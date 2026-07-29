/**
 * 玩家战机
 */
import { GameConfig } from '../../config/game.config.js';

export class Player {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.hp = GameConfig.player.hp;
    this.maxHp = GameConfig.player.hp;
    this.speed = GameConfig.player.speed;
    this.fireRate = GameConfig.player.fireRate;
    this.fireCooldown = 0;
    this.invincible = false;
    this.invincibleTime = 0;
    this.weapon = GameConfig.weaponTypes.SINGLE;
    this.ammo = 99;
    this.bombs = GameConfig.player.bombs;
    this.dashCooldown = 0;
    this.isDashing = false;
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.hitFlash = 0; // 受击红闪
  }
  
  update(deltaTime, input) {
    const canvasWidth = this.game.getWidth();
    const canvasHeight = this.game.getHeight();

    // 计算移动边界
    const minX = canvasWidth * GameConfig.player.minX;
    const maxX = canvasWidth * GameConfig.player.maxX;

    // 冲刺（Shift / 上方向）：短距离加速移动
    if (this.dashCooldown > 0) this.dashCooldown--;

    let currentSpeed = this.speed;
    if (input.isDash() && this.dashCooldown <= 0) {
      this.isDashing = true;
      this.dashCooldown = GameConfig.player.dashCooldown;
      currentSpeed = this.speed * 3;
      this.game.createDashTrail(this.x, this.y);
    } else {
      this.isDashing = false;
    }

    // 触屏跟随：手指在 canvas 上时，飞机平滑跟随指尖
    if (input.touchActive) {
      const targetX = input.touchX;
      const targetY = input.touchY;
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        const moveSpeed = Math.min(currentSpeed * 1.5, dist);
        this.x += (dx / dist) * moveSpeed;
        this.y += (dy / dist) * moveSpeed;
      }
    } else {
      // 左右移动（键盘 & 虚拟按键）
      if (input.isLeft()) {
        this.x -= currentSpeed;
      }
      if (input.isRight()) {
        this.x += currentSpeed;
      }

      // 上下移动（键盘 & 虚拟按键）
      if (input.isUp()) {
        this.y -= currentSpeed;
      }
      if (input.isDown()) {
        this.y += currentSpeed;
      }
    }

    // 限制在边界内
    if (this.x < minX) this.x = minX;
    if (this.x > maxX) this.x = maxX;
    if (this.y < 100) this.y = 100;
    if (this.y > canvasHeight - 50) this.y = canvasHeight - 50;

    // 射击冷却维护（实际开火由 Game.update 通过 WeaponSystem 统一触发，避免双重射击）
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
    }

    // 无敌时间
    if (this.invincible) {
      this.invincibleTime--;
      if (this.invincibleTime <= 0) {
        this.invincible = false;
      }
    }

    // 受击红闪衰减
    if (this.hitFlash > 0) this.hitFlash--;

    // 动画更新
    this.animationTimer += deltaTime;
    if (this.animationTimer > 100) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }
  }

  // 升级武器：委托给 WeaponSystem 并同步显示字段
  takeDamage(damage) {
    if (this.invincible) {
      return false;
    }

    this.hp -= damage;
    this.invincible = true;
    this.invincibleTime = 60; // 1秒无敌
    this.hitFlash = 12; // 受击红闪

    // 屏幕震动效果
    this.game.setShake(10, 0.05);

    if (this.hp <= 0) {
      return true;
    }

    return false;
  }
  
  // 升级武器：委托给 WeaponSystem 并同步显示字段
  upgradeWeapon() {
    if (!this.weaponSystem) return false;
    const ok = this.weaponSystem.upgrade();
    this.weapon = this.weaponSystem.getCurrentWeapon();
    this.ammo = this.weaponSystem.getAmmo();
    return ok;
  }

  // 直接设置武器（道具给予）
  setWeapon(type) {
    if (!this.weaponSystem) return false;
    const ok = this.weaponSystem.setWeapon(type);
    this.weapon = this.weaponSystem.getCurrentWeapon();
    this.ammo = this.weaponSystem.getAmmo();
    return ok;
  }

  applyRapid(multiplier, frames) {
    if (this.weaponSystem) this.weaponSystem.applyRapid(multiplier, frames);
  }
  
  addAmmo(amount) {
    if (this.weaponSystem) this.weaponSystem.addAmmo(amount);
    this.ammo = this.weaponSystem ? this.weaponSystem.getAmmo() : this.ammo;
  }
  
  heal() {
    if (this.hp < this.maxHp) {
      this.hp++;
    }
  }

  addBomb(amount = 1) {
    this.bombs = Math.min(GameConfig.player.maxBombs, this.bombs + amount);
  }
  
  grantInvincibility(duration) {
    this.invincible = true;
    this.invincibleTime = duration * 60; // 转换为帧
  }
  
  isDead() {
    return this.hp <= 0;
  }
  
  getBounds() {
    return {
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2
    };
  }
  
  render(ctx) {
    ctx.save();
    
    // 无敌闪烁效果
    if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }
    
    const x = this.x, y = this.y;
    const t = Date.now() * 0.01;
    const flameFlicker = 0.8 + 0.2 * Math.sin(t * 3 + x);
    
    // === 引擎尾焰 ===
    // 外层焰
    ctx.fillStyle = `rgba(255, 150, 50, ${0.3 * flameFlicker})`;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 18);
    ctx.quadraticCurveTo(x - 2, y + 32 * flameFlicker, x + 12, y + 18);
    ctx.fill();
    
    // 中层焰
    ctx.fillStyle = `rgba(255, 220, 50, ${0.5 * flameFlicker})`;
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 17);
    ctx.quadraticCurveTo(x, y + 26 * flameFlicker, x + 8, y + 17);
    ctx.fill();
    
    // 内层焰（白热核）
    ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * flameFlicker})`;
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 16);
    ctx.quadraticCurveTo(x, y + 20 * flameFlicker, x + 4, y + 16);
    ctx.fill();
    
    // === 机翼 ===
    // 左主翼
    ctx.fillStyle = '#0077B6';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 2);
    ctx.lineTo(x - 30, y + 12);
    ctx.lineTo(x - 28, y + 16);
    ctx.lineTo(x - 8, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#00B4D8';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 右主翼
    ctx.beginPath();
    ctx.moveTo(x + 6, y - 2);
    ctx.lineTo(x + 30, y + 12);
    ctx.lineTo(x + 28, y + 16);
    ctx.lineTo(x + 8, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 左副翼
    ctx.fillStyle = '#005F8A';
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 2);
    ctx.lineTo(x - 20, y + 14);
    ctx.lineTo(x - 18, y + 16);
    ctx.lineTo(x - 6, y + 8);
    ctx.closePath();
    ctx.fill();
    
    // 右副翼
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 2);
    ctx.lineTo(x + 20, y + 14);
    ctx.lineTo(x + 18, y + 16);
    ctx.lineTo(x + 6, y + 8);
    ctx.closePath();
    ctx.fill();

    // === 机身主体 ===
    // 机身渐变
    const bodyGrad = ctx.createLinearGradient(x - 14, y, x + 14, y);
    bodyGrad.addColorStop(0, '#00B4D8');
    bodyGrad.addColorStop(0.3, '#48CAE4');
    bodyGrad.addColorStop(0.5, '#90E0EF');
    bodyGrad.addColorStop(0.7, '#48CAE4');
    bodyGrad.addColorStop(1, '#00B4D8');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(x, y - 24);             // 机鼻
    ctx.lineTo(x - 14, y + 10);        // 左机尾
    ctx.lineTo(x - 8, y + 16);         // 左喷口
    ctx.lineTo(x - 4, y + 14);
    ctx.lineTo(x, y + 16);             // 中间喷口
    ctx.lineTo(x + 4, y + 14);
    ctx.lineTo(x + 8, y + 16);         // 右喷口
    ctx.lineTo(x + 14, y + 10);        // 右机尾
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0077B6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // === 座舱 ===
    const cockpitGrad = ctx.createLinearGradient(x - 5, y - 14, x + 5, y - 4);
    cockpitGrad.addColorStop(0, '#CAF0F8');
    cockpitGrad.addColorStop(0.5, '#ADE8F4');
    cockpitGrad.addColorStop(1, '#0096C7');
    ctx.fillStyle = cockpitGrad;
    ctx.beginPath();
    ctx.ellipse(x, y - 12, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0077B6';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 座舱高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x - 1, y - 14, 2, 3, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // === 机体高光线 ===
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 2, y - 22);
    ctx.lineTo(x - 8, y + 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 22);
    ctx.lineTo(x + 8, y + 6);
    ctx.stroke();
    
    // === 翼尖灯 ===
    ctx.fillStyle = `rgba(255, 0, 0, ${0.4 + 0.6 * Math.sin(t * 2)})`;
    ctx.beginPath();
    ctx.arc(x - 29, y + 14, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(0, 255, 100, ${0.4 + 0.6 * Math.sin(t * 2 + Math.PI)})`;
    ctx.beginPath();
    ctx.arc(x + 29, y + 14, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}
