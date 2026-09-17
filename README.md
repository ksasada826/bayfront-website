# Bayfront Partners 会社サイト

本番用の静的サイト（HTML / CSS / JS）。ドメインは **https://bayfront-partners.com/**。

ローカルパス: `C:\Users\ksasa\bayfront-site`  
GitHub: [ksasada826/bayfront-website](https://github.com/ksasada826/bayfront-website)（公開）  
ホスティング: **GitHub Pages**（カスタムドメイン）

## ローカルで開く

```powershell
cd C:\Users\ksasa\bayfront-site
start index.html
```

またはエクスプローラーで `index.html` を開く。静的なのでサーバー不要。フォントは Google Fonts 経由。

## デプロイ

`main` へ push すると GitHub Pages が配信する（Settings → Pages → Deploy from branch `main` / `/ (root)`）。

```powershell
cd C:\Users\ksasa\bayfront-site
git add -A
git commit -m "説明"
git push origin main
```

プレビュー（カスタムドメイン反映前）: `https://ksasada826.github.io/bayfront-website/`

## ドメイン（DNS）

レジストラ／DNS: **Squarespace Domains**（旧 Google Domains。NS は `ns-cloud-d*.googledomains.com`）。  
現状 A レコードは Squarespace の「近日公開」向け。GitHub Pages へ切り替えるには下表に置き換える。

**方針:** apex（`bayfront-partners.com`）を正とし、`www` は apex へ向ける。

| Type | Name / Host | Value | TTL |
|---|---|---|---|
| A | `@`（apex） | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |
| CNAME | `www` | `ksasada826.github.io` | 3600 |

**触らないもの:** MX（`smtp.google.com`）・SPF（`v=spf1 include:_spf.google.com ~all`）など Google Workspace 用レコード。

DNS 反映後、GitHub → リポジトリ → Settings → Pages で Custom domain に `bayfront-partners.com` を入れ、**Enforce HTTPS** をオン。`CNAME` ファイルはリポジトリ直下に同梱済み。

## 問い合わせフォーム（Web3Forms）

メールアドレスは HTML に書かない。送信は [Web3Forms](https://web3forms.com/)（無料枠）。

1. Web3Forms でアカウント作成し、受信先を `ksasada@bayfront-partners.com` に設定
2. Access Key を発行
3. `js/form-config.js` の `accessKey: ""` に貼って commit / push

キー未設定のまま送信すると、画面に設定案内が出る（送信はしない）。

## TBD

- **About 写真** — いまは `assets/photos/photo-yokohama-dusk.jpg`（港の夕景）を仮置き。ポートレート差し替え待ち

## ロック済みデザイン

- Harbour Photographic / Newsreader + Stack Sans Notch / 和文 Hiragino スタック
- 和文トーン B、モバイルはハンバーガー、実績は匿名
- 詳細は `DECISIONS.md`

## 会社情報の正本

`bp-vault/ref/company.md`。フッター表記は「横浜」（番地は非掲載）。
