/**
 * 敌机基类
 */
import { GameConfig } from '../../config/game.config.js';
import { isColliding } from '../../utils/MathUtils.js';

export class BaseEnemy {
  constructor(game, x, y, type) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.type = type;
    
    const config = GameConfig.enemyConfig[type] || GameConfig.enemyConfig.fighter;
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.score = config.score;
    this.color = config.color;
    this.width = type === 'bomber' ? 48 : type === 'boss' ? 128 : 32;
    this.height = type === 'bomber' ? 32 : type === 'boss' ? 64 : 32;
    
    this.speed = type === 'bomber' ? 2 : type === 'boss' ? 1 : 2;
    this.direction = 1;
    
    this.fireCooldown = Math.random() * 60 + 30;
    this.fireRate = type === 'bomber' ? 60 : type === 'boss' ? 30 : 90;
    
    this.dead = false;
    this.dying = false;
    this.dyingTimer = 0;
    
    this.formationX = x;
    this.formationY = y;
    
    this.chaseMode = false;
    this.chaseAngle = 0;
    
    this.animationFrame = 0;
    this.animationTimer = 0;
    
    // 智能 AI 属性
    this.attackStrategy = 'direct'; // 'direct', 'snipe', 'attack'
    this.snipeTargets = [];
    this.attackTarget = null;
    this.attackCooldown = 0;
    this.lastAttackTime = 0;
    this.consecutiveAttacks = 0;
    this.maxConsecutiveAttacks = 3;
    this.attackReward = 0;
    
    this.randMovement = 0;
    this.randMovementTimer = 0;
    this.randMovementInterval = 500;

