/**
 * 声音管理器
 * 优先使用加载的音频文件，fallback 到 Web Audio API 振荡器合成
 */
export class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.5;
    this.soundBuffers = {};
  }

  // 首次用户交互时初始化 AudioContext
  init() {
    if (this.audioContext && this.audioContext.state !== 'closed') return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new Ctx();
    } catch (e) {
      console.warn('Web Audio API not available', e);
    }
  }

  enableSound() {
    this.enabled = true;
  }

  disableSound() {
    this.enabled = false;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
  }

  play(soundName) {
    if (!this.enabled) return;
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    // 恢复因浏览器策略挂起的 AudioContext
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const buffer = this.soundBuffers[soundName];
    if (buffer) {
      this._playBuffer(buffer);
    } else {
      this._synthSound(soundName);
    }
  }

  _playBuffer(buffer) {
    if (!this.audioContext) return;
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      const gain = this.audioContext.createGain();
      gain.gain.value = this.volume;
      source.connect(gain);
      gain.connect(this.audioContext.destination);
      source.start(0);
    } catch (e) {
      console.warn('Failed to play buffer sound:', e);
    }
  }

  _synthSound(name) {
    if (!this.audioContext) return;
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      // 根据音效类型生成合成声音
      const now = this.audioContext.currentTime;
      const vol = this.volume;

      switch (name) {
        case 'shoot':
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
          gain.gain.setValueAtTime(vol * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        case 'doubleShoot':
          osc.type = 'square';
          osc.frequency.setValueAtTime(720, now);
          osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
          gain.gain.setValueAtTime(vol * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        case 'scatterShoot':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1000, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
          gain.gain.setValueAtTime(vol * 0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        case 'laserShoot':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
          gain.gain.setValueAtTime(vol * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        case 'explosion':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
          gain.gain.setValueAtTime(vol * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        case 'powerUp':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.exponentialRampToValueAtTime(1500, now + 0.15);
          gain.gain.setValueAtTime(vol * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        case 'teslaShoot':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(360, now);
          osc.frequency.exponentialRampToValueAtTime(1450, now + 0.12);
          gain.gain.setValueAtTime(vol * 0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.start(now);
          osc.stop(now + 0.14);
          break;
        case 'pulseShoot':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);
          gain.gain.setValueAtTime(vol * 0.32, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        case 'boomerangShoot':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(900, now);
          osc.frequency.exponentialRampToValueAtTime(420, now + 0.18);
          gain.gain.setValueAtTime(vol * 0.24, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        case 'novaShoot':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(480, now);
          osc.frequency.exponentialRampToValueAtTime(1250, now + 0.2);
          gain.gain.setValueAtTime(vol * 0.28, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
          osc.start(now);
          osc.stop(now + 0.24);
          break;
        case 'cometShoot':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(760, now + 0.28);
          gain.gain.setValueAtTime(vol * 0.34, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
          osc.start(now);
          osc.stop(now + 0.32);
          break;
        case 'enemyShoot':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
          gain.gain.setValueAtTime(vol * 0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        default:
          osc.type = 'square';
          osc.frequency.setValueAtTime(600, now);
          gain.gain.setValueAtTime(vol * 0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
      }
    } catch (e) {
      console.warn('Synth sound failed:', e);
    }
  }

  loadSound(name, url) {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => {
        this.soundBuffers[name] = buffer;
      })
      .catch(e => {
        console.warn(`Failed to load sound: ${url}`, e);
      });
  }

  unloadSound(name) {
    delete this.soundBuffers[name];
  }

  clearSounds() {
    this.soundBuffers = {};
  }
}
