/**
 * 主游戏类
 */
import { GameConfig } from '../config/game.config.js';
import { InputHandler } from './InputHandler.js';
import { Player } from '../entities/Player/Player.js';
import { WeaponSystem } from '../entities/Player/WeaponSystem.js';
import { BaseEnemy } from '../entities/Enemy/BaseEnemy.js';
import { Squadron } from '../entities/Enemy/Squadron.js';
import { PlayerBullet } from '../entities/Bullet/PlayerBullet.js';
import { EnemyBullet } from '../entities/Bullet/EnemyBullet.js';
import { PowerUp } from '../entities/PowerUp/PowerUp.js';
import { HUD } from '../ui/HUD.js';
import { ScoreBoard } from '../ui/ScoreBoard.js';
import Pool from '../utils/ObjectPool.js';
import { SoundManager } from '../audio/SoundManager.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    // 游戏状态
    this.state = 'menu'; // menu, playing, paused, gameOver, victory
    this.score = 0;
    this.level = 1;
    this.time = 0;
    this.timeBonus = 0;
    
    // 系统
    this.input = new InputHandler();
    this.hud = new HUD(this);
    this.scoreBoard = new ScoreBoard(this);
    
    // 实体
    this.player = null;
    this.weaponSystem = null;
    this.squadrons = [];
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.powerUps = [];
    this.explosions = [];
    this.collectEffects = [];
    
   // 星星预生成（避免每帧随机闪烁）
    this.stars = { far: [], mid: [], near: [] };
    
    // 星云
    this.nebulae = [];
    
    // 物体池
    this.playerBulletPool = new Pool(() => new PlayerBullet(this, 0, 0, 0, 0, 'normal'), 50);
    this.enemyBulletPool = new Pool(() => new EnemyBullet(this, 0, 0, 0, 0), 30);
    this.explosionPool = new Pool(() => ({
      x: 0, y: 0, color: '', life: 0, maxLife: 0, angle: 0, speed: 0, size: 0
    }), 40);
    
    // 屏幕震动
    this.shake = { intensity: 0, duration: 0 };
    
    // 黑洞效果
    this.blackholes = [];
    
    // 关卡配置
    this.levelConfig = GameConfig.levels;
    this.waveTimer = 0;
    this.currentWave = 0;
    
    // 敌人大生成
    this.spawnTimer = 0;
    this.spawnInterval = 2000;
    
    // 声音管理器
    this.soundManager = new SoundManager();
    
    // 难度
    this.difficultyLevel = GameConfig.difficultyLevels.NORMAL;
    
    this.init();
  }
  
  resetPools() {
    this.playerBulletPool.clear();
    this.enemyBulletPool.clear();
    this.explosionPool.clear();
  }
  
  init() {
    this.setupCanvas();
    this.resize();
    this.initStars();
  }
  
  setupCanvas() {
    const resizeCanvas = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
  
  initStars() {
    // 三层视差星星：far(远/小/慢), mid(中), near(近/大/快+闪烁)
    const layers = {
      far: { count: 60, sizeRange: [0.3, 1], speedRange: [0.08, 0.25], alphaRange: [0.2, 0.5] },
      mid: { count: 40, sizeRange: [1, 2], speedRange: [0.25, 0.6], alphaRange: [0.4, 0.8] },
      near: { count: 20, sizeRange: [1.5, 3], speedRange: [0.6, 1.2], alphaRange: [0.6, 1] }
    };
    for (const [layer, cfg] of Object.entries(layers)) {
      this.stars[layer] = [];
      for (let i = 0; i < cfg.count; i++) {
        this.stars[layer].push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]),
          speed: cfg.speedRange[0] + Math.random() * (cfg.speedRange[1] - cfg.speedRange[0]),
          alpha: cfg.alphaRange[0] + Math.random() * (cfg.alphaRange[1] - cfg.alphaRange[0]),
          twinkleSpeed: layer === 'near' ? (0.02 + Math.random() * 0.04) : 0,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    }

    // 星云（随机的半透明彩色云团）
    this.nebulae = [];
    const nebulaColors = [
      { r: 20, g: 0, b: 60 },   // 深紫
      { r: 0, g: 10, b: 50 },   // 深蓝
      { r: 40, g: 0, b: 30 },   // 紫红
      { r: 0, g: 20, b: 40 }    // 青蓝
    ];
    for (let i = 0; i < 4; i++) {
      const c = nebulaColors[i];
      this.nebulae.push({
        x: Math.random() * this.width,
        y: this.height * (0.1 + Math.random() * 0.6),
        radius: 100 + Math.random() * 200,
        color: `rgba(${c.r}, ${c.g}, ${c.b}, 0.15)`,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.05,
        pulse: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  setDifficulty(level) {
    this.difficultyLevel = level;
  }

  getDiffPreset() {
    const presets = GameConfig.difficultyPresets;
    return presets[this.difficultyLevel] || presets[GameConfig.difficultyLevels.NORMAL];
  }
  
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
  
startGame() {
    this.state = 'playing';
    this.score = 0;
    this.level = 1;
    this.time = 0;
    this.timeBonus = 0;
    this.currentWave = 0;
    this.difficultyLoop = 0;
    
    // 根据难度获取预设
    const diff = this.getDiffPreset();
    
    // 重置物体池
    this.resetPools();
    
    // 初始化玩家（使用难度预设的 HP）
    this.player = new Player(this, this.width / 2, this.height - 100);
    this.player.maxHp = diff.playerHp;
    this.player.hp = diff.playerHp;
    this.weaponSystem = new WeaponSystem(this.player, this.soundManager);
    this.player.weaponSystem = this.weaponSystem;
    this.boss = null;
    this.bossWasAlive = false;
    this.bossDefeated = false;
    
    // 清空实体
    this.squadrons = [];
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.powerUps = [];
    this.explosions = [];
    this.collectEffects = [];
    
    // 生初始敌机
    this.spawnInitialSquadron();
    
    // 重置计分板
    this.scoreBoard.reset();
  }
  
  spawnInitialSquadron() {
    const squadron = new Squadron(this, 'pentagon');
    this.squadrons.push(squadron);
  }
  
  spawnNextWave() {
    this.currentWave++;

    if (this.currentWave >= this.levelConfig.length) {
      this.level++;
      this.currentWave = 0;
      // 每完成一轮关卡，难度递增
      this.difficultyLoop = Math.min(
        (this.difficultyLoop || 0) + 1,
        GameConfig.difficulty.maxLoop
      );
    }

    const config = this.levelConfig[this.currentWave];

    if (config.wave === 4) {
      // Boss战
      this.spawnBoss();
    } else {
      // 普通敌机
      const squadron = new Squadron(this, this.getFormationType());
      this.applyDifficultyToSquadron(squadron);
      this.squadrons.push(squadron);
      const diff = this.getDiffPreset();
      this.spawnInterval = config.interval * diff.enemySpawnMul;
    }
  }

  // 根据当前难度循环 + 难度预设缩放编队成员属性
  applyDifficultyToSquadron(squadron) {
    const diff = this.getDiffPreset();
    const loop = this.difficultyLoop || 0;
    const hpMul = Math.pow(loop > 0 ? diff.loopHpMul : 1, loop) * diff.enemyHpMul;
    const spdMul = (loop > 0 ? Math.pow(diff.loopSpeedMul, loop) : 1) * diff.enemySpeedMul;
    const rateMul = (loop > 0 ? Math.pow(diff.loopFireRateMul, loop) : 1) * diff.enemyFireRateMul;
    squadron.members.forEach(m => {
      m.hp = Math.round(m.hp * hpMul) || 1;
      m.maxHp = m.hp;
      m.speed *= spdMul;
      m.fireRate = Math.max(8, Math.round(m.fireRate * rateMul));
    });
  }

  spawnBoss() {
    const boss = new BaseEnemy(this, this.width / 2, 120, 'boss');
    const diff = this.getDiffPreset();
    const loop = this.difficultyLoop || 0;
    let hpMul = diff.bossHpMul;
    if (loop > 0) {
      hpMul *= Math.pow(diff.loopHpMul, loop);
    }
    boss.hp = Math.round(boss.hp * hpMul) || 1;
    boss.maxHp = boss.hp;
    this.boss = boss;
    this.bossWasAlive = true;
    this.bossDefeated = false;
    this.enemies.push(boss);
  }

  // Boss 阶段召唤护卫机
  summonEscorts(x, y) {
    const types = ['fighter', 'escort'];
    for (let i = 0; i < 2; i++) {
      const e = new BaseEnemy(this, x + (i === 0 ? -60 : 60), y, types[i]);
      e.enterChaseMode();
      this.enemies.push(e);
    }
  }

  // 查找离指定点最近的存活敌人（用于追踪弹/闪电链锁定）
  findNearestEnemy(x, y, exclude = null) {
    let best = null;
    let bestDist = Infinity;

    const consider = (e) => {
      if (!e || e.isDead()) return;
      if (exclude && exclude.includes(e)) return;
      const dx = e.x - x;
      const dy = e.y - y;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        best = e;
      }
    };

    this.squadrons.forEach(s => s.members.forEach(consider));
    this.enemies.forEach(consider);
    return best;
  }

  // 玩家冲刺拖尾粒子
  createDashTrail(x, y) {
    for (let i = 0; i < 3; i++) {
      const exp = this.explosionPool.acquire();
      if (exp) {
        exp.x = x + (Math.random() - 0.5) * 20;
        exp.y = y + (Math.random() - 0.5) * 20;
        exp.color = '#00FFFF';
        exp.life = 12;
        exp.maxLife = 12;
        exp.angle = 0;
        exp.speed = 0;
        exp.size = Math.random() * 4 + 2;
        this.explosions.push(exp);
      }
    }
  }

  // 手动炸弹清屏（消耗炸弹数量）
  useBomb() {
    if (!this.player || this.player.bombs <= 0) return false;
    this.player.bombs--;
    this.soundManager.play('explosion');
    this.setShake(20, 0.15);
    this.clearAllEnemies();
    this.addScore(200);
    return true;
  }
  
  getFormationType() {
    const formations = ['pentagon', 'v', 'line'];
    return formations[Math.floor(Math.random() * formations.length)];
  }
  
  update(deltaTime) {
    if (this.state !== 'playing') {
      // 暂停状态：ESC 恢复
      if (this.state === 'paused' && this.input.isEscape()) {
        this.state = 'playing';
        return;
      }
      // 游戏结束：ENTER 返回菜单
      if (this.state === 'gameOver' && this.input.isEnter()) {
        this.quitGame();
        return;
      }
      // 菜单/结束状态：ENTER 开始游戏
      if (this.input.isEnter()) {
        this.startGame();
      }
      return;
    }
    // 暂停处理
    if (this.input.isEscape()) {
      this.state = 'paused';
      return;
    }
    
    // 时间更新
    this.time += deltaTime;
    this.timeBonus = Math.floor(this.time / 60000) * 10;
    
     // 玩家更新
    if (this.player) {
      this.player.update(deltaTime, this.input);
      this.weaponSystem.update(deltaTime);
      this.weaponSystem.processDelayedFires(this);
      
      // 引擎尾焰粒子
      if (Math.random() < 0.6) {
        const exp = this.explosionPool.acquire();
        if (exp) {
          exp.x = this.player.x + (Math.random() - 0.5) * 6;
          exp.y = this.player.y + 16;
          exp.color = Math.random() < 0.5 ? '#FFAA44' : '#FFDD88';
          exp.life = 8 + Math.floor(Math.random() * 6);
          exp.maxLife = exp.life;
          exp.angle = Math.PI / 2 + (Math.random() - 0.5) * 0.8;
          exp.speed = 1 + Math.random() * 2;
          exp.size = 1.5 + Math.random() * 2;
          this.explosions.push(exp);
        }
      }

      if (this.input.isFire() && this.weaponSystem.canFire()) {
        this.weaponSystem.fire(this, deltaTime);
      }

      // 炸弹清屏（B 键）
      if (this.input.isBomb()) {
        this.useBomb();
      }
    }
    
    // 敌机更新
    this.squadrons.forEach(squadron => {
      squadron.update(deltaTime);
    });
    
    this.enemies.forEach(enemy => {
      enemy.update(deltaTime);
    });
    
    // 子弹更新
    this.playerBullets.forEach(bullet => {
      bullet.update(deltaTime);
    });
    
    this.enemyBullets.forEach(bullet => {
      bullet.update(deltaTime);
    });
    
    // 道具更新
    this.powerUps.forEach(powerUp => {
      powerUp.update(deltaTime);
    });
    
    // 爆炸更新
    this.explosions = this.explosions.filter(exp => {
      exp.life--;
      if (exp.life <= 0) {
        this.explosionPool.release(exp);
        return false;
      }
      return true;
    });
    
    // 收集效果更新
    this.collectEffects = this.collectEffects.filter(eff => {
      eff.life--;
      eff.radius += 2;
      return eff.life > 0;
    });
    
    // 黑洞更新 + 持续伤害
    this.blackholes = this.blackholes.filter(bh => {
      bh.life += deltaTime;
      bh.damageTimer += deltaTime;
      if (bh.life >= bh.duration) {
        if (bh.onEnd) bh.onEnd();
        return false;
      }
      // 每 300ms 对范围内的敌人造成伤害
      if (bh.damageTimer >= 300) {
        bh.damageTimer = 0;
        const r2 = bh.radius * bh.radius;
        const dmg = 4; // 黑洞武器伤害
        const hitEnemy = (e) => {
          if (!e || e.isDead()) return;
          const dx = e.x - bh.x;
          const dy = e.y - bh.y;
          if (dx * dx + dy * dy > r2) return;
          // 越靠近中心伤害越高
          const dist = Math.sqrt(dx * dx + dy * dy);
          const falloff = 1 - (dist / bh.radius) * 0.5;
          e.takeDamage(Math.max(1, Math.round(dmg * falloff)));
          this.createExplosion(e.x, e.y, '#8B00FF');
        };
        this.squadrons.forEach(s => s.members.forEach(hitEnemy));
        this.enemies.forEach(hitEnemy);
      }
      return true;
    });
    
    // 碰撞检测
    this.checkCollisions();
    
    // 清理死亡实体
    this.cleanupDeadEntities();
    
    // Boss 被击败提示（仅在存活→死亡的一瞬间触发一次）
    if (this.boss && !this.boss.isDead() && this.bossWasAlive) {
      this.bossWasAlive = false;
    }
    if (this.boss && this.boss.isDead() && this.bossWasAlive === false && !this.bossDefeated) {
      this.bossDefeated = true;
      this.setShake(20, 0.2);
      this.scoreBoard.addPopup(this.width / 2, this.height / 2, 'BOSS 击破!', '#FFD700');
      this.boss = null; // 清除引用，避免后续帧重复触发
    }
    if (!this.boss) {
      this.bossDefeated = false;
      this.bossWasAlive = false;
    }

    // 生成新波次
    if (this.squadrons.length === 0 && this.enemies.length === 0) {
      this.spawnTimer += deltaTime;
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnNextWave();
        this.spawnTimer = 0;
      }
    }
    
    // 玩家死亡
    if (this.player && this.player.isDead()) {
      this.gameOver();
    }
    
    // 计分板更新
    this.scoreBoard.update(deltaTime);
    
    // 屏幕震动
    if (this.shake.duration > 0) {
      this.shake.duration--;
    }
  }
  
  checkCollisions() {
    if (!this.player) return;
    
    const playerBounds = this.player.getBounds();
    
    // 玩家子弹 vs 敌机
    this.playerBullets.forEach(bullet => {
      if (bullet.isDead()) return;

      const bulletBounds = bullet.getBounds();

      // 检查与编队成员
      this.squadrons.forEach(squadron => {
        squadron.members.forEach(member => {
          if (member.isDead()) return;

          const memberBounds = member.getBounds();
          if (this.rectIntersect(bulletBounds, memberBounds) && !bullet.hitTargets.has(member)) {
            member.takeDamage(bullet.damage);
            bullet.hitTargets.add(member);
            if (bullet.chainHits) bullet.chainHits.push(member);
            this.createWeaponImpact(bullet);
            if (!bullet.pierce) {
              if (bullet.type === 'cluster') this.splitCluster(bullet);
              bullet.dead = true;
            }
          }
        });
      });

      // 检查与独立敌机
      this.enemies.forEach(enemy => {
        if (enemy.isDead()) return;

        const enemyBounds = enemy.getBounds();
        if (this.rectIntersect(bulletBounds, enemyBounds) && !bullet.hitTargets.has(enemy)) {
          enemy.takeDamage(bullet.damage);
          bullet.hitTargets.add(enemy);
          if (bullet.chainHits) bullet.chainHits.push(enemy);
          this.createWeaponImpact(bullet);
          if (!bullet.pierce) {
            if (bullet.type === 'cluster') this.splitCluster(bullet);
            bullet.dead = true;
          }
        }
      });
    });
    
    // 敌人子弹 vs 玩家
    this.enemyBullets.forEach(bullet => {
      if (bullet.isDead()) return;
      
      const bulletBounds = bullet.getBounds();
      if (this.rectIntersect(bulletBounds, playerBounds)) {
        this.player.takeDamage(bullet.damage);
        bullet.dead = true;
        this.createExplosion(bullet.x, bullet.y, '#FF0000');
      }
    });
    
    // 敌机 vs 玩家
    this.squadrons.forEach(squadron => {
      squadron.members.forEach(member => {
        if (member.isDead()) return;
        
        const memberBounds = member.getBounds();
        if (this.rectIntersect(memberBounds, playerBounds)) {
          this.player.takeDamage(1);
          member.takeDamage(3);
          this.createExplosion(member.x, member.y, member.color);
        }
      });
    });
    
    this.enemies.forEach(enemy => {
      if (enemy.isDead()) return;
      
      const enemyBounds = enemy.getBounds();
      if (this.rectIntersect(enemyBounds, playerBounds)) {
        this.player.takeDamage(1);
        enemy.takeDamage(3);
        this.createExplosion(enemy.x, enemy.y, enemy.color);
      }
    });
  }
  
  rectIntersect(r1, r2) {
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom || 
             r2.bottom < r1.top);
  }
  
cleanupDeadEntities() {
    // 清理死子弹
    this.playerBullets = this.playerBullets.filter(bullet => {
      if (bullet.isDead()) {
        this.playerBulletPool.release(bullet);
        return false;
      }
      return true;
    });
    
    this.enemyBullets = this.enemyBullets.filter(bullet => {
      if (bullet.isDead()) {
        this.enemyBulletPool.release(bullet);
        return false;
      }
      return true;
    });
    
    // 清理死道具
    this.powerUps = this.powerUps.filter(p => !p.isDead());
    
    // 清理死独立敌机
    this.enemies = this.enemies.filter(e => !e.isDead());
    
    // 清理空编队
    this.squadrons = this.squadrons.filter(s => !s.isEmpty());
  }
  
  addScore(amount) {
    const diff = this.getDiffPreset();
    const adjusted = Math.round(amount * diff.scoreMul) || 1;
    this.score += adjusted;
    this.scoreBoard.addPopup(this.player ? this.player.x : this.width / 2, this.player ? this.player.y : this.height / 2, `+${adjusted}`, '#FFD700');
  }
  
  createWeaponImpact(bullet) {
    const impactColors = {
      lance: '#FFE766', twin: bullet.color || '#62E8FF', spread: '#FF78BE',
      laser: '#37F3FF', overkill: '#FF4FD8', pulse: '#FFD166', rainbow: bullet.color || '#FFFFFF',
      homing: '#FFD166', missile: '#FF593D', sniper: '#FFFFFF', drill: '#FFAA38',
      frag: '#FF6748', freeze: '#7DF7FF', plasma: '#9DFF4F', tesla: '#B58CFF',
      wave: '#54F4DF', boomerang: bullet.color || '#FFB45C', nova: '#FF79D7', comet: '#65E9FF',
      vortex: '#FF69B4', railgun: '#00E5FF', cluster: '#FF8C00', chain: '#FFD700',
      flame: '#FF4500', orbit: '#00CED1', ricochet: '#00FF7F', pierce: '#FFFFFF',
      shockwave: '#9370DB', photon: '#87CEEB'
    };
    const color = impactColors[bullet.type] || '#FFE766';
    const count = ['overkill', 'comet', 'nova', 'railgun', 'shockwave'].includes(bullet.type) ? 8 : 4;
    for (let i = 0; i < count; i++) {
      const exp = this.explosionPool.acquire();
      if (!exp) continue;
      exp.x = bullet.x + (Math.random() - .5) * 8;
      exp.y = bullet.y + (Math.random() - .5) * 8;
      exp.color = i % 3 === 0 ? '#FFFFFF' : color;
      exp.life = 8 + Math.floor(Math.random() * 8);
      exp.maxLife = exp.life;
      exp.angle = Math.random() * Math.PI * 2;
      exp.speed = Math.random() * 2.4 + .6;
      exp.size = Math.random() * 2.5 + 1;
      this.explosions.push(exp);
    }
  }

  // 集束弹：命中后分裂为6枚碎片
  splitCluster(bullet) {
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      const spd = 5 + Math.random() * 2;
      this.addPlayerBullet(bullet.x, bullet.y, Math.cos(angle) * spd, Math.sin(angle) * spd - 3, 'frag');
    }
  }

  createExplosion(x, y, color) {
    this.soundManager.play('explosion');
    const colors = [color, '#FFAA00', '#FF4400', '#FFFFFF', '#FFDD00'];
    const count = 12 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const exp = this.explosionPool.acquire();
      if (exp) {
        exp.x = x + (Math.random() - 0.5) * 6;
        exp.y = y + (Math.random() - 0.5) * 6;
        exp.color = colors[Math.floor(Math.random() * colors.length)];
        exp.life = 20 + Math.floor(Math.random() * 15);
        exp.maxLife = exp.life;
        exp.angle = Math.random() * Math.PI * 2;
        exp.speed = Math.random() * 4 + 1;
        exp.size = Math.random() * 5 + 2;
        this.explosions.push(exp);
      }
    }
  }
  
  createCollectEffect(x, y, color) {
    this.collectEffects.push({
      x: x,
      y: y,
      color: color,
      life: 30,
      maxLife: 30,
      radius: 10
    });
  }
  
  dropPowerUp(x, y, forceRare = false) {
    const diff = this.getDiffPreset();
    
    // 根据难度概率不触发掉落
    if (!forceRare && Math.random() > diff.powerUpMul) return;
    
    let type;
    if (forceRare) {
      type = GameConfig.rarePowerUp;
    } else if (Math.random() < GameConfig.rareDropChance) {
      type = GameConfig.rarePowerUp;
    } else {
      // 加权随机（应用难度道具权重倍率）
      const weights = {};
      let total = 0;
      const baseWeights = GameConfig.powerUpWeights;
      for (const [key, w] of Object.entries(baseWeights)) {
        const adj = Math.round(w * diff.dropWeightMul) || 1;
        weights[key] = adj;
        total += adj;
      }
      const entries = Object.entries(weights);
      let r = Math.random() * total;
      type = entries[0][0];
      for (const [t, w] of entries) {
        r -= w;
        if (r <= 0) {
          type = t;
          break;
        }
      }
    }
    const powerUp = new PowerUp(this, x, y, type);
    this.powerUps.push(powerUp);
  }
  
  clearAllEnemies() {
    this.squadrons.forEach(squadron => {
      squadron.members.forEach(member => {
        if (!member.isDead()) {
          this.createExplosion(member.x, member.y, member.color);
        }
      });
    });
    
    this.enemies.forEach(enemy => {
      if (!enemy.isDead()) {
        this.createExplosion(enemy.x, enemy.y, enemy.color);
      }
    });
    
    this.squadrons = [];
    this.enemies = [];
  }
  
  gameOver() {
    this.state = 'gameOver';
    if (this.onGameOver) {
      this.onGameOver(this.score, this.level);
    }
  }
  
  pauseGame() {
    this.state = 'paused';
  }
  
  resumeGame() {
    this.state = 'playing';
  }
  
  quitGame() {
    this.state = 'menu';
    this.score = 0;
    this.level = 1;
  }
  
  restartGame() {
    this.startGame();
  }
  
  setShake(intensity, duration) {
    this.shake.intensity = intensity;
    this.shake.duration = duration;
  }
  
  render() {
    this.ctx.save();
    
    // 屏幕震动
    if (this.shake.duration > 0) {
      const shakeX = (Math.random() - 0.5) * this.shake.intensity;
      const shakeY = (Math.random() - 0.5) * this.shake.intensity;
      this.ctx.translate(shakeX, shakeY);
    }
    
    // 背景
    this.renderBackground();
    
    // 批量渲染实体
    this.batchRenderEntity(this.squadrons, 'render');
    this.batchRenderEntity(this.enemies, 'render');
    
    this.batchRenderEntity(this.playerBullets, 'render');
    this.batchRenderEntity(this.enemyBullets, 'render');
    
    this.batchRenderEntity(this.powerUps, 'render');
    
    if (this.player) {
      this.player.render(this.ctx);
    }
    
    // 爆炸效果
    this.renderExplosions();
    
    // 收集效果
    this.renderCollectEffects();
    
    // 黑洞效果
    this.renderBlackholes();
    
    // UI
    if (this.state === 'playing') {
      this.hud.render(this.ctx);
      this.scoreBoard.render(this.ctx);
    } else if (this.state === 'paused') {
      this.hud.render(this.ctx);
      this.scoreBoard.render(this.ctx);
      this.renderOverlay('暂停', '按 ESC 继续', '#FFD700');
    } else if (this.state === 'gameOver') {
      this.renderGameOver();
    }

    this.ctx.restore();
  }

  // 通用覆盖层（用于暂停/提示）
  renderOverlay(title, subtitle, color) {
    const width = this.width;
    const height = this.height;
    const panelWidth = Math.min(520, width - 40);
    const panelHeight = 230;
    const panelX = (width - panelWidth) / 2;
    const panelY = (height - panelHeight) / 2;
    this.ctx.save();
    const shade = this.ctx.createRadialGradient(width / 2, height / 2, 30, width / 2, height / 2, Math.max(width, height) * 0.7);
    shade.addColorStop(0, 'rgba(12,18,48,0.46)');
    shade.addColorStop(1, 'rgba(1,3,14,0.88)');
    this.ctx.fillStyle = shade;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.fillStyle = 'rgba(7,12,35,0.9)';
    this.ctx.strokeStyle = 'rgba(93,229,255,0.55)';
    this.ctx.lineWidth = 1.5;
    this.ctx.shadowColor = 'rgba(64,124,255,0.55)';
    this.ctx.shadowBlur = 28;
    this.ctx.beginPath();
    this.ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 18);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = color;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 18;
    this.ctx.font = `700 ${Math.min(48, width * 0.1)}px "Trebuchet MS", sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(title, width / 2, height / 2 - 28);
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#A9BEDD';
    this.ctx.font = `700 ${Math.min(18, width * 0.04)}px "Trebuchet MS", sans-serif`;
    this.ctx.fillText(subtitle, width / 2, height / 2 + 43);
    this.ctx.restore();
  }

  // 游戏结束界面
  renderGameOver() {
    const width = this.width;
    const height = this.height;
    const panelWidth = Math.min(600, width - 32);
    const panelHeight = Math.min(480, height - 60);
    const panelX = (width - panelWidth) / 2;
    const panelY = (height - panelHeight) / 2;
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(1,3,14,0.84)';
    this.ctx.fillRect(0, 0, width, height);
    const panelGradient = this.ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
    panelGradient.addColorStop(0, 'rgba(14,22,58,0.96)');
    panelGradient.addColorStop(1, 'rgba(30,8,50,0.96)');
    this.ctx.fillStyle = panelGradient;
    this.ctx.strokeStyle = 'rgba(255,79,216,0.5)';
    this.ctx.lineWidth = 1.5;
    this.ctx.shadowColor = 'rgba(168,85,247,0.5)';
    this.ctx.shadowBlur = 32;
    this.ctx.beginPath();
    this.ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#FFF1F5';
    this.ctx.shadowColor = '#FF1744';
    this.ctx.shadowBlur = 20;
    this.ctx.font = `900 ${Math.min(56, width * 0.11)}px Impact, sans-serif`;
    this.ctx.fillText('GAME OVER', width / 2, height / 2 - 130);
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#FFD166';
    this.ctx.font = `800 ${Math.min(28, width * 0.055)}px "Trebuchet MS", sans-serif`;
    this.ctx.fillText(`最终得分  ${this.score}`, width / 2, height / 2 - 55);
    this.ctx.fillStyle = '#8BE9FD';
    this.ctx.font = `700 ${Math.min(18, width * 0.04)}px "Trebuchet MS", sans-serif`;
    this.ctx.fillText(`最高分  ${this.scoreBoard.highScore}`, width / 2, height / 2 - 5);
    this.ctx.fillText(`到达关卡  ${this.level}`, width / 2, height / 2 + 30);
    const isNew = this.score >= this.scoreBoard.highScore && this.score > 0;
    if (isNew) {
      this.ctx.fillStyle = '#FF79E6';
      this.ctx.shadowColor = '#FF4FD8';
      this.ctx.shadowBlur = 12;
      this.ctx.fillText('★  新纪录  ★', width / 2, height / 2 + 75);
      this.ctx.shadowBlur = 0;
    }
    this.ctx.fillStyle = '#D7E1F5';
    this.ctx.font = `700 ${Math.min(16, width * 0.035)}px "Trebuchet MS", sans-serif`;
    this.ctx.fillText('按 ENTER 返回菜单', width / 2, height / 2 + 135);
    this.ctx.restore();
  }
  
  batchRenderEntity(entities, methodName) {
    if (entities.length === 0) return;
    
    this.ctx.save();
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (entity && entity[methodName]) {
        entity[methodName](this.ctx);
      }
    }
    this.ctx.restore();
  }
  
  renderBackground() {
    const w = this.width, h = this.height;
    const ctx = this.ctx;
    const time = this.time || 0;
    const t = time * 0.001;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#050b24');
    skyGrad.addColorStop(0.38, '#090a28');
    skyGrad.addColorStop(0.72, '#16082d');
    skyGrad.addColorStop(1, '#030511');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);
    this.nebulae.forEach(n => {
      const cx = n.x + Math.sin(time * 0.0001 + n.phase) * n.driftX * 200;
      const cy = n.y + Math.cos(time * 0.00008 + n.phase) * n.driftY * 100;
      const pulse = 0.8 + 0.2 * Math.sin(time * 0.0003 + n.phase);
      const radius = n.radius * pulse;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, n.color.replace('0.15', '0.24'));
      gradient.addColorStop(0.45, n.color.replace('0.15', '0.12'));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    const planetX = w * 0.82;
    const planetY = h * 0.2;
    const planetRadius = Math.min(w, h) * 0.11;
    const planetGlow = ctx.createRadialGradient(planetX - planetRadius * 0.3, planetY - planetRadius * 0.35, 0, planetX, planetY, planetRadius * 1.7);
    planetGlow.addColorStop(0, 'rgba(131,205,255,0.26)');
    planetGlow.addColorStop(0.42, 'rgba(64,90,190,0.12)');
    planetGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = planetGlow;
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetRadius * 1.7, 0, Math.PI * 2);
    ctx.fill();
    const planet = ctx.createRadialGradient(planetX - planetRadius * 0.38, planetY - planetRadius * 0.42, planetRadius * 0.04, planetX, planetY, planetRadius);
    planet.addColorStop(0, 'rgba(121,184,230,0.3)');
    planet.addColorStop(0.52, 'rgba(39,55,130,0.26)');
    planet.addColorStop(1, 'rgba(9,10,40,0.08)');
    ctx.fillStyle = planet;
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
    ctx.fill();
    const layers = ['far', 'mid', 'near'];
    layers.forEach(layer => {
      this.stars[layer].forEach(star => {
        let alpha = star.alpha;
        if (star.twinkleSpeed > 0) {
          alpha *= 0.5 + 0.5 * Math.sin(t * star.twinkleSpeed * 20 + star.twinklePhase);
        }
        ctx.globalAlpha = Math.max(0.05, alpha);
        ctx.fillStyle = layer === 'near' ? '#BDEFFF' : '#FFFFFF';
        ctx.shadowColor = layer === 'near' ? '#5DE5FF' : 'transparent';
        ctx.shadowBlur = layer === 'near' ? star.size * 3 : 0;
        if (layer === 'near') {
          ctx.fillRect(star.x - star.size / 4, star.y - star.size * 1.7, star.size / 2, star.size * 3.4);
          ctx.fillRect(star.x - star.size * 1.7, star.y - star.size / 4, star.size * 3.4, star.size / 2);
        } else {
          ctx.fillRect(star.x - star.size / 2, star.y - star.size / 2, star.size, star.size);
        }
        star.y += star.speed;
        if (star.y > this.height) {
          star.y = -5;
          star.x = Math.random() * this.width;
        }
      });
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    const vignette = ctx.createRadialGradient(w / 2, h * 0.48, Math.min(w, h) * 0.18, w / 2, h * 0.48, Math.max(w, h) * 0.72);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(0.72, 'rgba(0,0,12,0.12)');
    vignette.addColorStop(1, 'rgba(0,0,8,0.58)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }
  
  renderExplosions() {
    this.explosions.forEach(exp => {
      this.ctx.save();
      const progress = 1 - exp.life / exp.maxLife;
      this.ctx.globalAlpha = Math.max(0, 1 - progress * 1.1);
      
      const dx = Math.cos(exp.angle) * exp.speed * progress * 5;
      const dy = Math.sin(exp.angle) * exp.speed * progress * 5;
      const size = exp.size * (1 - progress * 0.6);
      
      this.ctx.fillStyle = exp.color;
      this.ctx.beginPath();
      this.ctx.arc(exp.x + dx, exp.y + dy, Math.max(0.5, size), 0, Math.PI * 2);
      this.ctx.fill();
      
      // 白炽核心
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.globalAlpha = Math.max(0, (1 - progress * 1.5) * 0.6);
      this.ctx.beginPath();
      this.ctx.arc(exp.x + dx, exp.y + dy, Math.max(0.3, size * 0.3), 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
  
  renderCollectEffects() {
    this.collectEffects.forEach(eff => {
      this.ctx.save();
      this.ctx.globalAlpha = eff.life / eff.maxLife;
      this.ctx.strokeStyle = eff.color;
      this.ctx.lineWidth = 3;
      
      this.ctx.beginPath();
      this.ctx.arc(eff.x, eff.y, eff.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      
      this.ctx.restore();
    });
  }

  renderBlackholes() {
    this.blackholes.forEach(bh => {
      this.ctx.save();
      const progress = Math.min(1, bh.life / bh.duration);
      const alpha = 0.4 * (1 - progress);
      const radius = bh.radius * (0.6 + 0.4 * progress);

      // 外层光晕
      const gradient = this.ctx.createRadialGradient(bh.x, bh.y, 0, bh.x, bh.y, radius);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.3, `rgba(20, 0, 40, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(80, 0, 160, ${alpha * 0.6})`);
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(bh.x, bh.y, radius, 0, Math.PI * 2);
      this.ctx.fill();

      // 边缘扭曲环
      this.ctx.strokeStyle = `rgba(150, 0, 255, ${alpha * 0.8})`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(bh.x, bh.y, radius * 0.6, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.strokeStyle = `rgba(200, 100, 255, ${alpha * 0.5})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(bh.x, bh.y, radius * 0.3, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.restore();
    });
  }
  
  getPlayer() {
    return this.player;
  }
  
  getScore() {
    return this.score;
  }
  
  getCombo() {
    return this.scoreBoard.getCombo();
  }
  
  getLevel() {
    return this.level;
  }
  
  getTimeBonus() {
    return this.timeBonus;
  }
  
  addPlayerBullet(x, y, vx, vy, type = 'normal', color = null) {
    const bullet = this.playerBulletPool.acquire();
    if (bullet) {
      bullet.reset(x, y, vx, vy, type, color);
      this.playerBullets.push(bullet);
    }
  }

  addPlayerBulletDataDriven(x, y, vx, vy, type, dmg, pierce, chain) {
    const bullet = this.playerBulletPool.acquire();
    if (bullet) {
      bullet.reset(x, y, vx, vy, type);
      if (dmg !== undefined) bullet.damage = dmg;
      if (pierce !== undefined) bullet.pierce = pierce;
      if (chain) bullet.chainHits = bullet.chainHits || [];
      this.playerBullets.push(bullet);
    }
    return bullet;
  }

  addBlackhole(x, y, radius, duration, onEnd) {
    this.blackholes = this.blackholes || [];
    this.blackholes.push({
      x, y, radius, duration, onEnd,
      life: 0,
      damageTimer: 0
    });
  }
  
  addEnemyBullet(x, y, vx, vy) {
    const bullet = this.enemyBulletPool.acquire();
    if (bullet) {
      bullet.x = x;
      bullet.y = y;
      bullet.vx = vx;
      bullet.vy = vy;
      bullet.dead = false;
      bullet.damage = 1;
      this.enemyBullets.push(bullet);
    }
  }
  
  getWidth() {
    return this.width;
  }
  
  getHeight() {
    return this.height;
  }
}
