import { WEAPON_NAMES, WEAPON_DESC, AMMO_COST } from '../entities/Player/WeaponSystem.js';

function calcPanelParams(width) {
  if (width < 600) return { tier: 'phone', font: 11, small: 9, panelW: 158, panelH: 92, pad: 6, title: 13, bossY: 108, details: false };
  if (width < 1024) return { tier: 'tablet', font: 14, small: 11, panelW: 240, panelH: 132, pad: 10, title: 18, bossY: 148, details: true };
  return { tier: 'desktop', font: 15, small: 11, panelW: 224, panelH: 128, pad: 14, title: 22, bossY: 86, details: true };
}

export class HUD {
  constructor(game) {
    this.game = game;
  }

  render(ctx) {
    const player = this.game.getPlayer();
    if (!player) return;

    const width = this.game.getWidth();
    const height = this.game.getHeight();
    const p = calcPanelParams(width);
    const panelW = Math.min(p.panelW, Math.floor(width / 2 - p.pad - 10));
    const leftX = p.pad;
    const rightX = width - p.pad - panelW;

    ctx.save();
    this.drawPanel(ctx, leftX, p.pad, panelW, p.panelH, 'left');
    this.drawPanel(ctx, rightX, p.pad, panelW, p.panelH, 'right');

    this.drawPlayerStatus(ctx, player, leftX, p.pad, panelW, p);
    this.drawMissionStatus(ctx, rightX, p.pad, panelW, p);
    this.drawCenterMark(ctx, width, p);
    this.renderBossBar(ctx, width, height, p);
    ctx.restore();
  }

  drawPanel(ctx, x, y, w, h, side) {
    const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
    if (side === 'left') {
      gradient.addColorStop(0, 'rgba(7, 18, 42, 0.9)');
      gradient.addColorStop(1, 'rgba(11, 9, 31, 0.72)');
    } else {
      gradient.addColorStop(0, 'rgba(11, 9, 31, 0.72)');
      gradient.addColorStop(1, 'rgba(7, 18, 42, 0.9)');
    }
    ctx.fillStyle = gradient;
    this.roundRect(ctx, x, y, w, h, 11);
    ctx.fill();

    ctx.strokeStyle = side === 'left' ? 'rgba(98,232,255,.32)' : 'rgba(151,117,255,.34)';
    ctx.lineWidth = 1;
    this.roundRect(ctx, x, y, w, h, 11);
    ctx.stroke();

    const accent = ctx.createLinearGradient(x, y, x + w, y);
    accent.addColorStop(0, side === 'left' ? '#62e8ff' : 'transparent');
    accent.addColorStop(.5, 'rgba(255,255,255,.28)');
    accent.addColorStop(1, side === 'right' ? '#9b7cff' : 'transparent');
    ctx.fillStyle = accent;
    this.roundRect(ctx, x + 10, y, w - 20, 2, 2);
    ctx.fill();
  }

  drawPlayerStatus(ctx, player, x, y, w, p) {
    const innerX = x + 12;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillStyle = '#73819f';
    ctx.font = `700 ${p.small}px "Trebuchet MS", sans-serif`;
    ctx.fillText('FIGHTER STATUS', innerX, y + 10);

    const hearts = Array.from({ length: player.maxHp }, (_, i) => i < player.hp ? '♥' : '♡').join(' ');
    ctx.fillStyle = '#ff5874';
    ctx.shadowColor = 'rgba(255,71,104,.5)';
    ctx.shadowBlur = 8;
    ctx.font = `700 ${p.font + 1}px "Trebuchet MS", sans-serif`;
    ctx.fillText(hearts, innerX, y + 29);
    ctx.shadowBlur = 0;

    const weaponName = WEAPON_NAMES[player.weapon] || '未知';
    ctx.fillStyle = '#f1f5ff';
    ctx.font = `700 ${p.font}px "Trebuchet MS", "Microsoft YaHei", sans-serif`;
    ctx.fillText(weaponName, innerX, y + 51);

    const cost = AMMO_COST[player.weapon] || 0;
    const ammoText = cost > 0 ? `${player.ammo} / -${cost}` : `${player.ammo} / FREE`;
    ctx.fillStyle = '#ffd166';
    ctx.font = `700 ${p.small}px "Trebuchet MS", sans-serif`;
    ctx.fillText(`AMMO  ${ammoText}`, innerX, y + 73);

    if (p.details) {
      const desc = WEAPON_DESC[player.weapon] || '';
      ctx.fillStyle = '#7f8dab';
      ctx.font = `600 ${p.small}px "Trebuchet MS", "Microsoft YaHei", sans-serif`;
      ctx.fillText(desc, innerX, y + 94);
      ctx.fillStyle = '#ff9f43';
      ctx.textAlign = 'right';
      ctx.fillText(`BOMB  ${player.bombs}`, x + w - 12, y + 94);
    }
  }

