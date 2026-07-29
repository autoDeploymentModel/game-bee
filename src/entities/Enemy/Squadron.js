/**
 * 敌机编队系统
 */
import { BaseEnemy } from './BaseEnemy.js';

export class Squadron {
  constructor(game, formationType = 'pentagon') {
    this.game = game;
    this.members = [];
    this.formationType = formationType;
    this.moveSpeed = 2;
    this.direction = 1;
    this.chaseTimer = 0;
    this.chaseInterval = 300;
    
    this.initFormation();
  }
  
  initFormation() {
    const canvasWidth = this.game.getWidth();
    const canvasHeight = this.game.getHeight();
    const centerX = canvasWidth / 2;
    const startY = 60;
    const spacingX = 50;
    const spacingY = 40;
    const size = 32;
    
    if (this.formationType === 'pentagon') {
      // 经典 Galaga 五角阵型，居中
      const positions = [
        [centerX - spacingX * 2, startY],
        [centerX - spacingX, startY],
        [centerX, startY],
        [centerX + spacingX, startY],
        [centerX + spacingX * 2, startY],
        [centerX, startY + spacingY],
        [centerX - spacingX, startY + spacingY],
        [centerX + spacingX, startY + spacingY],
      ];
      positions.forEach((pos, i) => {
        this.addMember(pos[0], pos[1], i % 3 === 0 ? 'bomber' : 'fighter');
      });
    }
    else if (this.formationType === 'v') {
      // V字阵型
      for (let i = 0; i < 5; i++) {
        const x = centerX + (i - 2) * spacingX;
        const y = startY + Math.abs(i - 2) * 30;
        this.addMember(x, y, 'fighter');
      }
    }
    else if (this.formationType === 'line') {
      // 直线阵型
      for (let i = 0; i < 5; i++) {
        const x = centerX + (i - 2) * spacingX;
        this.addMember(x, startY, 'fighter');
      }
    }
  }
  
  addMember(x, y, type) {
    const enemy = new BaseEnemy(this.game, x, y, type);
    enemy.formationX = x;
    enemy.formationY = y;
    this.members.push(enemy);
  }
  
  update(deltaTime) {
    // 编队移动（成员自身update不再额外横向移动）
    this.members.forEach(member => {
      if (!member.isDead()) {
        member.x += this.moveSpeed * this.direction;
        member.update(deltaTime);
      }
    });
    
    // 到达边界时转向
    const canvasWidth = this.game.getWidth();
    const alive = this.members.filter(m => !m.isDead());
    if (alive.length > 0) {
      const minX = Math.min(...alive.map(m => m.x));
      const maxX = Math.max(...alive.map(m => m.x));
      if (maxX > canvasWidth - 80) {
        this.direction = -1;
      } else if (minX < 80) {
        this.direction = 1;
      }
    }
    
    // 随机追击
    this.chaseTimer++;
    if (this.chaseTimer >= this.chaseInterval) {
      this.chaseTimer = 0;
      if (Math.random() < 0.3) {
        this.triggerChase();
      }
    }
    
    // 清理死亡成员
    this.members = this.members.filter(member => !member.isDead());
  }
  
  triggerChase() {
    const aliveMembers = this.members.filter(m => !m.isDead());
    if (aliveMembers.length > 0) {
      // 随机选择一个成员进行追击
      const randomIndex = Math.floor(Math.random() * aliveMembers.length);
      aliveMembers[randomIndex].enterChaseMode();
    }
  }
  
  getAliveCount() {
    return this.members.filter(m => !m.isDead()).length;
  }
  
  isEmpty() {
    return this.members.length === 0;
  }
  
  render(ctx) {
    this.members.forEach(member => {
      member.render(ctx);
    });
  }
  
  addNewEnemy(type) {
    const x = this.game.getWidth() / 2;
    const y = 50;
    const enemy = new BaseEnemy(this.game, x, y, type);
    this.members.push(enemy);
    return enemy;
  }
}
