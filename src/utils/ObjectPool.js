/**
 * 对象池：减少垃圾收集开销
 * 重用 objects 而不是 creating new ones every frame
 */

class Pool {
  constructor(createFn, maxSize = 100) {
    this.pool = [];
    this.inUse = new Set();
    this.createFn = createFn;
    this.maxSize = maxSize;
  }

  acquire() {
    if (this.pool.length > 0) {
      const obj = this.pool.pop();
      this.inUse.add(obj);
      return obj;
    }
    // 未达到上限时动态创建
    if (this.inUse.size < this.maxSize) {
      const obj = this.createFn();
      this.inUse.add(obj);
      return obj;
    }
    return null;
  }

  release(obj) {
    if (obj && this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.pool.push(obj);
    }
  }

  getAllInUse() {
    return Array.from(this.inUse);
  }

  clear() {
    this.pool = [];
    this.inUse.clear();
  }

  get size() {
    return this.inUse.size;
  }

  get available() {
    return this.pool.length;
  }
}

export default Pool;