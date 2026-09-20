# Bayfront Partners site — design decisions

- **Direction:** A Harbour Photographic
- **Hero photo:** 2 昼の海（みなとみらい実写）`photo-yokohama-day.jpg`
- **Languages（【決定 2026-09-20】URL分離）:** `/`＝英語、`/ja/`＝日本語。各URLが最初から本文を返す（JSの `data-i18n` 書き換えは廃止）。hreflang・canonical・sitemap は両URLを相互参照。x-default は `/`。読み手: **EN＝海外の見込み客（B2B）**／**JP＝銀行など実態・実在を確認したい側**（営業用の日本語訳ページではない）。JPは会社概要・所在・代表・連絡手段など検証しやすい情報を厚くする方向。実績の数字追加・対象／契約形態の詳細文言は未着手（Keisuke）
- **About LinkedIn ラベル:** 両言語とも "LinkedIn"（「プロフィール」は使わない）
- **Client proof:** anonymous only
- **Logo (dark hero):** `logos/logo-name-white.png` from Drive `01 logo/02 png`
- **Logo (light sections):** `logos/logo-name-navy.png`
- **Logo サイズ（2026-09-17 Keisuke「これでいこう」）:** 潰さない（max-height + aspect 維持）。モバイル max-height 23px／デスクトップ約 28px
- **Mockup:** `mockup-full.html`（写真比較は `mockups-a-photos.html`）。現行見た目を採用（2026-09-17 Keisuke「いいね、これでいこう」）
- **モバイルナビ（2026-09-17 Keisuke「これでいこう」）:** ハンバーガー（三本線）。上段＝ロゴ＋EN|JP＋ハンバーガー。リンクは縦パネル。リンク／Esc／外側クリックで閉じる
- **Headline font:** Newsreader（「Beside you, beyond complexity.」）
- **Kicker / UI sans:** Stack Sans Notch（ロゴ同一）
- **Contact:** 問い合わせフォーム（メールアドレス直書きはしない）
- **和文コピーの型:** B 丁寧な会社案内に決定（2026-09-17 Keisuke）。A・C は不採用
- **和文フォント（2026-09-17 Keisuke「ヒラギノで」ロック）:** `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "游ゴシック", Meiryo, sans-serif`
- **会社概要（【決定 2026-09-20】代表を内包）:** `#company` に社名・事業一文・事実行（Founded／Founder／Address）。代表の経歴・LinkedInは Founder 行の中に展開（独立プロフィール見出しは置かない）。写真は右側。nav の About／代表紹介は廃止。**資本金・人数は出さない**。住所にマンション名なし・ENは Japan 付き。設立は 2025年11月。nav「サービス／Approach」は `#what`
- **実績:** 匿名の実案件5件（ロイヤリティ／スタジアム売店／海外アドテク日本窓口＝Opera系／国内不動産の経営改革＝楽市楽座系／海外気象テックBD＝Aeolus系）。社名・国籍の出しすぎに注意。楽市楽座は社内文書を載せず Bayfront 側の役割記述のみ（2026-09-17）
- **箱の使い分け（2026-09-17 採用）:** 同じ箱の繰り返しをやめた。ご支援の流れ＝1本の線でつないだ3ステップ（番号は Newsreader）／実績＝案件名｜内容の一覧表＋帯の地色（paper）。箱（背景＋左線）は使わない

- **公開ホスト（2026-09-17 → Cloudflare 寄せ）:** Cloudflare Pages（ソース repo `ksasada826/bayfront-website`）。カスタムドメイン `bayfront-partners.com`（apex 正、www も Pages に紐付け）。DNS 権威は Cloudflare。レジストラは Squarespace Domains のまま（NS のみ切替）。旧 GitHub Pages カスタムドメイン案は不採用（【決定 2026-09-17 Keisuke】）。フォームは Web3Forms（キーは `js/form-config.js`、メール直書きなし）。Google Workspace の MX／SPF／DKIM は DNS only で維持

Updated: 2026-09-20（会社概要に代表を統合）

## 和文調査メモ（2026-09-17）

参考にした型:
- 個人・小規模事務所の短文「〜します。」（例: JIMA の進出支援説明）
- 一般コーポレートのですます案内（例: N&E、越境支援系）
- スタジオ型の英語ナビ＋和文本文（例: Takram）

企業サイト和文フォント実態（100社調査系）: Noto / 游ゴシック / ヒラギノ が上位。BIZ・Zen・Plex は差別化候補。
