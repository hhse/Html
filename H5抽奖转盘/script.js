// 获取DOM元素
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resultElement = document.getElementById('result');
const chanceElement = document.querySelector('.chance-text b');

// 奖品配置
const prizes = [
    { name: "iPhone 15 Pro", color: "#FF4757", probability: 1 },
    { name: "iPad Air", color: "#2196F3", probability: 2 },
    { name: "AirPods", color: "#4CAF50", probability: 5 },
    { name: "100元优惠券", color: "#FFC107", probability: 12 },
    { name: "50元优惠券", color: "#9C27B0", probability: 20 },
    { name: "10元优惠券", color: "#FF9800", probability: 30 },
    { name: "5元优惠券", color: "#607D8B", probability: 30 }
];

// 游戏状态
let isSpinning = false;
let currentRotation = 0;
let chances = 3; // 剩余抽奖次数

// 计算总概率
const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);

// 初始化转盘
function initWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const anglePerPrize = (2 * Math.PI) / prizes.length;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制外圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF4757';
    ctx.fill();

    // 绘制白色边框
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制扇形区域
    prizes.forEach((prize, index) => {
        const startAngle = index * anglePerPrize;
        const endAngle = (index + 1) * anglePerPrize;

        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制文字
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerPrize / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';

        // 调整文字位置到色块中心
        const textDistance = radius * 0.65; // 调整文字到中心的距离，使其在色块中间
        ctx.fillText(prize.name, 0, -textDistance);
        
        ctx.restore();
    });

    // 绘制中心圆
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#FF4757';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// 选择奖品
function selectPrize() {
    const random = Math.random() * totalProbability;
    let currentSum = 0;
    
    for (let i = 0; i < prizes.length; i++) {
        currentSum += prizes[i].probability;
        if (random < currentSum) {
            return i;
        }
    }
    return prizes.length - 1;
}

// 开始抽奖
function startSpin() {
    if (isSpinning || chances <= 0) return;

    isSpinning = true;
    spinBtn.disabled = true;
    chances--;
    chanceElement.textContent = chances;
    
    // 清除上次的结果
    resultElement.textContent = '';
    resultElement.classList.remove('pulse');

    // 选择奖品
    const prizeIndex = selectPrize();
    const anglePerPrize = 360 / prizes.length;
    
    // 计算旋转角度
    const rotations = 5;
    const targetAngle = 360 * rotations - (prizeIndex * anglePerPrize + anglePerPrize / 2);
    
    // 重置转盘样式
    canvas.style.transition = 'none';
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    // 强制重绘
    void canvas.offsetWidth;
    
    // 设置旋转动画
    canvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
    canvas.style.transform = `rotate(${currentRotation + targetAngle}deg)`;
    
    // 更新当前角度
    currentRotation = (currentRotation + targetAngle) % 360;
    
    // 播放音效
    playSpinSound();

    // 显示结果
    setTimeout(() => {
        playWinSound();
        const prize = prizes[prizeIndex];
        resultElement.innerHTML = `
            <div class="win-message">
                <i class="fas fa-gift"></i>
                恭喜您获得：${prize.name}
            </div>
        `;
        resultElement.classList.add('pulse');
        
        spinBtn.disabled = false;
        isSpinning = false;

        // 检查是否还有抽奖机会
        if (chances <= 0) {
            spinBtn.disabled = true;
            spinBtn.innerHTML = '<i class="fas fa-lock"></i> 明日再来';
        }
    }, 4000);
}

// 音效
function playSpinSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-slot-machine-spin-1014.mp3');
    audio.volume = 0.5;
    audio.play().catch(console.error);
}

function playWinSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    audio.volume = 0.5;
    audio.play().catch(console.error);
}

// 初始化
function init() {
    initWheel();
    spinBtn.addEventListener('click', startSpin);
    
    // 添加悬停效果
    canvas.addEventListener('mouseover', () => {
        if (!isSpinning) {
            canvas.style.transform = `rotate(${currentRotation}deg) scale(1.02)`;
        }
    });
    
    canvas.addEventListener('mouseout', () => {
        if (!isSpinning) {
            canvas.style.transform = `rotate(${currentRotation}deg) scale(1)`;
        }
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init); 