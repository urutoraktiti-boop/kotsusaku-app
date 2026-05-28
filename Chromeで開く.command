#!/bin/bash
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_URL="file://${APP_DIR}/index.html"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [ -x "$CHROME" ]; then
  "$CHROME" "$TARGET_URL" >/dev/null 2>&1 &
  exit 0
fi

osascript -e 'display dialog "Google Chrome が見つかりませんでした。Chromeをインストールしてからもう一度お試しください。" buttons {"OK"} default button "OK"'
