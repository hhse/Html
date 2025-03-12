// 游戏配置
const config = {
    gameDuration: 60, // 游戏时长（秒）
    minBubbleSize: 30, // 最小泡泡尺寸
    maxBubbleSize: 60, // 最大泡泡尺寸
    bubbleInterval: 1000, // 生成泡泡的间隔（毫秒）
    colors: ['#FF4081', '#3F51B5', '#009688', '#FF9800', '#9C27B0'], // 泡泡颜色
    speedRange: { min: 2, max: 4 } // 泡泡上升速度范围（秒）
};

// 游戏状态
let gameState = {
    score: 0,
    timeLeft: config.gameDuration,
    isPlaying: false,
    bubbleInterval: null,
    timerInterval: null,
    highScore: localStorage.getItem('highScore') || 0
};

// DOM 元素
const gameArea = document.getElementById('game-area');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const resultElement = document.getElementById('result');
const finalScoreElement = document.getElementById('final-score');
const highScoreElement = document.getElementById('high-score');

// 事件监听器
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// 开始游戏
function startGame() {
    // 重置游戏状态
    gameState.score = 0;
    gameState.timeLeft = config.gameDuration;
    gameState.isPlaying = true;
    
    // 更新UI
    scoreElement.textContent = '0';
    timeElement.textContent = config.gameDuration;
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    resultElement.style.display = 'none';
    
    // 清除所有现有泡泡
    gameArea.innerHTML = '';
    
    // 开始生成泡泡
    gameState.bubbleInterval = setInterval(createBubble, config.bubbleInterval);
    
    // 开始倒计时
    gameState.timerInterval = setInterval(updateTimer, 1000);
}

// 创建泡泡
function createBubble() {
    if (!gameState.isPlaying) return;
    
    const bubble = document.createElement('div');
    const size = Math.random() * (config.maxBubbleSize - config.minBubbleSize) + config.minBubbleSize;
    const speed = Math.random() * (config.speedRange.max - config.speedRange.min) + config.speedRange.min;
    
    bubble.className = 'bubble';
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.backgroundColor = config.colors[Math.floor(Math.random() * config.colors.length)];
    bubble.style.left = `${Math.random() * (gameArea.offsetWidth - size)}px`;
    bubble.style.animation = `float ${speed}s linear`;
    
    // 添加点击事件
    bubble.addEventListener('click', () => popBubble(bubble));
    
    gameArea.appendChild(bubble);
    
    // 移除超出范围的泡泡
    bubble.addEventListener('animationend', () => {
        if (bubble.parentElement) {
            bubble.remove();
        }
    });
}

// 点击泡泡
function popBubble(bubble) {
    if (!gameState.isPlaying) return;
    
    // 计算得分（越小的泡泡得分越高）
    const size = parseFloat(bubble.style.width);
    const points = Math.ceil(config.maxBubbleSize - size + 10);
    
    // 更新得分
    gameState.score += points;
    scoreElement.textContent = gameState.score;
    
    // 显示得分动画
    showScoreAnimation(bubble, points);
    
    // 添加消失动画
    bubble.classList.add('pop');
    setTimeout(() => bubble.remove(), 300);
}

// 显示得分动画
function showScoreAnimation(bubble, points) {
    const scoreAnim = document.createElement('div');
    scoreAnim.className = 'score-animation';
    scoreAnim.textContent = `+${points}`;
    
    const rect = bubble.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    
    scoreAnim.style.left = `${rect.left - gameRect.left}px`;
    scoreAnim.style.top = `${rect.top - gameRect.top}px`;
    
    gameArea.appendChild(scoreAnim);
    setTimeout(() => scoreAnim.remove(), 1000);
}

// 更新计时器
function updateTimer() {
    gameState.timeLeft--;
    timeElement.textContent = gameState.timeLeft;
    
    if (gameState.timeLeft <= 0) {
        endGame();
    }
}

// 结束游戏
function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.bubbleInterval);
    clearInterval(gameState.timerInterval);
    
    // 清除所有泡泡
    gameArea.innerHTML = '';
    
    // 更新最高分
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('highScore', gameState.highScore);
    }
    
    // 显示结果
    finalScoreElement.textContent = gameState.score;
    highScoreElement.textContent = gameState.highScore;
    resultElement.style.display = 'block';
    restartButton.style.display = 'block';
} 