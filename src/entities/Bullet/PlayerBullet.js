const BULLET_CONFIG = {
  normal: { width: 4, height: 16, damage: 1, color: '#FFE766' },
  lance: { width: 5, height: 22, damage: 1, color: '#FFE766' },
  twin: { width: 5, height: 18, damage: 1, color: '#62E8FF' },
  spread: { width: 6, height: 14, damage: 1, color: '#FF78BE' },
  laser: { width: 5, height: 34, damage: 3, color: '#37F3FF' },
  overkill: { width: 12, height: 24, damage: 5, color: '#FF4FD8' },
  pulse: { width: 34, height: 34, damage: 2, color: '#FFD166' },
  rainbow: { width: 5, height: 18, damage: 1, color: '#FFFFFF' },
  homing: { width: 10, height: 15, damage: 2, color: '#FFD166' },
  missile: { width: 11, height: 22, damage: 3, color: '#FF593D' },
  sniper: { width: 4, height: 42, damage: 8, color: '#FFFFFF' },
  drill: { width: 13, height: 18, damage: 3, color: '#FFAA38' },
  frag: { width: 14, height: 14, damage: 2, color: '#FF6748' },
  freeze: { width: 9, height: 25, damage: 1, color: '#7DF7FF' },
  plasma: { width: 14, height: 25, damage: 4, color: '#9DFF4F' },
  tesla: { width: 18, height: 28, damage: 3, color: '#B58CFF' },
  wave: { width: 28, height: 16, damage: 2, color: '#54F4DF' },
  boomerang: { width: 20, height: 20, damage: 3, color: '#FFB45C' },
  nova: { width: 15, height: 15, damage: 2, color: '#FF79D7' },
  comet: { width: 18, height: 38, damage: 7, color: '#65E9FF' },
  vortex: { width: 14, height: 14, damage: 2, color: '#FF69B4' },
  railgun: { width: 4, height: 50, damage: 10, color: '#00E5FF' },
  cluster: { width: 14, height: 14, damage: 2, color: '#FF8C00' },
  chain: { width: 10, height: 18, damage: 3, color: '#FFD700' },
  flame: { width: 32, height: 14, damage: 2, color: '#FF4500' },
  orbit: { width: 14, height: 14, damage: 3, color: '#00CED1' },
  ricochet: { width: 10, height: 14, damage: 2, color: '#00FF7F' },
  pierce: { width: 3, height: 48, damage: 5, color: '#FFFFFF' },
  shockwave: { width: 80, height: 16, damage: 3, color: '#9370DB' },
  photon: { width: 6, height: 10, damage: 1, color: '#E0FFFF' },
  bolt: { width: 8, height: 22, damage: 4, color: '#FFD700' },
  orb: { width: 12, height: 12, damage: 3, color: '#C8A2FF' },
  beam: { width: 5, height: 40, damage: 6, color: '#00FFFF' },
  shard: { width: 8, height: 14, damage: 3, color: '#A8E6CF' },
  blade: { width: 16, height: 8, damage: 4, color: '#E0E0E0' },
  ring: { width: 30, height: 12, damage: 3, color: '#C8A2FF' },
  spark: { width: 5, height: 5, damage: 1, color: '#FFFF00' },
  ember: { width: 10, height: 10, damage: 2, color: '#FF6600' },
  mist: { width: 20, height: 20, damage: 2, color: '#90EE90' },
  void: { width: 14, height: 14, damage: 5, color: '#2E004F' }
};

export class PlayerBullet {
  constructor(game, x, y, vx, vy, type = 'normal', color = null) {
    this.game = game;
    this.reset(x, y, vx, vy, type, color);
  }