    // Boss 多阶段攻击状态
    if (type === 'boss') {
      const cfg = GameConfig.enemyConfig.boss;
      this.phaseIndex = 0;
      this.bossMoveTimer = 0;
      this.bossBaseY = y;
      this.bossMoveDir = 1;
      this.bossPatternTimer = 0;
      this.bossPatternInterval = cfg.phases[0].interval;
      this.bossAngle = 0;
    }
  }
  
  update(deltaTime) {
    if (this.dead) return;

    const canvasWidth = this.game.getWidth();

    // 动画更新
    this.animationTimer += deltaTime;
    if (this.animationTimer > 200) {
      this.animationFrame = (this.animationFrame + 1) % 2;
      this.animationTimer = 0;
    }

    // 射击冷却
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
    }

    // 死亡动画
    if (this.dying) {
      this.dyingTimer--;
      if (this.dyingTimer <= 0) {
        this.dead = true;
      }
      return;
    }

    // Boss 专用更新
    if (this.type === 'boss') {
      this.updateBoss(deltaTime);
      return;
    }

    // 随机移动
    this.randMovementTimer += deltaTime;
    if (this.randMovementTimer >= this.randMovementInterval) {
      this.randMovementTimer = 0;
      this.randMovement = (Math.random() - 0.5) * 4;
    }

    // 追击模式
    if (this.chaseMode) {
      this.updateChaseMode(deltaTime);
      return;
    }

    // 智能 AI 更新
    this.updateAIMovement(deltaTime);

    // 巡航模式：仅轻微上下浮动
    this.y += Math.sin(this.x * 0.02 + this.animationFrame * 1.5) * 0.3;

    // 随机射击（基于 AI 策略）
    if (this.fireCooldown <= 0) {
      this.updateAttackBehavior(deltaTime);
    }
  }

  // Boss 多阶段攻击：左右巡逻 + 螺旋/扩散/召唤
  updateBoss(deltaTime) {
    const canvasWidth = this.game.getWidth();

    // 左右巡逻移动
    this.bossMoveTimer += deltaTime;
    this.x += this.speed * this.bossMoveDir * 0.6;
    if (this.x > canvasWidth - 100) {
      this.x = canvasWidth - 100;
      this.bossMoveDir = -1;
    } else if (this.x < 100) {
      this.x = 100;
      this.bossMoveDir = 1;
    }
    // 上下缓动
    this.y = this.bossBaseY + Math.sin(this.bossMoveTimer * 0.002) * 30;

    // 阶段判定：根据剩余血量比例切换
    const cfg = GameConfig.enemyConfig.boss;
    const ratio = this.hp / this.maxHp;
    let newPhase = 0;
    for (let i = 0; i < cfg.phases.length; i++) {
      if (ratio <= cfg.phases[i].hpRatio) newPhase = i;
    }
    if (newPhase !== this.phaseIndex) {
      this.phaseIndex = newPhase;
      this.bossPatternInterval = cfg.phases[newPhase].interval;
      this.bossPatternTimer = 0;
      this.game.setShake(15, 0.08);
    }

    // 执行当前阶段攻击模式
    this.bossPatternTimer++;
;
    if (this.bossPatternTimer >= this.bossPatternInterval) {
      this.bossPatternTimer = 0;
      const phase = cfg.phases[this.phaseIndex];
      this.executeBossPattern(phase);
    }
  }

  executeBossPattern(phase) {
    const player = this.game.getPlayer();
    switch (phase.pattern) {
      case 'spiral': {
        // 螺旋弹幕
        this.bossAngle += 0.4;
        for (let k = 0; k < (phase.bullets || 2); k++) {
          const a = this.bossAngle + (k * Math.PI);
          this.game.addEnemyBullet(
            this.x, this.y + 20,
            Math.cos(a) * phase.bulletSpeed,
            Math.sin(a) * phase.bulletSpeed,
            'boss'
          );
        }
        break;
      }
      case 'spread': {
        // 扇形弹幕（瞄准玩家）
        const baseAngle = player ? Math.atan2(player.y - this.y, player.x - this.x) : Math.PI / 2;
        const n = phase.bullets || 5;
        for (let i = 0; i < n; i++) {
          const a = baseAngle + (i - (n - 1) / 2) * 0.25;
          this.game.addEnemyBullet(
            this.x, this.y + 20,
            Math.cos(a) * phase.bulletSpeed,
            Math.sin(a) * phase.bulletSpeed,
            'boss'
          );
        }
        break;
      }
      case 'summon': {
        // 召唤两架小怪
        if (this.game.summonEscorts) {
          this.game.summonEscorts(this.x, this.y + 40);
        }
        break;
      }
      default:
        this.fire();
    }
    this.game.soundManager.play('enemyShoot');
  }
  
  updateChaseMode(deltaTime) {
    const player = this.game.getPlayer();
    if (!player) {
      this.chaseMode = false;
      return;
    }
    
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      this.chaseAngle = Math.atan2(dy, dx);
      this.x += Math.cos(this.chaseAngle) * this.speed;
      this.y += Math.sin(this.chaseAngle) * this.speed;
    }
    
    // 如果超过屏幕边界，退出追击
    if (this.y > this.game.getHeight() + 50) {
      this.dead = true;
    }
  }
  
  updateAIMovement(deltaTime) {
    const player = this.game.getPlayer();
    if (!player) return;
    
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    switch (this.attackStrategy) {
      case 'snipe':
        // 狙击：当靠近玩家（<100px）则瞄准
        if (distance < 100) {
          this.attackTarget = player;
          this.attackCooldown = 30;
        }
        break;
        
      case 'attack':
        // 进攻：当非常靠近玩家（<50px）则直接攻击
        if (distance < 50) {
          this.attackTarget = player;
          this.attackCooldown = 20;
        }
        break;
        
      case 'direct':
      default:
        // 直接：总是当靠近玩家（<150px）则攻击
        if (distance < 150) {
          this.attackTarget = player;
          this.attackCooldown = 15;
        }
        break;
    }
  }
  
  updateAttackBehavior(deltaTime) {
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
      return;
    }
    
    const player = this.game.getPlayer();
    if (!player) return;
    
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 优先攻击目标
    if (this.attackTarget && this.attackTarget === player) {
      this.fire();
      this.attackCooldown = this.fireRate;
      this.consecutiveAttacks++;
      
      if (this.consecutiveAttacks >= this.maxConsecutiveAttacks) {
        this.attackCooldown = 20;
        this.consecutiveAttacks = 0;
      }
    }
    // 随机射击
    else if (Math.random() < 0.02) {
      this.fire();
      this.attackCooldown = this.fireRate;
    }
  }
  
  fire() {
    const player = this.game.getPlayer();
    if (!player) return;
    
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const speed = 5;
      const vx = (dx / distance) * speed;
      const vy = (dy / distance) * speed;
      this.game.addEnemyBullet(this.x, this.y + 10, vx, vy);
      this.game.soundManager.play('enemyShoot');
    }
  }
  
  takeDamage(damage) {
    if (this.dying || this.dead) return false;

    this.hp -= damage;

    if (this.hp <= 0) {
      this.dying = true;
      this.dyingTimer = 10;
      this.game.addScore(this.score);
      this.game.createExplosion(this.x, this.y, this.color);

      // 掉落道具
      if (this.type === 'boss') {
        // Boss 必掉稀有道具
        this.game.dropPowerUp(this.x, this.y, true);
      } else {
        const cfg = GameConfig.enemyConfig[this.type] || { dropWeight: 30 };
        const chance = (cfg.dropWeight || 30) / 100;
        if (Math.random() < chance) {
          this.game.dropPowerUp(this.x, this.y);
        }
      }

      return true;
    }

    return false;
  }
  
  isDead() {
    return this.dead;
  }
  
  getBounds() {
    return {
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2
    };
  }
  
  enterChaseMode() {
    this.chaseMode = true;
    this.chaseAngle = Math.atan2(this.game.getPlayer().y - this.y, this.game.getPlayer().x - this.x);
  }
  
  render(ctx) {
    if (this.dead) return;
    
    ctx.save();
    
    // 死亡闪烁
    if (this.dying) {
      ctx.globalAlpha = this.dyingTimer / 10;
    }
    
    ctx.fillStyle = this.color;
    
    switch (this.type) {
      case 'fighter':
        this.renderFighter(ctx);
        break;
      case 'bomber':
        this.renderBomber(ctx);
        break;
      case 'escort':
        this.renderEscort(ctx);
        break;
      case 'boss':
        this.renderBoss(ctx);
        break;
    }
    
    ctx.restore();
  }
  
  renderFighter(ctx) {
    // 经典 Galaga 小蜜蜂：蓝紫身体 + 大眼睛 + 触须
    const x = this.x, y = this.y;
    const wing = this.animationFrame;
    
    // 身体（蓝紫色椭圆）
    ctx.fillStyle = '#4B0082';
    ctx.beginPath();
    ctx.ellipse(x, y, 14, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 身体条纹
    ctx.fillStyle = '#8B00FF';
    ctx.fillRect(x - 12, y - 8, 24, 4);
    ctx.fillRect(x - 10, y, 20, 4);
    ctx.fillRect(x - 12, y + 8, 24, 4);
    
    // 大圆眼睛
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 6, y - 6, 5, 0, Math.PI * 2);
    ctx.arc(x + 6, y - 6, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 瞳孔
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 6, y - 6, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 6, y - 6, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 触须
    ctx.strokeStyle = '#8B00FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 14);
    ctx.lineTo(x - 7, y - 22);
    ctx.moveTo(x + 4, y - 14);
    ctx.lineTo(x + 7, y - 22);
    ctx.stroke();
    
    // 翅膀（蓝紫色，动画扇动）
    ctx.fillStyle = wing ? 'rgba(139,0,255,0.85)' : 'rgba(75,0,130,0.85)';
    ctx.beginPath();
    ctx.ellipse(x - 12, y + wing * 2, 6, 10 + wing * 2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 12, y - wing * 2, 6, 10 + wing * 2, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 翅膀高光
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(x - 14, y - 2, 2, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 14, y - 2, 2, 4, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  renderBomber(ctx) {
    // 大号 Galaga 蜜蜂（红紫色，更大更凶）
    const x = this.x, y = this.y;
    const wing = this.animationFrame;
    
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.ellipse(x, y, 20, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#CD5C5C';
    ctx.fillRect(x - 18, y - 12, 36, 5);
    ctx.fillRect(x - 16, y - 1, 32, 5);
    ctx.fillRect(x - 18, y + 12, 36, 5);
    
    // 大眼
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 8, y - 8, 7, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 8, 7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x - 8, y - 8, 4, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 8, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 8, y - 8, 2, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 8, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 触须
    ctx.strokeStyle = '#CD5C5C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 20);
    ctx.lineTo(x - 9, y - 30);
    ctx.moveTo(x + 5, y - 20);
    ctx.lineTo(x + 9, y - 30);
    ctx.stroke();
    
    // 大翅膀
    ctx.fillStyle = wing ? 'rgba(205,92,92,0.85)' : 'rgba(139,0,0,0.85)';
    ctx.beginPath();
    ctx.ellipse(x - 18, y, 8, 14 + wing * 3, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 18, y, 8, 14 + wing * 3, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 毒刺
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 20);
    ctx.lineTo(x + 4, y + 20);
    ctx.lineTo(x, y + 32);
    ctx.closePath();
    ctx.fill();
  }
  
  renderEscort(ctx) {
    // 小型 Galaga 蜜蜂（黄绿色小虫子）
    const x = this.x, y = this.y;
    const wing = this.animationFrame;
    
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(x, y, 9, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(x - 8, y - 4, 16, 3);
    ctx.fillRect(x - 6, y + 4, 12, 3);
    
    // 眼睛
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 4, y - 5, 3.5, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 4, y - 5, 1.8, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 5, 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    // 触须
    ctx.strokeStyle = '#32CD32';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 9);
    ctx.lineTo(x - 5, y - 15);
    ctx.moveTo(x + 3, y - 9);
    ctx.lineTo(x + 5, y - 15);
    ctx.stroke();
    
    // 翅膀
    ctx.fillStyle = wing ? 'rgba(50,205,50,0.85)' : 'rgba(34,139,34,0.85)';
    ctx.beginPath();
    ctx.ellipse(x - 8, y, 4, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 8, y, 4, 7, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  renderBoss(ctx) {
    // Galaga Boss：巨型紫蜂
    const x = this.x, y = this.y;
    const wing = this.animationFrame;
    
    // 主身体
    ctx.fillStyle = '#4B0082';
    ctx.beginPath();
    ctx.ellipse(x, y, 55, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 条纹
    ctx.fillStyle = '#9370DB';
    ctx.fillRect(x - 50, y - 25, 100, 8);
    ctx.fillRect(x - 45, y - 5, 90, 8);
    ctx.fillRect(x - 50, y + 20, 100, 8);
    
    // 大红眼
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 22, y - 18, 16, 0, Math.PI * 2);
    ctx.arc(x + 22, y - 18, 16, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x - 22, y - 18, 10, 0, Math.PI * 2);
    ctx.arc(x + 22, y - 18, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 22, y - 18, 5, 0, Math.PI * 2);
    ctx.arc(x + 22, y - 18, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 触须
    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 48);
    ctx.lineTo(x - 18, y - 70);
    ctx.moveTo(x + 10, y - 48);
    ctx.lineTo(x + 18, y - 70);
    ctx.stroke();
    
    // 大翅膀
    ctx.fillStyle = wing ? 'rgba(147,112,219,0.85)' : 'rgba(75,0,130,0.85)';
    ctx.beginPath();
    ctx.ellipse(x - 50, y, 16, 30 + wing * 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 50, y, 16, 30 + wing * 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 毒刺
    ctx.fillStyle = '#4B0082';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 45);
    ctx.lineTo(x + 8, y + 45);
    ctx.lineTo(x, y + 65);
    ctx.closePath();
    ctx.fill();
    
    // 生命条
    const hpRatio = this.hp / GameConfig.enemyConfig.boss.hp;
    ctx.fillStyle = '#333';
    ctx.fillRect(x - 50, y - 65, 100, 5);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x - 50, y - 65, 100 * hpRatio, 5);
  }
}
