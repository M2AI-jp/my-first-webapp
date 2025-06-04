// =====================================
// ゲーム状態管理
// =====================================
class SugorokuGame {
  constructor() {
      this.players = {
          player: {
              position: 0,
              money: 1000,
              name: '🎮 プレイヤー',
              token: 'player-token',
              isHuman: true
          },
          cpu: {
              position: 0,
              money: 1000,
              name: '🤖 CPU',
              token: 'cpu-token',
              isHuman: false
          }
      };
      
      this.currentPlayer = 'player';
      this.gameEnded = false;
      this.autoMode = false;
      this.animating = false;
      
      // DOM要素の取得
      this.diceElement = document.getElementById('dice');
      this.diceButton = document.getElementById('dice-button');
      this.diceResult = document.getElementById('dice-result');
      this.currentTurnElement = document.getElementById('current-turn');
      this.logContent = document.getElementById('log-content');
      this.gameResult = document.getElementById('game-result');
      
      // マスのイベントデータ
      this.squareEvents = this.initializeSquareEvents();
      
      // イベントリスナーの設定
      this.setupEventListeners();
      
      // 初期表示の更新
      this.updateDisplay();
      this.addLog('ゲームを開始しました！', 'game-event');
  }
  
  // =====================================
  // マスイベントの初期化
  // =====================================
  initializeSquareEvents() {
      return {
          0: { name: '人生スタート', effect: 0, description: '元気よく出発！' },
          1: { name: '初めての歩行', effect: 200, description: 'パパママが喜んでお小遣い' },
          2: { name: '誕生日プレゼント', effect: 300, description: 'おじいちゃんからお年玉' },
          3: { name: '転んで大泣き', effect: -100, description: 'お菓子代がなくなった' },
          4: { name: 'サーカスを見に行く', effect: -150, description: '入場料がかかった' },
          5: { name: 'お手伝いでお小遣い', effect: 100, description: 'お母さんのお手伝い' },
          6: { name: '絵画コンクール', effect: 250, description: '賞金をもらった' },
          7: { name: '自転車の練習', effect: -50, description: '転んで絆創膏代' },
          8: { name: 'ゲーム機をねだる', effect: -200, description: 'お小遣いを前借り' },
          9: { name: '歯が抜けた', effect: 100, description: '歯の妖精からプレゼント' },
          10: { name: '小学校入学', effect: 500, description: '入学祝いをもらった' },
          11: { name: 'テストで満点', effect: 300, description: '頑張ったご褒美' },
          12: { name: '宿題を忘れる', effect: -100, description: '先生に怒られて反省' },
          13: { name: '運動会で1位', effect: 200, description: '賞品をもらった' },
          14: { name: '学芸会の主役', effect: 150, description: 'お疲れ様のお小遣い' },
          15: { name: '友達とケンカ', effect: -80, description: '仲直りのお菓子代' },
          16: { name: '漢字検定合格', effect: 400, description: 'お祝いをもらった' },
          17: { name: 'バレンタインデー', effect: -120, description: 'チョコを買った' },
          18: { name: '修学旅行', effect: -300, description: 'お土産代がかかった' },
          19: { name: '読書感想文コンクール', effect: 250, description: '図書券をもらった' },
          20: { name: '卒業式', effect: 600, description: '卒業祝いをもらった' },
          21: { name: '就職活動', effect: -800, description: 'スーツ代がかかった' },
          22: { name: '初出勤', effect: -500, description: '歓迎会で飲み会代' },
          23: { name: '初任給', effect: 1000, description: '念願の給料日' },
          24: { name: '遅刻してタクシー', effect: -300, description: '交通費がかかった' },
          25: { name: 'プロジェクト成功', effect: 800, description: 'ボーナスをもらった' },
          26: { name: '同僚の結婚式', effect: -600, description: 'ご祝儀を包んだ' },
          27: { name: '昇格', effect: 700, description: '昇格祝いをもらった' },
          28: { name: '忘年会', effect: -400, description: '飲み過ぎて散財' },
          29: { name: '資格取得', effect: 500, description: '資格手当がついた' },
          30: { name: '車を購入', effect: -1200, description: '頭金を支払った' },
          31: { name: '引っ越し', effect: -800, description: '引っ越し費用がかかった' },
          32: { name: '結婚', effect: 1500, description: '結婚祝いをもらった' },
          33: { name: '子供誕生', effect: -1000, description: '出産費用がかかった' },
          34: { name: '家電を買い替え', effect: -600, description: '冷蔵庫とテレビ購入' },
          35: { name: '家族旅行', effect: -900, description: '旅行費用がかかった' },
          36: { name: 'アイデア特許', effect: 1200, description: '特許料収入' },
          37: { name: 'MBA取得', effect: -1500, description: '学費がかかった' },
          38: { name: '優秀社員賞', effect: 800, description: '表彰金をもらった' },
          39: { name: '投資成功', effect: 2000, description: '株で大儲け' },
          40: { name: '人生完走！', effect: 1000, description: 'お疲れ様でした！' }
      };
  }
  