  reset(x, y, vx, vy, type = 'normal', color = null) {
    const config = BULLET_CONFIG[type] || BULLET_CONFIG.normal;
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.originX = x;
    this.originY = y;
    this.vx = vx;
    this.vy = vy;
    this.baseVx = vx;
    this.baseVy = vy;
    this.type = type;
    this.color = color || config.color;
    this.dead = false;
    this.pierce = ['missile', 'sniper', 'wave', 'boomerang', 'comet', 'railgun', 'flame', 'pierce', 'shockwave'].includes(type);
    this.hitTargets = new Set();
    this.life = type === 'flame' ? 25 : type === 'orbit' ? 90 : 180;
    this.maxLife = this.life;
    this.age = 0;
    this.rotation = 0;
    this.phase = Math.random() * Math.PI * 2;
    this.trail = [];
    Object.assign(this, config);
    if (color) this.color = color;
    // 反弹弹计数
    this.bounces = type === 'ricochet' ? 3 : 0;
    // 闪电链已命中列表
    this.chainHits = type === 'chain' ? [] : null;
    this.chainMax = 3;
    // 环卫星弹状态
    this.orbitAngle = Math.random() * Math.PI * 2;
    this.orbitLaunched = false;
    return this;
  }

  update(deltaTime) {
    if (this.dead) return;
    this.age++;
    this.prevX = this.x;
    this.prevY = this.y;

    if (this.type === 'homing') this.updateHoming();
    if (this.type === 'tesla') this.vx = this.baseVx + Math.sin(this.age * 1.35 + this.phase) * 3.2;
    if (this.type === 'wave') this.width = Math.min(110, 28 + this.age * 2.4);
    if (this.type === 'boomerang') {
      this.rotation += .34;
      this.vx = this.baseVx * Math.max(-.65, 1 - this.age / 36);
      this.vy = this.baseVy + Math.max(0, this.age - 42) * .22;
    }
    if (this.type === 'drill') this.rotation += .5;
    if (this.type === 'frag') this.rotation += .22;
    if (this.type === 'nova') {
      this.rotation += .18;
      this.vx = this.baseVx + Math.sin(this.age * .25 + this.phase) * .5;
    }
    if (this.type === 'plasma') this.vx = this.baseVx + Math.sin(this.age * .3 + this.phase) * .75;
    if (this.type === 'vortex') this.rotation += .25;
    if (this.type === 'bolt') this.vx = this.baseVx + Math.sin(this.age * .5 + this.phase) * 1.5;
    if (this.type === 'orb') this.rotation += .15;
    if (this.type === 'beam') this.vx = this.baseVx + Math.sin(this.age * .3 + this.phase) * .8;
    if (this.type === 'shard') this.rotation += .28;
    if (this.type === 'blade') this.rotation += .4;
    if (this.type === 'ring') this.width = Math.min(80, 30 + this.age * 1.5);
    if (this.type === 'spark') { this.vx = this.baseVx + (Math.random() - .5) * 3; this.vy = this.baseVy + (Math.random() - .5) * 2; }
    if (this.type === 'ember') this.vy += Math.sin(this.age * .4 + this.phase) * .4;
    if (this.type === 'mist') { this.vx += (Math.random() - .5) * .6; this.vy += (Math.random() - .5) * .4; }
    if (this.type === 'void') { this.rotation += .08; this.width = Math.min(24, 14 + this.age * .3); }
    if (this.type === 'orbit') this.updateOrbit();
    if (this.type === 'chain') this.updateChainSeeking();
    if (this.type === 'shockwave') this.width = Math.min(400, 80 + this.age * 6);

    this.x += this.vx;
    this.y += this.vy;
    this.captureTrail();

    this.life--;
    if (this.life <= 0) this.dead = true;

    const h = this.game.getHeight();
    const w = this.game.getWidth();
    // 反弹弹：碰到屏幕边缘反弹
    if (this.type === 'ricochet' && this.bounces > 0) {
      if (this.x <= 4 || this.x >= w - 4) { this.vx = -this.vx; this.bounces--; }
      if (this.y <= 4 || this.y >= h - 4) { this.vy = -this.vy; this.bounces--; }
      this.x = Math.max(4, Math.min(w - 4, this.x));
      this.y = Math.max(4, Math.min(h - 4, this.y));
    } else if (this.y < -120 || this.y > h + 120 || this.x < -120 || this.x > w + 120) {
      this.dead = true;
    }
  }

