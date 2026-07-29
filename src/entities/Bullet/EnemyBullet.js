/**
 * 敌人子弹
 */
import { GameConfig } from '../../config/game.config.js';

export class EnemyBullet {
  constructor(game, x, y, vx, vy, type = 'normal') {
    this.game = game;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type; // 'normal', 'bomber', 'boss'
    this.dead = false;
    
    this.width = 6;
    this.height = 12;
    this.color = '#FF0000';
    this.damage = 1;
    
    if (type === 'bomber') {
      this.width = 8;
      this.height = 16;
      this.color = '#FF4400';
      this.damage = 1;
    } else if (type === 'boss') {
      this.width = 10;
      this.height = 20;
      this.color = '#FF00FF';
      this.damage = 2;
    }
  }
  
  update(deltaTime) {
    if (this.dead) return;
    
    this.x += this.vx;
    this.y += this.vy;
    
    // 检查是否超出屏幕
    const canvasHeight = this.game.getHeight();
    const canvasWidth = this.game.getWidth();
    
    if (this.y > canvasHeight + 50 || this.y < -50 || 
        this.x < -50 || this.x > canvasWidth + 50) {
      this.dead = true;
    }
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
    return this.dead;
  }
  
  render(ctx) {
    if (this.dead) return;

    ctx.save();
    const speed = Math.hypot(this.vx, this.vy) || 1;
    const directionX = this.vx / speed;
    const directionY = this.vy / speed;
    const angle = Math.atan2(this.vy, this.vx) - Math.PI / 2;
    const tailLength = this.height * 1.6;
    const tail = ctx.createLinearGradient(
      this.x - directionX * tailLength,
      this.y - directionY * tailLength,
      this.x,
      this.y
    );
    tail.addColorStop(0, 'rgba(255, 20, 90, 0)');
    tail.addColorStop(1, this.type === 'boss' ? 'rgba(255, 0, 255, 0.65)' : 'rgba(255, 45, 65, 0.65)');
    ctx.strokeStyle = tail;
    ctx.lineWidth = this.width * 0.75;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x - directionX * tailLength, this.y - directionY * tailLength);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.type === 'boss' ? 18 : 12;
    const body = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
    body.addColorStop(0, this.color);
    body.addColorStop(0.5, '#FFFFFF');
    body.addColorStop(1, this.color);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.quadraticCurveTo(this.width / 2, this.height / 5, this.width / 2, -this.height / 4);
    ctx.quadraticCurveTo(0, -this.height / 2, -this.width / 2, -this.height / 4);
    ctx.quadraticCurveTo(-this.width / 2, this.height / 5, 0, this.height / 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.ellipse(-this.width * 0.12, -this.height * 0.12, 1.2, this.height * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
