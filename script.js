// 1. 漢堡選單開關邏輯
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('open');
        navLinks.classList.toggle('active');
    });

    // 點擊選單連結後自動關閉下拉選單
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('open');
            navLinks.classList.remove('active');
        });
    });
}

// 2. CD 唱片播放控制
const cdPlayer = document.getElementById('cdPlayer');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

function toggleCD() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        cdPlayer.classList.add('active');
        bgMusic.play().catch(e => console.log('音樂播放失敗或尚未載入檔名：', e));
        musicBtn.textContent = '⏸️';
    } else {
        cdPlayer.classList.remove('active');
        bgMusic.pause();
        musicBtn.textContent = '🎵';
    }
}

if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCD();
    });
}

// 3. 飄落花瓣波瀾背景 Dynamic Canvas
const canvas = document.getElementById('inkCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const petals = [];
const numPetals = 35;

class Petal {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.rotation = Math.random() * 360;
        this.rotSpeed = Math.random() * 2 - 1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
        this.rotation += this.rotSpeed;

        if (this.y > height + 20) {
            this.reset();
            this.y = -10;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = `rgba(216, 112, 147, ${this.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < numPetals; i++) {
    petals.push(new Petal());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(petal => {
        petal.update();
        petal.draw();
    });
    requestAnimationFrame(animate);
}
animate();