  updateHoming() {
    const target = this.game.findNearestEnemy(this.x, this.y);
    if (!target) return;
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = Math.max(9, Math.hypot(this.vx, this.vy));
    this.vx += ((dx / dist) * speed - this.vx) * .15;
    this.vy += ((dy / dist) * speed - this.vy) * .15;
    this.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
  }

  updateOrbit() {
    if (!this.orbitLaunched) {
      const player = this.game.getPlayer();
      if (!player) return;
      this.orbitAngle += 0.2;
      const radius = 30 + this.age * 0.5;
      this.x = player.x + Math.cos(this.orbitAngle) * radius;
      this.y = player.y - 16 + Math.sin(this.orbitAngle) * radius;
      if (this.age > 25) {
        this.orbitLaunched = true;
        const angle = this.orbitAngle;
        const spd = 14;
        this.vx = Math.cos(angle) * spd;
        this.vy = Math.sin(angle) * spd - 4;
        this.life = 90;
      }
    }
  }

  updateChainSeeking() {
    if (this.chainHits && this.chainHits.length > 0 && this.age > 5) {
      const target = this.game.findNearestEnemy(this.x, this.y, this.chainHits);
      if (target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        const speed = Math.max(10, Math.hypot(this.vx, this.vy));
        this.vx += ((dx / dist) * speed - this.vx) * .2;
        this.vy += ((dy / dist) * speed - this.vy) * .2;
      }
    }
  }

  captureTrail() {
    const trailTypes = new Set(['lance', 'twin', 'spread', 'laser', 'overkill', 'rainbow', 'homing', 'missile', 'sniper', 'freeze', 'plasma', 'tesla', 'boomerang', 'nova', 'comet', 'vortex', 'railgun', 'chain', 'orbit', 'ricochet', 'pierce', 'photon']);
    if (!trailTypes.has(this.type)) return;
    this.trail.unshift({ x: this.x, y: this.y });
    const max = this.type === 'comet' ? 12 : this.type === 'tesla' ? 8 : 6;
    if (this.trail.length > max) this.trail.pop();
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
    ctx.globalCompositeOperation = 'lighter';
    this.renderTrail(ctx);

    const handler = {
      lance: () => this.renderLance(ctx),
      twin: () => this.renderTwin(ctx),
      spread: () => this.renderSpread(ctx),
      laser: () => this.renderLaser(ctx),
      overkill: () => this.renderOverkill(ctx),
      pulse: () => this.renderPulse(ctx),
      rainbow: () => this.renderRainbow(ctx),
      homing: () => this.renderHoming(ctx),
      missile: () => this.renderMissile(ctx),
      sniper: () => this.renderSniper(ctx),
      drill: () => this.renderDrill(ctx),
      frag: () => this.renderFrag(ctx),
      freeze: () => this.renderFreeze(ctx),
      plasma: () => this.renderPlasma(ctx),
      tesla: () => this.renderTesla(ctx),
      wave: () => this.renderWave(ctx),
      boomerang: () => this.renderBoomerang(ctx),
      nova: () => this.renderNova(ctx),
      comet: () => this.renderComet(ctx),
      vortex: () => this.renderVortex(ctx),
      railgun: () => this.renderRailgun(ctx),
      cluster: () => this.renderCluster(ctx),
      chain: () => this.renderChain(ctx),
      flame: () => this.renderFlame(ctx),
      orbit: () => this.renderOrbit(ctx),
      ricochet: () => this.renderRicochet(ctx),
      pierce: () => this.renderPierce(ctx),
      shockwave: () => this.renderShockwave(ctx),
      photon: () => this.renderPhoton(ctx),
      bolt: () => this.renderBolt(ctx),
      orb: () => this.renderOrb(ctx),
      beam: () => this.renderBeam(ctx),
      shard: () => this.renderShard(ctx),
      blade: () => this.renderBlade(ctx),
      ring: () => this.renderRing(ctx),
      spark: () => this.renderSpark(ctx),
      ember: () => this.renderEmber(ctx),
      mist: () => this.renderMist(ctx),
      void: () => this.renderVoid(ctx),
      normal: () => this.renderLance(ctx)
    }[this.type] || (() => this.renderLance(ctx));

    handler();
    ctx.restore();
  }

