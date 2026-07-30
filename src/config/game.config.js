/**
 * 游戏全局配置
 */
export const GameConfig = {
  // 游戏尺寸（运行时获取，仅在需要时使用）
  get width() {
    return window.innerWidth;
  },
  get height() {
    return window.innerHeight;
  },
  
  // 游戏状态
  states: {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
  },
  
  // 玩家配置
  player: {
    hp: 3,
    speed: 4,
    fireRate: 14, // 帧间隔
    minX: 0.1, // 屏幕10%
    maxX: 0.9, // 屏幕90%
    bombs: 3,        // 初始炸弹数量
    maxBombs: 5,
    dashCooldown: 60 // 冲刺冷却（帧）
  },
  
  // 武器类型 - 21 种武器（含 NONE）
  weaponTypes: {
    NONE: 0,
    SINGLE: 1,      // 基础单发
    DOUBLE: 2,      // 双枪
    SPREAD: 3,      // 散射
    LASER: 4,       // 激光
    HOMING: 5,      // 追踪弹
    MISSILE: 6,     // 穿透导弹
    PULSE: 7,       // 脉冲炮
    RAINBOW: 8,     // 彩虹弹幕
    BLACKHOLE: 9,   // 黑洞
    OVERKILL: 10,   // 毁灭
    SNIPER: 11,     // 狙击炮
    DRILL: 12,      // 钻头
    FRAG: 13,       // 榴弹碎片
    FREEZE: 14,     // 冻结光束
    PLASMA: 15,     // 等离子喷射
    TESLA: 16,      // 特斯拉电弧
    WAVE: 17,       // 音爆波
    BOOMERANG: 18,  // 回旋刃
    NOVA: 19,       // 星爆新星
    COMET: 20,      // 彗星炮
    VORTEX: 21,     // 漩涡弹
    RAILGUN: 22,    // 电磁炮
    CLUSTER: 23,    // 集束弹
    CHAIN: 24,      // 闪电链
    FLAME: 25,      // 烈焰喷射
    ORBIT: 26,      // 环卫星弹
    RICOCHET: 27,   // 反弹弹
    PIERCE: 28,     // 贯穿射线
    SHOCKWAVE: 29,  // 冲击波
    PHOTON: 30,     // 光子风暴
    // === 100种新武器 (31-130) ===
    // 元素系 (31-40)
    FIRE_STORM: 31, ICE_ARROW: 32, THUNDER_VOLT: 33, MAGMA: 34, CYCLONE: 35,
    EARTH_QUAKE: 36, WATER_DRAGON: 37, SAND_STORM: 38, POISON_MIST: 39, MOON_LIGHT: 40,
    // 科技系 (41-50)
    ION_CANNON: 41, ANTIMATTER: 42, NANO_SWARM: 43, QUANTUM: 44, PHASE_BEAM: 45,
    SUPERNOVA: 46, GAMMA_RAY: 47, GRAVITY_WAVE: 48, DARK_MATTER: 49, SINGULARITY: 50,
    // 神话系 (51-60)
    MJOLNIR: 51, SUN_ARROW: 52, HADES: 53, DRAGON_BREATH: 54, PHOENIX_FEATHER: 55,
    DIVINE_PUNISH: 56, ORACLE: 57, CHAOS_BALL: 58, GENESIS: 59, APOCALYPSE: 60,
    // 机械系 (61-70)
    GATLING: 61, MORTAR: 62, SHOTGUN: 63, ARMOR_PIERCE: 64, INCENDIARY: 65,
    CRYO_BLAST: 66, EMP_BURST: 67, CRUISE_MISSILE: 68, AIR_BURST: 69, PROXY_MINE: 70,
    // 近战系 (71-80)
    SWORD_QI: 71, SLASH_WAVE: 72, WHIRLWIND: 73, THRUST: 74, SWEEP: 75,
    SKY_REND: 76, JUDGEMENT: 77, ARMY_BREAKER: 78, ANNIHILATE: 79, VERDICT: 80,
    // 波动系 (81-90)
    ULTRASONIC: 81, INFRASONIC: 82, TREMOR: 83, RESONANCE: 84, HARMONIC: 85,
    ECHO_BLAST: 86, PULSE_WAVE: 87, SINE_WAVE: 88, SQUARE_WAVE: 89, TRIANGLE_WAVE: 90,
    // 空间系 (91-100)
    TELEPORT: 91, SPACE_RIFT: 92, DIMENSION: 93, FOLD: 94, WARP: 95,
    WORMHOLE: 96, PARALLEL: 97, PHASE_INVERT: 98, PHASE_SHIFT: 99, HYPERSPACE: 100,
    // 时间系 (101-110)
    TIME_STOP: 101, ACCELERATE: 102, DECELERATE: 103, REWIND: 104, FUTURE: 105,
    PAST: 106, ETERNITY: 107, MOMENT: 108, TEMPORAL: 109, CHRONOS: 110,
    // 能量系 (111-120)
    ENERGY_ORB: 111, MANA_BOLT: 112, AURA_BLAST: 113, SOUL_FIRE: 114, PSIONIC: 115,
    PRIMAL: 116, ESSENCE: 117, SPIRIT: 118, DIVINE_LIGHT: 119, ETHER: 120,
    // 召唤系 (121-130)
    DRONE: 121, UAV: 122, SWARM: 123, INTERCEPTOR: 124, GUARDIAN: 125,
    SENTINEL: 126, TURRET: 127, SATELLITE: 128, WINGMAN: 129, CARRIER: 130
  },
  
  // 敌人类别
  enemyTypes: {
    FIGHTER: 'fighter',
    BOMBER: 'bomber',
    ESCORT: 'escort',
    BOSS: 'boss'
  },
  
  // 敌人属性
  enemyConfig: {
    fighter: { hp: 3, score: 100, color: '#FF0000', speed: 2, fireRate: 90, dropWeight: 50 },
    bomber: { hp: 5, score: 200, color: '#FF00FF', speed: 1.5, fireRate: 70, dropWeight: 30 },
    escort: { hp: 2, score: 150, color: '#FFFF00', speed: 3, fireRate: 60, dropWeight: 20 },
    boss: { hp: 40, score: 2000, color: '#FF4400', speed: 1, fireRate: 30, dropWeight: 0,
      // Boss 多阶段配置
      phases: [
        { hpRatio: 1.0,  pattern: 'spiral',   interval: 18, bullets: 1, bulletSpeed: 4 },
        { hpRatio: 0.6,  pattern: 'spread',   interval: 24, bullets: 5, bulletSpeed: 5 },
        { hpRatio: 0.3,  pattern: 'summon',   interval: 60, bullets: 0, bulletSpeed: 0 }
      ]
    }
  },
  
  // 道具类型
  powerUpTypes: {
    RANDOM_WEAPON: 'randomWeapon',
    SHIELD: 'shield',
    CLEAR_SCREEN: 'clearScreen',
    LIFE: 'life',
    BOMB: 'bomb',        // 炸弹（手动清屏技能）
    SCORE: 'score',      // 金币（加分）
    RAPID: 'rapid',      // 射速提升
    AMMO: 'ammo'         // 补充弹药
  },
  
  // 道具掉落权重（用于加权随机掉落）
  powerUpWeights: {
    randomWeapon: 25,
    shield: 12,
    clearScreen: 8,
    life: 6,
    bomb: 15,
    score: 20,
    rapid: 10,
    ammo: 18
  },
  
  // 稀有道具（Boss/特殊掉落），概率极低
  rarePowerUp: 'randomWeapon',
  rareDropChance: 0.05,
  
  // 得分规则
  scoreTable: {
    SMALL_SHIP: 100,
    MEDIUM_SHIP: 200,
    LARGE_SHIP: 500,
    BOSS: 1000,
    POWERUP: 50
  },
  
  // 关卡配置（难度随关卡递增）
  levels: [
    { wave: 1, enemies: ['fighter'], interval: 4000 },
    { wave: 2, enemies: ['fighter', 'bomber'], interval: 3500 },
    { wave: 3, enemies: ['fighter', 'bomber', 'escort'], interval: 3000 },
    { wave: 4, enemies: ['boss'], interval: 0 },
    { wave: 5, enemies: ['fighter', 'fighter', 'escort'], interval: 2800 },
    { wave: 6, enemies: ['bomber', 'bomber', 'escort'], interval: 2600 },
    { wave: 7, enemies: ['fighter', 'bomber', 'escort', 'escort'], interval: 2400 },
    { wave: 8, enemies: ['boss'], interval: 0 }
  ],
  
  // 难度递增系数（每过一轮关卡后的属性倍率）
  difficulty: {
    hpScalePerLoop: 1.15,
    speedScalePerLoop: 1.05,
    fireRateScalePerLoop: 0.92,  // 越小射速越快
    maxLoop: 6
  },
  
  // 颜色配置
  colors: {
    player: '#00FF00',
    enemy: '#FF0000',
    bullet: '#FFFF00',
    uiBg: '#1a1a2e',
    uiBorder: '#16213e',
    highlight: '#ff00ff'
  },

  // 难度级别
  difficultyLevels: {
    EASY: 0,
    NORMAL: 1,
    HARD: 2,
    HELL: 3
  },

  // 各难度预设（乘数/覆盖值）
  difficultyPresets: {
    0: { // 简单
      label: '简单',
      color: '#4ECDC4',
      enemyHpMul: 0.6,
      enemySpeedMul: 0.7,
      enemyFireRateMul: 0.6, // 更慢射击
      playerHp: 5,
      enemySpawnMul: 1.3,    // 更慢生成
      powerUpMul: 1.5,       // 更多道具
      dropWeightMul: 1.2,
      scoreMul: 0.8,
      bossHpMul: 0.6,
      loopHpMul: 1.10,
      loopSpeedMul: 1.03,
      loopFireRateMul: 0.95
    },
    1: { // 普通
      label: '普通',
      color: '#FFFFFF',
      enemyHpMul: 1.0,
      enemySpeedMul: 1.0,
      enemyFireRateMul: 1.0,
      playerHp: 3,
      enemySpawnMul: 1.0,
      powerUpMul: 1.0,
      dropWeightMul: 1.0,
      scoreMul: 1.0,
      bossHpMul: 1.0,
      loopHpMul: 1.15,
      loopSpeedMul: 1.05,
      loopFireRateMul: 0.92
    },
    2: { // 困难
      label: '困难',
      color: '#FF6B6B',
      enemyHpMul: 1.8,
      enemySpeedMul: 1.3,
      enemyFireRateMul: 1.4, // 更快射击
      playerHp: 2,
      enemySpawnMul: 0.7,    // 更快生成
      powerUpMul: 0.6,
      dropWeightMul: 0.7,
      scoreMul: 1.5,
      bossHpMul: 1.8,
      loopHpMul: 1.20,
      loopSpeedMul: 1.08,
      loopFireRateMul: 0.88
    },
    3: { // 地狱
      label: '地狱',
      color: '#FF0000',
      enemyHpMul: 3.0,
      enemySpeedMul: 1.6,
      enemyFireRateMul: 1.8,
      playerHp: 1,
      enemySpawnMul: 0.4,
      powerUpMul: 0.6,      // 改为与困难相同
      dropWeightMul: 0.7,   // 改为与困难相同
      scoreMul: 3.0,
      bossHpMul: 3.0,
      loopHpMul: 1.30,
      loopSpeedMul: 1.12,
      loopFireRateMul: 0.82
    }
  }
};
