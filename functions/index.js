const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();

// Runs every hour — snapshots task analytics summary into a time-series collection.
// Keeps only the last 48 hours of data to avoid unbounded growth.
exports.snapshotTaskTrend = onSchedule('every 1 hours', async () => {
  const db = getFirestore();

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
