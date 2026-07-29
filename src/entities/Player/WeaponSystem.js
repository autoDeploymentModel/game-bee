/**
 * 武器系统 - 21 种武器
 */
import { GameConfig } from '../../config/game.config.js';
import { SoundManager } from '../../audio/SoundManager.js';

// 武器升级路径 - 主路线
const UPGRADE_PATH = {
  [GameConfig.weaponTypes.NONE]: GameConfig.weaponTypes.SINGLE,
  [GameConfig.weaponTypes.SINGLE]: GameConfig.weaponTypes.DOUBLE,
  [GameConfig.weaponTypes.DOUBLE]: GameConfig.weaponTypes.SPREAD,
  [GameConfig.weaponTypes.SPREAD]: GameConfig.weaponTypes.LASER,
  [GameConfig.weaponTypes.LASER]: GameConfig.weaponTypes.OVERKILL,
  [GameConfig.weaponTypes.OVERKILL]: GameConfig.weaponTypes.HOMING,
  [GameConfig.weaponTypes.HOMING]: GameConfig.weaponTypes.MISSILE,
  [GameConfig.weaponTypes.MISSILE]: GameConfig.weaponTypes.PULSE,
  [GameConfig.weaponTypes.PULSE]: GameConfig.weaponTypes.RAINBOW,
  [GameConfig.weaponTypes.RAINBOW]: GameConfig.weaponTypes.BLACKHOLE,
  [GameConfig.weaponTypes.BLACKHOLE]: GameConfig.weaponTypes.SNIPER,
  [GameConfig.weaponTypes.SNIPER]: GameConfig.weaponTypes.DRILL,
  [GameConfig.weaponTypes.DRILL]: GameConfig.weaponTypes.FRAG,
  [GameConfig.weaponTypes.FRAG]: GameConfig.weaponTypes.FREEZE,
  [GameConfig.weaponTypes.FREEZE]: GameConfig.weaponTypes.PLASMA,
  [GameConfig.weaponTypes.PLASMA]: GameConfig.weaponTypes.TESLA,
  [GameConfig.weaponTypes.TESLA]: GameConfig.weaponTypes.WAVE,
  [GameConfig.weaponTypes.WAVE]: GameConfig.weaponTypes.BOOMERANG,
  [GameConfig.weaponTypes.BOOMERANG]: GameConfig.weaponTypes.NOVA,
  [GameConfig.weaponTypes.NOVA]: GameConfig.weaponTypes.COMET,
  [GameConfig.weaponTypes.COMET]: GameConfig.weaponTypes.VORTEX,
  [GameConfig.weaponTypes.VORTEX]: GameConfig.weaponTypes.RAILGUN,
  [GameConfig.weaponTypes.RAILGUN]: GameConfig.weaponTypes.CLUSTER,
  [GameConfig.weaponTypes.CLUSTER]: GameConfig.weaponTypes.CHAIN,
  [GameConfig.weaponTypes.CHAIN]: GameConfig.weaponTypes.FLAME,
  [GameConfig.weaponTypes.FLAME]: GameConfig.weaponTypes.ORBIT,
  [GameConfig.weaponTypes.ORBIT]: GameConfig.weaponTypes.RICOCHET,
  [GameConfig.weaponTypes.RICOCHET]: GameConfig.weaponTypes.PIERCE,
  [GameConfig.weaponTypes.PIERCE]: GameConfig.weaponTypes.SHOCKWAVE,
  [GameConfig.weaponTypes.SHOCKWAVE]: GameConfig.weaponTypes.PHOTON,
  [GameConfig.weaponTypes.PHOTON]: GameConfig.weaponTypes.FIRE_STORM,
  [GameConfig.weaponTypes.FIRE_STORM]: GameConfig.weaponTypes.ICE_ARROW,
  [GameConfig.weaponTypes.ICE_ARROW]: GameConfig.weaponTypes.THUNDER_VOLT,
  [GameConfig.weaponTypes.THUNDER_VOLT]: GameConfig.weaponTypes.MAGMA,
  [GameConfig.weaponTypes.MAGMA]: GameConfig.weaponTypes.CYCLONE,
  [GameConfig.weaponTypes.CYCLONE]: GameConfig.weaponTypes.EARTH_QUAKE,
  [GameConfig.weaponTypes.EARTH_QUAKE]: GameConfig.weaponTypes.WATER_DRAGON,
  [GameConfig.weaponTypes.WATER_DRAGON]: GameConfig.weaponTypes.SAND_STORM,
  [GameConfig.weaponTypes.SAND_STORM]: GameConfig.weaponTypes.POISON_MIST,
  [GameConfig.weaponTypes.POISON_MIST]: GameConfig.weaponTypes.MOON_LIGHT,
  [GameConfig.weaponTypes.MOON_LIGHT]: GameConfig.weaponTypes.ION_CANNON,
  [GameConfig.weaponTypes.ION_CANNON]: GameConfig.weaponTypes.ANTIMATTER,
  [GameConfig.weaponTypes.ANTIMATTER]: GameConfig.weaponTypes.NANO_SWARM,
  [GameConfig.weaponTypes.NANO_SWARM]: GameConfig.weaponTypes.QUANTUM,
  [GameConfig.weaponTypes.QUANTUM]: GameConfig.weaponTypes.PHASE_BEAM,
  [GameConfig.weaponTypes.PHASE_BEAM]: GameConfig.weaponTypes.SUPERNOVA,
  [GameConfig.weaponTypes.SUPERNOVA]: GameConfig.weaponTypes.GAMMA_RAY,
  [GameConfig.weaponTypes.GAMMA_RAY]: GameConfig.weaponTypes.GRAVITY_WAVE,
  [GameConfig.weaponTypes.GRAVITY_WAVE]: GameConfig.weaponTypes.DARK_MATTER,
  [GameConfig.weaponTypes.DARK_MATTER]: GameConfig.weaponTypes.SINGULARITY,
  [GameConfig.weaponTypes.SINGULARITY]: GameConfig.weaponTypes.MJOLNIR,
  [GameConfig.weaponTypes.MJOLNIR]: GameConfig.weaponTypes.SUN_ARROW,
  [GameConfig.weaponTypes.SUN_ARROW]: GameConfig.weaponTypes.HADES,
  [GameConfig.weaponTypes.HADES]: GameConfig.weaponTypes.DRAGON_BREATH,
  [GameConfig.weaponTypes.DRAGON_BREATH]: GameConfig.weaponTypes.PHOENIX_FEATHER,
  [GameConfig.weaponTypes.PHOENIX_FEATHER]: GameConfig.weaponTypes.DIVINE_PUNISH,
  [GameConfig.weaponTypes.DIVINE_PUNISH]: GameConfig.weaponTypes.ORACLE,
  [GameConfig.weaponTypes.ORACLE]: GameConfig.weaponTypes.CHAOS_BALL,
  [GameConfig.weaponTypes.CHAOS_BALL]: GameConfig.weaponTypes.GENESIS,
  [GameConfig.weaponTypes.GENESIS]: GameConfig.weaponTypes.APOCALYPSE,
  [GameConfig.weaponTypes.APOCALYPSE]: GameConfig.weaponTypes.GATLING,
  [GameConfig.weaponTypes.GATLING]: GameConfig.weaponTypes.MORTAR,
  [GameConfig.weaponTypes.MORTAR]: GameConfig.weaponTypes.SHOTGUN,
  [GameConfig.weaponTypes.SHOTGUN]: GameConfig.weaponTypes.ARMOR_PIERCE,
  [GameConfig.weaponTypes.ARMOR_PIERCE]: GameConfig.weaponTypes.INCENDIARY,
  [GameConfig.weaponTypes.INCENDIARY]: GameConfig.weaponTypes.CRYO_BLAST,
  [GameConfig.weaponTypes.CRYO_BLAST]: GameConfig.weaponTypes.EMP_BURST,
  [GameConfig.weaponTypes.EMP_BURST]: GameConfig.weaponTypes.CRUISE_MISSILE,
  [GameConfig.weaponTypes.CRUISE_MISSILE]: GameConfig.weaponTypes.AIR_BURST,
  [GameConfig.weaponTypes.AIR_BURST]: GameConfig.weaponTypes.PROXY_MINE,
  [GameConfig.weaponTypes.PROXY_MINE]: GameConfig.weaponTypes.SWORD_QI,
  [GameConfig.weaponTypes.SWORD_QI]: GameConfig.weaponTypes.SLASH_WAVE,
  [GameConfig.weaponTypes.SLASH_WAVE]: GameConfig.weaponTypes.WHIRLWIND,
  [GameConfig.weaponTypes.WHIRLWIND]: GameConfig.weaponTypes.THRUST,
  [GameConfig.weaponTypes.THRUST]: GameConfig.weaponTypes.SWEEP,
  [GameConfig.weaponTypes.SWEEP]: GameConfig.weaponTypes.SKY_REND,
  [GameConfig.weaponTypes.SKY_REND]: GameConfig.weaponTypes.JUDGEMENT,
  [GameConfig.weaponTypes.JUDGEMENT]: GameConfig.weaponTypes.ARMY_BREAKER,
  [GameConfig.weaponTypes.ARMY_BREAKER]: GameConfig.weaponTypes.ANNIHILATE,
  [GameConfig.weaponTypes.ANNIHILATE]: GameConfig.weaponTypes.VERDICT,
  [GameConfig.weaponTypes.VERDICT]: GameConfig.weaponTypes.ULTRASONIC,
  [GameConfig.weaponTypes.ULTRASONIC]: GameConfig.weaponTypes.INFRASONIC,
  [GameConfig.weaponTypes.INFRASONIC]: GameConfig.weaponTypes.TREMOR,
  [GameConfig.weaponTypes.TREMOR]: GameConfig.weaponTypes.RESONANCE,
  [GameConfig.weaponTypes.RESONANCE]: GameConfig.weaponTypes.HARMONIC,
  [GameConfig.weaponTypes.HARMONIC]: GameConfig.weaponTypes.ECHO_BLAST,
  [GameConfig.weaponTypes.ECHO_BLAST]: GameConfig.weaponTypes.PULSE_WAVE,
  [GameConfig.weaponTypes.PULSE_WAVE]: GameConfig.weaponTypes.SINE_WAVE,
  [GameConfig.weaponTypes.SINE_WAVE]: GameConfig.weaponTypes.SQUARE_WAVE,
  [GameConfig.weaponTypes.SQUARE_WAVE]: GameConfig.weaponTypes.TRIANGLE_WAVE,
  [GameConfig.weaponTypes.TRIANGLE_WAVE]: GameConfig.weaponTypes.TELEPORT,
  [GameConfig.weaponTypes.TELEPORT]: GameConfig.weaponTypes.SPACE_RIFT,
  [GameConfig.weaponTypes.SPACE_RIFT]: GameConfig.weaponTypes.DIMENSION,
  [GameConfig.weaponTypes.DIMENSION]: GameConfig.weaponTypes.FOLD,
  [GameConfig.weaponTypes.FOLD]: GameConfig.weaponTypes.WARP,
  [GameConfig.weaponTypes.WARP]: GameConfig.weaponTypes.WORMHOLE,
  [GameConfig.weaponTypes.WORMHOLE]: GameConfig.weaponTypes.PARALLEL,
  [GameConfig.weaponTypes.PARALLEL]: GameConfig.weaponTypes.PHASE_INVERT,
  [GameConfig.weaponTypes.PHASE_INVERT]: GameConfig.weaponTypes.PHASE_SHIFT,
  [GameConfig.weaponTypes.PHASE_SHIFT]: GameConfig.weaponTypes.HYPERSPACE,
  [GameConfig.weaponTypes.HYPERSPACE]: GameConfig.weaponTypes.TIME_STOP,
  [GameConfig.weaponTypes.TIME_STOP]: GameConfig.weaponTypes.ACCELERATE,
  [GameConfig.weaponTypes.ACCELERATE]: GameConfig.weaponTypes.DECELERATE,
  [GameConfig.weaponTypes.DECELERATE]: GameConfig.weaponTypes.REWIND,
  [GameConfig.weaponTypes.REWIND]: GameConfig.weaponTypes.FUTURE,
  [GameConfig.weaponTypes.FUTURE]: GameConfig.weaponTypes.PAST,
  [GameConfig.weaponTypes.PAST]: GameConfig.weaponTypes.ETERNITY,
  [GameConfig.weaponTypes.ETERNITY]: GameConfig.weaponTypes.MOMENT,
  [GameConfig.weaponTypes.MOMENT]: GameConfig.weaponTypes.TEMPORAL,
  [GameConfig.weaponTypes.TEMPORAL]: GameConfig.weaponTypes.CHRONOS,
  [GameConfig.weaponTypes.CHRONOS]: GameConfig.weaponTypes.ENERGY_ORB,
  [GameConfig.weaponTypes.ENERGY_ORB]: GameConfig.weaponTypes.MANA_BOLT,
  [GameConfig.weaponTypes.MANA_BOLT]: GameConfig.weaponTypes.AURA_BLAST,
  [GameConfig.weaponTypes.AURA_BLAST]: GameConfig.weaponTypes.SOUL_FIRE,
  [GameConfig.weaponTypes.SOUL_FIRE]: GameConfig.weaponTypes.PSIONIC,
  [GameConfig.weaponTypes.PSIONIC]: GameConfig.weaponTypes.PRIMAL,
  [GameConfig.weaponTypes.PRIMAL]: GameConfig.weaponTypes.ESSENCE,
  [GameConfig.weaponTypes.ESSENCE]: GameConfig.weaponTypes.SPIRIT,
  [GameConfig.weaponTypes.SPIRIT]: GameConfig.weaponTypes.DIVINE_LIGHT,
  [GameConfig.weaponTypes.DIVINE_LIGHT]: GameConfig.weaponTypes.ETHER,
  [GameConfig.weaponTypes.ETHER]: GameConfig.weaponTypes.DRONE,
  [GameConfig.weaponTypes.DRONE]: GameConfig.weaponTypes.UAV,
  [GameConfig.weaponTypes.UAV]: GameConfig.weaponTypes.SWARM,
  [GameConfig.weaponTypes.SWARM]: GameConfig.weaponTypes.INTERCEPTOR,
  [GameConfig.weaponTypes.INTERCEPTOR]: GameConfig.weaponTypes.GUARDIAN,
  [GameConfig.weaponTypes.GUARDIAN]: GameConfig.weaponTypes.SENTINEL,
  [GameConfig.weaponTypes.SENTINEL]: GameConfig.weaponTypes.TURRET,
  [GameConfig.weaponTypes.TURRET]: GameConfig.weaponTypes.SATELLITE,
  [GameConfig.weaponTypes.SATELLITE]: GameConfig.weaponTypes.WINGMAN,
  [GameConfig.weaponTypes.WINGMAN]: GameConfig.weaponTypes.CARRIER,
  [GameConfig.weaponTypes.CARRIER]: GameConfig.weaponTypes.CARRIER
};

