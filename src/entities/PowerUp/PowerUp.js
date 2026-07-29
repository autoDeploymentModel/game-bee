/**
 * 道具系统
 */
import { GameConfig } from '../../config/game.config.js';
import { WEAPON_NAMES } from '../Player/WeaponSystem.js';

export class PowerUp {
  constructor(game, x, y, type) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = type;
    this.dead = false;
    this.collected = false;
    
    this.width = 24;
    this.height = 24;
    this.speed = 2;
    this.color = '#FFD700';
    this.glowRadius = 20;
    
    // 根据类型设置颜色和效果
    this.initByType(type);
  }
  
  initByType(type) {
    switch (type) {
      case GameConfig.powerUpTypes.RANDOM_WEAPON:
        this.color = '#FF6B6B'; // 红色箱子
        this.icon = '📦';
        this.name = '武器升级';
        // 预先决定本次将升级到的武器（用于显示）
        this.targetWeapon = this._rollNextWeapon();
        break;

      case GameConfig.powerUpTypes.SHIELD:
        this.color = '#4ECDC4'; // 蓝色宝石
        this.icon = '💎';
        this.name = '护盾';
        break;

      case GameConfig.powerUpTypes.CLEAR_SCREEN:
        this.color = '#FFE66D'; // 黄色闪电
        this.icon = '⚡';
        this.name = '全屏清除';
        break;

      case GameConfig.powerUpTypes.LIFE:
        this.color = '#FF6B6B'; // 爱心
        this.icon = '❤️';
        this.name = '回复生命';
        break;

      case GameConfig.powerUpTypes.BOMB:
        this.color = '#FF9F1C'; // 橙色炸弹
        this.icon = '💣';
        this.name = '炸弹+1';
        break;

      case GameConfig.powerUpTypes.SCORE:
        this.color = '#FFD700'; // 金币
        this.icon = '🪙';
        this.name = '+300分';
        break;

      case GameConfig.powerUpTypes.RAPID:
        this.color = '#9B5DE5'; // 紫色射速
        this.icon = '🔥';
        this.name = '射速x2';
        break;

      case GameConfig.powerUpTypes.AMMO:
        this.color = '#00BBF9'; // 蓝色弹药
        this.icon = '🔋';
        this.name = '弹药+5';
        break;

      default:
        this.color = '#FFD700';
        this.icon = '⭐';
        this.name = '道具';
    }
  }

  // 根据玩家当前武器，预先掷出升级后的目标武器名（用于掉落显示）
  _rollNextWeapon() {
    const player = this.game.getPlayer();
    if (!player || !player.weaponSystem) return null;
    const next = player.weaponSystem.peekNextWeapon();
    return next;
  }
  
  update(deltaTime) {
    if (this.dead || this.collected) return;
    
    // 缓慢下落
    this.y += this.speed;
    
    // 到达屏幕底部
    const canvasHeight = this.game.getHeight();
    if (this.y > canvasHeight + 30) {
      this.dead = true;
    }
    
    // 与玩家碰撞检测
    const player = this.game.getPlayer();
    if (player) {
      const dx = this.x - player.x;
      const dy = this.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 30) {
        this.collect();
      }
    }
  }
  
  collect() {
    if (this.collected) return;
    
    this.collected = true;
    
    const player = this.game.getPlayer();
    if (!player) return;
    
    // 应用道具效果
    switch (this.type) {
      case GameConfig.powerUpTypes.RANDOM_WEAPON:
        if (player.upgradeWeapon()) {
          this.game.addScore(50);
        }
        break;

      case GameConfig.powerUpTypes.SHIELD:
        player.grantInvincibility(30); // 30秒无敌
        break;

      case GameConfig.powerUpTypes.CLEAR_SCREEN:
        // 清除所有敌机
        this.game.clearAllEnemies();
        this.game.addScore(200);
        break;

      case GameConfig.powerUpTypes.LIFE:
        player.heal();
        this.game.addScore(50);
        break;

      case GameConfig.powerUpTypes.BOMB:
        player.addBomb(1);
        this.game.addScore(50);
        break;

      case GameConfig.powerUpTypes.SCORE:
        this.game.addScore(300);
        break;

      case GameConfig.powerUpTypes.RAPID:
        player.applyRapid(0.5, 60 * 8); // 8秒射速翻倍
        this.game.addScore(30);
        break;

      case GameConfig.powerUpTypes.AMMO:
        player.addAmmo(5);
        this.game.addScore(30);
        break;
    }
    
    // 收集效果
    this.game.createCollectEffect(this.x, this.y, this.color);
    
    // 立即消失
    this.dead = true;
  }
  
  getBounds() {
    return {
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2
    };
  }
  
  isDead() {
    return this.dead || this.collected;
  }
  
  render(ctx) {
    if (this.dead || this.collected) return;
    
    ctx.save();
    
    const t = Date.now() * 0.003;
    const pulse = 0.8 + 0.2 * Math.sin(t * 2);
    const glowPulse = 0.6 + 0.4 * Math.sin(t * 1.5);
    
    // 脉动发光
    const glowR = this.glowRadius * pulse;
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowR);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.4, this.color + (glowPulse >= 0 ? '99' : '66'));
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowR, 0, Math.PI * 2);
    ctx.fill();
    
    // 旋转外框（菱形旋转效果）
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(t * 1.5);
    const s = 12 * pulse;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    
    // 道具主体（带内发光）
    const bodyGrad = ctx.createLinearGradient(this.x - 10, this.y - 10, this.x + 10, this.y + 10);
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.3, this.color);
    bodyGrad.addColorStop(1, this.color);
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
    
    // 边框
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.strokeRect(this.x - 10, this.y - 10, 20, 20);
    
    // 图标
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.icon, this.x, this.y);

    // 名称标签
    let label = this.name || '';
    if (this.type === GameConfig.powerUpTypes.RANDOM_WEAPON && this.targetWeapon != null) {
      const wname = WEAPON_NAMES[this.targetWeapon] || '武器';
      label = `→${wname}`;
    }
    if (label) {
      ctx.font = '11px "Press Start 2P", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.strokeText(label, this.x, this.y + 14);
      ctx.fillText(label, this.x, this.y + 14);
    }

    ctx.restore();
  }
}
