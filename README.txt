コツコツサクサク 完全統合PWA版

中身
1. index.html 元HTMLを統合済み
2. manifest.json iPad/iPhone/Androidのホーム画面追加用
3. sw.js オンライン公開時のキャッシュ安定化用
4. icons ホーム画面アイコン

使い方
1. ZIPを解凍します
2. index.htmlをSafariで開きます
3. 安定運用する場合は、GitHub PagesやGoogle Drive公開リンクなどでURL化します
4. iPad/iPhoneはSafariの共有ボタンから「ホーム画面に追加」します

注意
Service Workerは file:// では動きません。完全安定運用はURL化した場合に有効です。
ローカルファイルとして開くだけでも元アプリは使えますが、OSがファイル場所を見失う場合があります。
