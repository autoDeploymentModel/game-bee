/**
 * 主入口文件
 */
import { Game } from './core/Game.js';
import { GameConfig } from './config/game.config.js';
import { Leaderboard } from './ui/Leaderboard.js';

// 等待DOM加载完成
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const menuOverlay = document.getElementById('menuOverlay');
  const startBtn = document.getElementById('startBtn');
  const helpBtn = document.getElementById('helpBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const helpOverlay = document.getElementById('helpOverlay');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const soundToggle = document.getElementById('soundToggle');
  const volumeControl = document.getElementById('volumeControl');
  const nameDialogOverlay = document.getElementById('nameDialogOverlay');
  const nameInput = document.getElementById('nameInput');
  const nameConfirmBtn = document.getElementById('nameConfirmBtn');
  const nameChangeBtn = document.getElementById('nameChangeBtn');
  const playerNameDisplay = document.getElementById('playerNameDisplay');
  const leaderboardContainer = document.getElementById('leaderboardContainer');
  
  // 创建游戏实例
  const game = new Game(canvas);

  // --- 名字系统 ---
  function showNameDialog() {
    if (nameDialogOverlay) {
      nameDialogOverlay.classList.remove('hidden');
      if (nameInput) {
        nameInput.value = '';
        nameInput.focus();
      }
    }
  }

  function hideNameDialog() {
    if (nameDialogOverlay) nameDialogOverlay.classList.add('hidden');
  }

  function updatePlayerNameUI() {
    const name = Leaderboard.getPlayerName();
    if (name && playerNameDisplay) {
      playerNameDisplay.textContent = '呼号：' + name;
      if (nameChangeBtn) nameChangeBtn.classList.remove('hidden');
    } else {
      if (playerNameDisplay) playerNameDisplay.textContent = '';
      if (nameChangeBtn) nameChangeBtn.classList.add('hidden');
    }
  }

  async function refreshLeaderboard() {
    if (leaderboardContainer) await Leaderboard.render(leaderboardContainer);
  }

  // 确认名字
  function confirmName() {
    if (!nameInput) return;
    const name = nameInput.value.trim();
    if (!name) return;
    Leaderboard.setPlayerName(name);
    hideNameDialog();
    updatePlayerNameUI();
    refreshLeaderboard();
  }

  if (nameConfirmBtn) {
    nameConfirmBtn.addEventListener('click', confirmName);
  }
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') confirmName();
    });
  }
  if (nameChangeBtn) {
    nameChangeBtn.addEventListener('click', () => {
      showNameDialog();
    });
  }

  // 首次进入：检查名字
  const existingName = Leaderboard.getPlayerName();
  if (!existingName) {
    showNameDialog();
  }
  updatePlayerNameUI();
  refreshLeaderboard();

  // 监听游戏结束 → 保存分数并刷新排行榜
  game.onGameOver = async (score, level) => {
    const name = Leaderboard.getPlayerName();
    if (name) {
      await Leaderboard.addScore(name, score, level);
      refreshLeaderboard();
    }
  };

  // 监听菜单显示（返回菜单时刷新排行榜）
  const menuObserver = new MutationObserver(() => {
    if (!menuOverlay.classList.contains('hidden')) {
      refreshLeaderboard();
    }
  });
  menuObserver.observe(menuOverlay, { attributes: true, attributeFilter: ['class'] });

  // --- 难度选择 ---
  let selectedDifficulty = 1; // 默认普通

  const diffButtons = document.querySelectorAll('.diff-btn');
  diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      diffButtons.forEach(b => b.classList.remove('diff-active'));
      btn.classList.add('diff-active');
      selectedDifficulty = parseInt(btn.dataset.diff, 10);
    });
  });
  
  // 游戏循环（锁定~60fps）
  let lastTime = 0;
  const targetFrameRate = 1000 / 60;
  const maxDelta = 1000; // 最大帧间隔（防止 Tab 切换后跳帧）

  function gameLoop(currentTime) {
    let deltaTime = currentTime - lastTime;
    
    if (deltaTime >= targetFrameRate) {
      // 限制最大 delta，避免切回标签页后瞬移
      if (deltaTime > maxDelta) {
        lastTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
      }
      lastTime = currentTime - (deltaTime % targetFrameRate);
      
      game.update(targetFrameRate);
      game.render();
      game.input.clearJustPressed();
      
      // 游戏返回菜单时显示菜单覆盖层
      if (game.state === 'menu' && menuOverlay.classList.contains('hidden')) {
        menuOverlay.classList.remove('hidden');
      }
    }
    
    requestAnimationFrame(gameLoop);
  }
  
  // 启动游戏循环
  requestAnimationFrame(gameLoop);
  
  // 按钮事件
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      game.soundManager.init();
      game.setDifficulty(selectedDifficulty);
      game.startGame();
      menuOverlay.classList.add('hidden');
    });
  }

  if (helpBtn && helpOverlay) {
    helpBtn.addEventListener('click', () => {
      menuOverlay.classList.add('hidden');
      helpOverlay.classList.remove('hidden');
    });
  }

  if (settingsBtn && settingsOverlay) {
    settingsBtn.addEventListener('click', () => {
      menuOverlay.classList.add('hidden');
      settingsOverlay.classList.remove('hidden');
    });
  }

  document.querySelectorAll('[data-close-overlay]').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = document.getElementById(btn.dataset.closeOverlay);
      if (overlay) overlay.classList.add('hidden');
      menuOverlay.classList.remove('hidden');
    });
  });

  if (soundToggle) {
    soundToggle.addEventListener('change', () => {
      if (soundToggle.checked) game.soundManager.enableSound();
      else game.soundManager.disableSound();
    });
  }

  if (volumeControl) {
    volumeControl.addEventListener('input', () => {
      game.soundManager.setVolume(Number(volumeControl.value) / 100);
    });
  }

  // 键盘快捷方式
  document.addEventListener('keydown', (e) => {
    // 菜单可见时 Enter 开始
    if (e.code === 'Enter' && !menuOverlay.classList.contains('hidden')) {
      game.soundManager.init();
      game.setDifficulty(selectedDifficulty);
      game.startGame();
      menuOverlay.classList.add('hidden');
    }
    // 暂停/继续与游戏内覆盖层由 Game 自身处理（ESC）
  });
});