// 武器中文名（用于 HUD 显示）
export const WEAPON_NAMES = [
  '无', '光矛', '双子炮', '扇形散射', '高能激光',
  '追踪弹', '穿透导弹', '脉冲炮', '彩虹炮',
  '黑洞', '毁灭者', '狙击炮', '螺旋钻头',
  '榴弹碎片', '冻结光束', '等离子', '特斯拉电弧',
  '音爆波', '回旋刃', '星爆新星', '彗星炮',
  '漩涡弹', '电磁炮', '集束弹', '闪电链',
  '烈焰', '环卫星弹', '反弹弹', '贯穿射线',
  '冲击波', '光子风暴',
  // 100种新武器 (31-130)
  '烈焰风暴','寒冰箭','雷霆','岩浆','龙卷风','地震','水龙','沙暴','毒雾','月光',
  '离子炮','反物质','纳米蜂群','量子','相位光束','超新星','伽马射线','引力波','暗物质','奇点',
  '雷神之锤','太阳箭','冥王','龙息','凤凰羽','天罚','神谕','混沌球','创世','天启',
  '加特林','迫击炮','霰弹枪','穿甲弹','燃烧弹','急冻','电磁脉冲','巡航导弹','空爆','感应雷',
  '剑气','斩波','旋风','穿刺','横扫','裂空','裁决','破军','湮灭','审判',
  '超声波','次声波','震波','共振','谐波','回响','脉冲波','正弦波','方波','三角波',
  '瞬移','空间裂隙','维度','折叠','曲速','虫洞','平行','相位反转','相位移','超空间',
  '时间停止','加速','减速','回溯','未来','过去','永恒','瞬间','时空','柯罗诺斯',
  '能量球','法力弹','光环冲击','灵魂之火','灵能','原始','精华','魂灵','圣光','以太',
  '无人机','侦察机','蜂群','拦截机','守护者','哨兵','炮塔','卫星','僚机','航母'
];