  // =====================================
  // イベントリスナーの設定
  // =====================================
  setupEventListeners() {
      this.diceButton.addEventListener('click', () => this.rollDice());
      
      document.getElementById('reset-button').addEventListener('click', () => this.resetGame());
      
      document.getElementById('auto-button').addEventListener('click', () => this.toggleAutoMode());
      
      document.getElementById('restart-button').addEventListener('click', () => this.restartGame());
      
      // サイコロクリックでも振れるように
      this.diceElement.addEventListener('click', () => {
          if (!this.diceButton.disabled && !this.animating) {
              this.rollDice();
          }
      });
      
      // キーボードショートカット
      document.addEventListener('keydown', (e) => {
          if (this.gameEnded) return;
          
          switch(e.key) {
              case ' ':
              case 'Enter':
                  e.preventDefault();
                  if (!this.diceButton.disabled && !this.animating) {
                      this.rollDice();
                  }
                  break;
              case 'r':
              case 'R':
                  if (e.ctrlKey) {
                      e.preventDefault();
                      this.resetGame();
                  }
                  break;
              case 'a':
              case 'A':
                  if (e.ctrlKey) {
                      e.preventDefault();
                      this.toggleAutoMode();
                  }
                  break;
          }
      });
  }
  
  // =====================================
  // サイコロを振る
  // =====================================
  async rollDice() {
      if (this.animating || this.gameEnded) return;
      
      this.animating = true;
      this.diceButton.disabled = true;
      
      // サイコロアニメーション
      this.diceElement.classList.add('rolling');
      this.diceResult.textContent = '振っています...';
      
      // アニメーション中のサイコロ表示
      const animationPromise = this.animateDiceRoll();
      
      // 1-6のランダムな値
      const diceValue = Math.floor(Math.random() * 6) + 1;
      
      await animationPromise;
      
      // 最終的なサイコロの値を表示
      this.displayDiceValue(diceValue);
      this.diceResult.textContent = `${diceValue} が出ました！`;
      
      const currentPlayerData = this.players[this.currentPlayer];
      this.addLog(`${currentPlayerData.name}が${diceValue}を出しました`, 
                 this.currentPlayer === 'player' ? 'player-action' : 'cpu-action');
      
      // プレイヤーを移動
      await this.movePlayer(this.currentPlayer, diceValue);
      
      // ゲーム終了チェック
      if (this.checkGameEnd()) {
          this.endGame();
          return;
      }
      
      // ターンを変更
      this.switchTurn();
      
      this.animating = false;
      
      // オートモードまたはCPUのターンの場合、自動で次のサイコロを振る
      if (this.autoMode || this.currentPlayer === 'cpu') {
          setTimeout(() => {
              if (!this.gameEnded) {
                  this.rollDice();
              }
          }, 1500);
      } else {
          this.diceButton.disabled = false;
      }
  }
  