  drawMissionStatus(ctx, x, y, w, p) {
    const innerX = x + w - 12;
    const score = String(this.game.getScore()).padStart(6, '0');
    const combo = this.game.getCombo();

    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#73819f';
    ctx.font = `700 ${p.small}px "Trebuchet MS", sans-serif`;
    ctx.fillText('MISSION DATA', innerX, y + 10);

    ctx.fillStyle = '#ffd166';
    ctx.shadowColor = 'rgba(255,209,102,.3)';
    ctx.shadowBlur = 8;
    ctx.font = `800 ${p.font + 3}px "Trebuchet MS", sans-serif`;
    ctx.fillText(score, innerX, y + 28);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#62e8ff';
    ctx.font = `700 ${p.font}px "Trebuchet MS", "Microsoft YaHei", sans-serif`;
    ctx.fillText(`STAGE  ${String(this.game.getLevel()).padStart(2, '0')}`, innerX, y + 55);

    if (combo > 1) {
      ctx.fillStyle = combo >= 5 ? '#ff536d' : '#ff8ac5';
      ctx.font = `800 ${p.font}px "Trebuchet MS", sans-serif`;
      ctx.fillText(`COMBO  x${combo}`, innerX, y + 78);
    } else {
      const diffPreset = this.game.getDiffPreset();
      ctx.fillStyle = diffPreset.color;
      ctx.font = `700 ${p.small}px "Trebuchet MS", "Microsoft YaHei", sans-serif`;
      ctx.fillText(diffPreset.label.toUpperCase(), innerX, y + 80);
    }

    if (p.details && this.game.difficultyLoop > 0) {
      ctx.fillStyle = '#a98cff';
      ctx.font = `700 ${p.small}px "Trebuchet MS", sans-serif`;
      ctx.fillText(`THREAT +${this.game.difficultyLoop}`, innerX, y + 101);
    }
  }

  drawCenterMark(ctx, width, p) {
    if (p.tier === 'phone') return;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#dffbff';
    ctx.shadowColor = '#3976ff';
    ctx.shadowBlur = 12;
    ctx.font = `800 ${p.title}px "Trebuchet MS", sans-serif`;
    ctx.fillText('GALAGA // NEON STRIKE', width / 2, p.pad + 4);
    ctx.shadowBlur = 0;

    const bonus = this.game.getTimeBonus();
    if (bonus > 0) {
      ctx.fillStyle = '#62e8ff';
      ctx.font = '700 11px "Trebuchet MS", sans-serif';
      ctx.fillText(`TIME BONUS  +${bonus}`, width / 2, p.pad + 35);
    }
  }

  renderBossBar(ctx, width, height, p) {
    const boss = this.game.boss;
    if (!boss || boss.isDead()) return;

    const barW = Math.min(520, width - 36);
    const barH = 13;
    const barX = (width - barW) / 2;
    const barY = p.bossY;
    const ratio = Math.max(0, Math.min(1, boss.hp / boss.maxHp));

    ctx.fillStyle = 'rgba(4,7,20,.9)';
    this.roundRect(ctx, barX - 5, barY - 19, barW + 10, 42, 9);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,83,109,.28)';
    ctx.stroke();

    ctx.fillStyle = '#24101d';
    this.roundRect(ctx, barX, barY, barW, barH, 4);
    ctx.fill();

    if (ratio > 0) {
      const hp = ctx.createLinearGradient(barX, barY, barX + barW, barY);
      hp.addColorStop(0, '#ffb14a');
      hp.addColorStop(.45, '#ff536d');
      hp.addColorStop(1, '#c938e8');
      ctx.fillStyle = hp;
      ctx.shadowColor = 'rgba(255,60,112,.6)';
      ctx.shadowBlur = 10;
      this.roundRect(ctx, barX, barY, barW * ratio, barH, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = '#f4dbe6';
    ctx.font = '800 10px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`BOSS // LEVEL ${this.game.getLevel()}`, barX, barY - 14);
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(ratio * 100)}%`, barX + barW, barY - 14);
  }

  roundRect(ctx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
