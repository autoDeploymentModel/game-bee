/**
 * 计分板（支持桌面端/移动端自适应）
 */
import { GameConfig } from '../config/game.config.js';

// 是否窄屏（手机端）
function isNarrowScreen(w) {
  return w < 600;
}

export class ScoreBoard {
  constructor(game) {
    this.game = game;
    this.highScore = this.loadHighScore();
    this.combo = 1;
    this.comboTimer = 0;
    this.comboMaxTime = 60; // 1秒无新击杀则重置连击
    this.popups = []; // 浮动得分显示
  }

  loadHighScore() {
    return localStorage.getItem('galaga_highScore') || 0;
  }

  saveHighScore() {
    localStorage.setItem('galaga_highScore', this.highScore);
  }

  addScore(amount) {
    const finalScore = amount * this.combo;
    this.game.addScore(finalScore);

    // 检查最高分
    if (this.game.getScore() > this.highScore) {
      this.highScore = this.game.getScore();
      this.saveHighScore();
    }

    // 增加连击
    this.combo++;
    this.comboTimer = this.comboMaxTime;
  }

  update(deltaTime) {
    // 连击计时
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) {
        this.combo = 1;
      }
    }

    // 更新浮动得分
    this.popups = this.popups.filter(p => {
      p.y -= 2;
      p.life--;
      return p.life > 0;
    });
  }

  addPopup(x, y, text, color) {
    this.popups.push({
      x: x,
      y: y,
      text: text,
      color: color,
      life: 60
    });
  }

  reset() {
    this.combo = 1;
    this.comboTimer = 0;
    this.popups = [];
  }

  render(ctx) {
    ctx.save();

    // 浮动得分
    const popupFontSize = this.game.getWidth() < 600 ? '14' : '20';
    this.popups.forEach(p => {
      const progress = 1 - p.life / 60;
      ctx.globalAlpha = Math.min(1, p.life / 18);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.font = `800 ${popupFontSize}px "Trebuchet MS", sans-serif`;
      ctx.textAlign = 'center';
      const scale = 1 + Math.sin(progress * Math.PI) * .18;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(scale, scale);
      ctx.fillText(p.text, 0, 0);
      ctx.restore();
      ctx.shadowBlur = 0;
    });

    ctx.globalAlpha = 1;

    const width = this.game.getWidth();
    const height = this.game.getHeight();
    const narrow = isNarrowScreen(width);

    // 最高分 - 手机端放在底部避免遮挡
    const highScoreX = width - (narrow ? 12 : 24);
    const highScoreY = narrow ? height - 18 : 158;

    ctx.fillStyle = 'rgba(152, 169, 204, .72)';
    ctx.font = `700 ${narrow ? '10' : '12'}px "Trebuchet MS", sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`HIGH SCORE  ${String(this.highScore).padStart(6, '0')}`, highScoreX, highScoreY);

    ctx.restore();
  }

  getCombo() {
    return this.combo;
  }
}
