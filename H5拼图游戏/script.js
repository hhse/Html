let gameState = {
    isPlaying: false,
    moves: 0,
    startTime: null,
    timerInterval: null
};

const imageUrl = './puzzle-image.jpg'; // 使用本地图片
let pieces = [];

// 初始化游戏
async function initializeGame() {
    try {
        const img = new Image();
        
        const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('图片加载失败'));
            img.src = imageUrl;
        });
        
        const loadedImg = await imageLoadPromise;
        const puzzleGrid = document.getElementById('puzzleGrid');
        puzzleGrid.innerHTML = '';
        pieces = createPuzzlePieces(loadedImg);
        
        // 打乱拼图顺序
        shuffleArray(pieces);
        
        // 将拼图片段添加到网格中
        pieces.forEach((piece, index) => {
            const pieceElement = createPieceElement(piece, index);
            puzzleGrid.appendChild(pieceElement);
        });
        
        setupDragAndDrop();
    } catch (error) {
        alert('图片加载失败，请重试');
        console.error('图片加载错误:', error);
        document.getElementById('startBtn').disabled = false;
    }
}

// 创建拼图片段
function createPuzzlePieces(img) {
    const pieces = [];
    const pieceSize = img.width / 3;
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceSize;
            canvas.height = pieceSize;
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(
                img,
                col * pieceSize, row * pieceSize,
                pieceSize, pieceSize,
                0, 0,
                pieceSize, pieceSize
            );
            
            pieces.push({
                url: canvas.toDataURL(),
                correctPosition: row * 3 + col
            });
        }
    }
    
    return pieces;
}

// 创建拼图元素
function createPieceElement(piece, index) {
    const pieceElement = document.createElement('div');
    pieceElement.className = 'puzzle-piece';
    pieceElement.dataset.index = index;
    pieceElement.dataset.correctPosition = piece.correctPosition;
    
    const img = document.createElement('img');
    img.src = piece.url;
    pieceElement.appendChild(img);
    
    return pieceElement;
}

// 设置拖拽功能
function setupDragAndDrop() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    
    pieces.forEach(piece => {
        piece.draggable = true;
        
        piece.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
        });
        
        piece.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
        
        piece.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        piece.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedPiece = document.querySelector('.dragging');
            if (draggedPiece && draggedPiece !== e.target) {
                swapPieces(draggedPiece, e.target);
            }
        });
    });
}

// 交换两个拼图片段
function swapPieces(piece1, piece2) {
    if (!gameState.isPlaying) return;
    
    const parent = piece1.parentNode;
    const sibling = piece2.nextSibling;
    
    parent.insertBefore(piece2, piece1);
    parent.insertBefore(piece1, sibling);
    
    gameState.moves++;
    document.getElementById('moves').textContent = gameState.moves;
    
    checkWinCondition();
}

// 检查是否完成拼图
function checkWinCondition() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    const isComplete = Array.from(pieces).every((piece, index) => {
        return parseInt(piece.dataset.correctPosition) === index;
    });
    
    if (isComplete) {
        endGame();
    }
}

// 开始游戏
function startGame() {
    gameState.isPlaying = true;
    gameState.moves = 0;
    gameState.startTime = Date.now();
    document.getElementById('moves').textContent = '0';
    
    // 启动计时器
    gameState.timerInterval = setInterval(updateTimer, 1000);
    
    // 更新按钮状态
    document.getElementById('startBtn').disabled = true;
    document.getElementById('restartBtn').disabled = false;
    
    initializeGame();
}

// 重新开始游戏
function restartGame() {
    clearInterval(gameState.timerInterval);
    startGame();
}

// 结束游戏
function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    
    const timeSpent = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    
    setTimeout(() => {
        alert(`恭喜你完成拼图！\n用时：${minutes}分${seconds}秒\n移动次数：${gameState.moves}次`);
        document.getElementById('startBtn').disabled = false;
    }, 300);
}

// 更新计时器显示
function updateTimer() {
    if (!gameState.startTime) return;
    
    const timeSpent = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60).toString().padStart(2, '0');
    const seconds = (timeSpent % 60).toString().padStart(2, '0');
    
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

// 打乱数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 事件监听器
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);