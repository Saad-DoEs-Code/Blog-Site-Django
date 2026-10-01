/**
 * Interactive Starry Galaxy & Falling Stars Background
 * Features:
 * - Deep space galaxy nebulas with dynamic soft color gradients
 * - Multi-layered twinkling background stars with color variations
 * - Continuous falling stars / space dust drifting downward
 * - High-speed shooting stars / meteors with trailing glow streaks
 * - Smooth mouse parallax interaction
 */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class StarryGalaxy {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.width = 0;
      this.height = 0;
      this.dpr = 1;

      // Particle collections
      this.twinkleStars = [];
      this.fallingStars = [];
      this.shootingStars = [];
      this.nebulas = [];

      // Mouse tracking for subtle parallax
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetMouseX = 0;
      this.targetMouseY = 0;

      // Settings
      this.numTwinkleStars = 240;
      this.numFallingStars = 75;
      this.lastShootingStarTime = 0;
      this.nextShootingStarDelay = 2000 + Math.random() * 3000;

      this.init();
    }

    init() {
      this.handleResize();
      this.createNebulas();
      this.createTwinkleStars();
      this.createFallingStars();

      window.addEventListener('resize', () => this.handleResize());
      window.addEventListener('mousemove', (e) => {
        this.targetMouseX = (e.clientX - this.width / 2) * 0.05;
        this.targetMouseY = (e.clientY - this.height / 2) * 0.05;
      });

      requestAnimationFrame((t) => this.animate(t));
    }

    handleResize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.scale(this.dpr, this.dpr);

      // Re-create particles for current viewport
      this.createNebulas();
      this.createTwinkleStars();
      this.createFallingStars();
    }

    createNebulas() {
      // Create static background nebula glow points
      this.nebulas = [
        {
          x: this.width * 0.15,
          y: this.height * 0.25,
          radius: Math.max(this.width, this.height) * 0.45,
          color: 'rgba(29, 14, 56, 0.45)', // Deep cosmic indigo
        },
        {
          x: this.width * 0.82,
          y: this.height * 0.55,
          radius: Math.max(this.width, this.height) * 0.5,
          color: 'rgba(10, 34, 65, 0.4)', // Deep space cyan
        },
        {
          x: this.width * 0.45,
          y: this.height * 0.85,
          radius: Math.max(this.width, this.height) * 0.4,
          color: 'rgba(40, 10, 51, 0.35)', // Deep magenta nebula
        },
        {
          x: this.width * 0.88,
          y: this.height * 0.12,
          radius: Math.max(this.width, this.height) * 0.32,
          color: 'rgba(15, 45, 60, 0.25)', // Cold cyan dust
        },
      ];
    }

    createTwinkleStars() {
      this.twinkleStars = [];
      const starColors = [
        '#ffffff',
        '#e0f2fe',
        '#bae6fd',
        '#ddd6fe',
        '#fef08a',
        '#f472b6',
      ];

      for (let i = 0; i < this.numTwinkleStars; i++) {
        this.twinkleStars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 1.6 + 0.4,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          alpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          depth: Math.random() * 0.5 + 0.5,
        });
      }
    }

    createFallingStars() {
      this.fallingStars = [];
      for (let i = 0; i < this.numFallingStars; i++) {
        this.fallingStars.push(this.generateFallingStar(true));
      }
    }

    generateFallingStar(randomY = false) {
      const speed = Math.random() * 1.8 + 0.6;
      const angle = (15 + Math.random() * 15) * (Math.PI / 180); // 15 to 30 deg angle
      const length = Math.random() * 20 + 10;

      const starColors = [
        'rgba(255, 255, 255, ',
        'rgba(186, 230, 253, ', // cyan-blue
        'rgba(221, 214, 254, ', // violet-blue
        'rgba(254, 240, 138, ', // soft warm star
      ];

      return {
        x: Math.random() * (this.width + 200) - 100,
        y: randomY ? Math.random() * this.height : -40,
        speedX: Math.sin(angle) * speed,
        speedY: Math.cos(angle) * speed,
        length: length,
        size: Math.random() * 1.4 + 0.6,
        colorBase: starColors[Math.floor(Math.random() * starColors.length)],
        opacity: Math.random() * 0.7 + 0.3,
        depth: Math.random() * 0.6 + 0.4,
      };
    }

    spawnShootingStar() {
      const startX = Math.random() * (this.width * 0.8) + this.width * 0.1;
      const startY = Math.random() * (this.height * 0.35);
      const angle = (32 + Math.random() * 16) * (Math.PI / 180);
      const speed = Math.random() * 11 + 9;
      const length = Math.random() * 130 + 90;

      this.shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: length,
        life: 0,
        maxLife: Math.random() * 35 + 25,
        size: Math.random() * 1.8 + 1.2,
      });
    }

    animate(timestamp) {
      // Smooth mouse parallax interpolation
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

      // Clear canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Render Cosmic Nebulas
      this.drawNebulas();

      // Render Twinkling Stars
      this.drawTwinkleStars();

      // Render Continuous Falling Stars
      if (!prefersReducedMotion) {
        this.updateAndDrawFallingStars();
      }

      // Handle Shooting Stars
      if (!prefersReducedMotion) {
        if (timestamp - this.lastShootingStarTime > this.nextShootingStarDelay) {
          this.spawnShootingStar();
          this.lastShootingStarTime = timestamp;
          this.nextShootingStarDelay = 2200 + Math.random() * 4000;
        }
        this.updateAndDrawShootingStars();
      }

      requestAnimationFrame((t) => this.animate(t));
    }

    drawNebulas() {
      for (const neb of this.nebulas) {
        const posX = neb.x + this.mouseX * 0.15;
        const posY = neb.y + this.mouseY * 0.15;

        const grad = this.ctx.createRadialGradient(
          posX,
          posY,
          0,
          posX,
          posY,
          neb.radius
        );
        grad.addColorStop(0, neb.color);
        grad.addColorStop(1, 'transparent');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(posX, posY, neb.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    drawTwinkleStars() {
      for (const star of this.twinkleStars) {
        star.twinklePhase += star.twinkleSpeed;
        const alphaShift = Math.sin(star.twinklePhase) * 0.35;
        const currentAlpha = Math.max(0.1, Math.min(1, star.alpha + alphaShift));

        const posX = star.x + this.mouseX * star.depth * 0.3;
        const posY = star.y + this.mouseY * star.depth * 0.3;

        this.ctx.save();
        this.ctx.globalAlpha = currentAlpha;
        this.ctx.fillStyle = star.color;
        this.ctx.beginPath();
        this.ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
        this.ctx.fill();

        if (star.size > 1.3) {
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = star.color;
          this.ctx.fill();
        }

        this.ctx.restore();
      }
    }

    updateAndDrawFallingStars() {
      for (let i = 0; i < this.fallingStars.length; i++) {
        const star = this.fallingStars[i];

        star.x += star.speedX;
        star.y += star.speedY;

        if (star.y > this.height + 40 || star.x > this.width + 100 || star.x < -100) {
          this.fallingStars[i] = this.generateFallingStar(false);
          continue;
        }

        const posX = star.x + this.mouseX * star.depth * 0.5;
        const posY = star.y + this.mouseY * star.depth * 0.5;

        const tailX = posX - star.speedX * (star.length / 2);
        const tailY = posY - star.speedY * (star.length / 2);

        const grad = this.ctx.createLinearGradient(tailX, tailY, posX, posY);
        grad.addColorStop(0, star.colorBase + '0)');
        grad.addColorStop(0.7, star.colorBase + (star.opacity * 0.45) + ')');
        grad.addColorStop(1, star.colorBase + star.opacity + ')');

        this.ctx.lineWidth = star.size;
        this.ctx.strokeStyle = grad;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(tailX, tailY);
        this.ctx.lineTo(posX, posY);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(posX, posY, star.size * 0.75, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    updateAndDrawShootingStars() {
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const meteor = this.shootingStars[i];
        meteor.life++;

        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        const progress = meteor.life / meteor.maxLife;
        const fadeOut = Math.sin(progress * Math.PI);

        if (progress >= 1) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        const tailX = meteor.x - meteor.vx * (meteor.length / 12);
        const tailY = meteor.y - meteor.vy * (meteor.length / 12);

        const grad = this.ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.5, 'rgba(186, 230, 253, ' + (fadeOut * 0.45) + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, ' + (fadeOut * 0.95) + ')');

        this.ctx.save();
        this.ctx.lineWidth = meteor.size * fadeOut;
        this.ctx.strokeStyle = grad;
        this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = 12 * fadeOut;
        this.ctx.shadowColor = '#818cf8';

        this.ctx.beginPath();
        this.ctx.moveTo(tailX, tailY);
        this.ctx.lineTo(meteor.x, meteor.y);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(meteor.x, meteor.y, meteor.size * 1.25 * fadeOut, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new StarryGalaxy('space-bg'));
  } else {
    new StarryGalaxy('space-bg');
  }
})();