  // =====================================
  // サイコロアニメーション
  // =====================================
  async animateDiceRoll() {
      const diceNumbers = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      const animationSteps = 20;
      const stepDuration = 50;
      
      for (let i = 0; i < animationSteps; i++) {
          const randomIndex = Math.floor(Math.random() * 6);
          this.diceElement.querySelector('.dice-face').textContent = diceNumbers[randomIndex];
          await this.delay(stepDuration);
      }
      
      this.diceElement.classList.remove('rolling');
  }
  
  // =====================================
  // サイコロの値を表示
  // =====================================
  displayDiceValue(value) {
      const diceDisplay = {
          1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅'
      };
      this.diceElement.querySelector('.dice-face').textContent = diceDisplay[value];
  }
  
  // =====================================
  // プレイヤーを移動
  // =====================================
  async movePlayer(playerType, steps) {
      const player = this.players[playerType];
      const startPosition = player.position;
      
      // 1マスずつ移動アニメーション
      for (let i = 1; i <= steps; i++) {
          await this.delay(300);
          const newPosition = Math.min(startPosition + i, 40);
          await this.movePlayerToPosition(playerType, newPosition);
      }
      
      const finalPosition = Math.min(startPosition + steps, 40);
      player.position = finalPosition;
      
      // マスのイベントを処理
      await this.processSquareEvent(playerType, finalPosition);
      
      this.updateDisplay();
  }
  
  // =====================================
  // プレイヤーを指定位置に移動
  // =====================================
  async movePlayerToPosition(playerType, position) {
      const player = this.players[playerType];
      const tokenClass = player.token;
      
      // 現在の位置からトークンを削除
      const currentTokens = document.querySelectorAll(`.${tokenClass}`);
      currentTokens.forEach(token => token.remove());
      
      // 新しい位置にトークンを追加
      const targetSquare = document.querySelector(`[data-position="${position}"] .player-tokens`);
      if (targetSquare) {
          const token = document.createElement('div');
          token.className = `token ${tokenClass}`;
          token.textContent = playerType === 'player' ? '🎮' : '🤖';
          token.classList.add('moving');
          targetSquare.appendChild(token);
          
          // マスをハイライト
          const square = document.querySelector(`[data-position="${position}"]`);
          square.classList.add('active');
          setTimeout(() => square.classList.remove('active'), 500);
      }
  }
  
  // =====================================
  // マスイベントの処理
  // =====================================
  async processSquareEvent(playerType, position) {
      const player = this.players[playerType];
      const event = this.squareEvents[position];
      
      if (!event) return;
      
      const oldMoney = player.money;
      player.money += event.effect;
      
      // マイナスの場合は0円を下回らないように
      if (player.money < 0) {
          player.money = 0;
      }
      
      // イベントログを追加
      let logMessage = `${player.name}が「${event.name}」に止まりました。`;
      if (event.effect > 0) {
          logMessage += ` +${event.effect}円`;
      } else if (event.effect < 0) {
          logMessage += ` ${event.effect}円`;
      }
      
      this.addLog(logMessage, 'game-event');
      
      // 所持金変更アニメーション
      if (event.effect !== 0) {
          const moneyElement = document.getElementById(`${playerType}-money`);
          moneyElement.classList.add('changing');
          setTimeout(() => moneyElement.classList.remove('changing'), 600);
      }
      
      // 位置情報を更新
      this.updatePositionDisplay(playerType, position);
  }
  
  // =====================================
  // 位置表示の更新
  // =====================================
  updatePositionDisplay(playerType, position) {
      const positionElement = document.getElementById(`${playerType}-position`);
      const event = this.squareEvents[position];
      
      if (position === 0) {
          positionElement.textContent = 'スタート';
      } else if (position === 40) {
          positionElement.textContent = 'ゴール';
      } else {
          positionElement.textContent = `${position}番目 (${event.name})`;
      }
  }
  
  // =====================================
  // ターン切り替え
  // =====================================
  switchTurn() {
      this.currentPlayer = this.currentPlayer === 'player' ? 'cpu' : 'player';
      this.updateTurnDisplay();
  }
  