// 各武器每发消耗的弹药
export const AMMO_COST = {
  [GameConfig.weaponTypes.SINGLE]: 0,
  [GameConfig.weaponTypes.DOUBLE]: 0,
  [GameConfig.weaponTypes.SPREAD]: 0,
  [GameConfig.weaponTypes.LASER]: 0,
  [GameConfig.weaponTypes.OVERKILL]: 0,
  [GameConfig.weaponTypes.HOMING]: 1,
  [GameConfig.weaponTypes.MISSILE]: 1,
  [GameConfig.weaponTypes.PULSE]: 0,
  [GameConfig.weaponTypes.RAINBOW]: 0,
  [GameConfig.weaponTypes.BLACKHOLE]: 0,
  [GameConfig.weaponTypes.SNIPER]: 0,
  [GameConfig.weaponTypes.DRILL]: 0,
  [GameConfig.weaponTypes.FRAG]: 0,
  [GameConfig.weaponTypes.FREEZE]: 0,
  [GameConfig.weaponTypes.PLASMA]: 0,
  [GameConfig.weaponTypes.TESLA]: 0,
  [GameConfig.weaponTypes.WAVE]: 0,
  [GameConfig.weaponTypes.BOOMERANG]: 0,
  [GameConfig.weaponTypes.NOVA]: 0,
  [GameConfig.weaponTypes.COMET]: 0,
  [GameConfig.weaponTypes.VORTEX]: 0,
  [GameConfig.weaponTypes.RAILGUN]: 0,
  [GameConfig.weaponTypes.CLUSTER]: 0,
  [GameConfig.weaponTypes.CHAIN]: 0,
  [GameConfig.weaponTypes.FLAME]: 0,
  [GameConfig.weaponTypes.ORBIT]: 0,
  [GameConfig.weaponTypes.RICOCHET]: 0,
  [GameConfig.weaponTypes.PIERCE]: 0,
  [GameConfig.weaponTypes.SHOCKWAVE]: 0,
  [GameConfig.weaponTypes.PHOTON]: 0,
  [GameConfig.weaponTypes.FIRE_STORM]: 0,
  [GameConfig.weaponTypes.ICE_ARROW]: 0,
  [GameConfig.weaponTypes.THUNDER_VOLT]: 0,
  [GameConfig.weaponTypes.MAGMA]: 0,
  [GameConfig.weaponTypes.CYCLONE]: 0,
  [GameConfig.weaponTypes.EARTH_QUAKE]: 0,
  [GameConfig.weaponTypes.WATER_DRAGON]: 0,
  [GameConfig.weaponTypes.SAND_STORM]: 0,
  [GameConfig.weaponTypes.POISON_MIST]: 0,
  [GameConfig.weaponTypes.MOON_LIGHT]: 0,
  [GameConfig.weaponTypes.ION_CANNON]: 0,
  [GameConfig.weaponTypes.ANTIMATTER]: 0,
  [GameConfig.weaponTypes.NANO_SWARM]: 0,
  [GameConfig.weaponTypes.QUANTUM]: 0,
  [GameConfig.weaponTypes.PHASE_BEAM]: 0,
  [GameConfig.weaponTypes.SUPERNOVA]: 0,
  [GameConfig.weaponTypes.GAMMA_RAY]: 0,
  [GameConfig.weaponTypes.GRAVITY_WAVE]: 0,
  [GameConfig.weaponTypes.DARK_MATTER]: 0,
  [GameConfig.weaponTypes.SINGULARITY]: 0,
  [GameConfig.weaponTypes.MJOLNIR]: 0,
  [GameConfig.weaponTypes.SUN_ARROW]: 0,
  [GameConfig.weaponTypes.HADES]: 0,
  [GameConfig.weaponTypes.DRAGON_BREATH]: 0,
  [GameConfig.weaponTypes.PHOENIX_FEATHER]: 0,
  [GameConfig.weaponTypes.DIVINE_PUNISH]: 0,
  [GameConfig.weaponTypes.ORACLE]: 0,
  [GameConfig.weaponTypes.CHAOS_BALL]: 0,
  [GameConfig.weaponTypes.GENESIS]: 0,
  [GameConfig.weaponTypes.APOCALYPSE]: 0,
  [GameConfig.weaponTypes.GATLING]: 0,
  [GameConfig.weaponTypes.MORTAR]: 0,
  [GameConfig.weaponTypes.SHOTGUN]: 0,
  [GameConfig.weaponTypes.ARMOR_PIERCE]: 0,
  [GameConfig.weaponTypes.INCENDIARY]: 0,
  [GameConfig.weaponTypes.CRYO_BLAST]: 0,
  [GameConfig.weaponTypes.EMP_BURST]: 0,
  [GameConfig.weaponTypes.CRUISE_MISSILE]: 0,
  [GameConfig.weaponTypes.AIR_BURST]: 0,
  [GameConfig.weaponTypes.PROXY_MINE]: 0,
  [GameConfig.weaponTypes.SWORD_QI]: 0,
  [GameConfig.weaponTypes.SLASH_WAVE]: 0,
  [GameConfig.weaponTypes.WHIRLWIND]: 0,
  [GameConfig.weaponTypes.THRUST]: 0,
  [GameConfig.weaponTypes.SWEEP]: 0,
  [GameConfig.weaponTypes.SKY_REND]: 0,
  [GameConfig.weaponTypes.JUDGEMENT]: 0,
  [GameConfig.weaponTypes.ARMY_BREAKER]: 0,
  [GameConfig.weaponTypes.ANNIHILATE]: 0,
  [GameConfig.weaponTypes.VERDICT]: 0,
  [GameConfig.weaponTypes.ULTRASONIC]: 0,
  [GameConfig.weaponTypes.INFRASONIC]: 0,
  [GameConfig.weaponTypes.TREMOR]: 0,
  [GameConfig.weaponTypes.RESONANCE]: 0,
  [GameConfig.weaponTypes.HARMONIC]: 0,
  [GameConfig.weaponTypes.ECHO_BLAST]: 0,
  [GameConfig.weaponTypes.PULSE_WAVE]: 0,
  [GameConfig.weaponTypes.SINE_WAVE]: 0,
  [GameConfig.weaponTypes.SQUARE_WAVE]: 0,
  [GameConfig.weaponTypes.TRIANGLE_WAVE]: 0,
  [GameConfig.weaponTypes.TELEPORT]: 0,
  [GameConfig.weaponTypes.SPACE_RIFT]: 0,
  [GameConfig.weaponTypes.DIMENSION]: 0,
  [GameConfig.weaponTypes.FOLD]: 0,
  [GameConfig.weaponTypes.WARP]: 0,
  [GameConfig.weaponTypes.WORMHOLE]: 0,
  [GameConfig.weaponTypes.PARALLEL]: 0,
  [GameConfig.weaponTypes.PHASE_INVERT]: 0,
  [GameConfig.weaponTypes.PHASE_SHIFT]: 0,
  [GameConfig.weaponTypes.HYPERSPACE]: 0,
  [GameConfig.weaponTypes.TIME_STOP]: 0,
  [GameConfig.weaponTypes.ACCELERATE]: 0,
  [GameConfig.weaponTypes.DECELERATE]: 0,
  [GameConfig.weaponTypes.REWIND]: 0,
  [GameConfig.weaponTypes.FUTURE]: 0,
  [GameConfig.weaponTypes.PAST]: 0,
  [GameConfig.weaponTypes.ETERNITY]: 0,
  [GameConfig.weaponTypes.MOMENT]: 0,
  [GameConfig.weaponTypes.TEMPORAL]: 0,
  [GameConfig.weaponTypes.CHRONOS]: 0,
  [GameConfig.weaponTypes.ENERGY_ORB]: 0,
  [GameConfig.weaponTypes.MANA_BOLT]: 0,
  [GameConfig.weaponTypes.AURA_BLAST]: 0,
  [GameConfig.weaponTypes.SOUL_FIRE]: 0,
  [GameConfig.weaponTypes.PSIONIC]: 0,
  [GameConfig.weaponTypes.PRIMAL]: 0,
  [GameConfig.weaponTypes.ESSENCE]: 0,
  [GameConfig.weaponTypes.SPIRIT]: 0,
  [GameConfig.weaponTypes.DIVINE_LIGHT]: 0,
  [GameConfig.weaponTypes.ETHER]: 0,
  [GameConfig.weaponTypes.DRONE]: 0,
  [GameConfig.weaponTypes.UAV]: 0,
  [GameConfig.weaponTypes.SWARM]: 0,
  [GameConfig.weaponTypes.INTERCEPTOR]: 0,
  [GameConfig.weaponTypes.GUARDIAN]: 0,
  [GameConfig.weaponTypes.SENTINEL]: 0,
  [GameConfig.weaponTypes.TURRET]: 0,
  [GameConfig.weaponTypes.SATELLITE]: 0,
  [GameConfig.weaponTypes.WINGMAN]: 0,
  [GameConfig.weaponTypes.CARRIER]: 0,
  [GameConfig.weaponTypes.NONE]: 0
};

