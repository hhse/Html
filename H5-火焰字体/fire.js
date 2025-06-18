document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const canvas = document.getElementById('fireCanvas');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('textInput');
    const intensitySlider = document.getElementById('intensitySlider');
    const colorSelect = document.getElementById('colorSelect');
    
    // 设置画布尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 40;
        canvas.height = 200;
    }
    
    // 初始化参数
    let particles = [];
    let fireIntensity = 5;
    let fireColor = 'red';
    let text = textInput.value;
    let animationId;
    
    // 粒子类
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = Math.random() * 2 - 1;
            this.vy = -2 - Math.random() * 3;
            this.size = Math.random() * 3 + 2;
            this.life = Math.random() * 80 + 50;
            this.maxLife = this.life;
        }
        
        update() {
            // 粒子逐渐上升并左右摆动
            this.x += this.vx * (fireIntensity / 5);
            this.y += this.vy * (fireIntensity / 5);
            
            // 随机左右飘动效果
            this.vx += (Math.random() * 0.4 - 0.2);
            this.vx = Math.min(Math.max(this.vx, -1.5), 1.5);
            
            // 粒子生命值减少
            this.life--;
            
            // 粒子逐渐缩小
            if (this.size > 0.2) {
                this.size -= 0.05;
            }
        }
        
        draw() {
            if (this.life <= 0) return;
            
            // 透明度根据生命周期变化
            const opacity = this.life / this.maxLife;
            
            // 根据选择的颜色创建渐变
            let gradient;
            if (fireColor === 'red') {
                gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                gradient.addColorStop(0.4, `rgba(255, 180, 0, ${opacity})`);
                gradient.addColorStop(0.8, `rgba(255, 0, 0, ${opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
            } else if (fireColor === 'blue') {
                gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                gradient.addColorStop(0.4, `rgba(0, 150, 255, ${opacity})`);
                gradient.addColorStop(0.8, `rgba(0, 50, 255, ${opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
            } else if (fireColor === 'green') {
                gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                gradient.addColorStop(0.4, `rgba(0, 255, 150, ${opacity})`);
                gradient.addColorStop(0.8, `rgba(0, 180, 0, ${opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
            } else if (fireColor === 'purple') {
                gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                gradient.addColorStop(0.4, `rgba(200, 100, 255, ${opacity})`);
                gradient.addColorStop(0.8, `rgba(128, 0, 255, ${opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 生成粒子
    function generateParticles() {
        // 设置字体
        const fontSize = Math.floor(canvas.width / (text.length * 1.5));
        const finalFontSize = Math.min(Math.max(fontSize, 30), 80);
        ctx.font = `bold ${finalFontSize}px '微软雅黑', Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 测量文本尺寸
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        
        // 临时画布用于测量字体像素
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = textWidth + 20;
        tempCanvas.height = finalFontSize * 1.5;
        tempCtx.font = ctx.font;
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
        
        // 获取像素数据
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const pixels = imageData.data;
        
        // 清空现有粒子
        particles = [];
        
        // 根据像素数据创建粒子
        for (let y = 0; y < tempCanvas.height; y += Math.max(1, Math.floor(5 / (fireIntensity / 5)))) {
            for (let x = 0; x < tempCanvas.width; x += Math.max(1, Math.floor(5 / (fireIntensity / 5)))) {
                const index = (y * tempCanvas.width + x) * 4;
                if (pixels[index + 3] > 128) { // 只在非透明像素处创建粒子
                    const particleX = (canvas.width - textWidth) / 2 + x;
                    const particleY = (canvas.height - finalFontSize) / 2 + y;
                    
                    // 每个点有一定几率生成粒子
                    if (Math.random() < 0.3) {
                        particles.push(new Particle(particleX, particleY));
                    }
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 帧率控制
        let newParticles = [];
        
        // 更新和绘制现有粒子
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // 保留还有生命值的粒子
            if (particles[i].life > 0) {
                newParticles.push(particles[i]);
            }
        }
        
        // 更新粒子数组
        particles = newParticles;
        
        // 持续生成新粒子
        if (particles.length < 500 * (fireIntensity / 5)) {
            generateParticles();
        }
        
        // 继续动画循环
        animationId = requestAnimationFrame(animate);
    }
    
    // 初始化
    function init() {
        resizeCanvas();
        text = textInput.value;
        fireIntensity = parseInt(intensitySlider.value);
        fireColor = colorSelect.value;
        
        // 重新生成粒子
        generateParticles();
        
        // 如果已经有动画在运行，先取消
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // 开始动画
        animate();
    }
    
    // 事件监听
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });
    
    textInput.addEventListener('input', () => {
        text = textInput.value;
        init();
    });
    
    intensitySlider.addEventListener('input', () => {
        fireIntensity = parseInt(intensitySlider.value);
    });
    
    colorSelect.addEventListener('change', () => {
        fireColor = colorSelect.value;
    });
    
    // 启动动画
    init();
}); 