

> Little Chapter 是一個專為親子設計的繪本電商平台，提供年齡分齡推薦、互動式購物體驗，以及豐富的繪本內容，協助家長為孩子挑選最適合的繪本。

# Little Chapter 前端前台

![專案封面圖](https://storage.googleapis.com/little-chapter-book-imgs/home.jpg)

> 此專案是 Little Chapter 親子繪本電商平台的前端前台系統，採用 Next.js 14 開發，提供現代化的購物體驗和響應式設計，讓家長能輕鬆為孩子選購合適的繪本。

- [線上觀看連結](DEMO連結)

## 功能特色

測試帳號密碼 **（僅供測試使用）**

```bash
帳號： test@example.com
密碼： test123
```

### 核心功能
- [x] 會員註冊/登入系統
- [x] 商品瀏覽與搜尋
- [x] 年齡分齡推薦系統
- [x] 購物車功能
- [x] 訂單管理
- [x] 收藏清單
- [x] 折扣碼系統
- [x] 會員通知中心
- [x] 商品評價系統
- [x] 響應式設計 (RWD)
- [x] 聊天機器人客服

### 特色功能
- [x] AI關鍵字補足功能
- [x] AI智能客服
- [x] 互動式產品展示
- [x] 多層次分類篩選

## 畫面展示

> 展示主要功能頁面，讓使用者快速了解平台特色

![首頁展示](https://a-little-chapter-frontend.vercel.app/)
![商品列表](https://a-little-chapter-frontend.vercel.app/products)
![購物車](https://a-little-chapter-frontend.vercel.app/cart)

## 安裝與設定

> 請確保您的開發環境符合以下要求

以下將引導您如何在本地環境中設定此專案。

Node.js 版本建議為：`18.17.0` 以上
npm 版本建議為：`9.0.0` 以上

### 取得專案

```bash
git clone https://github.com/yutzu1370/aLittleChapter-frontend.git
```

### 移動到專案目錄

```bash
cd frontend
```

### 安裝套件

```bash
npm install
```

### 環境變數設定

請在終端機輸入 `cp .env.example .env` 來複製環境變數範例檔案，並依據 `.env` 內容調整相關欄位。

```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 運行專案

```bash
npm run dev
```

### 開啟專案

在瀏覽器網址列輸入以下即可看到畫面

```bash
http://localhost:3000
```

## 環境變數說明

```env
NEXT_PUBLIC_API_BASE_URL= # 後端 API 基礎網址
NEXT_PUBLIC_GOOGLE_CLIENT_ID= # Google OAuth 客戶端 ID
```

## 專案結構

```
little-chapter/
├── app/                    # Next.js 13+ App Router
│   ├── about/             # 關於我們頁面
│   ├── account/           # 會員中心相關頁面
│   ├── cart/              # 購物車相關頁面
│   ├── products/          # 商品相關頁面
│   ├── globals.css        # 全域樣式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首頁
├── components/            # React 組件
│   ├── account/           # 會員中心組件
│   ├── auth/              # 認證相關組件
│   ├── cart/              # 購物車組件
│   ├── home/              # 首頁組件
│   ├── interaction/       # 互動組件
│   ├── layout/            # 布局組件
│   ├── products/          # 商品組件
│   └── ui/                # 基礎 UI 組件
├── hooks/                 # 自定義 React Hooks
├── lib/                   # 工具函數與配置
│   ├── api/               # API 呼叫函數
│   ├── store/             # 狀態管理 (Zustand)
│   ├── types/             # TypeScript 型別定義
│   └── utils/             # 工具函數
├── public/                # 靜態資源
│   ├── images/            # 圖片資源
│   └── fonts/             # 字體檔案
└── docs/                  # 專案文件
```

## 專案技術

### 核心技術
- **Next.js** v14.2.5 - React 全端框架
- **React** v18.3.1 - 前端函式庫
- **TypeScript** v5.5.4 - 型別安全的 JavaScript
- **Tailwind CSS** v3.4.1 - 原子化 CSS 框架

### UI 與樣式
- **Shadcn UI** - 現代化 UI 組件庫
- **Radix UI** - 無障礙 UI 基礎組件
- **Lucide React** - 圖示庫
- **Swiper** v11.1.14 - 輪播組件

### 狀態管理與工具
- **Zustand** v4.5.5 - 輕量級狀態管理
- **React Hook Form** v7.53.0 - 表單處理
- **Sonner** v1.5.0 - 通知系統

### 開發工具
- **ESLint** - 程式碼檢查
- **PostCSS** - CSS 後處理器
- **Autoprefixer** - CSS 前綴自動添加

## 第三方服務

- **Google OAuth** - 第三方登入
- **RESTful API** - 後端資料串接
- **Vercel** - 部署平台

## 開發指令

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置專案
- `npm run start` - 啟動正式伺服器
- `npm run lint` - 執行 ESLint 檢查
- `npm run lint:fix` - 自動修復 ESLint 錯誤

## Git Flow 協作流程

### 分支管理

- **main** - 正式發布分支，僅合併穩定版本
- **dev** - 主要開發分支，所有功能分支皆自此建立
- **feature/\*** - 功能開發分支，命名如 `feature/shopping-cart`

### 開發流程

1. **切換並更新開發分支**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **建立功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **開發與提交**
   ```bash
   git add .
   git commit -m "feat: 新增購物車功能"
   ```

4. **合併回開發分支**
   ```bash
   git checkout dev
   git merge feature/your-feature-name
   git push origin dev
   ```

5. **發布正式版本**
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

## 部署說明

此專案使用 Vercel 進行自動部署：

- **開發環境**：自動部署 `dev` 分支
- **正式環境**：自動部署 `main` 分支

當專案 merge 到 main 時會自動執行以下動作：
- 建立 Node.js 環境
- 安裝相依套件
- 執行 TypeScript 編譯
- 執行 ESLint 掃描
- 建置 Next.js 專案
- 部署到 Vercel

## 性能優化

- **圖片優化**：使用 Next.js Image 組件，支援 WebP 格式和 lazy loading
- **程式碼分割**：利用 Next.js 自動程式碼分割功能
- **SSR/SSG**：適當使用伺服器端渲染和靜態生成
- **響應式設計**：行動優先的 RWD 設計

## 開發規範

- 遵循 TypeScript 嚴格模式
- 使用 ESLint 和 Prettier 確保程式碼品質
- 組件採用函數式組件和 Hooks
- 優先使用 RSC (React Server Components)
- API 呼叫統一放在 `/lib/api` 目錄
- 型別定義統一放在 `/lib/types` 目錄

## 聯絡資訊

如有任何問題或建議，歡迎聯絡開發團隊：

- **專案負責人**：[GitHub](https://github.com/yutzu1370)
- **技術支援**：[Issues](https://github.com/yutzu1370)
- **官方網站**：[A Little Chapter](https://a-little-chapter-frontend.vercel.app/)

---

**Little Chapter** - 讓每個孩子都能找到屬於自己的故事 📚✨