  // =====================================
  // ターン表示の更新
  // =====================================
  updateTurnDisplay() {
      const playerData = this.players[this.currentPlayer];
      this.currentTurnElement.textContent = `${playerData.name}のターン`;
      
      if (this.currentPlayer === 'player' && !this.autoMode) {
          this.diceButton.disabled = false;
      }
  }
  
  // =====================================
  // 画面表示の更新
  // =====================================
  updateDisplay() {
      // 所持金の更新
      document.getElementById('player-money').textContent = this.players.player.money;
      document.getElementById('cpu-money').textContent = this.players.cpu.money;
      
      // 位置の更新
      this.updatePositionDisplay('player', this.players.player.position);
      this.updatePositionDisplay('cpu', this.players.cpu.position);
      
      // ターン表示の更新
      this.updateTurnDisplay();
  }
  
  // =====================================
  // ゲーム終了チェック
  // =====================================
  checkGameEnd() {
      return this.players.player.position >= 40 || this.players.cpu.position >= 40;
  }
  
  // =====================================
  // ゲーム終了
  // =====================================
  endGame() {
      this.gameEnded = true;
      this.diceButton.disabled = true;
      
      const playerMoney = this.players.player.money;
      const cpuMoney = this.players.cpu.money;
      
      // 最終スコアを表示
      document.getElementById('final-player-score').textContent = `${playerMoney}円`;
      document.getElementById('final-cpu-score').textContent = `${cpuMoney}円`;
      
      // 勝者を決定
      const winnerElement = document.getElementById('winner-announcement');
      let winnerMessage = '';
      let winnerClass = '';
      
      if (playerMoney > cpuMoney) {
          winnerMessage = '🎉 プレイヤーの勝利！ 🎉';
          winnerClass = 'player-wins';
          this.addLog('🎉 プレイヤーが勝利しました！', 'game-event');
      } else if (cpuMoney > playerMoney) {
          winnerMessage = '🤖 CPUの勝利！ 🤖';
          winnerClass = 'cpu-wins';
          this.addLog('🤖 CPUが勝利しました！', 'game-event');
      } else {
          winnerMessage = '🤝 引き分け！ 🤝';
          winnerClass = 'tie';
          this.addLog('🤝 引き分けです！', 'game-event');
      }
      
      winnerElement.textContent = winnerMessage;
      winnerElement.className = `winner-announcement ${winnerClass}`;
      
      // 結果画面を表示
      this.gameResult.style.display = 'flex';
      
      // 自動モードを停止
      this.autoMode = false;
      this.updateAutoButton();
      
      this.addLog('ゲームが終了しました。お疲れ様でした！', 'game-event');
  }
  
  // =====================================
  // オートモード切り替え
  // =====================================
  toggleAutoMode() {
      if (this.gameEnded) return;
      
      this.autoMode = !this.autoMode;
      this.updateAutoButton();
      
      if (this.autoMode) {
          this.addLog('オートモードが有効になりました', 'game-event');
          if (!this.animating) {
              setTimeout(() => this.rollDice(), 500);
          }
      } else {
          this.addLog('オートモードが無効になりました', 'game-event');
          if (this.currentPlayer === 'player') {
              this.diceButton.disabled = false;
          }
      }
  }
  
  // =====================================
  // オートボタンの更新
  // =====================================
  updateAutoButton() {
      const autoButton = document.getElementById('auto-button');
      autoButton.textContent = this.autoMode ? 'オート停止' : 'オート進行';
      autoButton.style.background = this.autoMode 
          ? 'linear-gradient(135deg, #e74c3c, #c0392b)' 
          : 'linear-gradient(135deg, #f39c12, #e67e22)';
  }
  