// 武器伤害
const WEAPON_DAMAGE = {
  [GameConfig.weaponTypes.SINGLE]: 1,
  [GameConfig.weaponTypes.DOUBLE]: 1,
  [GameConfig.weaponTypes.SPREAD]: 1,
  [GameConfig.weaponTypes.LASER]: 3,
  [GameConfig.weaponTypes.OVERKILL]: 5,
  [GameConfig.weaponTypes.HOMING]: 2,
  [GameConfig.weaponTypes.MISSILE]: 3,
  [GameConfig.weaponTypes.PULSE]: 2,
  [GameConfig.weaponTypes.RAINBOW]: 1,
  [GameConfig.weaponTypes.BLACKHOLE]: 4,
  [GameConfig.weaponTypes.SNIPER]: 8,
  [GameConfig.weaponTypes.DRILL]: 3,
  [GameConfig.weaponTypes.FRAG]: 2,
  [GameConfig.weaponTypes.FREEZE]: 1,
  [GameConfig.weaponTypes.PLASMA]: 4,
  [GameConfig.weaponTypes.TESLA]: 3,
  [GameConfig.weaponTypes.WAVE]: 2,
  [GameConfig.weaponTypes.BOOMERANG]: 3,
  [GameConfig.weaponTypes.NOVA]: 2,
  [GameConfig.weaponTypes.COMET]: 7,
  [GameConfig.weaponTypes.VORTEX]: 2,
  [GameConfig.weaponTypes.RAILGUN]: 10,
  [GameConfig.weaponTypes.CLUSTER]: 2,
  [GameConfig.weaponTypes.CHAIN]: 3,
  [GameConfig.weaponTypes.FLAME]: 2,
  [GameConfig.weaponTypes.ORBIT]: 3,
  [GameConfig.weaponTypes.RICOCHET]: 2,
  [GameConfig.weaponTypes.PIERCE]: 5,
  [GameConfig.weaponTypes.SHOCKWAVE]: 3,
  [GameConfig.weaponTypes.PHOTON]: 1
};

// 武器描述
export const WEAPON_DESC = {
  [GameConfig.weaponTypes.SINGLE]: '精准单发',
  [GameConfig.weaponTypes.DOUBLE]: '双枪齐射',
  [GameConfig.weaponTypes.SPREAD]: '三向散射',
  [GameConfig.weaponTypes.LASER]: '高能激光',
  [GameConfig.weaponTypes.OVERKILL]: '宇宙毁灭者',
  [GameConfig.weaponTypes.HOMING]: '智能追踪',
  [GameConfig.weaponTypes.MISSILE]: '穿透导弹',
  [GameConfig.weaponTypes.PULSE]: '脉冲冲击波',
  [GameConfig.weaponTypes.RAINBOW]: '彩虹弹幕',
  [GameConfig.weaponTypes.BLACKHOLE]: '黑洞引力',
  [GameConfig.weaponTypes.SNIPER]: '超远程狙击',
  [GameConfig.weaponTypes.DRILL]: '旋转钻头',
  [GameConfig.weaponTypes.FRAG]: '爆炸碎片',
  [GameConfig.weaponTypes.FREEZE]: '冰封光束',
  [GameConfig.weaponTypes.PLASMA]: '等离子洪流',
  [GameConfig.weaponTypes.TESLA]: '跃动高压电弧',
  [GameConfig.weaponTypes.WAVE]: '横向扩张震波',
  [GameConfig.weaponTypes.BOOMERANG]: '弧线往返切割',
  [GameConfig.weaponTypes.NOVA]: '五向星芒爆发',
  [GameConfig.weaponTypes.COMET]: '贯穿彗星核心',
  [GameConfig.weaponTypes.VORTEX]: '旋转飞散弹幕',
  [GameConfig.weaponTypes.RAILGUN]: '超高速电磁穿透',
  [GameConfig.weaponTypes.CLUSTER]: '命中后集束分裂',
  [GameConfig.weaponTypes.CHAIN]: '闪电链式跳跃',
  [GameConfig.weaponTypes.FLAME]: '宽幅烈焰穿透',
  [GameConfig.weaponTypes.ORBIT]: '环绕后高速飞出',
  [GameConfig.weaponTypes.RICOCHET]: '边缘反弹3次',
  [GameConfig.weaponTypes.PIERCE]: '超细贯穿射线',
  [GameConfig.weaponTypes.SHOCKWAVE]: '全屏横向冲击',
  [GameConfig.weaponTypes.PHOTON]: '光子连射风暴'
};

