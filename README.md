# 逛逛AI MVP

AI穿搭推荐电商产品教学Demo —— 用于"AI原生产品经理工作流"课程。

**用户端**: 5屏交互（场合快选 → 穿搭推荐 → 风格偏好 → 收藏历史 → 分享图）
**后台**: 3屏数据管理（Dashboard → 偏好分析 → 穿搭管理）

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 + 自研设计系统 (Soft Coral Pink) |
| 路由 | React Router v6 |
| 状态管理 | React Context + useReducer |
| 图表 | Recharts |
| 测试 | Vitest + Testing Library |
| 包管理 | pnpm workspaces (monorepo) |
| 部署 | Vercel |

## 本地运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器（两个App同时启动）
pnpm dev
# user-app  → http://localhost:3000
# admin-app → http://localhost:3001

# 运行测试
pnpm test

# 构建
pnpm build
```

## 项目结构

```
逛逛AI-mvp/
├── packages/
│   ├── shared/          # 共享设计系统 + TypeScript类型
│   │   ├── types/       # Outfit, Occasion, UserPreferences 等
│   │   └── tokens/      # Tailwind CSS preset (颜色/字体/圆角/间距)
│   ├── user-app/        # 用户端SPA (5屏)
│   │   └── src/
│   │       ├── pages/       # HomePage, RecommendPage, PreferencesPage, FavoritesPage, SharePage
│   │       ├── components/  # OccasionCard, OutfitCard
│   │       └── store/       # AppContext + reducer + seedData
│   └── admin-app/       # 后台SPA (3屏 + 登录)
│       └── src/
│           ├── pages/       # LoginPage, DashboardPage, AnalyticsPage, OutfitsPage
│           ├── components/  # Sidebar, MetricCard
│           └── store/       # AdminContext + reducer + seedData
├── assets/outfits/      # 穿搭素材图片
├── vercel.json
└── README.md
```

## 01-11 模块对照表

| 模块 | 内容 | 对应产物 |
|------|------|----------|
| 01 | AI Native产品方法论 | 整体产品架构设计 |
| 02 | 用户调研与需求洞察 | DESIGN.md 用户场景定义 |
| 03 | 竞品分析与市场格局 | 竞品调研结论 |
| 04 | 需求优先级排序 | MVP功能取舍 (5屏用户端 + 3屏后台) |
| 05 | 需求文档化 | PRD → proposal.md |
| 06 | 产品创新与差异化 | 场合场景化AI穿搭推荐 |
| 07 | 商业价值评估 | 价格档位体系 + 后台数据指标 |
| 08 | 产品路线图 | 非目标功能列表 (Non-Goals) |
| 09 | 项目计划与资源 | tasks.md (52个任务, 7个Phase) |
| 10 | PRD撰写 | specs/ 目录下的详细规格 |
| 11 | 原型生成与验证 | Google Stitch 原型 → React SPA |

## 设计系统

基于 Soft Coral Pink / Plus Jakarta Sans 设计语言。
- Primary: `#874c63` (Soft Coral Pink)
- Surface: `#fcf9f8` (Warm Grey-White)
- Font: Plus Jakarta Sans

详见 `DESIGN.md` 和 `packages/shared/tokens/tailwind-preset.ts`

## 部署

- 用户端: `guangguangai.vercel.app`
- 后台: `guangguangai-admin.vercel.app`
- 本地预览: `pnpm dev` → localhost:3000 / localhost:3001