  renderTrail(ctx) {
    if (!this.trail.length) return;
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      const alpha = (1 - i / this.trail.length) * .2;
      const size = Math.max(1, (1 - i / this.trail.length) * this.width * .45);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  glow(ctx, color, blur = 14) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
  }

  renderLance(ctx) {
    this.glow(ctx, this.color, 12);
    const g = ctx.createLinearGradient(this.x, this.y - 12, this.x, this.y + 12);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(.35, this.color);
    g.addColorStop(1, 'rgba(255,140,20,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 13);
    ctx.lineTo(this.x + 3, this.y + 8);
    ctx.lineTo(this.x, this.y + 12);
    ctx.lineTo(this.x - 3, this.y + 8);
    ctx.closePath();
    ctx.fill();
  }

  renderTwin(ctx) {
    this.glow(ctx, this.color, 15);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + 9);
    ctx.lineTo(this.x, this.y - 9);
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  renderSpread(ctx) {
    this.glow(ctx, this.color, 12);
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.vy, this.vx) + Math.PI / 2);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-1, -6, 2, 8);
  }

  renderLaser(ctx) {
    this.glow(ctx, '#37F3FF', 20);
    ctx.fillStyle = 'rgba(0,170,255,.35)';
    ctx.fillRect(this.x - 5, this.y - 20, 10, 40);
    ctx.fillStyle = '#37F3FF';
    ctx.fillRect(this.x - 2.5, this.y - 18, 5, 36);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x - .8, this.y - 18, 1.6, 36);
  }

  renderOverkill(ctx) {
    this.glow(ctx, '#FF4FD8', 24);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.age * .12);
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      const g = ctx.createLinearGradient(0, 0, 0, -14);
      g.addColorStop(0, '#FFFFFF');
      g.addColorStop(.4, '#FF4FD8');
      g.addColorStop(1, 'rgba(61,221,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -14);
      ctx.stroke();
    }
  }

  renderPulse(ctx) {
    const pulse = 1 + Math.sin(this.age * .55) * .18;
    this.glow(ctx, '#FFD166', 18);
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = .32;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 17 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  renderRainbow(ctx) {
    this.glow(ctx, this.color, 14);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + 10);
    ctx.quadraticCurveTo(this.x + Math.sin(this.age * .4) * 5, this.y, this.x, this.y - 10);
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  renderHoming(ctx) {
    this.glow(ctx, '#FFD166', 14);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FF5E57';
    ctx.fillRect(-2, 5, 4, 5 + Math.random() * 4);
  }

  renderMissile(ctx) {
    this.glow(ctx, '#FF593D', 14);
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.vy, this.vx) + Math.PI / 2);
    ctx.fillStyle = '#F4F7FF';
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(5, -4);
    ctx.lineTo(5, 8);
    ctx.lineTo(-5, 8);
    ctx.lineTo(-5, -4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FF593D';
    ctx.fillRect(-3, 0, 6, 7);
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.moveTo(-3, 8);
    ctx.lineTo(0, 17 + Math.random() * 5);
    ctx.lineTo(3, 8);
    ctx.fill();
  }

  renderSniper(ctx) {
    this.glow(ctx, '#FFFFFF', 24);
    ctx.strokeStyle = 'rgba(255,73,91,.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + 70);
    ctx.lineTo(this.x, this.y - 25);
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + 16);
    ctx.lineTo(this.x, this.y - 20);
    ctx.stroke();
    ctx.fillStyle = '#FF536D';
    ctx.fillRect(this.x - 1, this.y - 20, 2, 7);
  }

  renderDrill(ctx) {
    this.glow(ctx, '#FFAA38', 16);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = '#FFAA38';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const r = i % 2 ? 4 : 7;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-1.5, -7, 3, 14);
  }

  renderFrag(ctx) {
    this.glow(ctx, '#FF6748', 14);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#FF6748';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  renderFreeze(ctx) {
    this.glow(ctx, '#7DF7FF', 18);
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = '#7DF7FF';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(0, 12);
      ctx.moveTo(-4, -8);
      ctx.lineTo(0, -12);
      ctx.lineTo(4, -8);
      ctx.stroke();
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderPlasma(ctx) {
    const pulse = 1 + Math.sin(this.age * .7) * .16;
    this.glow(ctx, '#9DFF4F', 22);
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 14 * pulse);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(.2, '#C8FF72');
    g.addColorStop(.55, '#40E85B');
    g.addColorStop(1, 'rgba(27,255,101,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 14 * pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  renderTesla(ctx) {
    this.glow(ctx, '#B58CFF', 24);
    ctx.strokeStyle = '#B58CFF';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + 18);
    for (let i = 1; i <= 6; i++) {
      const py = this.y + 18 - i * 7;
      const px = this.x + (i % 2 ? -1 : 1) * (3 + Math.sin(this.age + i) * 3);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 24, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  renderWave(ctx) {
    const alpha = Math.max(.25, 1 - this.age / 70);
    this.glow(ctx, '#54F4DF', 18);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#54F4DF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.width / 2, 8, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = alpha * .45;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 5, this.width * .38, 5, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  renderBoomerang(ctx) {
    this.glow(ctx, this.color, 18);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, 8, -.8, 3.9);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(7, -4, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  renderNova(ctx) {
    const pulse = 1 + Math.sin(this.age * .8) * .24;
    this.glow(ctx, '#FF79D7', 20);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#FF79D7';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const r = (i % 2 ? 4 : 9) * pulse;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderComet(ctx) {
    this.glow(ctx, '#65E9FF', 28);
    const tail = ctx.createLinearGradient(this.x, this.y - 18, this.x, this.y + 48);
    tail.addColorStop(0, '#FFFFFF');
    tail.addColorStop(.22, '#65E9FF');
    tail.addColorStop(1, 'rgba(101,233,255,0)');
    ctx.fillStyle = tail;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 22);
    ctx.quadraticCurveTo(this.x + 10, this.y, this.x + 3, this.y + 52);
    ctx.lineTo(this.x - 3, this.y + 52);
    ctx.quadraticCurveTo(this.x - 10, this.y, this.x, this.y - 22);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 12, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderVortex(ctx) {
    this.glow(ctx, '#FF69B4', 18);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(3, -2);
      ctx.lineTo(0, 0);
      ctx.stroke();
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderRailgun(ctx) {
    this.glow(ctx, '#00E5FF', 30);
    const g = ctx.createLinearGradient(this.x, this.y + 28, this.x, this.y - 28);
    g.addColorStop(0, 'rgba(0,229,255,0)');
    g.addColorStop(.3, '#00E5FF');
    g.addColorStop(.5, '#FFFFFF');
    g.addColorStop(.7, '#00E5FF');
    g.addColorStop(1, 'rgba(0,229,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(this.x - 2, this.y - 25, 4, 50);
    ctx.fillStyle = 'rgba(0,229,255,.2)';
    ctx.fillRect(this.x - 6, this.y - 20, 12, 40);
  }

  renderCluster(ctx) {
    this.glow(ctx, '#FF8C00', 16);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 7, Math.sin(a) * 7);
      ctx.lineTo(Math.cos(a) * 10, Math.sin(a) * 10);
      ctx.stroke();
    }
  }

  renderChain(ctx) {
    this.glow(ctx, '#FFD700', 22);
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    for (let i = 1; i <= 4; i++) {
      const py = 10 - i * 5;
      const px = (i % 2 ? -1 : 1) * (2 + Math.sin(this.age + i) * 2);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -12, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  renderFlame(ctx) {
    const alpha = Math.max(.3, 1 - this.age / 25);
    this.glow(ctx, '#FF4500', 20);
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 16);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(.2, '#FFD700');
    g.addColorStop(.5, '#FF6600');
    g.addColorStop(1, 'rgba(255,69,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  renderOrbit(ctx) {
    this.glow(ctx, '#00CED1', 18);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.age * .3);
    ctx.strokeStyle = '#00CED1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -7, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  renderRicochet(ctx) {
    this.glow(ctx, '#00FF7F', 16);
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.vy, this.vx) + Math.PI / 2);
    ctx.fillStyle = '#00FF7F';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(-5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  renderPierce(ctx) {
    this.glow(ctx, '#FFFFFF', 26);
    const g = ctx.createLinearGradient(this.x, this.y + 24, this.x, this.y - 24);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(.35, 'rgba(200,220,255,.6)');
    g.addColorStop(.5, '#FFFFFF');
    g.addColorStop(.65, 'rgba(200,220,255,.6)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(this.x - 1.5, this.y - 24, 3, 48);
    ctx.fillStyle = 'rgba(180,220,255,.15)';
    ctx.fillRect(this.x - 4, this.y - 18, 8, 36);
  }

  renderShockwave(ctx) {
    const alpha = Math.max(.2, 1 - this.age / 60);
    this.glow(ctx, '#9370DB', 24);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.width / 2, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = alpha * .4;
    ctx.strokeStyle = '#C8A2FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.width / 3, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  renderPhoton(ctx) {
    const pulse = 1 + Math.sin(this.age * 1.2) * .3;
    this.glow(ctx, '#87CEEB', 14);
    ctx.fillStyle = '#E0FFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderBolt(ctx) {
    this.glow(ctx, '#FFD700', 20);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + 12);
    for (let i = 0; i < 5; i++) {
      const py = this.y + 12 - i * 5;
      ctx.lineTo(this.x + (i % 2 ? 1 : -1) * (2 + Math.random() * 2), py);
    }
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  renderOrb(ctx) {
    const pulse = 1 + Math.sin(this.age * .6) * .2;
    this.glow(ctx, '#C8A2FF', 18);
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 6 * pulse);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(.3, '#C8A2FF');
    g.addColorStop(1, 'rgba(200,162,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6 * pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  renderBeam(ctx) {
    this.glow(ctx, '#00FFFF', 24);
    ctx.fillStyle = 'rgba(0,255,255,.3)';
    ctx.fillRect(this.x - 4, this.y - 20, 8, 40);
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(this.x - 2, this.y - 18, 4, 36);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x - .8, this.y - 18, 1.6, 36);
  }

  renderShard(ctx) {
    this.glow(ctx, '#A8E6CF', 14);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#A8E6CF';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(-5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  renderBlade(ctx) {
    this.glow(ctx, '#E0E0E0', 16);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 4);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  renderRing(ctx) {
    const alpha = Math.max(.25, 1 - this.age / 50);
    this.glow(ctx, '#C8A2FF', 16);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#C8A2FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.width / 2, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  renderSpark(ctx) {
    this.glow(ctx, '#FFFF00', 8);
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  renderEmber(ctx) {
    const pulse = 1 + Math.sin(this.age * .8) * .3;
    this.glow(ctx, '#FF6600', 12);
    ctx.fillStyle = '#FF6600';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderMist(ctx) {
    const alpha = Math.max(.15, 1 - this.age / 50);
    this.glow(ctx, '#90EE90', 10);
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 10);
    g.addColorStop(0, 'rgba(144,238,144,.4)');
    g.addColorStop(1, 'rgba(144,238,144,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  renderVoid(ctx) {
    const pulse = 1 + Math.sin(this.age * .3) * .15;
    this.glow(ctx, '#2E004F', 22);
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * .5 * pulse);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(.4, 'rgba(46,0,79,.8)');
    g.addColorStop(1, 'rgba(46,0,79,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width * .5 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(180,0,255,.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