// ===== 武器火力配置表 (数据驱动，支持100+武器) =====
// pattern: single/dual/spread/burst/rain/ring/homing/blackhole/orbit
const WEAPON_FIRE = {
  // 元素系 (31-40)
  [GameConfig.weaponTypes.FIRE_STORM]: { type: 'ember', pattern: 'spread', count: 7, spread: 5, speed: 10, sound: 'scatterShoot', dmg: 3, name: '烈焰风暴', desc: '高温火焰弹幕' },
  [GameConfig.weaponTypes.ICE_ARROW]: { type: 'shard', pattern: 'single', speed: 16, sound: 'shoot', dmg: 5, name: '寒冰箭', desc: '低温贯穿箭矢', pierce: true },
  [GameConfig.weaponTypes.THUNDER_VOLT]: { type: 'bolt', pattern: 'single', speed: 14, sound: 'teslaShoot', dmg: 4, name: '雷霆', desc: '跳跃闪电弹', chain: true },
  [GameConfig.weaponTypes.MAGMA]: { type: 'ember', pattern: 'burst', count: 5, speed: 10, sound: 'scatterShoot', dmg: 3, name: '岩浆', desc: '连续熔岩弹' },
  [GameConfig.weaponTypes.CYCLONE]: { type: 'blade', pattern: 'spread', count: 5, spread: 4, speed: 9, sound: 'scatterShoot', dmg: 3, name: '龙卷风', desc: '旋转风刃弹幕' },
  [GameConfig.weaponTypes.EARTH_QUAKE]: { type: 'ring', pattern: 'single', speed: 6, sound: 'explosion', dmg: 5, name: '地震', desc: '全屏扩散震波' },
  [GameConfig.weaponTypes.WATER_DRAGON]: { type: 'lance', pattern: 'spread', count: 3, spread: 3, speed: 11, sound: 'doubleShoot', dmg: 2, name: '水龙', desc: '水龙卷弹幕' },
  [GameConfig.weaponTypes.SAND_STORM]: { type: 'shard', pattern: 'rain', count: 8, speed: 8, sound: 'scatterShoot', dmg: 2, name: '沙暴', desc: '漫天沙尘弹幕' },
  [GameConfig.weaponTypes.POISON_MIST]: { type: 'mist', pattern: 'spread', count: 6, spread: 3, speed: 6, sound: 'scatterShoot', dmg: 2, name: '毒雾', desc: '扩散毒雾云' },
  [GameConfig.weaponTypes.MOON_LIGHT]: { type: 'orb', pattern: 'beam', speed: 15, sound: 'laserShoot', dmg: 6, name: '月光', desc: '月光贯穿光束' },
  // 科技系 (41-50)
  [GameConfig.weaponTypes.ION_CANNON]: { type: 'beam', pattern: 'spread', count: 3, spread: 2, speed: 14, sound: 'laserShoot', dmg: 5, name: '离子炮', desc: '离子束散射' },
  [GameConfig.weaponTypes.ANTIMATTER]: { type: 'void', pattern: 'single', speed: 12, sound: 'explosion', dmg: 8, name: '反物质', desc: '湮灭一切物质', pierce: true },
  [GameConfig.weaponTypes.NANO_SWARM]: { type: 'spark', pattern: 'burst', count: 12, speed: 10, sound: 'scatterShoot', dmg: 1, name: '纳米蜂群', desc: '纳米机器连射' },
  [GameConfig.weaponTypes.QUANTUM]: { type: 'orb', pattern: 'dual', speed: 13, sound: 'doubleShoot', dmg: 4, name: '量子', desc: '量子纠缠双弹' },
  [GameConfig.weaponTypes.PHASE_BEAM]: { type: 'beam', pattern: 'burst', count: 3, speed: 16, sound: 'laserShoot', dmg: 5, name: '相位光束', desc: '相位穿透连射' },
  [GameConfig.weaponTypes.SUPERNOVA]: { type: 'ember', pattern: 'spread', count: 9, spread: 6, speed: 12, sound: 'novaShoot', dmg: 4, name: '超新星', desc: '星爆溅射弹幕' },
  [GameConfig.weaponTypes.GAMMA_RAY]: { type: 'beam', pattern: 'single', speed: 20, sound: 'laserShoot', dmg: 10, name: '伽马射线', desc: '超高能射线', pierce: true },
  [GameConfig.weaponTypes.GRAVITY_WAVE]: { type: 'ring', pattern: 'burst', count: 3, speed: 7, sound: 'pulseShoot', dmg: 4, name: '引力波', desc: '连续引力波纹' },
  [GameConfig.weaponTypes.DARK_MATTER]: { type: 'void', pattern: 'spread', count: 5, spread: 4, speed: 8, sound: 'scatterShoot', dmg: 4, name: '暗物质', desc: '暗物质扩散弹' },
  [GameConfig.weaponTypes.SINGULARITY]: { type: 'void', pattern: 'blackhole', speed: 0, sound: 'laserShoot', dmg: 6, name: '奇点', desc: '微型黑洞引力场' },
  // 神话系 (51-60)
  [GameConfig.weaponTypes.MJOLNIR]: { type: 'bolt', pattern: 'rain', count: 4, speed: 12, sound: 'teslaShoot', dmg: 5, name: '雷神之锤', desc: '天降雷击' },
  [GameConfig.weaponTypes.SUN_ARROW]: { type: 'lance', pattern: 'single', speed: 18, sound: 'laserShoot', dmg: 8, name: '太阳箭', desc: '灼热贯穿箭', pierce: true },
  [GameConfig.weaponTypes.HADES]: { type: 'ember', pattern: 'spread', count: 9, spread: 5, speed: 10, sound: 'scatterShoot', dmg: 3, name: '冥王', desc: '地狱烈焰弹幕' },
  [GameConfig.weaponTypes.DRAGON_BREATH]: { type: 'flame', pattern: 'spread', count: 5, spread: 3, speed: 9, sound: 'scatterShoot', dmg: 3, name: '龙息', desc: '龙焰贯穿火浪' },
  [GameConfig.weaponTypes.PHOENIX_FEATHER]: { type: 'ember', pattern: 'orbit', count: 6, speed: 8, sound: 'doubleShoot', dmg: 3, name: '凤凰羽', desc: '环绕烈焰羽' },
  [GameConfig.weaponTypes.DIVINE_PUNISH]: { type: 'beam', pattern: 'rain', count: 3, speed: 14, sound: 'laserShoot', dmg: 7, name: '天罚', desc: '天降光柱' },
  [GameConfig.weaponTypes.ORACLE]: { type: 'orb', pattern: 'homing', count: 3, speed: 10, sound: 'doubleShoot', dmg: 4, name: '神谕', desc: '追踪灵光弹' },
  [GameConfig.weaponTypes.CHAOS_BALL]: { type: 'void', pattern: 'spread', count: 7, spread: 5, speed: 8, sound: 'scatterShoot', dmg: 4, name: '混沌球', desc: '混沌扩散虚弹' },
  [GameConfig.weaponTypes.GENESIS]: { type: 'orb', pattern: 'burst', count: 5, speed: 12, sound: 'novaShoot', dmg: 5, name: '创世', desc: '创世之光连射' },
  [GameConfig.weaponTypes.APOCALYPSE]: { type: 'void', pattern: 'rain', count: 5, speed: 10, sound: 'explosion', dmg: 6, name: '天启', desc: '末日虚空弹幕' },
  // 机械系 (61-70)
  [GameConfig.weaponTypes.GATLING]: { type: 'lance', pattern: 'burst', count: 8, speed: 14, sound: 'shoot', dmg: 2, name: '加特林', desc: '高速弹幕连射' },
  [GameConfig.weaponTypes.MORTAR]: { type: 'ember', pattern: 'rain', count: 3, speed: 8, sound: 'explosion', dmg: 6, name: '迫击炮', desc: '抛物线轰炸' },
  [GameConfig.weaponTypes.SHOTGUN]: { type: 'ember', pattern: 'spread', count: 8, spread: 6, speed: 10, sound: 'scatterShoot', dmg: 2, name: '霰弹枪', desc: '近距离散射' },
  [GameConfig.weaponTypes.ARMOR_PIERCE]: { type: 'lance', pattern: 'single', speed: 18, sound: 'shoot', dmg: 7, name: '穿甲弹', desc: '高穿透狙击弹', pierce: true },
  [GameConfig.weaponTypes.INCENDIARY]: { type: 'ember', pattern: 'spread', count: 5, spread: 4, speed: 10, sound: 'scatterShoot', dmg: 3, name: '燃烧弹', desc: '燃烧扩散弹' },
  [GameConfig.weaponTypes.CRYO_BLAST]: { type: 'shard', pattern: 'spread', count: 5, spread: 4, speed: 11, sound: 'scatterShoot', dmg: 3, name: '急冻', desc: '冰晶碎片弹幕' },
  [GameConfig.weaponTypes.EMP_BURST]: { type: 'ring', pattern: 'single', speed: 7, sound: 'pulseShoot', dmg: 5, name: '电磁脉冲', desc: '电磁扩散波纹' },
  [GameConfig.weaponTypes.CRUISE_MISSILE]: { type: 'missile', pattern: 'homing', speed: 8, sound: 'scatterShoot', dmg: 6, name: '巡航导弹', desc: '追踪导弹' },
  [GameConfig.weaponTypes.AIR_BURST]: { type: 'frag', pattern: 'spread', count: 9, spread: 6, speed: 10, sound: 'explosion', dmg: 3, name: '空爆', desc: '空爆碎片弹幕' },
  [GameConfig.weaponTypes.PROXY_MINE]: { type: 'orb', pattern: 'ring', count: 4, speed: 6, sound: 'doubleShoot', dmg: 4, name: '感应雷', desc: '环形雷场' },
  // 近战系 (71-80)
  [GameConfig.weaponTypes.SWORD_QI]: { type: 'blade', pattern: 'single', speed: 14, sound: 'shoot', dmg: 5, name: '剑气', desc: '凌厉剑气', pierce: true },
  [GameConfig.weaponTypes.SLASH_WAVE]: { type: 'blade', pattern: 'spread', count: 3, spread: 3, speed: 12, sound: 'scatterShoot', dmg: 4, name: '斩波', desc: '三连斩波' },
  [GameConfig.weaponTypes.WHIRLWIND]: { type: 'blade', pattern: 'spread', count: 6, spread: 5, speed: 9, sound: 'scatterShoot', dmg: 3, name: '旋风', desc: '旋风斩击' },
  [GameConfig.weaponTypes.THRUST]: { type: 'lance', pattern: 'single', speed: 20, sound: 'laserShoot', dmg: 9, name: '穿刺', desc: '极限穿刺一击', pierce: true },
  [GameConfig.weaponTypes.SWEEP]: { type: 'blade', pattern: 'spread', count: 3, spread: 4, speed: 10, sound: 'scatterShoot', dmg: 4, name: '横扫', desc: '横扫千军' },
  [GameConfig.weaponTypes.SKY_REND]: { type: 'blade', pattern: 'beam', speed: 16, sound: 'laserShoot', dmg: 7, name: '裂空', desc: '裂空斩击光束', pierce: true },
  [GameConfig.weaponTypes.JUDGEMENT]: { type: 'blade', pattern: 'rain', count: 5, speed: 12, sound: 'novaShoot', dmg: 5, name: '裁决', desc: '天降裁决之刃' },
  [GameConfig.weaponTypes.ARMY_BREAKER]: { type: 'blade', pattern: 'spread', count: 7, spread: 5, speed: 11, sound: 'scatterShoot', dmg: 4, name: '破军', desc: '破军斩击弹幕' },
  [GameConfig.weaponTypes.ANNIHILATE]: { type: 'blade', pattern: 'burst', count: 10, speed: 12, sound: 'scatterShoot', dmg: 3, name: '湮灭', desc: '湮灭连斩' },
  [GameConfig.weaponTypes.VERDICT]: { type: 'blade', pattern: 'spread', count: 5, spread: 4, speed: 14, sound: 'novaShoot', dmg: 5, name: '审判', desc: '审判之刃弹幕' },
  // 波动系 (81-90)
  [GameConfig.weaponTypes.ULTRASONIC]: { type: 'ring', pattern: 'single', speed: 8, sound: 'pulseShoot', dmg: 4, name: '超声波', desc: '高频振动波纹' },
  [GameConfig.weaponTypes.INFRASONIC]: { type: 'ring', pattern: 'burst', count: 3, speed: 5, sound: 'pulseShoot', dmg: 5, name: '次声波', desc: '低频连续震波' },
  [GameConfig.weaponTypes.TREMOR]: { type: 'ring', pattern: 'spread', count: 5, spread: 3, speed: 6, sound: 'explosion', dmg: 4, name: '震波', desc: '地震扩散波' },
  [GameConfig.weaponTypes.RESONANCE]: { type: 'ring', pattern: 'burst', count: 5, speed: 7, sound: 'pulseShoot', dmg: 3, name: '共振', desc: '连续共振波纹' },
  [GameConfig.weaponTypes.HARMONIC]: { type: 'ring', pattern: 'spread', count: 3, spread: 3, speed: 8, sound: 'pulseShoot', dmg: 4, name: '谐波', desc: '谐波扩散' },
  [GameConfig.weaponTypes.ECHO_BLAST]: { type: 'ring', pattern: 'burst', count: 4, speed: 7, sound: 'pulseShoot', dmg: 4, name: '回响', desc: '回响连续波纹' },
  [GameConfig.weaponTypes.PULSE_WAVE]: { type: 'ring', pattern: 'spread', count: 3, spread: 2, speed: 8, sound: 'pulseShoot', dmg: 4, name: '脉冲波', desc: '脉冲扩散波' },
  [GameConfig.weaponTypes.SINE_WAVE]: { type: 'bolt', pattern: 'spread', count: 4, spread: 3, speed: 10, sound: 'teslaShoot', dmg: 3, name: '正弦波', desc: '正弦闪电弹幕' },
  [GameConfig.weaponTypes.SQUARE_WAVE]: { type: 'bolt', pattern: 'spread', count: 4, spread: 4, speed: 10, sound: 'teslaShoot', dmg: 4, name: '方波', desc: '方波闪电弹幕' },
  [GameConfig.weaponTypes.TRIANGLE_WAVE]: { type: 'bolt', pattern: 'rain', count: 4, speed: 10, sound: 'teslaShoot', dmg: 3, name: '三角波', desc: '三角波闪电弹幕' },
  // 空间系 (91-100)
  [GameConfig.weaponTypes.TELEPORT]: { type: 'void', pattern: 'single', speed: 14, sound: 'laserShoot', dmg: 6, name: '瞬移', desc: '瞬移虚空弹' },
  [GameConfig.weaponTypes.SPACE_RIFT]: { type: 'void', pattern: 'spread', count: 5, spread: 4, speed: 8, sound: 'scatterShoot', dmg: 4, name: '空间裂隙', desc: '空间裂隙弹幕' },
  [GameConfig.weaponTypes.DIMENSION]: { type: 'void', pattern: 'dual', speed: 12, sound: 'doubleShoot', dmg: 5, name: '维度', desc: '维度交错双弹' },
  [GameConfig.weaponTypes.FOLD]: { type: 'void', pattern: 'beam', speed: 16, sound: 'laserShoot', dmg: 7, name: '折叠', desc: '空间折叠光束', pierce: true },
  [GameConfig.weaponTypes.WARP]: { type: 'void', pattern: 'burst', count: 6, speed: 10, sound: 'scatterShoot', dmg: 4, name: '曲速', desc: '曲速连续弹' },
  [GameConfig.weaponTypes.WORMHOLE]: { type: 'void', pattern: 'blackhole', speed: 0, sound: 'laserShoot', dmg: 5, name: '虫洞', desc: '微型虫洞引力场' },
  [GameConfig.weaponTypes.PARALLEL]: { type: 'void', pattern: 'dual', speed: 12, sound: 'doubleShoot', dmg: 5, name: '平行', desc: '平行世界双弹', spread: 8 },
  [GameConfig.weaponTypes.PHASE_INVERT]: { type: 'void', pattern: 'ring', count: 3, speed: 6, sound: 'pulseShoot', dmg: 4, name: '相位反转', desc: '相位反转波纹' },
  [GameConfig.weaponTypes.PHASE_SHIFT]: { type: 'void', pattern: 'spread', count: 5, spread: 3, speed: 8, sound: 'scatterShoot', dmg: 4, name: '相位移', desc: '相位移弹幕' },
  [GameConfig.weaponTypes.HYPERSPACE]: { type: 'void', pattern: 'rain', count: 6, speed: 10, sound: 'explosion', dmg: 5, name: '超空间', desc: '超空间弹幕' },
  // 时间系 (101-110)
  [GameConfig.weaponTypes.TIME_STOP]: { type: 'orb', pattern: 'ring', count: 3, speed: 5, sound: 'pulseShoot', dmg: 4, name: '时间停止', desc: '时停波纹' },
  [GameConfig.weaponTypes.ACCELERATE]: { type: 'lance', pattern: 'burst', count: 5, speed: 16, sound: 'shoot', dmg: 3, name: '加速', desc: '时间加速连射' },
  [GameConfig.weaponTypes.DECELERATE]: { type: 'orb', pattern: 'ring', count: 3, speed: 5, sound: 'pulseShoot', dmg: 4, name: '减速', desc: '时间减速波纹' },
  [GameConfig.weaponTypes.REWIND]: { type: 'orb', pattern: 'dual', speed: 12, sound: 'doubleShoot', dmg: 4, name: '回溯', desc: '时间回溯双弹' },
  [GameConfig.weaponTypes.FUTURE]: { type: 'lance', pattern: 'beam', speed: 18, sound: 'laserShoot', dmg: 7, name: '未来', desc: '未来之光', pierce: true },
  [GameConfig.weaponTypes.PAST]: { type: 'shard', pattern: 'rain', count: 4, speed: 10, sound: 'scatterShoot', dmg: 4, name: '过去', desc: '过去之影弹幕' },
  [GameConfig.weaponTypes.ETERNITY]: { type: 'orb', pattern: 'burst', count: 5, speed: 12, sound: 'novaShoot', dmg: 5, name: '永恒', desc: '永恒之光连射' },
  [GameConfig.weaponTypes.MOMENT]: { type: 'lance', pattern: 'single', speed: 22, sound: 'laserShoot', dmg: 10, name: '瞬间', desc: '瞬间一击', pierce: true },
  [GameConfig.weaponTypes.TEMPORAL]: { type: 'orb', pattern: 'dual', speed: 13, sound: 'doubleShoot', dmg: 5, name: '时空', desc: '时空交错双弹' },
  [GameConfig.weaponTypes.CHRONOS]: { type: 'orb', pattern: 'spread', count: 5, spread: 4, speed: 12, sound: 'novaShoot', dmg: 5, name: '柯罗诺斯', desc: '时间之神弹幕' },
  // 能量系 (111-120)
  [GameConfig.weaponTypes.ENERGY_ORB]: { type: 'orb', pattern: 'single', speed: 14, sound: 'shoot', dmg: 5, name: '能量球', desc: '纯净能量球' },
  [GameConfig.weaponTypes.MANA_BOLT]: { type: 'bolt', pattern: 'single', speed: 14, sound: 'teslaShoot', dmg: 5, name: '法力弹', desc: '法力闪电弹', chain: true },
  [GameConfig.weaponTypes.AURA_BLAST]: { type: 'orb', pattern: 'spread', count: 5, spread: 4, speed: 10, sound: 'scatterShoot', dmg: 4, name: '光环冲击', desc: '光环扩散弹幕' },
  [GameConfig.weaponTypes.SOUL_FIRE]: { type: 'ember', pattern: 'spread', count: 5, spread: 4, speed: 10, sound: 'scatterShoot', dmg: 4, name: '灵魂之火', desc: '灵魂烈焰弹幕' },
  [GameConfig.weaponTypes.PSIONIC]: { type: 'orb', pattern: 'spread', count: 3, spread: 3, speed: 12, sound: 'novaShoot', dmg: 5, name: '灵能', desc: '灵能冲击波' },
  [GameConfig.weaponTypes.PRIMAL]: { type: 'lance', pattern: 'spread', count: 5, spread: 4, speed: 11, sound: 'scatterShoot', dmg: 3, name: '原始', desc: '原始力量弹幕' },
  [GameConfig.weaponTypes.ESSENCE]: { type: 'orb', pattern: 'dual', speed: 13, sound: 'doubleShoot', dmg: 5, name: '精华', desc: '精华双弹' },
  [GameConfig.weaponTypes.SPIRIT]: { type: 'mist', pattern: 'single', speed: 8, sound: 'shoot', dmg: 4, name: '魂灵', desc: '魂灵之雾' },
  [GameConfig.weaponTypes.DIVINE_LIGHT]: { type: 'beam', pattern: 'single', speed: 16, sound: 'laserShoot', dmg: 7, name: '圣光', desc: '神圣光束', pierce: true },
  [GameConfig.weaponTypes.ETHER]: { type: 'mist', pattern: 'spread', count: 5, spread: 3, speed: 7, sound: 'scatterShoot', dmg: 3, name: '以太', desc: '以太迷雾' },
  // 召唤系 (121-130)
  [GameConfig.weaponTypes.DRONE]: { type: 'spark', pattern: 'homing', count: 2, speed: 8, sound: 'doubleShoot', dmg: 3, name: '无人机', desc: '追踪无人机群' },
  [GameConfig.weaponTypes.UAV]: { type: 'spark', pattern: 'homing', count: 3, speed: 9, sound: 'doubleShoot', dmg: 3, name: '侦察机', desc: '追踪侦察机群' },
  [GameConfig.weaponTypes.SWARM]: { type: 'spark', pattern: 'burst', count: 12, speed: 10, sound: 'scatterShoot', dmg: 1, name: '蜂群', desc: '蜂群连射弹幕' },
  [GameConfig.weaponTypes.INTERCEPTOR]: { type: 'spark', pattern: 'dual', speed: 12, sound: 'doubleShoot', dmg: 4, name: '拦截机', desc: '拦截双弹' },
  [GameConfig.weaponTypes.GUARDIAN]: { type: 'orb', pattern: 'orbit', count: 4, speed: 7, sound: 'doubleShoot', dmg: 4, name: '守护者', desc: '环绕守护弹' },
  [GameConfig.weaponTypes.SENTINEL]: { type: 'beam', pattern: 'single', speed: 14, sound: 'laserShoot', dmg: 6, name: '哨兵', desc: '哨兵光束', pierce: true },
  [GameConfig.weaponTypes.TURRET]: { type: 'lance', pattern: 'burst', count: 5, speed: 14, sound: 'shoot', dmg: 3, name: '炮塔', desc: '炮塔连射系统' },
  [GameConfig.weaponTypes.SATELLITE]: { type: 'beam', pattern: 'rain', count: 3, speed: 12, sound: 'laserShoot', dmg: 6, name: '卫星', desc: '卫星轨道炮' },
  [GameConfig.weaponTypes.WINGMAN]: { type: 'spark', pattern: 'dual', speed: 12, sound: 'doubleShoot', dmg: 4, name: '僚机', desc: '僚机双弹支援' },
  [GameConfig.weaponTypes.CARRIER]: { type: 'spark', pattern: 'rain', count: 6, speed: 10, sound: 'scatterShoot', dmg: 3, name: '航母', desc: '航母弹幕支援' }
};

