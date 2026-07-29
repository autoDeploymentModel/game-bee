import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'leaderboard.json');
const MAX_ENTRIES = 50;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));

function load() {
  try {
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {}
  return [];
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data), 'utf-8');
}

app.get('/api/leaderboard', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 50);
    res.json(load().slice(0, limit));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leaderboard', (req, res) => {
  const { name, score, level } = req.body;
  if (!name || typeof score !== 'number' || score <= 0) {
    return res.status(400).json({ error: '无效的分数数据' });
  }
  try {
    const scores = load();
    scores.push({
      name: name.trim().slice(0, 12),
      score,
      level: level || 1,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    scores.sort((a, b) => b.score - a.score);
    save(scores.slice(0, MAX_ENTRIES));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Galaga 排行榜服务器已启动: http://localhost:${PORT}`);
});