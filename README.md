# Bayfront Partners 会社サイト

本番用の静的サイト（HTML / CSS / JS）。ドメインは **https://bayfront-partners.com/**。

ローカルパス: `C:\Users\ksasa\bayfront-site`  
GitHub: [ksasada826/bayfront-website](https://github.com/ksasada826/bayfront-website)（公開・ソース正本）  
ホスティング: **Cloudflare Pages**  
DNS: **Cloudflare**（レジストラは Squarespace Domains のまま。NS だけ Cloudflare へ）

【決定 2026-09-17 Keisuke】GitHub Pages カスタムドメイン案は取り下げ。Cloudflare（Pages + DNS）に寄せる。

## ローカルで開く

```powershell
cd C:\Users\ksasa\bayfront-site
start index.html
```

またはエクスプローラーで `index.html` を開く。静的なのでサーバー不要。フォントは Google Fonts 経由。

## デプロイ（Cloudflare Pages）

`main` へ push → Cloudflare が Git 連携で配信する（ダッシュボードで repo 接続後）。

初回／手動デプロイ（Wrangler）:

```powershell
cd C:\Users\ksasa\bayfront-site
npx wrangler login
npx wrangler pages project create bayfront-website --production-branch=main
npx wrangler pages deploy . --project-name=bayfront-website
```

Git 連携（推奨・ダッシュボード）:

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Create → Pages → Connect to Git
2. `ksasada826/bayfront-website` を選択
3. Build command: （空）／ Output directory: `/`（または `.`）
4. 本番ブランチ: `main`

プレビュー URL（プロジェクト作成後）: `https://bayfront-website.pages.dev/`（名前が違えばダッシュボード表記に従う）  
本番 URL: `https://bayfront-partners.com/`（カスタムドメイン紐付け＋NS 切替後）

ローカルの変更を反映するだけなら:

```powershell
cd C:\Users\ksasa\bayfront-site
git add -A
git commit -m "説明"
git push origin main
```

## ドメイン（DNS）— Cloudflare

レジストラは **Squarespace Domains**（旧 Google Domains）のまま。  
DNS の権威だけ **Cloudflare** に移す（NS 切替）。

### いまの実測（切替前・2026-09-17）

| 種別 | 値 |
|---|---|
| NS | `ns-cloud-d1`〜`d4.googledomains.com`（Squarespace） |
| A（apex） | Squarespace パーキング `198.49.23.144/145`, `198.185.159.144/145` |
| CNAME（www） | `ext-sq.squarespace.com` |
| MX | `smtp.google.com`（priority 1）— **Google Workspace。維持必須** |
| TXT（SPF） | `v=spf1 include:_spf.google.com ~all` — **維持必須** |
| TXT（DKIM） | `google._domainkey` — 既存の全文をそのまま Cloudflare へ — **維持必須** |
| DMARC | なし（現状どおりでよい。新規追加はしない） |

### Cloudflare 側の準備（NS 切替の前に済ませる）

1. Cloudflare に `bayfront-partners.com` ゾーンを追加 → 表示される **2つの Nameserver** を控える  
2. メール用レコードを **DNS only（グレー雲）** で入れる（下表）  
3. Pages プロジェクトにカスタムドメイン `bayfront-partners.com` と `www.bayfront-partners.com` を追加  
   → ゾーンが Cloudflare 上なら、Web 用 CNAME（apex / www → `*.pages.dev`）はダッシュボードが作る。プロキシは **オレンジ雲**  
4. 旧 Squarespace の A／www CNAME は Web 用に置き換える（メール用 MX／SPF／DKIM は触らない）

**メール用（コピー必須・すべて DNS only）**

| Type | Name | Content | Proxy |
|---|---|---|---|
| MX | `@` | `smtp.google.com`（Priority `1`） | DNS only |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | DNS only |
| TXT | `google._domainkey` | 現行 DKIM 全文（`v=DKIM1; k=rsa; p=...`。Squarespace／`nslookup` で確認した値を一字一句同じに） | DNS only |

**Web 用（Pages カスタムドメイン追加後・オレンジ雲）**

| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | `@` | `<project>.pages.dev`（Pages が自動作成することが多い） | Proxied |
| CNAME | `www` | 同上 | Proxied |

apex の CNAME は Cloudflare の CNAME flattening で動く。GitHub Pages 用の A レコード（`185.199.*`）は使わない。

### Squarespace で Keisuke がやること（エージェント不可ならここだけ手動）

1. Squarespace Domains → `bayfront-partners.com` → DNS／Nameservers  
2. Cloudflare が表示した 2 つの NS に差し替え（例: `ada.ns.cloudflare.com` / `bob.ns.cloudflare.com` — **ダッシュボードの実値を使う**）  
3. 反映待ち（数分〜最大48時間）。切替直後に MX／SPF／DKIM が Cloudflare 側に無いとメールが落ちるので、**必ず NS 変更前にメール用レコードを Cloudflare へ入れておく**

確認（PowerShell 5.1・1コマンドずつ）:

```powershell
nslookup -type=NS bayfront-partners.com 8.8.8.8
nslookup -type=MX bayfront-partners.com 8.8.8.8
nslookup -type=TXT bayfront-partners.com 8.8.8.8
nslookup -type=TXT google._domainkey.bayfront-partners.com 8.8.8.8
```

## GitHub Pages について

旧計画のカスタムドメイン設定は使わない。ソースは GitHub、配信は Cloudflare Pages。  
リポジトリ直下の `CNAME` ファイルは削除済み（GitHub Pages 用。Cloudflare では不要）。  
Settings → Pages にカスタムドメインが残っていれば外す（`github.io` プレビューだけ残してよい）。

旧プレビュー: `https://ksasada826.github.io/bayfront-website/`（Pages を branch 配信のまま残した場合）

## 問い合わせフォーム（Web3Forms）

メールアドレスは HTML に書かない。送信は [Web3Forms](https://web3forms.com/)（無料枠）。

1. Web3Forms でアカウント作成し、受信先を `ksasada@bayfront-partners.com` に設定
2. Access Key を発行
3. `js/form-config.js` の `accessKey: ""` に貼って commit / push

キー未設定のまま送信すると、画面に設定案内が出る（送信はしない）。

## TBD

- **About 写真** — いまは `assets/photos/photo-yokohama-dusk.jpg`（港の夕景）を仮置き。ポートレート差し替え待ち
- **Web3Forms access key** — 未設定
- **Cloudflare ログイン／ゾーン作成／NS 切替** — Keisuke 作業（下記「初回セットアップ」）

## 初回セットアップ（Keisuke・PowerShell 5.1）

エージェント環境は非対話のため `wrangler login` できない。手元で:

```powershell
cd C:\Users\ksasa\bayfront-site
npx wrangler login
```

ブラウザで Cloudflare にログインしたあと:

```powershell
npx wrangler pages project list
npx wrangler pages deploy . --project-name=bayfront-website
```

ゾーン追加とカスタムドメインはダッシュボードの方が分かりやすい（Workers & Pages → 該当プロジェクト → Custom domains）。

## ロック済みデザイン

- Harbour Photographic / Newsreader + Stack Sans Notch / 和文 Hiragino スタック
- 和文トーン B、モバイルはハンバーガー、実績は匿名
- 詳細は `DECISIONS.md`

## 会社情報の正本

`bp-vault/ref/company.md`。フッター表記は「横浜」（番地は非掲載）。