export class WeaponSystem {
  constructor(player, soundManager) {
    this.player = player;
    this.soundManager = soundManager;
    this.currentWeapon = GameConfig.weaponTypes.SINGLE;
    this.ammo = 99;
    this.fireRate = GameConfig.player.fireRate;
    this.fireCooldown = 0;
    this.lastFireTime = 0;
    this.upgradeHistory = [];
    this.totalWeaponsUsed = 0;
    
    // 射速增益
    this.rapidTimer = 0;
    this.rapidMultiplier = 1;
    
    // 黑洞武器状态
    this.blackholeActive = false;
    this.blackholeTarget = null;
    this.blackholeEnemies = [];

    // 延迟发射武器的帧计数状态
    this.pendingPulseCount = 0;
    this.pendingPulseTimer = 0;
    this.pendingPulseInterval = 3;

    this.pendingDrillCount = 0;
    this.pendingDrillTimer = 0;
    this.pendingDrillInterval = 2;

    this.pendingFragGroup = 0;
    this.pendingFragTimer = 0;
    this.pendingFragInterval = 6;

    this.pendingPlasmaCount = 0;
    this.pendingPlasmaTimer = 0;
    this.pendingPlasmaInterval = 9;

    this.pendingVortexCount = 0;
    this.pendingVortexTimer = 0;
    this.pendingVortexInterval = 2;
  }

