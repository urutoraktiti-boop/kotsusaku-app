const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();

const MANUAL_AGGREGATE_COOLDOWN_MS = 10 * 60 * 1000;
const MANUAL_AGGREGATE_CONTROL_REF = 'dashboard_control/manualAggregate';
const ALLOWED_ORIGINS = new Set([
  'https://urutoraktiti-boop.github.io',
  'https://urutoraktiti-boop.github.io/kotsusaku-dashboard',
]);

function numberValue(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function positiveNumber(value) {
  return Math.max(0, numberValue(value, 0));
}

function countMapInc(map, key, amount = 1) {
  const normalizedKey = String(key || '').trim();
  if (!normalizedKey) return;
  map[normalizedKey] = (map[normalizedKey] || 0) + amount;
}

function timestampToDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function daysAgo(now, date) {
  if (!date) return Infinity;
  return Math.floor((now.getTime() - date.getTime()) / 86400000);
}

function avgDailyBucket(minutes) {
  const m = positiveNumber(minutes);
  if (m < 10) return '0-10';
  if (m < 30) return '10-30';
  if (m < 60) return '30-60';
  if (m < 90) return '60-90';
  return '90-';
}

function totalStudyHourBucket(minutes) {
  const h = positiveNumber(minutes) / 60;
  if (h < 5) return '0-5';
  if (h < 20) return '5-20';
  if (h < 50) return '20-50';
  if (h < 100) return '50-100';
  return '100-';
}

function normalizeDeviceType(value) {
  const raw = String(value || '').toLowerCase();
  if (raw === 'mobile' || raw === 'smartphone' || raw === 'phone') return 'mobile';
  if (raw === 'desktop' || raw === 'pc') return 'pc';
  if (raw === 'tablet') return 'tablet';
  return raw || 'unknown';
}

function addBadgeCounts(target, badgeList) {
  if (!Array.isArray(badgeList)) return;
  badgeList.forEach((badgeId) => countMapInc(target, badgeId));
}

async function aggregateAnalyticsSummaryCore() {
  const db = getFirestore();
  const snap = await db.collection('analytics').get();
  const now = new Date();

  const summary = {
    analyticsCount: snap.size,
    userCount: snap.size,
    totalStudyMin: 0,
    avgDailyMinutes: 0,
    avgStreakDays: 0,
    activeUsers3d: 0,
    activeUsers7d: 0,
    activeUsers30d: 0,
    retainedUsers30d: 0,
    pwaUsers: 0,
    stopwatchUsers: 0,
    myCrazy10Users: 0,
    crazy10Users: 0,
    taskUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    todayTasks: 0,
    todayCompletedTasks: 0,
    weekTasks: 0,
    weekCompletedTasks: 0,
    monthTasks: 0,
    monthCompletedTasks: 0,
    kotsuTotalActualMin: 0,
    kotsuWeekActualMin: 0,
    kotsuMonthActualMin: 0,
    kotsuTemplateCount: 0,
    kotsuKP: 0,
    deviceCounts: {},
    osCounts: {},
    accessHourCounts: {},
    storyCounts: {},
    licenseCategoryCounts: {},
    levelCounts: {},
    badgeCounts: {},
    avgDailyMinuteCounts: {},
    totalStudyHourCounts: {},
    kotsuCategoryCounts: {},
    aggregateSource: 'cloud-functions',
    aggregateVersion: 1,
    aggregatedAtIso: now.toISOString(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  let avgDailySum = 0;
  let avgDailyCount = 0;
  let streakSum = 0;
  let streakCount = 0;

  snap.forEach((doc) => {
    const data = doc.data() || {};
    const totalStudyMin = positiveNumber(data.totalStudyMin);
    const avgDailyMinutes = positiveNumber(data.avgDailyMinutes);
    const streakDays = positiveNumber(data.streakDays);
    const level = Math.max(1, Math.round(positiveNumber(data.level) || 1));
    const lastAccessDate = timestampToDate(data.lastAccess);
    const firstAccessDate = timestampToDate(data.firstAccess);
    const lastAccessDays = daysAgo(now, lastAccessDate);

    summary.totalStudyMin += totalStudyMin;
    countMapInc(summary.totalStudyHourCounts, totalStudyHourBucket(totalStudyMin));

    if (avgDailyMinutes > 0) {
      avgDailySum += avgDailyMinutes;
      avgDailyCount += 1;
    }
    countMapInc(summary.avgDailyMinuteCounts, avgDailyBucket(avgDailyMinutes));

    if (streakDays > 0) {
      streakSum += streakDays;
      streakCount += 1;
    }

    if (lastAccessDays <= 3) summary.activeUsers3d += 1;
    if (lastAccessDays <= 7) summary.activeUsers7d += 1;
    if (lastAccessDays <= 30) summary.activeUsers30d += 1;
    if (firstAccessDate && daysAgo(now, firstAccessDate) >= 30 && lastAccessDays <= 30) {
      summary.retainedUsers30d += 1;
    }

    if (data.isPWA) summary.pwaUsers += 1;
    if (data.usesStopwatch) summary.stopwatchUsers += 1;
    if (data.hasMyCrazy10) summary.myCrazy10Users += 1;
    if (data.joinsCrazy10) summary.crazy10Users += 1;

    countMapInc(summary.deviceCounts, normalizeDeviceType(data.deviceType));
    countMapInc(summary.osCounts, data.os || 'other');
    countMapInc(summary.storyCounts, data.storyMode || 'none');
    countMapInc(summary.licenseCategoryCounts, data.licenseCategory || 'unanswered');
    countMapInc(summary.levelCounts, level);
    if (Number.isInteger(Number(data.accessHour)) && Number(data.accessHour) >= 0 && Number(data.accessHour) < 24) {
      countMapInc(summary.accessHourCounts, Number(data.accessHour));
    }
    addBadgeCounts(summary.badgeCounts, data.badgeList);

    const hasKotsuHabit = !!data.hasKotsuHabit || positiveNumber(data.kotsuTaskCount) > 0;
    if (hasKotsuHabit) summary.taskUsers += 1;
    summary.totalTasks += positiveNumber(data.kotsuTaskCount);
    summary.completedTasks += positiveNumber(data.kotsuDoneCount);
    summary.pendingTasks += positiveNumber(data.kotsuTodoCount);
    summary.todayTasks += positiveNumber(data.kotsuTodayTaskCount);
    summary.todayCompletedTasks += positiveNumber(data.kotsuTodayDoneCount);
    summary.weekTasks += positiveNumber(data.kotsuWeekTaskCount);
    summary.weekCompletedTasks += positiveNumber(data.kotsuWeekDoneCount);
    summary.monthTasks += positiveNumber(data.kotsuMonthTaskCount);
    summary.monthCompletedTasks += positiveNumber(data.kotsuMonthDoneCount);
    summary.kotsuTotalActualMin += positiveNumber(data.kotsuTotalActualMin);
    summary.kotsuWeekActualMin += positiveNumber(data.kotsuWeekActualMin);
    summary.kotsuMonthActualMin += positiveNumber(data.kotsuMonthActualMin);
    summary.kotsuTemplateCount += positiveNumber(data.kotsuTemplateCount);
    summary.kotsuKP += positiveNumber(data.kotsuKP);

    const categories = data.kotsuCategoryCounts || {};
    Object.entries(categories).forEach(([key, value]) => {
      countMapInc(summary.kotsuCategoryCounts, key, positiveNumber(value));
    });
  });

  summary.avgDailyMinutes = avgDailyCount ? Math.round(avgDailySum / avgDailyCount) : 0;
  summary.avgStreakDays = streakCount ? Math.round(streakSum / streakCount) : 0;
  summary.totalStudyMin = Math.round(summary.totalStudyMin);
  summary.totalTasks = Math.round(summary.totalTasks);
  summary.completedTasks = Math.round(summary.completedTasks);
  summary.pendingTasks = Math.max(Math.round(summary.pendingTasks), Math.max(summary.totalTasks - summary.completedTasks, 0));

  await db.collection('analytics_summary').doc('summary').set(summary, { merge: true });

  console.log(`Aggregated analytics summary: users=${summary.userCount}, totalStudyMin=${summary.totalStudyMin}, taskUsers=${summary.taskUsers}, totalTasks=${summary.totalTasks}`);
  return summary;
}

function setCorsHeaders(req, res) {
  const origin = req.get('Origin') || '';
  if (ALLOWED_ORIGINS.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  } else {
    res.set('Access-Control-Allow-Origin', 'https://urutoraktiti-boop.github.io');
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

exports.runAggregateNow = onRequest({ region: 'asia-northeast1' }, async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const db = getFirestore();
  const controlRef = db.doc(MANUAL_AGGREGATE_CONTROL_REF);
  const now = Date.now();

  try {
    const allowed = await db.runTransaction(async (tx) => {
      const controlSnap = await tx.get(controlRef);
      const lastRunAt = controlSnap.exists ? numberValue(controlSnap.data().lastRunAtMs, 0) : 0;
      const elapsed = now - lastRunAt;
      if (elapsed < MANUAL_AGGREGATE_COOLDOWN_MS) {
        return {
          ok: false,
          waitSeconds: Math.ceil((MANUAL_AGGREGATE_COOLDOWN_MS - elapsed) / 1000),
        };
      }
      tx.set(controlRef, {
        lastRunAtMs: now,
        lastRunAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      return { ok: true };
    });

    if (!allowed.ok) {
      res.status(429).json({ ok: false, error: 'rate_limited', waitSeconds: allowed.waitSeconds });
      return;
    }

    const summary = await aggregateAnalyticsSummaryCore();
    res.json({
      ok: true,
      userCount: summary.userCount,
      totalStudyMin: summary.totalStudyMin,
      taskUsers: summary.taskUsers,
      totalTasks: summary.totalTasks,
      completedTasks: summary.completedTasks,
    });
  } catch (error) {
    console.error('runAggregateNow failed:', error);
    res.status(500).json({ ok: false, error: 'aggregate_failed' });
  }
});

// Runs every hour — snapshots task analytics summary into a time-series collection.
// Keeps only the last 48 hours of data to avoid unbounded growth.
exports.snapshotTaskTrend = onSchedule({ schedule: 'every 1 hours', region: 'asia-northeast1' }, async () => {
  const db = getFirestore();
  await aggregateAnalyticsSummaryCore();

  // Read current summary
  const summaryRef = db.collection('analytics_summary').doc('summary');
  const summarySnap = await summaryRef.get();

  if (!summarySnap.exists) {
    console.log('analytics_summary/summary does not exist yet, skipping snapshot');
    return;
  }

  const data = summarySnap.data();
  const now = new Date();

  // Write snapshot
  const trendRef = db.collection('analytics_task_trend');
  await trendRef.add({
    timestamp: FieldValue.serverTimestamp(),
    totalTasks: data.totalTasks || 0,
    completedTasks: data.completedTasks || 0,
    taskUsers: data.taskUsers || 0,
  });

  // Prune snapshots older than 48 hours
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const oldSnaps = await trendRef
    .where('timestamp', '<', cutoff)
    .get();

  const batch = db.batch();
  oldSnaps.forEach((doc) => batch.delete(doc.ref));
  if (!oldSnaps.empty) {
    await batch.commit();
    console.log(`Pruned ${oldSnaps.size} old trend snapshots`);
  }

  console.log(`Snapshot written: totalTasks=${data.totalTasks}, completedTasks=${data.completedTasks}, taskUsers=${data.taskUsers}`);
});
