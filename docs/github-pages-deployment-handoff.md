# ZhuKana GitHub Pages 部署交接文件

這份文件是給下一個接手的 LLM / 開發者使用的，目標是讓對方可以在最少上下文下完成以下事情：

- 使用 `Weily-j` 的 GitHub 身分推送這個 repo
- 透過 GitHub Actions 部署到 GitHub Pages
- 理解本 repo 已完成的部署設定與常見失敗點

## Repo 資訊

- GitHub repo: `Weily-j/ZhuKana`
- 預設分支: `main`
- Git remote 建議使用 SSH alias，而不是 HTTPS
- GitHub Pages 網址預期為: `https://weily-j.github.io/ZhuKana/`

## Repo 內已存在的部署檔案

- GitHub Pages workflow: [`.github/workflows/deploy-pages.yml`](/Users/mis/jp/.github/workflows/deploy-pages.yml)
- Pages build script: [`scripts/build-pages.mjs`](/Users/mis/jp/scripts/build-pages.mjs)
- NPM script: [`package.json`](/Users/mis/jp/package.json)
  - `npm run build:pages`
- PWA manifest: [`manifest.json`](/Users/mis/jp/manifest.json)
- Service Worker: [`sw.js`](/Users/mis/jp/sw.js)
- Installable icons:
  - [`icons/app-icon-192.png`](/Users/mis/jp/icons/app-icon-192.png)
  - [`icons/app-icon-512.png`](/Users/mis/jp/icons/app-icon-512.png)
  - [`icons/app-icon.svg`](/Users/mis/jp/icons/app-icon.svg)

## 已驗證狀態

以下命令已在本機跑過並通過：

```bash
node --test
npm run build:pages
```

目前 `main` 已成功推到 `origin`。
GitHub Pages 站點也已可公開存取：

`https://weily-j.github.io/ZhuKana/`

## OpenSpec 任務狀態

- `10.5 部署至靜態主機（GitHub Pages）` 已完成
- `10.1 ~ 10.3` 仍需要實機驗證，不能用桌面瀏覽器模擬結果取代

如果下一個接手的 LLM 要收尾 OpenSpec，應該把重點放在：

1. iOS Safari 實機驗證 flick / 複製 / Safe Area
2. Android Chrome 實機驗證震動與分享
3. Add to Home Screen / 安裝提示流程驗證

## 為什麼不能用 HTTPS 直接推

先前嘗試用 HTTPS push 時，GitHub 回傳：

```text
remote: Permission to Weily-j/ZhuKana.git denied to weily-jp.
fatal: unable to access 'https://github.com/Weily-j/ZhuKana.git/': The requested URL returned error: 403
```

原因是本機 HTTPS 憑證綁到錯的 GitHub 帳號 `weily-jp`。  
解法是改成專門給 `Weily-j` 的 SSH key。

## Weily-j 專用 SSH 設定

### 1. 產生 SSH key

```bash
ssh-keygen -t ed25519 -C "Weily-j GitHub" -f ~/.ssh/id_ed25519_weily_j
```

### 2. SSH config

將以下內容放到 `~/.ssh/config`：

```sshconfig
Host github-weily-j
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_weily_j
  IdentitiesOnly yes
```

### 3. 將公鑰加到 GitHub

公鑰內容在：

```bash
cat ~/.ssh/id_ed25519_weily_j.pub
```

到 GitHub 的：

- `Settings`
- `SSH and GPG keys`
- `New SSH key`

把公鑰貼上去。

### 4. 測試 SSH

```bash
ssh -T git@github-weily-j
```

成功時會看到類似：

```text
Hi Weily-j! You've successfully authenticated, but GitHub does not provide shell access.
```

## 本 repo 的 remote 應該長這樣

```bash
git remote -v
```

預期輸出：

```text
origin  git@github-weily-j:Weily-j/ZhuKana.git (fetch)
origin  git@github-weily-j:Weily-j/ZhuKana.git (push)
```

如果不是，修正為：

```bash
git remote set-url origin git@github-weily-j:Weily-j/ZhuKana.git
```

## 推送流程

### 1. 檢查狀態

```bash
git status -sb
```

### 2. 跑測試

```bash
node --test
npm run build:pages
```

### 3. 提交變更

```bash
git add <需要的檔案>
git commit -m "<清楚的 commit 訊息>"
```

### 4. Push

```bash
git push -u origin main
```

## GitHub Pages 啟用方式

### 1. 打開 repo

`https://github.com/Weily-j/ZhuKana`

### 2. 啟用 Pages

- `Settings`
- `Pages`
- `Source` 選 `GitHub Actions`

### 3. 部署 workflow

workflow 名稱是：

`Deploy GitHub Pages`

如果 `Pages` 是在 `push` 之後才啟用，workflow 可能不會自動開始。這時要手動跑一次：

- repo 頂部導覽列點 `Actions`
- 找 `Deploy GitHub Pages`
- 點 `Run workflow`

## Workflow 做了什麼

GitHub Actions workflow 會：

1. checkout repo
2. setup Node.js
3. 跑 `npm test`
4. 跑 `npm run build:pages`
5. 上傳 `dist/` 當 Pages artifact
6. 部署到 GitHub Pages

## `dist/` 內容

`build:pages` 會輸出一個乾淨的靜態站點，包含：

- `index.html`
- `style.css`
- `app.js`
- `lib/`
- `data/`
- `icons/`
- `manifest.json`
- `sw.js`
- `.nojekyll`

`dist/` 已在 [`.gitignore`](/Users/mis/jp/.gitignore) 中排除，不應提交進 repo。

## 常見失敗與解法

### 1. `403 Permission denied`

代表目前 Git 認證不是 `Weily-j`。  
不要再用 HTTPS，改用上面的 SSH alias。

### 2. 在 `Settings` 看到的只是 Actions 設定，不是 workflow 列表

這是 GitHub UI 常見混淆點。

- `Settings > Actions` 是設定區
- 真正的 workflow 在 repo 上方導覽列的 `Actions`

### 3. Pages 沒自動部署

如果你是在 push 之後才開 `Pages > GitHub Actions`，請手動 `Run workflow` 一次。

### 4. PWA installability 不通過

先檢查：

- `manifest.json` 是否包含 `192x192` 和 `512x512` PNG
- `sw.js` 是否有把 icon 加入快取

本 repo 已經補好這些設定。

## 建議給下一個 LLM 的最短流程

如果只是要「接手並完成部署」，照這個順序做就夠了：

1. `git remote -v` 檢查是不是 `git@github-weily-j:Weily-j/ZhuKana.git`
2. `ssh -T git@github-weily-j` 檢查 SSH
3. `node --test`
4. `npm run build:pages`
5. `git status -sb`
6. commit / push
7. 到 GitHub `Actions` 確認 `Deploy GitHub Pages`
8. 確認站點 `https://weily-j.github.io/ZhuKana/`

## 補充

如果需要讓另一台機器也能以 `Weily-j` 身分 push，不要複製私鑰，應該在那台機器上重新產生一把新的 SSH key，再加到 GitHub。
