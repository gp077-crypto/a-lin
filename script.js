// --- 1. CD 唱片點擊滑出與音樂播放連動 ---
const cdPlayer = document.getElementById('cdPlayer');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

function toggleCD() {
    // 切換 CD 展開 / 收回 Class
    cdPlayer.classList.toggle('active');

    // 播放或暫停音樂
    if (cdPlayer.classList.contains('active')) {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = '⏸ 暫停音樂';
        }).catch(err => {
            console.log("自動播放受限：", err);
        });
        
        // 點擊封面時產生花瓣散落效果
        const rect = cdPlayer.getBoundingClientRect();
        createPetalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        bgMusic.pause();
        isPlaying = false;
        musicBtn.textContent = '🎵 靜心音樂';
    }
}

// 右上角按鈕手動播放/暫停音樂
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
        bgMusic.pause();
        cdPlayer.classList.remove('active');
        musicBtn.textContent = '🎵 靜心音樂';
    } else {
        bgMusic.play();
        cdPlayer.classList.add('active');
        musicBtn.textContent = '⏸ 暫停音樂';
    }
    isPlaying = !isPlaying;
});


// --- 2. Canvas 古風飄落花瓣特效 ---
const canvas = document.getElementById('inkCanvas');
const ctx = canvas.getContext('2d');

let petals = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 花瓣粒子類別
class Petal {
    constructor(x, y, isBurst = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || -10;
        this.size = Math.random() * 8 + 6; // 花瓣大小
        this.speedY = isBurst ? (Math.random() - 0.5) * 4 : Math.random() * 1 + 0.8; // 下落速度
        this.speedX = isBurst ? (Math.random() - 0.5) * 4 : Math.random() * 0.8 - 0.4; // 左右隨風飄動
        this.rotation = Math.random() * 360; // 旋轉角度
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.alpha = 1;
        this.fadeSpeed = isBurst ? 0.015 : 0.003; // 2-3秒內自然淡出
        
        // 古風朱紅/粉色系配色
        const colors = ['#e8a7a1', '#c75450', '#8c2423', '#f2c3c0'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.beginPath();
        // 繪製水滴/花瓣形狀
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(this.size, -this.size, this.size, 0);
        ctx.quadraticCurveTo(this.size, this.size, 0, this.size * 1.5);
        ctx.quadraticCurveTo(-this.size, this.size, -this.size, 0);
        ctx.quadraticCurveTo(-this.size, -this.size, 0, 0);
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.alpha -= this.fadeSpeed;
    }
}

// 動畫繪製循環
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 偶爾隨機從上方飄落一片花瓣
    if (Math.random() < 0.05) {
        petals.push(new Petal());
    }

    for (let i = petals.length - 1; i >= 0; i--) {
        const petal = petals[i];
        petal.update();
        petal.draw();

        // 落地或完全透明後移除
        if (petal.alpha <= 0 || petal.y > canvas.height + 20) {
            petals.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}
animate();

// 滑鼠移動時隨風飄出微小花瓣
window.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.1) {
        petals.push(new Petal(e.clientX, e.clientY, true));
    }
});

// 點擊散開花瓣
function createPetalBurst(x, y) {
    for (let i = 0; i < 12; i++) {
        petals.push(new Petal(x, y, true));
    }
}