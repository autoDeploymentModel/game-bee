import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public', { index: 'index.html' }));

// 初始化 SQLite 数据库
const db = new Database('leaderboard.db');
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    level INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
`);

// GET /api/leaderboard - 获取排行榜前 50
app.get('/api/leaderboard', (req, res) => {
  try {
    const rows = db.prepare('SELECT name, score, level, created_at FROM scores ORDER BY score DESC LIMIT 50').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leaderboard - 提交分数
app.post('/api/leaderboard', (req, res) => {
  const { name, score, level } = req.body;
  if (!name || typeof score !== 'number' || score <= 0) {
    return res.status(400).json({ error: '无效的分数数据' });
  }
  try {
    db.prepare('INSERT INTO scores (name, score, level) VALUES (?, ?, ?)').run(name, score, level || 1);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 首页 fallback
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.listen(PORT, () => {
  console.log(`Galaga 排行榜服务器已启动: http://localhost:${PORT}`);
});