  getCurrentWeapon() {
    return this.currentWeapon;
  }

  getAmmo() {
    return this.ammo;
  }

  applyRapid(multiplier, frames) {
    this.rapidMultiplier = multiplier;
    this.rapidTimer = frames;
  }

  addAmmo(amount) {
    this.ammo = Math.min(99, this.ammo + amount);
  }

  upgrade(weaponType) {
    const next = UPGRADE_PATH[this.currentWeapon];
    if (next && next !== this.currentWeapon) {
      this.currentWeapon = next;
      this.upgradeHistory.push(this.currentWeapon);
      this.totalWeaponsUsed++;
      return true;
    }
    return false;
  }

  setWeapon(type) {
    if (AMMO_COST[type] > 0 && this.ammo <= 0) {
      const prev = this._getPreviousWeapon();
      if (prev) {
        this.currentWeapon = prev;
        this.ammo = 99;
      } else {
        this.currentWeapon = GameConfig.weaponTypes.SINGLE;
      }
      return false;
    }
    this.currentWeapon = type;
    if (type === GameConfig.weaponTypes.BLACKHOLE) {
      this.blackholeActive = true;
    }
    return true;
  }

  peekNextWeapon() {
    return UPGRADE_PATH[this.currentWeapon] || null;
  }

  _getPreviousWeapon() {
    const entries = Object.entries(UPGRADE_PATH);
    for (const [k, v] of entries) {
      if (v === this.currentWeapon && parseInt(k) !== this.currentWeapon) {
        return parseInt(k);
      }
    }
    return null;
  }

  fire(game, deltaTime) {
    const now = Date.now();
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
      return;
    }

    this.lastFireTime = now;
    const rate = Math.max(4, Math.round(this.fireRate * this.rapidMultiplier));
    this.fireCooldown = rate;

    let cost = AMMO_COST[this.currentWeapon] || 0;
    if (cost > 0 && this.ammo < cost) {
      const prev = this._getPreviousWeapon();
      if (prev) {
        this.currentWeapon = prev;
        this.ammo = 99;
      } else {
        this.currentWeapon = GameConfig.weaponTypes.SINGLE;
      }
      cost = 0;
    }
    this.ammo -= cost;

    const playerX = this.player.x;
    const playerY = this.player.y - 20;
    const bulletSpeed = 12;

    switch (this.currentWeapon) {
      case GameConfig.weaponTypes.SINGLE:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed, 'lance');
        if (this.soundManager) this.soundManager.play('shoot');
        break;

      case GameConfig.weaponTypes.DOUBLE:
        game.addPlayerBullet(playerX - 10, playerY, -.35, -bulletSpeed, 'twin', '#62E8FF');
        game.addPlayerBullet(playerX + 10, playerY, .35, -bulletSpeed, 'twin', '#B58CFF');
        if (this.soundManager) this.soundManager.play('doubleShoot');
        break;

      case GameConfig.weaponTypes.SPREAD:
        for (let i = -2; i <= 2; i++) {
          game.addPlayerBullet(playerX, playerY, i * 2.5, -bulletSpeed, 'spread', i === 0 ? '#FFFFFF' : '#FF78BE');
        }
        if (this.soundManager) this.soundManager.play('scatterShoot');
        break;

