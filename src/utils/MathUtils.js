/**
 * 数学工具函数
 */

/**
 * 快速碰撞检测（优化版本）
 */
export function isColliding(rect1, rect2) {
  return !(rect2.left > rect1.right ||
           rect2.right < rect1.left ||
           rect2.top > rect1.bottom ||
           rect2.bottom < rect1.top);
}

/**
 * 快速距离平方（避免 sqrt 计算）
 */
export function distanceSq(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return dx * dx + dy * dy;
}

/**
 * 距离计算
 */
export function distance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 角度计算
 */
export function angleBetween(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.atan2(dy, dx);
}

/**
 * 随机浮值
 */
export function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * 限制范围
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * 线性渐变
 */
export function linearGradient(start, end, current, total) {
  const ratio = current / total;
  return start + (end - start) * ratio;
}
