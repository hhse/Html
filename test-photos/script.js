// 照片滤镜应用部分
const filterCanvas = document.getElementById('canvas');
const filterCtx = filterCanvas.getContext('2d');
const imageInput = document.getElementById('image-input');
const downloadBtn = document.getElementById('download-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadingElement = document.getElementById('loading');

let originalImage = null;

// 显示加载动画
function showLoading() {
    loadingElement.style.display = 'block';
}

// 隐藏加载动画
function hideLoading() {
    loadingElement.style.display = 'none';
}

// 初始化画布
function initCanvas() {
    // 设置初始画布大小
    filterCanvas.width = 300;
    filterCanvas.height = 300;
    
    // 在画布上显示提示文字
    filterCtx.fillStyle = '#ccc';
    filterCtx.font = '16px Arial';
    filterCtx.textAlign = 'center';
    filterCtx.fillText('请选择一张图片开始编辑', filterCanvas.width / 2, filterCanvas.height / 2);
}

// 加载图片
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    showLoading();
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // 调整canvas大小以适应图片
            const aspectRatio = img.width / img.height;
            
            if (aspectRatio > 1) {
                filterCanvas.width = 500; // 增加尺寸以提高质量
                filterCanvas.height = Math.floor(500 / aspectRatio);
            } else {
                filterCanvas.height = 500; // 增加尺寸以提高质量
                filterCanvas.width = Math.floor(500 * aspectRatio);
            }
            
            // 清除画布
            filterCtx.clearRect(0, 0, filterCanvas.width, filterCanvas.height);
            
            // 绘制原始图片
            filterCtx.drawImage(img, 0, 0, filterCanvas.width, filterCanvas.height);
            originalImage = filterCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
            
            // 启用下载按钮
            downloadBtn.disabled = false;
            
            // 激活原图按钮
            filterBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-filter="normal"]').classList.add('active');
            
            hideLoading();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// 应用滤镜
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (!originalImage) return;
        
        showLoading();
        
        // 更新活动按钮
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        // 使用setTimeout来允许UI更新
        setTimeout(() => {
            applyFilter(filter);
            hideLoading();
        }, 50);
    });
});

// 应用不同的滤镜效果
function applyFilter(filter) {
    // 重置为原始图片
    filterCtx.putImageData(originalImage, 0, 0);
    
    // 应用选定的滤镜
    switch (filter) {
        case 'normal':
            // 不做任何处理
            break;
        case 'grayscale':
            applyGrayscale();
            break;
        case 'sepia':
            applySepia();
            break;
        case 'invert':
            applyInvert();
            break;
        case 'blur':
            applyBlur();
            break;
        case 'brightness':
            applyBrightness();
            break;
    }
}

// 黑白滤镜
function applyGrayscale() {
    const imageData = filterCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // 红
        data[i + 1] = avg; // 绿
        data[i + 2] = avg; // 蓝
    }
    
    filterCtx.putImageData(imageData, 0, 0);
}

// 复古滤镜
function applySepia() {
    const imageData = filterCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    
    filterCtx.putImageData(imageData, 0, 0);
}

// 反色滤镜
function applyInvert() {
    const imageData = filterCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // 红
        data[i + 1] = 255 - data[i + 1]; // 绿
        data[i + 2] = 255 - data[i + 2]; // 蓝
    }
    
    filterCtx.putImageData(imageData, 0, 0);
}

// 模糊滤镜（简化版）
function applyBlur() {
    // 保存原始图像数据
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = filterCanvas.width;
    tempCanvas.height = filterCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(originalImage, 0, 0);
    
    // 应用模糊效果
    filterCtx.filter = 'blur(5px)';
    filterCtx.clearRect(0, 0, filterCanvas.width, filterCanvas.height);
    filterCtx.drawImage(tempCanvas, 0, 0);
    filterCtx.filter = 'none';
}

// 明亮滤镜
function applyBrightness() {
    const imageData = filterCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
    const data = imageData.data;
    const brightness = 50; // 亮度增加值
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + brightness);
        data[i + 1] = Math.min(255, data[i + 1] + brightness);
        data[i + 2] = Math.min(255, data[i + 2] + brightness);
    }
    
    filterCtx.putImageData(imageData, 0, 0);
}

// 下载图片
downloadBtn.addEventListener('click', function() {
    if (!originalImage) return;
    
    showLoading();
    
    setTimeout(() => {
        const link = document.createElement('a');
        link.download = '滤镜图片.png';
        link.href = filterCanvas.toDataURL('image/png');
        link.click();
        
        hideLoading();
    }, 100);
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
}); 