  // =====================================
  // ゲームリセット
  // =====================================
  resetGame() {
      // プレイヤー情報をリセット
      this.players.player = {
          position: 0,
          money: 1000,
          name: '🎮 プレイヤー',
          token: 'player-token',
          isHuman: true
      };
      
      this.players.cpu = {
          position: 0,
          money: 1000,
          name: '🤖 CPU',
          token: 'cpu-token',
          isHuman: false
      };
      
      // ゲーム状態をリセット
      this.currentPlayer = 'player';
      this.gameEnded = false;
      this.autoMode = false;
      this.animating = false;
      
      // トークンをスタート位置に移動
      this.resetTokenPositions();
      
      // 画面をリセット
      this.diceButton.disabled = false;
      this.diceResult.textContent = '準備完了';
      this.diceElement.querySelector('.dice-face').textContent = '🎲';
      this.gameResult.style.display = 'none';
      
      // ログをクリア
      this.logContent.innerHTML = '';
      
      // 表示を更新
      this.updateDisplay();
      this.updateAutoButton();
      
      this.addLog('ゲームをリセットしました', 'game-event');
  }
  
  // =====================================
  // トークン位置をリセット
  // =====================================
  resetTokenPositions() {
      // 全てのトークンを削除
      const allTokens = document.querySelectorAll('.token');
      allTokens.forEach(token => token.remove());
      
      // スタート位置にトークンを配置
      const startSquare = document.querySelector('[data-position="0"] .player-tokens');
      if (startSquare) {
          const playerToken = document.createElement('div');
          playerToken.className = 'token player-token';
          playerToken.textContent = '🎮';
          startSquare.appendChild(playerToken);
          
          const cpuToken = document.createElement('div');
          cpuToken.className = 'token cpu-token';
          cpuToken.textContent = '🤖';
          startSquare.appendChild(cpuToken);
      }
  }
  
  // =====================================
  // ゲーム再開
  // =====================================
  restartGame() {
      this.resetGame();
  }
  
  // =====================================
  // ログ追加
  // =====================================
  addLog(message, type = 'game-event') {
      const logEntry = document.createElement('div');
      logEntry.className = `log-entry ${type}`;
      logEntry.textContent = `${this.getCurrentTime()} ${message}`;
      
      this.logContent.appendChild(logEntry);
      this.logContent.scrollTop = this.logContent.scrollHeight;
      
      // ログ数を制限（最大50件）
      const logEntries = this.logContent.querySelectorAll('.log-entry');
      if (logEntries.length > 50) {
          logEntries[0].remove();
      }
  }
  
  // =====================================
  // 現在時刻を取得
  // =====================================
  getCurrentTime() {
      const now = new Date();
      return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
  }
  
  // =====================================
  // 遅延処理
  // =====================================
  delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // =====================================
  // デバッグ機能
  // =====================================
  debug() {
      console.log('=== ゲーム状態 ===');
      console.log('プレイヤー:', this.players.player);
      console.log('CPU:', this.players.cpu);
      console.log('現在のターン:', this.currentPlayer);
      console.log('ゲーム終了:', this.gameEnded);
      console.log('オートモード:', this.autoMode);
      console.log('アニメーション中:', this.animating);
  }
  
  // =====================================
  // チート機能（開発用）
  // =====================================
  cheat(playerType, position, money) {
      if (typeof position === 'number') {
          this.players[playerType].position = Math.max(0, Math.min(40, position));
          this.movePlayerToPosition(playerType, this.players[playerType].position);
      }
      
      if (typeof money === 'number') {
          this.players[playerType].money = Math.max(0, money);
      }
      
      this.updateDisplay();
      this.addLog(`チート機能: ${this.players[playerType].name}の状態を変更しました`, 'game-event');
  }
}

// =====================================
// ゲーム開始
// =====================================
let game;

// DOMが読み込まれたらゲームを開始
document.addEventListener('DOMContentLoaded', () => {
  game = new SugorokuGame();
  
  // グローバル関数として公開（デバッグ用）
  window.gameDebug = () => game.debug();
  window.gameCheat = (playerType, position, money) => game.cheat(playerType, position, money);
  
  console.log('🎮 人生すごろくゲームが開始されました！');
  console.log('デバッグ: gameDebug()');
  console.log('チート: gameCheat("player", 位置, 所持金)');
  console.log('キーボードショートカット:');
  console.log('  スペース/Enter: サイコロを振る');
  console.log('  Ctrl+R: リセット');
  console.log('  Ctrl+A: オートモード切り替え');
});

