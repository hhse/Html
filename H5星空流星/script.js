const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 200; // 星星数量

// 初始化星星
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        speed: Math.random() * 0.05 + 0.01
    });
}

// 绘制星星
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';

    stars.forEach(star => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 更新星星位置和透明度
function updateStars() {
    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
            star.speed = -star.speed;
        }
        star.x += Math.random() * 0.5 - 0.25;
        star.y += Math.random() * 0.5 - 0.25;

        // 如果星星超出边界，重置位置
        if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height) {
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.alpha = Math.random();
            star.speed = Math.random() * 0.05 + 0.01;
        }
    });
}

// 流星类
class Meteor {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 80 + 20;
        this.speed = Math.random() * 5 + 2;
        this.angle = Math.PI / 4; // 45度角
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        if (this.x > canvas.width || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

const meteors = [];
const numMeteors = 5; // 流星数量

for (let i = 0; i < numMeteors; i++) {
    meteors.push(new Meteor());
}

// 更新流星
function updateMeteors() {
    meteors.forEach(meteor => {
        meteor.update();
    });
}

// 绘制流星
function drawMeteors() {
    meteors.forEach(meteor => {
        meteor.draw();
    });
}

// 星座数据
const constellations = [
    { name: "Orion", stars: [{ x: 100, y: 100 }, { x: 150, y: 150 }, { x: 200, y: 100 }] },
    { name: "Big Dipper", stars: [{ x: 300, y: 200 }, { x: 350, y: 250 }, { x: 400, y: 200 }] }
];

// 绘制星座
function drawConstellations() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;

    constellations.forEach(constellation => {
        ctx.beginPath();
        constellation.stars.forEach((star, index) => {
            if (index === 0) {
                ctx.moveTo(star.x, star.y);
            } else {
                ctx.lineTo(star.x, star.y);
            }
        });
        ctx.stroke();
    });
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    updateStars();
    drawMeteors();
    updateMeteors();
    drawConstellations();
    requestAnimationFrame(animate);
}

animate();