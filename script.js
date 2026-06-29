/**
 * Swara Sang Atman - Core Engine (Vanilla JS)
 * Mengontrol Partikel, Interaksi Responsif, Sistem Reveal Naskah, dan Matrix Glitch
 */

document.addEventListener("DOMContentLoaded", () => {
    initSacredParticles();
    initInteractions();
    initScrollObserver();
    initMatrixGlitch();
});

/* ==========================================
   1. SISTEM PARTIKEL (DEBU EMAS SAKRAL)
   ========================================== */
function initSacredParticles() {
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const maxParticles = window.innerWidth < 768 ? 400 : 750;

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class HolyParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * window.innerHeight;
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = window.innerHeight + Math.random() * 20;
            this.size = Math.random() * 1.6 + 0.4;
            this.speedY = -(Math.random() * 0.4 + 0.15);
            this.speedX = Math.sin(Math.random() * 2) * 0.2;
            this.alpha = 0;
            this.fadeSpeed = Math.random() * 0.008 + 0.003;
            this.maxAlpha = Math.random() * 0.6 + 0.15;
            this.oscillationSpeed = Math.random() * 0.02 + 0.005;
            this.angle = Math.random() * Math.PI;
        }

        update() {
            this.y += this.speedY;
            this.angle += this.oscillationSpeed;
            this.x += Math.sin(this.angle) * 0.25 + this.speedX;

            if (this.y < window.innerHeight * 0.85 && this.alpha < this.maxAlpha) {
                this.alpha += this.fadeSpeed;
            }
            if (this.y < window.innerHeight * 0.15) {
                this.alpha -= this.fadeSpeed;
            }

            if (this.y < -10 || this.alpha <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
            
            if (this.size > 1.2) {
                ctx.shadowBlur = 6;
                ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
            }
            
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new HolyParticle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

/* ==========================================
   2. INTERAKSI MOUSE & ORIENTASI PERANGKAT
   ========================================== */
function initInteractions() {
    const spotlight = document.getElementById("spotlight");
    const root = document.documentElement;
    
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const easeAmount = 0.08;

    window.addEventListener("mousemove", (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;

        targetX = (e.clientX - window.innerWidth / 2) * 0.03;
        targetY = (e.clientY - window.innerHeight / 2) * 0.03;
    });

    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (e) => {
            if (e.beta === null || e.gamma === null) return;
            
            const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
            const clampedBeta = Math.max(-30, Math.min(30, e.beta - 45));

            targetX = clampedGamma * 0.6;
            targetY = clampedBeta * 0.6;
        }, true);
    }

    function renderParallax() {
        currentX += (targetX - currentX) * easeAmount;
        currentY += (targetY - currentY) * easeAmount;

        root.style.setProperty("--parallax-x", `${currentX}px`);
        root.style.setProperty("--parallax-y", `${currentY}px`);

        requestAnimationFrame(renderParallax);
    }
    renderParallax();
}

/* ==========================================
   3. INTERSECTION OBSERVER (REVEAL ANIMATION)
   ========================================== */
function initScrollObserver() {
    const stanzas = document.querySelectorAll("[data-observe]");

    const observerOptions = {
        root: null, // Memicu secara akurat di seluruh browser
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
            } else {
                entry.target.classList.remove("reveal-active");
            }
        });
    }, observerOptions);

    stanzas.forEach((stanza) => {
        observer.observe(stanza);
    });
}

/* ==========================================
   4. INIT & ENGINE TEXT SCRAMBLE MATRIX
   ========================================== */
function initMatrixGlitch() {
    const titleEl = document.querySelector(".main-title");
    const transEl = document.querySelector(".transliteration");
    
    // Tambahan target untuk animasi footer
    const footerMono = document.querySelector(".sacred-monogram");
    const footerTrans = document.querySelector(".tranliteration2");
    
    const javaneseChars = "ꦲꦤꦕꦫꦏꦢꦠꦱꦮꦬꦥꦿꦨꦩꦒꦧꦛꦯꦤ꧀ꦮꦶꦰꦸꦣ";
    const latinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}—=+*^?";

    if (titleEl) {
        const scramblerMain = new MatrixScramble(titleEl, javaneseChars);
        scramblerMain.scramble("ꦱ꧀ꦮꦫꦯꦁꦄꦠ꧀ꦩꦤ꧀ꦮꦶꦰꦸꦣ");
    }

    if (transEl) {
        const scramblerTrans = new MatrixScramble(transEl, latinChars);
        setTimeout(() => {
            scramblerTrans.scramble("SWARA SANG ATMAN");
        }, 800);
    }
    
    if (footerMono) {
        const scramblerFooterMono = new MatrixScramble(footerMono, javaneseChars);
        // Delay agar teracak saat halaman pertama kali load, memberikan kesan hidup
        setTimeout(() => {
            scramblerFooterMono.scramble("ꦦꦬꦩꦓꦸꦫꦸꦄꦗ꧀ꦤꦟꦓꦩ");
        }, 1500);
    }
    
    if (footerTrans) {
        const scramblerFooterTrans = new MatrixScramble(footerTrans, latinChars);
        setTimeout(() => {
            scramblerFooterTrans.scramble("PARAMAGURU AJNANAGAMA");
        }, 1900);
    }
}

class MatrixScramble {
    constructor(el, matrixChars) {
        this.el = el;
        this.matrixChars = matrixChars; 
        this.update = this.update.bind(this);
    }

    scramble(finalText) {
        const oldText = this.el.innerText || "";
        const length = Math.max(oldText.length, finalText.length);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || "";
            const to = finalText[i] || "";
            const start = Math.floor(Math.random() * 25);
            const end = start + Math.floor(Math.random() * 35);
            
            this.queue.push({ from, to, start, end, currentChar: "" });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
    }

    update() {
        let output = "";
        let completeCount = 0;

        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, currentChar } = this.queue[i];

            if (this.frame >= end) {
                completeCount++;
                output += to; 
            } else if (this.frame >= start) {
                if (!currentChar || Math.random() < 0.25) {
                    currentChar = this.getRandomMatrixChar();
                    this.queue[i].currentChar = currentChar;
                }
                output += `<span class="matrix-glyph">${currentChar}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (completeCount === this.queue.length) {
            this.el.setAttribute("data-text", this.el.innerText);
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    getRandomMatrixChar() {
        return this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
    }
}