// =====================================
// 追加機能: ゲーム統計
// =====================================
class GameStats {
  constructor() {
      this.games = JSON.parse(localStorage.getItem('sugoroku-stats') || '[]');
  }
  
  addGame(playerMoney, cpuMoney, winner) {
      const gameData = {
          date: new Date().toISOString(),
          playerMoney,
          cpuMoney,
          winner,
          id: Date.now()
      };
      
      this.games.push(gameData);
      this.saveStats();
  }
  
  saveStats() {
      localStorage.setItem('sugoroku-stats', JSON.stringify(this.games));
  }
  
  getStats() {
      const playerWins = this.games.filter(g => g.winner === 'player').length;
      const cpuWins = this.games.filter(g => g.winner === 'cpu').length;
      const ties = this.games.filter(g => g.winner === 'tie').length;
      
      return {
          totalGames: this.games.length,
          playerWins,
          cpuWins,
          ties,
          playerWinRate: this.games.length > 0 ? (playerWins / this.games.length * 100).toFixed(1) : 0
      };
  }
  
  clearStats() {
      this.games = [];
      this.saveStats();
  }
}

// =====================================
// 音響効果（オプション）
// =====================================
class SoundManager {
  constructor() {
      this.enabled = true;
      this.volume = 0.3;
  }
  
  playDiceRoll() {
      if (!this.enabled) return;
      // Web Audio APIを使った簡単な音の生成
      this.playTone(220, 0.1);
  }
  
  playMovement() {
      if (!this.enabled) return;
      this.playTone(440, 0.05);
  }
  
  playGameEnd() {
      if (!this.enabled) return;
      // 勝利音のメロディー
      setTimeout(() => this.playTone(523, 0.2), 0);
      setTimeout(() => this.playTone(659, 0.2), 200);
      setTimeout(() => this.playTone(784, 0.4), 400);
  }
  
  playTone(frequency, duration) {
      try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
      } catch (e) {
          // 音の再生に失敗した場合は無視
      }
  }
  
  toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
  }
}

// =====================================
// パフォーマンス監視
// =====================================
class PerformanceMonitor {
  constructor() {
      this.metrics = {
          frameCount: 0,
          lastFrameTime: performance.now(),
          fps: 0
      };
      
      this.startMonitoring();
  }
  
  startMonitoring() {
      const updateFPS = () => {
          const now = performance.now();
          this.metrics.frameCount++;
          
          if (now - this.metrics.lastFrameTime >= 1000) {
              this.metrics.fps = this.metrics.frameCount;
              this.metrics.frameCount = 0;
              this.metrics.lastFrameTime = now;
          }
          
          requestAnimationFrame(updateFPS);
      };
      
      requestAnimationFrame(updateFPS);
  }
  
  getFPS() {
      return this.metrics.fps;
  }
}

// 統計とサウンドマネージャーのインスタンス化
const gameStats = new GameStats();
const soundManager = new SoundManager();
const performanceMonitor = new PerformanceMonitor();

// ゲーム終了時に統計を保存するためのイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
  const originalEndGame = game?.endGame;
  if (originalEndGame) {
      game.endGame = function() {
          originalEndGame.call(this);
          
          // 統計に追加
          const playerMoney = this.players.player.money;
          const cpuMoney = this.players.cpu.money;
          let winner = 'tie';
          
          if (playerMoney > cpuMoney) winner = 'player';
          else if (cpuMoney > playerMoney) winner = 'cpu';
          
          gameStats.addGame(playerMoney, cpuMoney, winner);
          soundManager.playGameEnd();
      };
  }
});

console.log('🎮 すごろくゲーム完全版が読み込まれました！');