      case GameConfig.weaponTypes.LASER:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 1.5, 'laser');
        if (this.soundManager) this.soundManager.play('laserShoot');
        break;

      case GameConfig.weaponTypes.OVERKILL:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 1.5, 'overkill');
        if (this.soundManager) this.soundManager.play('scatterShoot');
        break;

      case GameConfig.weaponTypes.HOMING:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed, 'homing');
        if (this.soundManager) this.soundManager.play('doubleShoot');
        break;

      case GameConfig.weaponTypes.MISSILE:
        game.addPlayerBullet(playerX - 8, playerY, 0, -bulletSpeed, 'missile');
        game.addPlayerBullet(playerX + 8, playerY, 0, -bulletSpeed, 'missile');
        if (this.soundManager) this.soundManager.play('scatterShoot');
        break;

      case GameConfig.weaponTypes.PULSE:
        this.pendingPulseCount = 5;
        this.pendingPulseTimer = 0;
        this.pendingPulseInterval = 3;
        if (this.soundManager) this.soundManager.play('laserShoot');
        break;

      case GameConfig.weaponTypes.RAINBOW:
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FF00', '#0000FF', '#9400D3'];
        for (let i = 0; i < 7; i++) {
          game.addPlayerBullet(playerX, playerY, Math.cos(i * Math.PI / 6) * 3, -bulletSpeed, 'rainbow', colors[i]);
        }
        if (this.soundManager) this.soundManager.play('scatterShoot');
        break;

      case GameConfig.weaponTypes.BLACKHOLE:
        game.addBlackhole(playerX, playerY, 250, 5000, () => {
          this.endBlackhole(game);
        });
        if (this.soundManager) this.soundManager.play('laserShoot');
        break;

      case GameConfig.weaponTypes.SNIPER:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 2, 'sniper');
        if (this.soundManager) this.soundManager.play('laserShoot');
        break;

      case GameConfig.weaponTypes.DRILL:
        this.pendingDrillCount = 12;
        this.pendingDrillTimer = 0;
        this.pendingDrillInterval = 2;
        if (this.soundManager) this.soundManager.play('scatterShoot');
        break;

      case GameConfig.weaponTypes.FRAG:
        this.pendingFragGroup = 0;
        this.pendingFragTimer = 0;
        this.pendingFragInterval = 6;
        if (this.soundManager) this.soundManager.play('explosion');
        break;

      case GameConfig.weaponTypes.FREEZE:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed, 'freeze');
        if (this.soundManager) this.soundManager.play('laserShoot');
        break;

      case GameConfig.weaponTypes.PLASMA:
        this.pendingPlasmaCount = 8;
        this.pendingPlasmaTimer = 0;
        this.pendingPlasmaInterval = 9;
        if (this.soundManager) this.soundManager.play('scatterShoot');
        break;

      case GameConfig.weaponTypes.TESLA:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 1.05, 'tesla');
        if (this.soundManager) this.soundManager.play('teslaShoot');
        break;

      case GameConfig.weaponTypes.WAVE:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * .8, 'wave');
        if (this.soundManager) this.soundManager.play('pulseShoot');
        break;

      case GameConfig.weaponTypes.BOOMERANG:
        game.addPlayerBullet(playerX - 12, playerY, -3.8, -bulletSpeed * .85, 'boomerang', '#FFB45C');
        game.addPlayerBullet(playerX + 12, playerY, 3.8, -bulletSpeed * .85, 'boomerang', '#FF78BE');
        if (this.soundManager) this.soundManager.play('boomerangShoot');
        break;

      case GameConfig.weaponTypes.NOVA:
        for (let i = -2; i <= 2; i++) {
          game.addPlayerBullet(playerX, playerY, i * 2.8, -bulletSpeed * (1 - Math.abs(i) * .06), 'nova');
        }
        if (this.soundManager) this.soundManager.play('novaShoot');
        break;

      case GameConfig.weaponTypes.COMET:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 1.35, 'comet');
        if (this.soundManager) this.soundManager.play('cometShoot');
        break;

      case GameConfig.weaponTypes.VORTEX:
        this.pendingVortexCount = 8;
        this.pendingVortexTimer = 0;
        this.pendingVortexInterval = 2;
        if (this.soundManager) this.soundManager.play('scatterShoot');
        break;

      case GameConfig.weaponTypes.RAILGUN:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 2.2, 'railgun');
        if (this.soundManager) this.soundManager.play('laserShoot');
        break;

      case GameConfig.weaponTypes.CLUSTER:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 0.8, 'cluster');
        if (this.soundManager) this.soundManager.play('explosion');
        break;

      case GameConfig.weaponTypes.CHAIN:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed, 'chain');
        if (this.soundManager) this.soundManager.play('teslaShoot');
        break;

      case GameConfig.weaponTypes.FLAME:
        for (let i = -2; i <= 2; i++) {
          game.addPlayerBullet(playerX, playerY, i * 1.8, -bulletSpeed * 0.9, 'flame');
        }
        if (this.soundManager) this.soundManager.play('scatterShoot');
        break;

      case GameConfig.weaponTypes.ORBIT:
        for (let i = 0; i < 4; i++) {
          game.addPlayerBullet(playerX, playerY, (i - 1.5) * 2.5, -bulletSpeed * 0.4, 'orbit');
        }
        if (this.soundManager) this.soundManager.play('doubleShoot');
        break;

      case GameConfig.weaponTypes.RICOCHET:
        game.addPlayerBullet(playerX - 10, playerY, -2, -bulletSpeed, 'ricochet');
        game.addPlayerBullet(playerX + 10, playerY, 2, -bulletSpeed, 'ricochet');
        if (this.soundManager) this.soundManager.play('doubleShoot');
        break;

      case GameConfig.weaponTypes.PIERCE:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 2.5, 'pierce');
        if (this.soundManager) this.soundManager.play('laserShoot');
        break;

      case GameConfig.weaponTypes.SHOCKWAVE:
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed * 0.5, 'shockwave');
        if (this.soundManager) this.soundManager.play('pulseShoot');
        break;

      case GameConfig.weaponTypes.PHOTON:
        game.addPlayerBullet(playerX + (Math.random() - 0.5) * 16, playerY, (Math.random() - 0.5) * 1.5, -bulletSpeed * 1.8, 'photon');
        if (this.soundManager) this.soundManager.play('shoot');
        break;

      default:
        this._fireDataDriven(game, playerX, playerY, bulletSpeed);
        break;
    }
  }

  _fireDataDriven(game, playerX, playerY, bulletSpeed) {
    const cfg = WEAPON_FIRE[this.currentWeapon];
    if (!cfg) return;
    const { type, pattern, count = 1, spread = 3, speed = 12, sound, dmg, pierce, chain } = cfg;
    if (sound && this.soundManager) this.soundManager.play(sound);

    const fireBullet = (vx, vy, bt) => {
      const b = game.addPlayerBulletDataDriven(playerX, playerY, vx, vy, bt || type, dmg, pierce, chain);
      return b;
    };

    switch (pattern) {
      case 'single':
        fireBullet(0, -speed);
        break;
      case 'dual':
        fireBullet(-spread * 0.5, -speed);
        fireBullet(spread * 0.5, -speed);
        break;
      case 'spread':
        for (let i = 0; i < count; i++) {
          const offset = (i - (count - 1) / 2) * spread;
          fireBullet(offset * 0.5, -speed);
        }
        break;
      case 'burst':
        this._pendingBurst = { game, type, count, speed, dmg, pierce, chain, timer: 0, interval: 4 };
        break;
      case 'rain':
        for (let i = 0; i < count; i++) {
          fireBullet((Math.random() - 0.5) * spread * 2, -speed * (0.6 + Math.random() * 0.4));
        }
        break;
      case 'ring':
        fireBullet(0, -speed * 0.5, 'ring');
        break;
      case 'homing':
        game.addPlayerBullet(playerX, playerY, 0, -speed, 'homing');
        break;
      case 'blackhole':
        game.addBlackhole(playerX, playerY, 250, 5000, () => { this.endBlackhole(game); });
        break;
      case 'orbit':
        for (let i = 0; i < count; i++) {
          fireBullet((i - (count - 1) / 2) * 2.5, -speed * 0.4, 'orbit');
        }
        break;
      case 'beam':
        fireBullet(0, -speed * 1.5, 'beam');
        break;
    }
  }

  _processDelayedFires(game, deltaTime) {
    const playerX = this.player.x;
    const playerY = this.player.y - 20;
    const bulletSpeed = 12;

    // Pulse: 5 pulses spaced ~50ms apart
    if (this.pendingPulseCount > 0) {
      this.pendingPulseTimer++;
      if (this.pendingPulseTimer >= this.pendingPulseInterval) {
        this.pendingPulseTimer = 0;
        game.addPlayerBullet(playerX, playerY, 0, -bulletSpeed, 'pulse');
        this.pendingPulseCount--;
      }
    }

    // Drill: 12 drills spaced ~33ms apart
    if (this.pendingDrillCount > 0) {
      this.pendingDrillTimer++;
      if (this.pendingDrillTimer >= this.pendingDrillInterval) {
        this.pendingDrillTimer = 0;
        const i = 12 - this.pendingDrillCount;
        game.addPlayerBullet(playerX, playerY, Math.cos(i * Math.PI / 6) * 4, -bulletSpeed, 'drill');
        this.pendingDrillCount--;
      }
    }

    // Frag: 3 groups (-1, 0, +1), each group fires 3 bullets
    if (this.pendingFragGroup >= 0 && this.pendingFragGroup <= 2) {
      this.pendingFragTimer++;
      if (this.pendingFragTimer >= this.pendingFragInterval) {
        this.pendingFragTimer = 0;
        const groupIdx = this.pendingFragGroup - 1;
        for (let j = 0; j < 3; j++) {
          game.addPlayerBullet(playerX, playerY, groupIdx * 3 + j, -bulletSpeed, 'frag');
        }
        this.pendingFragGroup++;
      }
    }

    // Plasma: 8 bursts spaced ~150ms apart
    if (this.pendingPlasmaCount > 0) {
      this.pendingPlasmaTimer++;
      if (this.pendingPlasmaTimer >= this.pendingPlasmaInterval) {
        this.pendingPlasmaTimer = 0;
        const i = 8 - this.pendingPlasmaCount;
        game.addPlayerBullet(playerX, playerY, Math.sin(i * 0.8) * 5, -bulletSpeed, 'plasma');
        this.pendingPlasmaCount--;
      }
    }

    // Vortex: 8 bullets in spiral pattern
    if (this.pendingVortexCount > 0) {
      this.pendingVortexTimer++;
      if (this.pendingVortexTimer >= this.pendingVortexInterval) {
        this.pendingVortexTimer = 0;
        const i = 8 - this.pendingVortexCount;
        const angle = i * Math.PI / 4;
        const spd = 5;
        game.addPlayerBullet(playerX, playerY, Math.cos(angle) * spd, Math.sin(angle) * spd - bulletSpeed * 0.6, 'vortex');
        this.pendingVortexCount--;
      }
    }
  }

  activateBlackhole(game, x, y, duration = 5000, onEnd) {
    this.blackholeActive = true;
    this.blackholeTarget = null;
    this.blackholeEnemies = [];
    game.addBlackhole(x, y, 250, duration, onEnd);
  }

  endBlackhole(game) {
    this.blackholeActive = false;
    this.blackholeTarget = null;
    this.blackholeEnemies = [];
  }

  getWeaponName() {
    return WEAPON_NAMES[this.currentWeapon] || '未知';
  }

  getWeaponDesc() {
    return WEAPON_DESC[this.currentWeapon] || '';
  }

  getWeaponDamage() {
    return WEAPON_DAMAGE[this.currentWeapon] || (WEAPON_FIRE[this.currentWeapon] && WEAPON_FIRE[this.currentWeapon].dmg) || 1;
  }

  handleBurst(game, playerX, playerY) {
    if (!this._pendingBurst) return;
    const b = this._pendingBurst;
    b.timer++;
    if (b.timer >= b.interval && b.count > 0) {
      b.timer = 0;
      b.count--;
      game.addPlayerBulletDataDriven(playerX, playerY, 0, -b.speed, b.type, b.dmg, b.pierce, b.chain);
    }
    if (b.count <= 0) this._pendingBurst = null;
  }

  update(deltaTime) {
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
    }
    if (this.rapidTimer > 0) {
      this.rapidTimer--;
      if (this.rapidTimer <= 0) {
        this.rapidMultiplier = 1;
      }
    }
    // 处理burst模式延迟发射
    if (this._pendingBurst) {
      const player = this.player;
      this.handleBurst(player.game, player.x, player.y - 20);
    }
  }

  canFire() {
    return this.fireCooldown <= 0;
  }

  /**
   * 公共方法：供 Game 每帧调用以推进延迟发射（不受开火按键状态影响）
   */
  processDelayedFires(game) {
    this._processDelayedFires(game, 0);
  }
}