/* ============================================================
 * bloom-countdown.js — 開花日カウントダウン応援メッセージ
 * コツコツサクサク 追加モジュール
 * ------------------------------------------------------------
 * ・ストップウォッチ横のランナー / コツ習得ボタン横のバウンサー
 *   （動くキャラ）をタップすると、開花日までの残日数に応じた
 *   伴走応援メッセージをカード表示する
 * ・文言: 5ストーリー × 33本（31日以上前/30日前〜当日/開花日後）
 * ・残日数は端末ローカルの exam-date から表示時に毎回計算する
 *   （ユーザー毎に開花日が違っても正しい文言が出る）
 * ・導入: index.html の </body> 直前に
 *   <script src="./bloom-countdown.js"></script> を1行追加
 * ============================================================ */
(function () {
  'use strict';

  var DATA = {"gorilla":{"icon":"🦍","days":{"30":["ジャングル修行確認期","今日もアプリを開いたゴリ？それだけでえらいゴリ！","ここまで積んだコツコツ、ぜんぶ見てたゴリ。"],"29":["ジャングル修行確認期","10分でも机に向かえたら、今日は大勝利ゴリ。","小さな一歩の積み重ねが、太い幹になるゴリ。"],"28":["ジャングル修行確認期","不安な日も来てくれた。それが一番すごいゴリ。","解いてきた問題は、ちゃんと体に残ってるゴリ。"],"27":["ジャングル修行確認期","毎日じゃなくてもいいゴリ。戻ってきたら満点ゴリ。","今日もバナナ一本ぶん、一緒に積むゴリ。"],"26":["ジャングル修行確認期","完璧じゃなくていいゴリ。開いただけで前進ゴリ。","昨日よりひとつ整えば、もう十分ゴリ。"],"25":["ジャングル修行確認期","今日の10分が、開花日の落ち着きになるゴリ。","見直した分だけ、試験の森で迷わなくなるゴリ。"],"24":["ジャングル修行確認期","迷った問題に向き合えた。それがもう強さゴリ。","拾った木の実は、ぜんぶ力になるゴリ。"],"23":["ジャングル修行確認期","コツコツ続けてきた君は、直前期に強いゴリ。","今日の1問も、ちゃんと筋肉になるゴリ。"],"22":["ジャングル修行確認期","ここまで来たこと自体が、伝説の途中ゴリ。","胸を張っていいゴリ。ずっと見てたゴリ。"],"21":["弱点バナナ補給期","苦手に気づけたのは、頑張ってる証拠ゴリ。","今日はひとつだけ。それで大成功ゴリ。"],"20":["弱点バナナ補給期","あいまいをひとつ直せたら、今日は花マルゴリ。","全部じゃなくていい。ひとつで十分ゴリ。"],"19":["弱点バナナ補給期","わからない問題に出会えた君は、前に進んでるゴリ。","本番前に見つけた弱点は、味方ゴリ。"],"18":["弱点バナナ補給期","間違いを見直せる人は、本当に強い人ゴリ。","その一歩、ちゃんと開花につながってるゴリ。"],"17":["弱点バナナ補給期","苦手が残ってても大丈夫ゴリ。積んだ日々は消えないゴリ。","大事なところから、一緒に整えるゴリ。"],"16":["弱点バナナ補給期","今日の確認は、未来の自分へのバナナ補給ゴリ。","10分の見直しでも、開花日の安心になるゴリ。"],"15":["弱点バナナ補給期","あせらなくていいゴリ。君のペースで積めばいいゴリ。","ここからの一歩も、ちゃんと伝説につながるゴリ。"],"14":["ボスゴリラ仕上げ期","折り返しゴリ！ここまで走ってきた君はすごいゴリ。","取れる問題を、ひとつずつ武器にするゴリ。"],"13":["ボスゴリラ仕上げ期","いつもの解き方があるって、それだけで財産ゴリ。","続けてきたからこそ持てた型ゴリ。"],"12":["ボスゴリラ仕上げ期","迷っても大丈夫ゴリ。迷いながらも進んでるゴリ。","今日はひとつ、選び方を確かめるゴリ。"],"11":["ボスゴリラ仕上げ期","覚えてきたこと、ちゃんと頭の中にあるゴリ。","バナナ倉庫、一緒に整えるゴリ。"],"10":["ボスゴリラ仕上げ期","あと10日。ここまで続けた君なら大丈夫ゴリ。","今日の復習も、しっかり点につながるゴリ。"],"9":["ボスゴリラ仕上げ期","あせらなくていいゴリ。開いた時点で今日は合格ゴリ。","いつもの力を、いつも通り出す準備ゴリ。"],"8":["ボスゴリラ仕上げ期","今からの復習も、ぜんぶ花になるゴリ。","今日の10分が、開花日の背中を押すゴリ。"],"7":["伝説準備期","あと1週間。ここまでの毎日が、もう伝説ゴリ。","体も頭も整えて、一緒に向かうゴリ。"],"6":["伝説準備期","今日は「確認できた」がひとつあれば満点ゴリ。","安心が増えるたび、落ち着いて強くなれるゴリ。"],"5":["伝説準備期","無理しなくていいゴリ。積んできた力はもうあるゴリ。","落ち着いて出す準備だけでいいゴリ。"],"4":["伝説準備期","ここまで一緒に来られて、うれしいゴリ。","小さな見直しが、開花日の安心になるゴリ。"],"3":["伝説準備期","頑張ってきた日々、ぜんぶ知ってるゴリ。","伝説ゴリラの開花は、もう目の前ゴリ。"],"2":["安心バナナ確認日","今日は安心をひとつ増やす日ゴリ。勉強は軽くでいいゴリ。","持ち物、会場、時間。確認した分だけ落ち着けるゴリ。"],"1":["信じるゴリの日","ここまで本当におつかれゴリ。君のコツコツは本物ゴリ。","明日は完璧じゃなく、積み上げてきた自分で咲くゴリ。"],"0":["伝説の開花日","まずは深呼吸ゴリ。ずっと隣で見てきたから言えるゴリ。大丈夫ゴリ。","育てた力を、落ち着いて咲かせてくるゴリ。"]},"pre":["コツコツ準備期","開花日はまだ先ゴリ。でも今日ここに来たこと、もう最高ゴリ。","10分でも1問でも、積んだ分だけ一緒に強くなるゴリ。"],"post":["咲いたあとの森","本当におつかれさまゴリ。走りきった君は伝説ゴリ。","結果がどうでも、積み上げた日々は一生の力ゴリ。"]},"samurai":{"icon":"⚔️","days":{"30":["鍛錬確認期","今日もここへ来た。それだけで立派な鍛錬だ。","ここまで研いできた刃を、私は見てきた。"],"29":["鍛錬確認期","10分でも刃を振れたなら、今日は良い日だ。","小さな鍛錬は、見えないところで型になる。"],"28":["鍛錬確認期","不安な日に道場へ来る。それこそ剣士の心だ。","斬ってきた問いは、確かに己の中にある。"],"27":["鍛錬確認期","毎日でなくていい。戻ってきたなら、それで良し。","今日も静かに、一緒に刃を研ごう。"],"26":["鍛錬確認期","完璧でなくていい。ここに立っただけで前進だ。","昨日よりひとつ整えば、それで十分。"],"25":["鍛錬確認期","今日の10分が、決戦の日の静けさになる。","見直した分だけ、構えは安定する。"],"24":["鍛錬確認期","迷った問いに向き合えた。それがもう強さだ。","今のうちに向き合えば、次は斬れる。"],"23":["鍛錬確認期","日々積んできたあなたは、直前期に強い。","今日の一太刀も、確かに型になる。"],"22":["鍛錬確認期","ここまで歩いてきた道のりが、既に強さだ。","あなたの鍛錬をずっと見てきた。胸を張れ。"],"21":["弱点研磨期","苦手に気づけたのは、真剣に向き合った証だ。","今日はひとつだけ。それで十分な研ぎだ。"],"20":["弱点研磨期","あいまいをひとつ直せたなら、今日は良い稽古だ。","全部でなくていい。一点を研げばいい。"],"19":["弱点研磨期","わからぬ問いに出会えたあなたは、前へ進んでいる。","決戦前に見つけた迷いは、今なら断てる。"],"18":["弱点研磨期","間違いを見直せる者こそ、本当に強い剣士だ。","その一歩が、次の一太刀を変える。"],"17":["弱点研磨期","弱点が残っていても、ここまでの鍛錬は消えない。","大事なところから、共に研ごう。"],"16":["弱点研磨期","今日の確認は、未来の自分への型稽古だ。","10分の見直しも、決戦の日の静けさになる。"],"15":["弱点研磨期","焦らずともよい。あなたの歩幅で研げばいい。","ここからの一太刀も、確かに勝ちへつながる。"],"14":["決戦仕上げ期","よくぞここまで来た。ここからは斬れる問いを確かに斬る。","取れる問題を、一つずつ型にしよう。"],"13":["決戦仕上げ期","いつもの解き方がある。それは続けた者だけの財産だ。","慣れた型は、本番で迷いを消してくれる。"],"12":["決戦仕上げ期","迷ってもよい。迷いながらも、あなたは進んでいる。","今日はひとつ、選び方の型を確かめよう。"],"11":["決戦仕上げ期","積んできた知識は、確かにあなたの中にある。","抜ける刃へ、共に整えよう。"],"10":["決戦仕上げ期","あと10日。ここまで続けたあなたなら、大丈夫だ。","ここからの復習は、確かに勝ちに近づく。"],"9":["決戦仕上げ期","焦らずともよい。今日ここに来ただけで十分だ。","いつもの力を、いつも通り出せる構えにしよう。"],"8":["決戦仕上げ期","今からの復習も、すべて刃になる。","今日の10分が、開花日の一太刀になる。"],"7":["出陣準備期","あと七日。ここまでの日々が、既に誉れだ。","心と体を整え、共に決戦の朝へ向かおう。"],"6":["出陣準備期","今日は「確認できた」がひとつあれば上出来だ。","安心が増えるほど、剣士の呼吸は深くなる。"],"5":["出陣準備期","無理はいらない。積んできた力は既にある。","落ち着いて抜く準備だけでいい。"],"4":["出陣準備期","ここまで共に歩めたこと、誇りに思う。","小さな見直しが、決戦の日の守りになる。"],"3":["出陣準備期","あなたの鍛錬の日々を、すべて見てきた。","刃は十分に研がれている。あとは信じるだけだ。"],"2":["装備確認日","今日は安心をひとつ増やす日。稽古は軽くでいい。","持ち物、会場、時間。確認した分だけ、心は静まる。"],"1":["信じる日","ここまで本当におつかれさまでした。あなたの鍛錬は本物です。","明日は完璧な剣士ではなく、研ぎ続けた自分で臨もう。"],"0":["開花日 出陣","まずは深呼吸。ずっと隣で見てきた、だから言える。大丈夫だ。","積み上げた型を信じ、落ち着いて一問ずつ斬ってこよう。"]},"pre":["鍛錬準備期","開花日はまだ先。だが今日も道場に立った。それが誇りだ。","10分の素振りも、確かに刃を研いでいる。"],"post":["納刀の日","見事な戦いだった。研ぎ続けたあなたは、真の剣士だ。","結果がどうであれ、積んだ鍛錬は一生の力になる。"]},"space":{"icon":"🚀","days":{"30":["ミッション確認期","今日も操縦席に来たんだね。それだけで立派な航行だ。","ここまでの飛行記録、ぜんぶ見てるよ。"],"29":["ミッション確認期","10分でもエンジンを回せたら、今日は良い航行だ。","小さな軌道修正も、続けば大きな軌道になる。"],"28":["ミッション確認期","不安な日も飛び続けた。それが一番の推進力だ。","解いてきた問題は、ちゃんと航行記録に残ってる。"],"27":["ミッション確認期","毎日じゃなくていい。帰ってきたら、それで満点だ。","今日も少しだけ、一緒にエンジンを温めよう。"],"26":["ミッション確認期","完璧な航行じゃなくていい。乗り込んだだけで前進だ。","昨日よりひとつ修正できたら十分。"],"25":["ミッション確認期","今日の10分が、開花日の落ち着いた操縦になる。","見直した分だけ、ナビは正確になる。"],"24":["ミッション確認期","迷った問題に向き合えた。それが探検家の強さだ。","見つけた星は、ぜんぶ味方になる。"],"23":["ミッション確認期","コツコツ飛んできた君は、直前期に強い。","今日の記録も、星図の一部になる。"],"22":["ミッション確認期","ここまで飛んだ距離そのものが、もう力だ。","君の航行を、管制室からずっと見てたよ。"],"21":["軌道修正期","苦手に気づけたのは、ちゃんと飛んでる証拠だ。","今日はひとつだけ軌道修正。それで大成功。"],"20":["軌道修正期","あいまいをひとつ直せたら、今日はいい飛行だ。","全部じゃなくていい。修正はひとつで十分。"],"19":["軌道修正期","わからない問題に出会えた君は、前に進んでる。","本番前に見つかった信号は、君を助ける。"],"18":["軌道修正期","間違いを見直せる人は、本当に強い探検家だ。","その通信が、次の航路を変える。"],"17":["軌道修正期","弱点が残ってても、飛んできた距離は消えない。","重要な航路から、一緒に整えよう。"],"16":["軌道修正期","今日の確認は、未来の自分への燃料補給だ。","10分の見直しでも、開花日の安定飛行になる。"],"15":["軌道修正期","あせらなくていい。君の速度で飛べばいい。","ここからの一歩も、ちゃんと目的地へつながってる。"],"14":["最終航路仕上げ期","よくここまで飛んだ！ここからは確実に星を取る時間だ。","取れる問題を、ひとつずつ成功につなげよう。"],"13":["最終航路仕上げ期","いつもの解き方があるって、それだけで頼れる装備だ。","慣れた手順は、本番の自動操縦になる。"],"12":["最終航路仕上げ期","迷っても大丈夫。迷いながらも軌道は進んでる。","今日はひとつ、センサーを確かめよう。"],"11":["最終航路仕上げ期","積んできたデータは、ちゃんと君の中にある。","星図を、一緒に使える形へ整えよう。"],"10":["最終航路仕上げ期","あと10日。ここまで飛び続けた君なら大丈夫。","ここからの復習は、確実に推進力になる。"],"9":["最終航路仕上げ期","あせらなくていい。操縦席に座った時点で今日は合格だ。","いつもの力を、いつも通り起動しよう。"],"8":["最終航路仕上げ期","今からの復習も、ちゃんと星に届く。","今日の10分が、開花日のナビになる。"],"7":["着陸準備期","あと1週間。ここまでの航行が、もう快挙だ。","船内を整えて、一緒に着陸へ向かおう。"],"6":["着陸準備期","今日は「確認できた」がひとつあれば満点だ。","安心がひとつ増えるたび、着陸は安定する。"],"5":["着陸準備期","無理に星図を広げなくていい。力はもうある。","落ち着いて使う準備だけでいい。"],"4":["着陸準備期","ここまで一緒に飛べて、うれしいよ。","小さな見直しが、開花日の安心航行になる。"],"3":["着陸準備期","君の飛行記録、ぜんぶ見てきた。すごい距離だ。","目的地の星は、すぐそこまで来ている。"],"2":["最終チェック日","今日は安心をひとつ増やす日。航行は軽めでいい。","持ち物、会場、時間。確認した分だけ、着陸は落ち着く。"],"1":["星を信じる日","ここまで本当におつかれさまでした。君の航行は本物だ。","明日は完璧じゃなく、飛び続けてきた自分で星へ向かおう。"],"0":["開花日 着陸","まずは深呼吸。ずっと管制室から見てきたから言える。大丈夫。","航行記録を信じて、落ち着いてミッションを完了しよう。"]},"pre":["航行準備期","開花日の星はまだ遠い。でも今日も操縦席に座った。それがすごい。","10分の航行でも、確実に星へ近づいている。"],"post":["帰還の日","帰還おめでとう。飛びきった君は本物の探検家だ。","結果がどうでも、この航行記録は一生の財産だ。"]},"itachacha":{"icon":"🥦","days":{"30":["ニヤニヤ観察期","今日も開いたね。それだけで今日のMVP。ニヤニヤ。","ここまでのコツコツ、ぜんぶ見てたよ。"],"29":["ニヤニヤ観察期","10分でもできたら、今日は大勝利。チャチャ。","小さな積み重ね、見えないとこでふさふさしてる。"],"28":["ニヤニヤ観察期","不安な日にも来た。それが一番すごい。ニヤニヤ。","解いてきた問題、意外とちゃんと残ってるよ。"],"27":["ニヤニヤ観察期","毎日じゃなくていい。戻ってきたら満点。","気づいたら来てた？それ、かなりえらい。"],"26":["ニヤニヤ観察期","完璧じゃなくていい。開いただけで前進。チャチャ。","昨日よりひとつ整えば、もう十分。"],"25":["ニヤニヤ観察期","今日の10分、開花日の自分をこっそり助けるよ。","今見直したこと、あとで効いてくる。ニヤニヤ。"],"24":["ニヤニヤ観察期","迷った問題に向き合えたの、地味にすごい。","今のうちに出会えたの、けっこうラッキー。"],"23":["ニヤニヤ観察期","コツコツ来てる人は、直前期にじわじわ強い。","今日の10分も、ちゃんと未来に届く。チャチャ。"],"22":["ニヤニヤ観察期","ここまで来たこと自体、もうかなりすごい。","何かが育ってます。気のせいじゃない。ニヤニヤ。"],"21":["ふさふさメンテ期","苦手に気づけたの、ちゃんと向き合ってる証拠。","今日はひとつだけ。それで大成功。"],"20":["ふさふさメンテ期","あいまいをひとつ整えたら、今日は花マル。","全部じゃなくていい。ひとつで十分。ニヤニヤ。"],"19":["ふさふさメンテ期","わからない問題に出会えたのは、前に進んでる証拠。","今気づけたの、かなりいい流れ。チャチャ。"],"18":["ふさふさメンテ期","間違いを見直せる人、ほんとに強い人だよ。","その一歩で、次の自分がちょっと変わる。"],"17":["ふさふさメンテ期","苦手が残ってても大丈夫。積み重ねは消えない。","大事なところから、一緒に整えよ。"],"16":["ふさふさメンテ期","今日の確認は、未来の自分へのこっそり応援。","10分の見直しでも、開花日の落ち着きになる。ニヤニヤ。"],"15":["ふさふさメンテ期","あせらなくていい。きみのペースでいこ。","ここからの一歩も、ちゃんと花につながってる。チャチャ。"],"14":["チャチャ仕上げ期","ここまで来たの、ほんとすごい。ここからは取れる問題をちゃんと取ろ。","できることを一つずつ、力にしていこ。"],"13":["チャチャ仕上げ期","いつもの解き方があるの、それだけで財産。","慣れた手順、思ったより頼りになる。ニヤニヤ。"],"12":["チャチャ仕上げ期","迷っても大丈夫。迷いながらも進んでる。","今日はひとつ、選び方を確かめてみよ。"],"11":["チャチャ仕上げ期","覚えてきたこと、ちゃんと頭の中にあるよ。","引き出し、一緒にちょっと整理しよ。"],"10":["チャチャ仕上げ期","あと10日。ここまで続けたきみなら大丈夫。","ここからの復習、ちゃんと効きます。ニヤニヤ。"],"9":["チャチャ仕上げ期","あせらなくていい。開いた時点で今日は合格。","いつもの力を、いつも通り出せるようにしよ。"],"8":["チャチャ仕上げ期","今からの復習も、ぜんぶ花につながる。","今日の10分が、開花日のきみを助ける。チャチャ。"],"7":["開花準備ニヤ期","あと1週間。ここまでの毎日、もう快挙。","ちょっと落ち着いて、力を出す準備をしよ。"],"6":["開花準備ニヤ期","今日は「確認できた」がひとつあれば満点。","安心が増えるたび、当日の自分がラクになる。"],"5":["開花準備ニヤ期","無理に広げなくていい。育ててきたもの、もうあるよ。","ちゃんと咲く準備、できてる。ニヤニヤ。"],"4":["開花準備ニヤ期","ここまで一緒に来られて、うれしい。","小さな見直しが、開花日の安心になる。"],"3":["開花準備ニヤ期","頑張ってきた日々、ぜんぶ見てたよ。","育ってきたもの、ちゃんとある。チャチャ。"],"2":["安心チャチャ確認日","今日は安心をひとつ増やす日。勉強は軽くでOK。","持ち物、会場、時間。確認できた分だけ落ち着ける。"],"1":["ニヤニヤ信じる日","ここまでほんとにおつかれさま。きみのコツコツは本物。","明日は完璧じゃなくていい。コツコツ来た自分で行こ。ニヤニヤ。"],"0":["開花日 チャチャ","まずは深呼吸。ずっと隣で見てたから言える、大丈夫。","育ててきた力、落ち着いて咲かせてきて。チャチャ。"]},"pre":["コツコツ観察期","開花日はまだ先。でも今日も開いたんだ。えらすぎ。ニヤニヤ。","10分でも1問でも、ちゃんと何かが育ってるよ。チャチャ。"],"post":["満開チャチャ","ほんっとうにおつかれさま！ここまで走ったきみ、最高。","結果がどうでも、積み上げた日々は一生もの。ニヤニヤ。"]},"spartan":{"icon":"🐉","days":{"30":["特訓確認期","今日もアプリを開いたな。それでいい。それが継続だ。","ここまで積んだ時間、俺は全部見てきた。"],"29":["特訓確認期","10分でもやれたなら、今日は合格だ。","小さな特訓を続けた者だけが強くなる。"],"28":["特訓確認期","不安な日にも来た。それが一番の根性だ。","解いてきた問題は、ちゃんと武器になっている。"],"27":["特訓確認期","毎日でなくていい。戻ってきたなら、それで良し。","今日も一つ積め。俺も付き合う。"],"26":["特訓確認期","完璧はいらん。開いた時点で前進だ。","昨日より一つ直せば十分だ。"],"25":["特訓確認期","今日の10分は、本番の落ち着きになる。","今の見直しを軽く見るな。最後に効く。"],"24":["特訓確認期","迷った問題に向き合った。それを評価する。","今見つけた弱点は、今なら潰せる。"],"23":["特訓確認期","コツコツ続けたお前は、直前期で崩れない。","今日の積み重ねも、ちゃんと土台になる。"],"22":["特訓確認期","ここまで来たこと自体、簡単なことではない。","よくやっている。だが、まだ伸びる。"],"21":["弱点制圧期","苦手に気づけたのは、真剣にやってきた証拠だ。","今日は一つでいい。それで十分な前進だ。"],"20":["弱点制圧期","あいまいを一つ潰せたら、今日は上出来だ。","全部やろうとして止まるな。一つでいい。"],"19":["弱点制圧期","わからない問題に出会えたのは、前に進んでいる証だ。","本番前に見つかっただけ運がいい。"],"18":["弱点制圧期","間違いを見直せる者は、本当に強い者だ。","その一歩が、次のミスを消す。"],"17":["弱点制圧期","弱点が残っていても、積んだ時間は消えない。","重要な所から順にいこう。付き合うぞ。"],"16":["弱点制圧期","今日の確認は、未来の自分への援護だ。","10分の見直しも、本番の判断を支える。"],"15":["弱点制圧期","焦るな。お前のペースで積めばいい。","ここからの一歩も、確かに力になる。"],"14":["本番仕上げ期","よくここまで来た。ここからは取れる問題を確実に取る。","得点になる行動に絞れ。俺も見ている。"],"13":["本番仕上げ期","いつもの解き方がある。それは続けた者の財産だ。","型は裏切らない。信じて繰り返せ。"],"12":["本番仕上げ期","迷ってもいい。迷いながらも前に進んでいる。","今日は一つ、選び方を確認しよう。"],"11":["本番仕上げ期","覚えてきたことは、ちゃんとお前の中にある。","取り出せる形に、一緒に整えるぞ。"],"10":["本番仕上げ期","あと10日。ここまで続けたお前なら大丈夫だ。","ここからの復習は、まだ十分効く。"],"9":["本番仕上げ期","焦りはいらん。今日ここに来ただけで合格だ。","いつもの力を、いつも通り出す準備をしろ。"],"8":["本番仕上げ期","今からの復習も、全部点につながる。","今日の10分を、本番の自分に渡せ。"],"7":["出力調整期","あと1週間。ここまでの日々を、俺は誇りに思う。","睡眠、準備、復習量。全部、勝つための調整だ。"],"6":["出力調整期","今日は「確認できた」が一つあれば上出来だ。","安心材料が増えれば、本番で余計な力が抜ける。"],"5":["出力調整期","無理に広げるな。力はもう積み上がっている。","当日使える状態に整えるだけでいい。"],"4":["出力調整期","ここまでよく付いてきた。大したものだ。","小さな見直しが、本番の失点を防ぐ。"],"3":["出力調整期","お前の積み重ねを、俺は全部見てきた。本物だ。","あとは崩さず、整えて出すだけだ。"],"2":["最終確認日","今日は安心材料を一つ増やす日だ。勉強は軽くでいい。","持ち物、会場、時間。不安は先に潰しておけ。"],"1":["信じて寝る日","ここまで本当によくやった。これは事実だ。誇れ。","明日は完璧な自分ではなく、積み上げてきた自分で行け。"],"0":["開花日 本番","まず深呼吸だ。ずっと見てきた俺が保証する。お前はやれる。","できる問題から取れ。最後まで読め。全部出してこい。"]},"pre":["特訓準備期","開花日はまだ先だ。だが今日ここに来た。それを俺は評価する。","10分でも手を動かした者は強くなる。今日も見ているぞ。"],"post":["特訓完了","見事だった。走り抜いたお前を、俺は誇りに思う。","結果がどうであれ、積んだ日々はお前の一生の武器だ。"]}};

  var FALLBACK_STORY = 'samurai';

  function currentStoryId() {
    var id = null;
    try {
      if (window.CUST && window.CUST.storyId) id = window.CUST.storyId;
      if (!id) {
        var cust = JSON.parse(localStorage.getItem('study-cust') || '{}');
        id = cust.storyId || null;
      }
    } catch (e) { /* noop */ }
    return (id && DATA[id]) ? id : FALLBACK_STORY;
  }

  function daysLeft() {
    var v = null;
    try { v = localStorage.getItem('exam-date'); } catch (e) { /* noop */ }
    if (!v) return null;
    var d = new Date(v);
    if (isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    var t = new Date();
    t.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - t.getTime()) / 86400000);
  }

  function buildMessage(d) {
    var story = DATA[currentStoryId()];
    if (d === null) {
      return {
        icon: story.icon,
        label: '開花日が未設定',
        period: 'いつでもスタート',
        main: '開花日（試験日・目標日）を設定すると、その日まで毎日ここで応援メッセージが届くよ。',
        sub: '設定 → 試験日・目標日 から入力できます。'
      };
    }
    var e;
    if (d < 0) {
      e = story.post;
      return { icon: story.icon, label: '開花、おめでとう', period: e[0], main: e[1], sub: e[2] };
    }
    if (d > 30) {
      e = story.pre;
      return { icon: story.icon, label: '開花日まであと' + d + '日', period: e[0], main: e[1], sub: e[2] };
    }
    e = story.days[String(d)];
    var label = d === 0 ? '開花日 当日' : (d === 1 ? '開花日はいよいよ明日' : '開花日まであと' + d + '日');
    return { icon: story.icon, label: label, period: e[0], main: e[1], sub: e[2] };
  }

  function todaysMessage() {
    return buildMessage(daysLeft());
  }

  /* ---------- UI ---------- */

  var CSS = [
    '#bloom-cd-overlay{position:fixed;inset:0;z-index:24500;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);}',
    '#bloom-cd-overlay.show{display:flex;}',
    '#bloom-cd-card{position:relative;background:var(--surface,var(--surface2,#fff));color:var(--text,#1f2937);border:1px solid var(--border,#e5e7eb);border-radius:18px;max-width:340px;width:100%;padding:20px 18px;text-align:center;max-height:calc(100vh - 48px);max-height:calc(100dvh - 48px);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;box-shadow:0 12px 40px rgba(0,0,0,.35);animation:bloomCdPop .22s ease-out;touch-action:pan-y;user-select:none;}',
    '@keyframes bloomCdPop{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}',
    '#bloom-cd-label{display:inline-block;font-size:.68rem;font-weight:800;color:var(--accent,#e97fae);border:1px solid var(--accent,#e97fae);border-radius:999px;padding:3px 12px;margin-bottom:10px;}',
    '#bloom-cd-icon{font-size:2.6rem;line-height:1.2;margin-bottom:2px;}',
    '#bloom-cd-period{font-size:.62rem;font-weight:700;color:var(--text-muted,#9ca3af);margin-bottom:10px;letter-spacing:.05em;}',
    '#bloom-cd-main{font-size:.92rem;font-weight:800;line-height:1.65;margin-bottom:8px;}',
    '#bloom-cd-sub{font-size:.78rem;line-height:1.65;color:var(--text-muted,#6b7280);margin-bottom:16px;}',
    '#bloom-cd-nav{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:14px;}',
    '#bloom-cd-prev,#bloom-cd-next{width:30px;height:30px;border-radius:50%;border:1px solid var(--border,#e5e7eb);background:var(--surface2,#f3f4f6);color:var(--text,#1f2937);font-size:1rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
    '#bloom-cd-prev:disabled,#bloom-cd-next:disabled{opacity:.3;cursor:default;}',
    '#bloom-cd-daytag{font-size:.66rem;font-weight:700;color:var(--text-muted,#6b7280);min-width:52px;}',
    '#bloom-cd-close{width:100%;border:none;border-radius:12px;padding:11px 0;font-size:.85rem;font-weight:800;cursor:pointer;background:var(--accent,#e97fae);color:#fff;}',
    '#bloom-cd-close:active{transform:scale(.98);}',
    '#bloom-cd-replay{display:none;width:100%;margin-bottom:8px;border:1px solid var(--accent,#e97fae);border-radius:12px;padding:10px 0;font-size:.8rem;font-weight:800;cursor:pointer;background:transparent;color:var(--accent,#e97fae);}',
    '#bloom-cd-replay.show{display:block;}',
    '#bloom-cd-replay:active{transform:scale(.98);}'
  ].join('');

  /* アイコンを表示する期間: 開花日の30日前 〜 開花日の3日後 */
  var TRIGGER_SHOW_FROM_DAYS = 30;
  var TRIGGER_SHOW_UNTIL_DAYS = -3;

  /* 過去の応援メッセージを遡って見られる範囲（今日から何日前まで） */
  var MAX_HISTORY_OFFSET = 90;
  var viewOffset = 0;
  var openedDaysLeft = null;

  function buildUi() {
    if (document.getElementById('bloom-cd-overlay')) return;
    var st = document.createElement('style');
    st.id = 'bloom-cd-style';
    st.textContent = CSS;
    document.head.appendChild(st);
    var ov = document.createElement('div');
    ov.id = 'bloom-cd-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', '開花日カウントダウンメッセージ');
    ov.innerHTML =
      '<div id="bloom-cd-card">' +
      '<div id="bloom-cd-label"></div>' +
      '<div id="bloom-cd-icon"></div>' +
      '<div id="bloom-cd-period"></div>' +
      '<div id="bloom-cd-main"></div>' +
      '<div id="bloom-cd-sub"></div>' +
      '<div id="bloom-cd-nav">' +
      '<button id="bloom-cd-prev" type="button" aria-label="前の日の応援メッセージ">‹</button>' +
      '<span id="bloom-cd-daytag"></span>' +
      '<button id="bloom-cd-next" type="button" aria-label="次の日の応援メッセージ">›</button>' +
      '</div>' +
      '<button id="bloom-cd-replay" type="button">🎬 開花のムービーをもう一度</button>' +
      '<button id="bloom-cd-close" type="button">🌸 開花スイッチ</button>' +
      '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function (e) { if (e.target === ov) hide(); });
    document.getElementById('bloom-cd-close').addEventListener('click', hide);
    document.getElementById('bloom-cd-replay').addEventListener('click', function () { hide(); showDayVideo(); });
    document.getElementById('bloom-cd-prev').addEventListener('click', goOlder);
    document.getElementById('bloom-cd-next').addEventListener('click', goNewer);
    document.addEventListener('keydown', function (e) {
      if (!ov.classList.contains('show')) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') goOlder();
      if (e.key === 'ArrowRight') goNewer();
    });

    /* スワイプ操作（右にスワイプで前の日、左にスワイプで次の日） */
    var card = document.getElementById('bloom-cd-card');
    var swipeX = null, swipeY = null;
    card.addEventListener('pointerdown', function (e) { swipeX = e.clientX; swipeY = e.clientY; });
    card.addEventListener('pointerup', function (e) {
      if (swipeX === null) return;
      var dx = e.clientX - swipeX, dy = e.clientY - swipeY;
      swipeX = null; swipeY = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx > 0) goOlder(); else goNewer();
      }
    });
  }

  function renderCard() {
    var d = (openedDaysLeft === null) ? null : (openedDaysLeft + viewOffset);
    var m = buildMessage(d);
    document.getElementById('bloom-cd-label').textContent = m.label;
    document.getElementById('bloom-cd-icon').textContent = m.icon;
    document.getElementById('bloom-cd-period').textContent = m.period;
    document.getElementById('bloom-cd-main').textContent = m.main;
    document.getElementById('bloom-cd-sub').textContent = m.sub;

    /* 開花日 当日を見ているときだけ、ムービーを見返せるようにする */
    var replay = document.getElementById('bloom-cd-replay');
    if (replay) replay.classList.toggle('show', d === 0);

    var nav = document.getElementById('bloom-cd-nav');
    if (openedDaysLeft === null) {
      nav.style.visibility = 'hidden';
      return;
    }
    nav.style.visibility = '';
    document.getElementById('bloom-cd-daytag').textContent = viewOffset === 0 ? '今日' : viewOffset + '日前';
    document.getElementById('bloom-cd-prev').disabled = viewOffset >= MAX_HISTORY_OFFSET;
    document.getElementById('bloom-cd-next').disabled = viewOffset <= 0;
  }

  function goOlder() {
    if (openedDaysLeft === null) return;
    viewOffset = Math.min(MAX_HISTORY_OFFSET, viewOffset + 1);
    renderCard();
  }

  function goNewer() {
    if (openedDaysLeft === null) return;
    viewOffset = Math.max(0, viewOffset - 1);
    renderCard();
  }

  function show() {
    buildUi();
    viewOffset = 0;
    openedDaysLeft = daysLeft();
    renderCard();
    document.getElementById('bloom-cd-overlay').classList.add('show');
  }

  function hide() {
    var ov = document.getElementById('bloom-cd-overlay');
    if (ov) ov.classList.remove('show');
  }

  /* 専用アイコン（🌸 ストップウォッチ横）タップで表示 */
  document.addEventListener('click', function (e) {
    var hit = e.target && e.target.closest && e.target.closest('[data-bloom-cd-trigger]');
    if (!hit) return;
    e.preventDefault();
    show();
  });

  /* 専用アイコンの表示・非表示（開花日の30日前〜3日後だけ表示） */
  function updateTriggerVisibility() {
    var btn = document.querySelector('[data-bloom-cd-trigger]');
    if (!btn) return;
    var d = daysLeft();
    var visible = (d !== null && d <= TRIGGER_SHOW_FROM_DAYS && d >= TRIGGER_SHOW_UNTIL_DAYS);
    btn.style.display = visible ? '' : 'none';
  }

  /* ============================================================
   * 開花日 当日のムービー（カウントダウンの最後）
   * ------------------------------------------------------------
   * ・開花日の当日にアプリを開いたとき、1回だけ自動で表示する
   * ・同じ開花日につき1回だけ（開花日を設定し直せば、その日にまた出る）
   * ・出したらまず「音あり／音なし」を選んでもらう。選んでから再生する
   *   （携帯・パソコンとも「音つきの自動再生」は止められる決まり。
   *     ボタンを押してもらうこと自体が、音を鳴らす許可になる）
   * ・選んだあとも、動画の下のボタンで音を切り替えられる
   * ============================================================ */
  var DAY_VIDEO_SRC = './assets/bloom/bloom-day.mp4';
  /* 一部の環境（H.264を再生できないブラウザ）用の予備。
     再生できる方を1つだけ取りに行くので、両方が通信されることはない */
  var DAY_VIDEO_SRC_WEBM = './assets/bloom/bloom-day.webm';
  var DAY_VIDEO_POSTER = './assets/bloom/bloom-day-poster.jpg';
  var DAY_VIDEO_SEEN_KEY = 'kotsusaku-bloom-day-video-seen';
  /* 「音あり／音なし」でどちらを選んだか。▶ を押し直したときに希望どおりで流すために覚えておく */
  var dayVideoWantSound = false;

  var DAY_VIDEO_CSS = [
    '#bloom-day-overlay{position:fixed;inset:0;z-index:25000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.82);}',
    '#bloom-day-overlay.show{display:flex;}',
    /* 教訓#007：小さい携帯でも一番下のボタンに指が届くよう、高さの上限とスクロールを必ず付ける */
    '#bloom-day-card{position:relative;background:#0f1117;border:2px solid #f472b6;border-radius:20px;max-width:360px;width:100%;padding:16px 14px;text-align:center;box-shadow:0 12px 48px rgba(244,114,182,.35);max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;animation:bloomDayPop .28s ease-out;}',
    '@keyframes bloomDayPop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}',
    '#bloom-day-label{display:inline-block;font-size:.68rem;font-weight:800;color:#f472b6;border:1px solid #f472b6;border-radius:999px;padding:3px 12px;margin-bottom:10px;}',
    '#bloom-day-stage{position:relative;display:inline-block;line-height:0;max-width:100%;}',
    /* 動画の大きさ。下の「音を消す」ボタンと閉じるボタンの分を引いて、
       小さい携帯でも一番下まで収まるようにしてある */
    '#bloom-day-video{display:block;max-width:100%;width:auto;height:auto;max-height:calc(100vh - 280px);max-height:calc(100dvh - 280px);border-radius:14px;background:#000;}',

    /* 「音あり／音なし」の確認。出したらまずこれが動画の上に出る */
    '#bloom-day-ask{position:absolute;inset:0;border-radius:14px;background:rgba(0,0,0,.68);display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:14px;line-height:1.5;}',
    '#bloom-day-ask.show{display:flex;}',
    '#bloom-day-ask-text{font-size:.86rem;font-weight:800;color:#fff;margin-bottom:2px;text-shadow:0 2px 8px rgba(0,0,0,.8);}',
    '#bloom-day-ask-on,#bloom-day-ask-off{width:min(210px,86%);border-radius:999px;padding:12px 0;font-size:.88rem;font-weight:800;cursor:pointer;line-height:1;}',
    '#bloom-day-ask-on{border:none;background:#f472b6;color:#fff;box-shadow:0 4px 16px rgba(244,114,182,.5);}',
    '#bloom-day-ask-off{border:2px solid rgba(255,255,255,.75);background:rgba(0,0,0,.35);color:#fff;}',
    '#bloom-day-ask-on:active,#bloom-day-ask-off:active{transform:scale(.97);}',

    /* 自動再生が止められたときだけ出す「▶」 */
    '#bloom-day-play{position:absolute;inset:0;border:none;background:rgba(0,0,0,.35);color:#fff;font-size:2.4rem;border-radius:14px;cursor:pointer;display:none;align-items:center;justify-content:center;padding:0;}',
    '#bloom-day-play.show{display:flex;}',

    /* 音の切り替え。動画の上に重ねると見えにくいので、動画の下に文字つきで置く */
    '#bloom-day-sound{display:none;margin:10px auto 0;border:1px solid rgba(253,232,247,.45);border-radius:999px;background:rgba(253,232,247,.08);color:#fde8f7;font-size:.75rem;font-weight:800;padding:8px 18px;cursor:pointer;line-height:1;}',
    '#bloom-day-sound.show{display:inline-block;}',
    '#bloom-day-sound:active{transform:scale(.97);}',

    '#bloom-day-text{font-size:.78rem;font-weight:700;line-height:1.7;color:#fde8f7;margin:12px 0 12px;}',
    '#bloom-day-close{width:100%;border:none;border-radius:12px;padding:12px 0;font-size:.9rem;font-weight:800;cursor:pointer;background:#f472b6;color:#fff;}',
    '#bloom-day-close:active{transform:scale(.98);}'
  ].join('');

  function dayVideoEls() {
    return {
      ov: document.getElementById('bloom-day-overlay'),
      vid: document.getElementById('bloom-day-video'),
      sound: document.getElementById('bloom-day-sound'),
      play: document.getElementById('bloom-day-play'),
      ask: document.getElementById('bloom-day-ask')
    };
  }

  /* 音の切り替えボタンの文字。いまの状態ではなく「押すとどうなるか」を書く */
  function setSoundLabel(muted) {
    var s = document.getElementById('bloom-day-sound');
    if (!s) return;
    s.textContent = muted ? '🔊 音を出す' : '🔇 音を消す';
    s.setAttribute('aria-label', muted ? '音を出す' : '音を消す');
  }

  function buildDayVideoUi() {
    if (document.getElementById('bloom-day-overlay')) return;
    var st = document.createElement('style');
    st.id = 'bloom-day-style';
    st.textContent = DAY_VIDEO_CSS;
    document.head.appendChild(st);

    var ov = document.createElement('div');
    ov.id = 'bloom-day-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', '開花日 当日のムービー');
    ov.innerHTML =
      '<div id="bloom-day-card">' +
      '<div id="bloom-day-label">🌸 開花日 当日</div>' +
      '<div id="bloom-day-stage">' +
      '<video id="bloom-day-video" muted loop playsinline webkit-playsinline preload="none" ' +
      'poster="' + DAY_VIDEO_POSTER + '">' +
      '<source src="' + DAY_VIDEO_SRC + '" type="video/mp4">' +
      '<source src="' + DAY_VIDEO_SRC_WEBM + '" type="video/webm">' +
      '</video>' +
      '<button id="bloom-day-play" type="button" aria-label="再生する">▶</button>' +
      '<div id="bloom-day-ask">' +
      '<div id="bloom-day-ask-text">音を出して見ますか？</div>' +
      '<button id="bloom-day-ask-on" type="button">🔊 音ありで見る</button>' +
      '<button id="bloom-day-ask-off" type="button">🔇 音なしで見る</button>' +
      '</div>' +
      '</div>' +
      '<button id="bloom-day-sound" type="button" aria-label="音を出す">🔊 音を出す</button>' +
      '<div id="bloom-day-text">積み上げてきた日々が、ぜんぶ味方。<br>いってらっしゃい。</div>' +
      '<button id="bloom-day-close" type="button">🌸 いってきます</button>' +
      '</div>';
    document.body.appendChild(ov);

    var el = dayVideoEls();
    el.ov.addEventListener('click', function (e) { if (e.target === el.ov) hideDayVideo(); });
    document.getElementById('bloom-day-close').addEventListener('click', hideDayVideo);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && el.ov.classList.contains('show')) hideDayVideo();
    });

    /* 「音あり／音なし」を選んでもらってから再生する */
    document.getElementById('bloom-day-ask-on').addEventListener('click', function () { startDayVideo(true); });
    document.getElementById('bloom-day-ask-off').addEventListener('click', function () { startDayVideo(false); });

    /* 選んだあとの音の切り替え（動画の下のボタン） */
    el.sound.addEventListener('click', function () {
      el.vid.muted = !el.vid.muted;
      setSoundLabel(el.vid.muted);
      playDayVideo(false);
    });

    /* 自動再生が止められたときの「▶」。押すのは指の操作なので、
       ここでは選ばれたとおり（音あり／音なし）に戻して流し直す */
    el.play.addEventListener('click', function () {
      el.play.classList.remove('show');
      el.vid.muted = !dayVideoWantSound;
      setSoundLabel(el.vid.muted);
      playDayVideo(true);
    });
  }

  /* 選ばれたとおりに再生を始める。押した指の操作なので、音つきでも再生できる */
  function startDayVideo(withSound) {
    var el = dayVideoEls();
    if (!el.vid) return;
    el.ask.classList.remove('show');
    el.play.classList.remove('show');
    el.sound.classList.add('show');
    dayVideoWantSound = !!withSound;
    el.vid.muted = !withSound;
    setSoundLabel(el.vid.muted);
    try { el.vid.currentTime = 0; } catch (e) { /* noop */ }
    playDayVideo(withSound);
  }

  /* 再生を試みる。音つきで断られたら、音を消してもう一度だけ試す */
  function playDayVideo(retryMuted) {
    var el = dayVideoEls();
    if (!el.vid) return;
    var p;
    try { p = el.vid.play(); } catch (e) { p = null; }
    if (p && p.catch) {
      p.catch(function () {
        if (retryMuted && !el.vid.muted) {
          el.vid.muted = true;
          setSoundLabel(true);
          var q;
          try { q = el.vid.play(); } catch (e2) { q = null; }
          if (q && q.catch) q.catch(function () { el.play.classList.add('show'); });
          return;
        }
        el.play.classList.add('show');
      });
    }
  }

  function showDayVideo() {
    buildDayVideoUi();
    var el = dayVideoEls();
    el.ov.classList.add('show');
    /* まだ再生しない。静止画の上に「音あり／音なし」の確認を出して待つ */
    el.play.classList.remove('show');
    el.sound.classList.remove('show');
    el.ask.classList.add('show');
    dayVideoWantSound = false;
    el.vid.muted = true;
    setSoundLabel(true);
    /* 選ばれたらすぐ流せるよう、ここで動画を先に読み込んでおく */
    if (el.vid.preload !== 'auto') el.vid.preload = 'auto';
    try { el.vid.pause(); el.vid.currentTime = 0; el.vid.load(); } catch (e) { /* noop */ }
  }

  function hideDayVideo() {
    var el = dayVideoEls();
    if (!el.ov) return;
    el.ov.classList.remove('show');
    if (el.vid) {
      try { el.vid.pause(); el.vid.currentTime = 0; } catch (e) { /* noop */ }
    }
  }

  function examDateKey() {
    try { return localStorage.getItem('exam-date') || ''; } catch (e) { return ''; }
  }

  /* 開花日の当日、まだ見ていなければ1回だけ自動で出す */
  function maybeAutoShowDayVideo() {
    if (daysLeft() !== 0) return;
    var key = examDateKey();
    if (!key) return;
    try { if (localStorage.getItem(DAY_VIDEO_SEEN_KEY) === key) return; } catch (e) { /* noop */ }
    /* 閉じずにアプリを終了しても二度は出さない（出した時点で記録する） */
    try { localStorage.setItem(DAY_VIDEO_SEEN_KEY, key); } catch (e) { /* noop */ }
    showDayVideo();
  }

  /* 開花日の前日に動画を先に取っておく（当日すぐ再生できるように） */
  var dayVideoPrefetched = false;
  function prefetchDayVideo() {
    if (dayVideoPrefetched) return;
    if (daysLeft() !== 1) return;
    try {
      var c = navigator.connection;
      if (c && c.saveData) return;   /* 通信量を節約する設定の人には取りに行かない */
    } catch (e) { /* noop */ }
    dayVideoPrefetched = true;
    var url = DAY_VIDEO_SRC;
    try {
      var probe = document.createElement('video');
      if (!probe.canPlayType('video/mp4; codecs="avc1.4D401E"')) url = DAY_VIDEO_SRC_WEBM;
    } catch (e) { /* noop */ }
    try { fetch(url).catch(function () {}); } catch (e) { /* noop */ }
  }

  window.BLOOM_CD = { show: show, hide: hide, message: todaysMessage, older: goOlder, newer: goNewer,
    updateTriggerVisibility: updateTriggerVisibility, showDayVideo: showDayVideo, hideDayVideo: hideDayVideo };

  function init() {
    buildUi();
    updateTriggerVisibility();
    document.addEventListener('click', updateTriggerVisibility);
    document.addEventListener('visibilitychange', updateTriggerVisibility);
    window.addEventListener('focus', updateTriggerVisibility);
    setInterval(updateTriggerVisibility, 30000);
    /* 開花日 当日のムービー（画面が出そろってから） */
    setTimeout(function () { maybeAutoShowDayVideo(); prefetchDayVideo(); }, 1200);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
