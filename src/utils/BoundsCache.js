/**
 * 缓存 bounding boxes 以避免 repeated calculation
 */
export class BoundsCache {
  constructor(getBoundsFn) {
    this.getBoundsFn = getBoundsFn;
    this.cache = null;
    this.lastUpdate = 0;
    this.updateThreshold = 10; // px 变化才更新 cache
  }

  invalidate() {
    this.cache = null;
  }

  getBounds() {
    if (!this.cache || Date.now() - this.lastUpdate > this.updateThreshold) {
      this.cache = this.getBoundsFn();
      this.lastUpdate = Date.now();
    }
    return this.cache;
  }
}