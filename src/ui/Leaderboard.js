/**
 * 排行榜系统 - 优先 REST API，失败时降级到 localStorage
 */
const NAME_KEY = 'galaga_playerName';
const LOCAL_KEY = 'galaga_localScores';
const API_BASE = '';

export class Leaderboard {
  static getPlayerName() {
    return localStorage.getItem(NAME_KEY) || null;
  }

  static setPlayerName(name) {
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem(NAME_KEY, trimmed);
      return trimmed;
    }
    return null;
  }

  // === 本地降级存储 ===
  static _loadLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
  }

  static _saveLocal(scores) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(scores.slice(0, 50)));
  }

  // === 获取排行 ===
  static async getScores() {
    // 先尝试服务器
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard`);
      if (res.ok) return await res.json();
    } catch { /* 降级 */ }

    // 服务器不可用，用本地数据
    return this._loadLocal();
  }

  // === 提交分数 ===
  static async addScore(name, score, level) {
    if (!name || score <= 0) return;

    const trimmed = name.trim();

    // 先尝试提交到服务器
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, score, level })
      });
      if (res.ok) return; // 服务器成功，结束
    } catch { /* 降级到本地 */ }

    // 服务器不可用，存入 localStorage
    const local = this._loadLocal();
    local.push({
      name: trimmed,
      score,
      level,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    local.sort((a, b) => b.score - a.score);
    this._saveLocal(local);
  }

  // === 渲染 ===
  static async render(container) {
    if (!container) return;
    const scores = await this.getScores();
    const currentName = this.getPlayerName();

    let html = '<div class="leaderboard-section">';
    html += '<div class="section-label"><span>积分排行榜</span><small>Leaderboard</small></div>';

    if (scores.length === 0) {
      html += '<div class="leaderboard-empty">暂无记录，快去战斗吧！</div>';
    } else {
      const top10 = scores.slice(0, 10);
      html += '<div class="leaderboard-list">';
      html += '<div class="lb-header"><span class="lb-rank">#</span><span class="lb-name">飞行员</span><span class="lb-score">积分</span><span class="lb-level">关卡</span></div>';

      top10.forEach((entry, i) => {
        const isMe = currentName && entry.name === currentName;
        const rankClass = i === 0 ? 'lb-rank-gold' : i === 1 ? 'lb-rank-silver' : i === 2 ? 'lb-rank-bronze' : '';
        const rowClass = isMe ? 'lb-row lb-me' : 'lb-row';
        const safeName = this._escape(entry.name);
        html += `<div class="${rowClass}">`;
        html += `<span class="lb-rank ${rankClass}">${i + 1}</span>`;
        html += `<span class="lb-name">${safeName}</span>`;
        html += `<span class="lb-score">${entry.score.toLocaleString()}</span>`;
        html += `<span class="lb-level">Stage ${entry.level}</span>`;
        html += '</div>';
      });

      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  static _escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}