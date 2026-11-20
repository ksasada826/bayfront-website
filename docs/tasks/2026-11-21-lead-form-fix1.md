# Fix 1: 完了画面で進捗が消えない（2026-11-21）

`docs/tasks/2026-11-21-lead-form.md` の続き。

## 不具合

送信が成功して完了画面になると、`js/lead-form.js` は `.progress` に `hidden` を付けるが、`css/styles.css` の `.lead-form .progress { display: flex; }` が `hidden` の既定の非表示を上書きするため、進捗の番号・バー・「戻る」が完了画面の上に残る。

## 直し方

- `css/styles.css` の `.lead-form .progress` のすぐ後に `.lead-form .progress[hidden] { display: none; }` を足す
- 同じ理由で `hidden` が効かなくなっている要素が `.lead-form` の中に他にあれば、同じ形で直す（`.back[hidden]` は意図して場所を残しているので変えない）
- `index.html` と `ja/index.html` の CSS の読み込みを `?v=lead1` から `?v=lead2` に上げる（JS の `?v=` は変えない）

## 制約

git のコマンドを打たない。補助スクリプトを作らない。上の2ファイル（と HTML の `?v=`）以外を触らない。

## 返却物

変更した行を短く。
