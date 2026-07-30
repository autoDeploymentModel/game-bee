/**
 * 输入处理系统
 */
export class InputHandler {
  constructor() {
    this.keys = {};
    this.keysJustPressed = {};
    this.mouseButtons = {};
    this.touchState = { left: false, right: false, up: false, down: false, fire: false };
    this.moveTouchId = null;
    this.touchActive = false;
    this.touchX = 0;
    this.touchY = 0;
    
    this.initKeyboard();
    this.initTouch();
    this.initMouse();
  }
  
  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.keysJustPressed[e.code] = true;
      }
      this.keys[e.code] = true;
      
      // 防止方向键滚动页面
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(e.code)) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  clearJustPressed() {
    this.keysJustPressed = {};
  }
  
  initMouse() {
    window.addEventListener('mousedown', (e) => {
      this.mouseButtons[e.button] = true;
    });
    
    window.addEventListener('mouseup', (e) => {
      this.mouseButtons[e.button] = false;
    });
  }
  
  initTouch() {
    const canvas = document.getElementById('gameCanvas');
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnFire = document.getElementById('btnFire');

    if (canvas) {
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.moveTouchId !== null) return;
        const touch = e.changedTouches[0];
        this.moveTouchId = touch.identifier;
        this.touchActive = true;
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
      }, { passive: false });

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = Array.from(e.changedTouches).find(item => item.identifier === this.moveTouchId);
        if (!touch) return;
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
      }, { passive: false });

      const stopMoving = (e) => {
        const touch = Array.from(e.changedTouches).find(item => item.identifier === this.moveTouchId);
        if (!touch) return;
        this.moveTouchId = null;
        this.touchActive = false;
      };

      canvas.addEventListener('touchend', stopMoving);
      canvas.addEventListener('touchcancel', stopMoving);
    }
    
    if (btnLeft) {
      btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.touchState.left = true;
        btnLeft.classList.add('active');
      });
      const releaseLeft = () => {
        this.touchState.left = false;
        btnLeft.classList.remove('active');
      };
      btnLeft.addEventListener('touchend', releaseLeft);
      btnLeft.addEventListener('touchcancel', releaseLeft);
    }
    
    if (btnRight) {
      btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.touchState.right = true;
        btnRight.classList.add('active');
      });
      const releaseRight = () => {
        this.touchState.right = false;
        btnRight.classList.remove('active');
      };
      btnRight.addEventListener('touchend', releaseRight);
      btnRight.addEventListener('touchcancel', releaseRight);
    }
    
    if (btnFire) {
      btnFire.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.touchState.fire = true;
        btnFire.classList.add('active');
      });
      const releaseFire = () => {
        this.touchState.fire = false;
        btnFire.classList.remove('active');
      };
      btnFire.addEventListener('touchend', releaseFire);
      btnFire.addEventListener('touchcancel', releaseFire);
    }
  }
  
  isLeft() {
    return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchState.left;
  }
  
  isRight() {
    return this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchState.right;
  }
  
  isFire() {
    return this.mouseButtons[0] || this.keys['KeyZ'] || this.keys['KeyX'] || this.keys['Space'] || this.touchState.fire;
  }

  isBomb() {
    return this.keys['KeyB'] || this.keys['KeyC'];
  }

  isDash() {
    return this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['ArrowUp'];
  }
  
  isUp() {
    return this.keys['ArrowUp'] || this.keys['KeyW'] || this.touchState.up;
  }
  
  isDown() {
    return this.keys['ArrowDown'] || this.keys['KeyS'] || this.touchState.down;
  }
  
  isEnter() {
    return this.keysJustPressed['Enter'];
  }
  
  isEscape() {
    return this.keysJustPressed['Escape'];
  }
}
