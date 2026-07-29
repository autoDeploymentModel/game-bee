# Galaga H5 - FC小蜜蜂

## 项目简介

这是一个高度模仿FC经典游戏《小蜜蜂》（Galaga）的H5版本射击游戏，适配移动端和桌面端浏览器。

## 核心特性

- ✅ 像素风格画面，还原FC时代经典视觉体验
- ✅ 流畅的射击战斗手感
- ✅ 丰富的道具系统和敌人类型
- ✅ 支持触摸控制和键盘操作
- ✅ 多种武器升级系统（单发→双枪→散射→激光→追踪弹→导弹）
- ✅ 连击和得分系统
- ✅ 多阶段 Boss 战（螺旋/扇形弹幕 + 召唤小怪）
- ✅ 炸弹清屏技能与冲刺位移
- ✅ 难度逐轮递增（敌人血量/速度/射速随循环提升）
- ✅ Boss 血条、暂停/结束界面等 UI 反馈

## 技术栈

- **原生 Canvas API**: 高性能2D渲染（手写游戏引擎）
- **Web Audio API**: 音效管理
- **localStorage**: 本地存档
- **Webpack 5**: 模块打包工具

## 游戏机制

### 玩家系统
- 生命值：3条心
- 移动速度：5px/帧
- 武器类型：单发→双枪→散射→激光

### 敌人类型
| 类型 | 血量 | 分值 | 行为 |
|------|------|------|------|
| 战斗机 | 3 | 100 | 直线飞行，俯冲攻击 |
| 轰炸机 | 5 | 200 | 缓慢飞行，投掷炸弹 |
| 护卫机 | 2 | 150 | 快速移动，成对包夹 |
| Boss | 40 | 2000 | 多阶段弹幕 + 召唤小怪 |

### 武器系统
- 单发 → 双枪 → 散射 → 激光 → 追踪弹（自动锁敌）→ 导弹（穿透）
- 高级武器（追踪弹/导弹）消耗弹药，拾取 🔋 道具补充

### 道具系统
- 📦 红色箱子：随机武器升级
- 💎 蓝色宝石：无敌护盾（30秒）
- ⚡ 黄色闪电：全屏清敌
- ❤️ 爱心：回复生命
- 💣 炸弹：增加手动清屏次数（B/C 键释放）
- 🪙 金币：直接加分
- 🔥 射速：限时射速翻倍
- 🔋 弹药：补充弹药

### 操作
- ← → 移动，↑↓ 上下移动，Z/X/空格 射击
- B/C 投放炸弹，Shift/↑ 冲刺，ESC 暂停，Enter 开始/重开

## 安装和运行

### 前置要求
- Node.js >= 18
- pnpm >= 9（或 npm）

### 本地开发

1. 克隆项目
```bash
git clone <repo-url>
cd galaga-h5
```

2. 安装前端依赖
```bash
pnpm install
```

3. 开发模式运行
```bash
pnpm run dev
```

4. 访问：http://localhost:8080

### 生产构建

```bash
pnpm run build
```

构建产物在 `server/public/` 目录中。

## 服务器部署

排行榜功能需要后端服务器（Express + JSON 文件）支持。**构建产物自动输出到 `server/public/`，部署时只需上传 `server/` 目录。**

### 本地构建

```bash
pnpm install
pnpm run build
```

### 部署步骤

1. 将 `server/` 目录上传到服务器

```bash
scp -r server/ user@your-server:/path/to/galaga/
```

2. 在服务器上安装依赖并启动

```bash
cd /path/to/galaga/server
npm install
npm start
# 默认监听 3000 端口，可通过 PORT 环境变量修改
# 示例：PORT=80 npm start
```

3. 访问：`http://<服务器IP>:3000`

### 部署架构

```
server/                         ← 只需部署这一个目录
├── index.js                    ← Express 服务器入口
├── package.json
├── public/                     ← 前端静态文件（构建产物）
│   ├── index.html
│   └── main.js
└── leaderboard.json           ← 排行榜数据（自动创建，JSON 格式）
```

- 服务器同时提供前端页面和排行榜 API
- 所有访问该服务器的玩家共享同一个排行榜
- 数据以 JSON 格式持久化保存，支持备份

### 使用 PM2 守护进程

```bash
npm install -g pm2
cd /path/to/galaga/server
pm2 start index.js --name galaga
pm2 save
pm2 startup
```

### Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### API 接口

| 方法 | 路径 | Content-Type | 请求体 | 响应 |
|------|------|-------------|--------|------|
| GET | `/api/leaderboard` | - | - | `[{name, score, level, created_at}]` |
| POST | `/api/leaderboard` | `application/json` | `{name, score, level}` | `{ok: true}` |

## 操作说明

### 桌面端
- ← → 方向键：移动战机
- Z/X/空格键：射击
- Enter：开始游戏
- Escape：暂停/继续

### 移动端
- 虚拟按键：左右移动
- 射击按钮：触发射击

## 项目结构

```
src/
├── config/           # 游戏配置
│   └── game.config.js
├── core/             # 核心系统
│   ├── Game.js       # 游戏主循环
│   ├── InputHandler.js # 输入处理
│   └── SceneManager.js # 场景管理
├── entities/         # 游戏实体
│   ├── Player/       # 玩家系统
│   │   ├── Player.js
│   │   └── WeaponSystem.js
│   ├── Enemy/        # 敌人系统
│   │   ├── BaseEnemy.js
│   │   └── Squadron.js
│   ├── Bullet/       # 子弹系统
│   │   ├── PlayerBullet.js
│   │   └── EnemyBullet.js
│   └── PowerUp/      # 道具系统
│       └── PowerUp.js
├── ui/               # UI界面
│   ├── HUD.js        # 信息显示
│   ├── Leaderboard.js # 排行榜（REST API）
│   └── ScoreBoard.js # 计分板
├── utils/            # 工具函数
│   └── MathUtils.js
├── main.js           # 入口文件
├── server/           # 后端服务器（部署只需此目录）
│   ├── index.js      # Express + SQLite API
│   ├── package.json
│   └── public/       # 构建产物（前端静态文件）
```

## 浏览器支持

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- 移动端 Chrome
- iOS Safari

## 性能要求

- 60 FPS 稳定运行
- 内存占用 < 500MB
- 加载时间 < 3秒

## 后续计划

### 功能扩展
- [x] 排行榜（SQLite 后端，跨地区共享）
- [ ] 多人联机模式
- [ ] 成就系统
- [ ] 皮肤解锁
- [ ] 关卡编辑器

### 优化项
- [ ] 音效系统
- [ ] 背景音乐
- [ ] 粒子特效
- [ ] 动画优化

## 许可证

MIT License

## 开发团队

- 开发者：admAgent
- 版本：v1.0
- 最后更新：2026年7月18日
