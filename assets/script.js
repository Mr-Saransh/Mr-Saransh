/**
 * ==========================================================================
 * SARANSH GUPTA — CYBER GOLD PORTFOLIO & ARCADE MINI-GAME ENGINE
 * Ultra-Responsive, Highly Optimized Black & Gold Architecture
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. SOUND SYNTHESIZER ENGINE (Web Audio API - Zero External Dependencies)
  // --------------------------------------------------------------------------
  const SoundFX = (function () {
    let ctx = null;
    let isMuted = localStorage.getItem('sg_sound_muted') === 'true';

    function initCtx() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) ctx = new AudioCtx();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    }

    function isEnabled() {
      return !isMuted && ctx;
    }

    return {
      toggleMute: function () {
        initCtx();
        isMuted = !isMuted;
        localStorage.setItem('sg_sound_muted', isMuted);
        return !isMuted;
      },
      isMuted: function () {
        return isMuted;
      },
      laser: function () {
        if (!isEnabled()) return;
        try {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.11);

          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.12);
        } catch (e) {}
      },
      explosion: function () {
        if (!isEnabled()) return;
        try {
          const now = ctx.currentTime;
          const bufferSize = ctx.sampleRate * 0.22;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, now);
          filter.frequency.exponentialRampToValueAtTime(30, now + 0.22);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.24, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          noise.start(now);
          noise.stop(now + 0.23);
        } catch (e) {}
      },
      coin: function () {
        if (!isEnabled()) return;
        try {
          const now = ctx.currentTime;
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = now + idx * 0.04;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.09);
          });
        } catch (e) {}
      },
      powerUp: function () {
        if (!isEnabled()) return;
        try {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.22);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.23);
        } catch (e) {}
      },
      uiClick: function () {
        if (!isEnabled()) return;
        try {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now);

          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.04);
        } catch (e) {}
      },
      gameOver: function () {
        if (!isEnabled()) return;
        try {
          const now = ctx.currentTime;
          const notes = [440, 415.3, 392, 349.23];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = now + idx * 0.12;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.16);
          });
        } catch (e) {}
      },
      initOnFirstInteraction: function () {
        const unlock = () => {
          initCtx();
          window.removeEventListener('click', unlock);
          window.removeEventListener('keydown', unlock);
          window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
      }
    };
  })();

  // --------------------------------------------------------------------------
  // 2. GOLDEN STARDUST INTERACTIVE CANVAS
  // --------------------------------------------------------------------------
  function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = Math.min(75, Math.floor(window.innerWidth / 16));
    const mouse = { x: -1000, y: -1000, radius: 130 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class StarParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.4;
        this.baseSize = this.size;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.6 + 0.15;
        this.goldTone = Math.random() > 0.4 ? '#FFDF73' : '#D4AF37';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.5;
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
          this.size = this.baseSize * 1.5;
        } else {
          this.size = this.baseSize;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.goldTone;
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new StarParticle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#D4AF37';
            ctx.globalAlpha = (1 - dist / 100) * 0.12;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resize();
      particles.forEach((p) => p.reset());
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    init();
    animate();
  }

  // --------------------------------------------------------------------------
  // 3. CYBER GOLD DEFENDER ARCADE MINI-GAME
  // --------------------------------------------------------------------------
  function initCyberArcade() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const overlay = document.getElementById('game-overlay');
    const startBtn = document.getElementById('game-start-btn');
    const overlayTitle = document.getElementById('overlay-title');
    const overlaySub = document.getElementById('overlay-sub');

    const hudScore = document.getElementById('hud-score');
    const hudWave = document.getElementById('hud-wave');
    const hudHigh = document.getElementById('hud-high');
    const hudShield = document.getElementById('hud-shield');

    let highScore = parseInt(localStorage.getItem('sg_arcade_high') || '0', 10);
    if (hudHigh) hudHigh.textContent = highScore.toLocaleString();

    let isPlaying = false;
    let score = 0;
    let wave = 1;
    let shield = 100;
    let combo = 1;
    let animationId = null;

    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false,
      Space: false
    };

    let pointer = { x: 300, y: 240, active: false };

    let player = {
      x: 80,
      y: 240,
      speed: 6.5,
      fireRate: 11,
      fireCooldown: 0,
      laserLevel: 1,
      overdriveTimer: 0
    };

    let bullets = [];
    let enemies = [];
    let crystals = [];
    let particles = [];
    let popups = [];

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function resetGame() {
      score = 0;
      wave = 1;
      shield = 100;
      combo = 1;
      bullets = [];
      enemies = [];
      crystals = [];
      particles = [];
      popups = [];
      player.x = 80;
      player.y = canvas.height / 2;
      player.laserLevel = 1;
      player.overdriveTimer = 0;
      updateHUD();
    }

    function updateHUD() {
      if (hudScore) hudScore.textContent = score.toLocaleString();
      if (hudWave) hudWave.textContent = `0${wave}`.slice(-2);
      if (hudShield) hudShield.textContent = `${Math.max(0, Math.round(shield))}%`;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('sg_arcade_high', highScore);
        if (hudHigh) hudHigh.textContent = highScore.toLocaleString();
      }
    }

    function spawnEnemy() {
      const types = [
        { name: 'BUG#404', color: '#EF4444', hp: 1, pts: 100, speed: 2.8, size: 14, shape: 'bug' },
        { name: 'LATENCY', color: '#F59E0B', hp: 2, pts: 250, speed: 4.0, size: 12, shape: 'dart' },
        { name: 'LEAK', color: '#8B5CF6', hp: 4, pts: 500, speed: 1.6, size: 20, shape: 'tank' }
      ];

      const chosen = types[Math.floor(Math.random() * types.length)];
      enemies.push({
        x: canvas.width + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        vy: (Math.random() - 0.5) * 1.5,
        ...chosen,
        maxHp: chosen.hp
      });
    }

    function createExplosion(x, y, color, count = 12) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1,
          color: color,
          alpha: 1,
          life: 28
        });
      }
    }

    function addScorePopup(text, x, y, color = '#FFDF73') {
      popups.push({
        text: text,
        x: x,
        y: y,
        alpha: 1,
        color: color,
        life: 40
      });
    }

    function fireLaser() {
      SoundFX.laser();
      if (player.laserLevel === 1) {
        bullets.push({ x: player.x + 24, y: player.y - 4, vx: 12, vy: 0 });
        bullets.push({ x: player.x + 24, y: player.y + 4, vx: 12, vy: 0 });
      } else {
        bullets.push({ x: player.x + 24, y: player.y, vx: 13, vy: 0 });
        bullets.push({ x: player.x + 20, y: player.y - 8, vx: 12, vy: -2.5 });
        bullets.push({ x: player.x + 20, y: player.y + 8, vx: 12, vy: 2.5 });
      }
    }

    let enemySpawnCounter = 0;

    function gameLoop() {
      if (!isPlaying) return;

      ctx.fillStyle = '#030306';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
      for (let i = 0; i < 20; i++) {
        const sx = (Date.now() * 0.15 * (i + 1)) % canvas.width;
        const sy = (i * 37) % canvas.height;
        ctx.fillRect(canvas.width - sx, sy, 1.5, 1.5);
      }

      // Movement
      if (pointer.active) {
        player.x += (pointer.x - player.x) * 0.14;
        player.y += (pointer.y - player.y) * 0.14;
      } else {
        if ((keys.ArrowUp || keys.KeyW) && player.y > 20) player.y -= player.speed;
        if ((keys.ArrowDown || keys.KeyS) && player.y < canvas.height - 20) player.y += player.speed;
        if ((keys.ArrowLeft || keys.KeyA) && player.x > 30) player.x -= player.speed;
        if ((keys.ArrowRight || keys.KeyD) && player.x < canvas.width - 60) player.x += player.speed;
      }

      // Shooting
      if (player.fireCooldown > 0) player.fireCooldown--;
      if ((keys.Space || pointer.active) && player.fireCooldown === 0) {
        fireLaser();
        player.fireCooldown = player.fireRate;
      }

      if (player.overdriveTimer > 0) {
        player.overdriveTimer--;
        if (player.overdriveTimer === 0) player.laserLevel = 1;
      }

      // Draw Ship
      ctx.save();
      ctx.translate(player.x, player.y);

      // Thruster
      ctx.beginPath();
      ctx.moveTo(-12, -4);
      ctx.lineTo(-20 - Math.random() * 8, 0);
      ctx.lineTo(-12, 4);
      ctx.fillStyle = '#60A5FA';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#3B82F6';
      ctx.fill();

      // Hull
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-10, -14);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-6, 4);
      ctx.lineTo(-10, 14);
      ctx.closePath();

      const shipGrad = ctx.createLinearGradient(-10, 0, 18, 0);
      shipGrad.addColorStop(0, '#AA771C');
      shipGrad.addColorStop(0.5, '#FFDF73');
      shipGrad.addColorStop(1, '#FFF8D6');
      ctx.fillStyle = shipGrad;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#D4AF37';
      ctx.fill();

      // Cockpit
      ctx.beginPath();
      ctx.arc(2, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#4ADE80';
      ctx.fill();
      ctx.restore();

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;

        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF8D6';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FFDF73';
        ctx.fill();

        if (b.x > canvas.width + 20) {
          bullets.splice(i, 1);
        }
      }

      // Spawn
      enemySpawnCounter++;
      const spawnInterval = Math.max(30, 75 - wave * 6);
      if (enemySpawnCounter >= spawnInterval) {
        spawnEnemy();
        enemySpawnCounter = 0;
      }

      // Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.x -= e.speed;
        e.y += e.vy;

        if (e.y < 20 || e.y > canvas.height - 20) e.vy *= -1;

        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = e.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = e.color;

        if (e.shape === 'bug') {
          ctx.fillRect(-e.size / 2, -e.size / 2, e.size, e.size);
        } else if (e.shape === 'dart') {
          ctx.beginPath();
          ctx.moveTo(-e.size, -e.size / 2);
          ctx.lineTo(0, 0);
          ctx.lineTo(-e.size, e.size / 2);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, e.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Hit by bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.size + 4) {
            bullets.splice(j, 1);
            e.hp--;
            createExplosion(b.x, b.y, '#FFDF73', 4);

            if (e.hp <= 0) {
              SoundFX.explosion();
              createExplosion(e.x, e.y, e.color, 16);
              const earnedPts = e.pts * combo;
              score += earnedPts;
              addScorePopup(`+${earnedPts}`, e.x, e.y);

              if (Math.random() < 0.45) {
                crystals.push({ x: e.x, y: e.y, vx: -1.5, vy: (Math.random() - 0.5) * 1 });
              }

              if (score > wave * 1800) {
                wave++;
                SoundFX.powerUp();
                addScorePopup(`WAVE ${wave} ENGAGED!`, canvas.width / 2, 80, '#4ADE80');
              }

              enemies.splice(i, 1);
              updateHUD();
              break;
            }
          }
        }

        // Collision with player
        if (enemies[i]) {
          if (Math.hypot(player.x - e.x, player.y - e.y) < e.size + 14) {
            shield -= 25;
            SoundFX.explosion();
            createExplosion(player.x, player.y, '#EF4444', 18);
            enemies.splice(i, 1);
            updateHUD();

            if (shield <= 0) {
              gameOver();
              return;
            }
          } else if (e.x < -30) {
            enemies.splice(i, 1);
          }
        }
      }

      // Crystals
      for (let i = crystals.length - 1; i >= 0; i--) {
        const c = crystals[i];
        c.x += c.vx;
        c.y += c.vy;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(8, 0);
        ctx.lineTo(0, 8);
        ctx.lineTo(-8, 0);
        ctx.closePath();
        ctx.fillStyle = '#FFDF73';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.restore();

        if (Math.hypot(player.x - c.x, player.y - c.y) < 26) {
          crystals.splice(i, 1);
          SoundFX.coin();
          score += 300;
          shield = Math.min(100, shield + 10);
          player.laserLevel = 2;
          player.overdriveTimer = 300;
          addScorePopup('+300 OVERDRIVE!', player.x, player.y - 15, '#FDE047');
          updateHUD();
        } else if (c.x < -20) {
          crystals.splice(i, 1);
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        p.life--;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();

        if (p.life <= 0 || p.alpha <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      // Popups
      for (let i = popups.length - 1; i >= 0; i--) {
        const pop = popups[i];
        pop.y -= 0.8;
        pop.life--;
        pop.alpha -= 0.025;

        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillStyle = pop.color;
        ctx.globalAlpha = Math.max(0, pop.alpha);
        ctx.fillText(pop.text, pop.x, pop.y);

        if (pop.life <= 0 || pop.alpha <= 0) popups.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
      resetGame();
      isPlaying = true;
      if (overlay) overlay.classList.add('hidden');
      SoundFX.powerUp();
      animationId = requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      isPlaying = false;
      cancelAnimationFrame(animationId);
      SoundFX.gameOver();

      if (overlay) {
        overlay.classList.remove('hidden');
        if (overlayTitle) overlayTitle.textContent = 'SYSTEM BREACHED // GAME OVER';
        if (overlaySub) {
          overlaySub.innerHTML = `Final Score: <strong style="color:#FFDF73">${score.toLocaleString()}</strong> | Wave Reached: <strong style="color:#FFDF73">${wave}</strong><br/>High Score: <strong>${highScore.toLocaleString()}</strong>`;
        }
        if (startBtn) startBtn.textContent = 'REDEPLOY AURA-1 (PLAY AGAIN)';
      }
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        SoundFX.uiClick();
        startGame();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (keys.hasOwnProperty(e.code)) keys[e.code] = true;
      if (e.code === 'Space' && isPlaying) e.preventDefault();
    });

    window.addEventListener('keyup', (e) => {
      if (keys.hasOwnProperty(e.code)) keys[e.code] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
      pointer.active = false;
    });

    canvas.addEventListener('mousedown', () => {
      if (isPlaying) fireLaser();
    });

    // Touch Support for Mobile & Tablets
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      pointer.x = touch.clientX - rect.left;
      pointer.y = touch.clientY - rect.top;
      pointer.active = true;
      if (isPlaying) fireLaser();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      pointer.x = touch.clientX - rect.left;
      pointer.y = touch.clientY - rect.top;
      pointer.active = true;
      if (isPlaying && player.fireCooldown === 0) fireLaser();
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      pointer.active = false;
    }, { passive: false });

    // CRT Toggle
    const crtBtn = document.getElementById('toggle-crt-btn');
    const crtOverlay = document.getElementById('crt-overlay');
    if (crtBtn && crtOverlay) {
      crtBtn.addEventListener('click', () => {
        SoundFX.uiClick();
        crtOverlay.classList.toggle('disabled');
        crtBtn.textContent = crtOverlay.classList.contains('disabled') ? 'CRT: OFF' : 'CRT: ON';
      });
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE HACKER COMMAND TERMINAL
  // --------------------------------------------------------------------------
  function initTerminal() {
    const modal = document.getElementById('terminal-modal');
    const launcher = document.getElementById('terminal-launcher');
    const closeBtn = document.getElementById('terminal-close-btn');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!modal || !input || !output) return;

    function openTerminal() {
      modal.classList.remove('hidden');
      if (launcher) launcher.classList.add('hidden');
      SoundFX.uiClick();
      input.focus();
    }

    function closeTerminal() {
      modal.classList.add('hidden');
      if (launcher) launcher.classList.remove('hidden');
      SoundFX.uiClick();
    }

    if (launcher) launcher.addEventListener('click', openTerminal);
    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

    const navTermBtn = document.getElementById('nav-terminal-btn');
    if (navTermBtn) navTermBtn.addEventListener('click', openTerminal);

    window.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~') {
        if (modal.classList.contains('hidden')) openTerminal();
        else closeTerminal();
      }
    });

    const commands = {
      help: `AVAILABLE COMMANDS:
  bio        - Overview of Saransh Gupta
  academics  - Department rank & university record
  projects   - Showcase of 5 featured production systems
  skills     - Technical stack & engineering capabilities
  awards     - Honors & 1st Prize recognitions
  arcade     - Launch Cyber Gold Defender arcade shooter
  cv         - Open official formatted CV modal
  sound      - Toggle Web Audio synthesizer (ON/OFF)
  secret     - Play golden victory fanfare
  clear      - Clear terminal console`,

      bio: `SARANSH GUPTA // FULL STACK DEVELOPER & SOFTWARE ENGINEER
• Focus: Scalable Web Platforms, High-Concurrency APIs, Clean Architecture
• Academic Standout: Ranked 1st in Semester II & Semester IV (Ongoing 5th Sem)
• Winner: 1st Prize MERI-CET & Best Student Innovator 2026
• Location: India • GitHub: github.com/Mr-Saransh`,

      academics: `ACADEMIC HONORS // MERI-CET (Affiliated to MDU)
• B.Tech Computer Science & Engineering (2024 - 2028)
• 🎓 RANK 1ST in Semester II among CSE students
• 🎓 RANK 1ST in Semester IV among CSE students
• Current Standing: Semester V (5th Sem Ongoing)
• Class XII (CBSE): 88%`,

      projects: `FEATURED PRODUCTION PROJECTS:
1. Apni Estate  - Construction ERP & CRM (Next.js, Tailwind, Postgres, Prisma)
2. ACTIFY       - Goal Execution Enforcement Platform (Gamified MVP)
3. COACT        - Real-Time Group Collab & Quizzes (WebSockets - 1st Prize Winner)
4. AI Telemed   - Voice-First AI Healthcare Assistant (Python, NLP, Flask)
5. ATITHI       - Guest House Management SaaS (Flask, SQL, JS)`,

      skills: `ENGINEERING ARSENAL:
• Languages : C++, C, Python, JavaScript, SQL, TypeScript
• Frontend  : React, Next.js, HTML5, CSS3, Tailwind CSS
• Backend   : Flask, REST APIs, WebSockets
• Databases : PostgreSQL, Prisma ORM, SQLite
• Cloud/Dev : Git, GitHub, VS Code, Figma, Vercel, Render, Railway, AWS`,

      awards: `HONORS & ACHIEVEMENTS:
🏆 1st Prize (Software Category) - MERI-CET Project Competition (COACT)
🏆 Best Student Innovator - Startup Carnival Haryana 2026
⭐ Ranked 1st in Semester II & IV CSE - MERI College of Eng & Tech
🥈 2nd Prize - MERI Project Competition`,

      arcade: () => {
        closeTerminal();
        const sec = document.getElementById('arcade');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        return 'Navigating to Cyber Gold Defender Arcade...';
      },

      cv: () => {
        openCVModal();
        return 'Opening official CV modal...';
      },

      sound: () => {
        const enabled = SoundFX.toggleMute();
        updateSoundButtonUI(enabled);
        return `Web Audio Synthesizer: ${enabled ? 'ENABLED 🔊' : 'MUTED 🔇'}`;
      },

      secret: () => {
        SoundFX.powerUp();
        setTimeout(SoundFX.coin, 120);
        return '✨ GOLDEN APEX ACTIVATED: Systems operating at 100% efficiency.';
      },

      clear: () => {
        output.innerHTML = '';
        return '';
      }
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = input.value.trim();
        input.value = '';
        if (!raw) return;

        SoundFX.uiClick();
        const cmd = raw.toLowerCase();

        const line = document.createElement('div');
        line.innerHTML = `<span style="color:#FFDF73">saransh@gold:~$</span> ${raw}`;
        output.appendChild(line);

        const responseDiv = document.createElement('div');
        responseDiv.style.marginBottom = '12px';
        responseDiv.style.color = '#E5E7EB';

        if (commands[cmd]) {
          if (typeof commands[cmd] === 'function') {
            responseDiv.textContent = commands[cmd]();
          } else {
            responseDiv.textContent = commands[cmd];
          }
        } else {
          responseDiv.innerHTML = `<span style="color:#EF4444">Command not recognized: '${cmd}'. Type <strong style="color:#FFDF73">help</strong> for valid commands.</span>`;
        }

        output.appendChild(responseDiv);
        modal.querySelector('.terminal-body').scrollTop = modal.querySelector('.terminal-body').scrollHeight;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. PROJECT FILTER & 3D TILT CARDS
  // --------------------------------------------------------------------------
  function initProjectCards() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.project-card');

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        SoundFX.uiClick();
        filterTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        cards.forEach((card) => {
          if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 3D Perspective Tilt on Hover
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });

      card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project-id');
        openProjectDetailModal(projectId);
      });
    });
  }

  const projectDetails = {
    'apni-estate': {
      title: 'Apni Estate — Construction ERP & CRM',
      category: 'Full-Stack Enterprise',
      tech: ['Next.js', 'React', 'Tailwind CSS', 'PostgreSQL', 'Prisma ORM'],
      bullets: [
        'Engineered role-based access for Builders, Supervisors, Project Managers, Accountants, Sales Executives, and Admins.',
        'Automated multi-department construction workflows: procurement, inventory management, purchase orders, billing, and attendance tracking.',
        'Built scalable relational data models and responsive UI components capable of handling thousands of daily operations.'
      ]
    },
    actify: {
      title: 'ACTIFY — Execution Enforcement Platform',
      category: 'Gamified Execution Engine',
      tech: ['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Prisma ORM'],
      bullets: [
        'Built a high-accountability system that transforms long-term objectives into mandatory daily execution backed by proof verification.',
        'Designed gamified feedback mechanics: ACT Points, ACT Currency, dynamic streaks, penalty deductions, and automated task locking.',
        'Shipped and tested functional MVP with active user cohorts to optimize retention and goal-completion rates.'
      ]
    },
    coact: {
      title: 'COACT — Real-Time Group Interaction Platform',
      category: '🏆 1st Prize Winner @ MERI-CET',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'WebSockets'],
      bullets: [
        'Awarded First Prize (Software Category) at the prestigious MERI-CET Project Competition.',
        'Designed synchronized group study sessions with live quizzes, participant presence, and interactive polling over WebSockets.',
        'Built interactive gamification modules including Trivia Night, Word Chain, collaborative Q&A boards, and live leaderboards.'
      ]
    },
    telemed: {
      title: 'AI Telemedicine Application',
      category: 'Voice-First AI Healthcare',
      tech: ['Python', 'NLP', 'Flask', 'SQLite'],
      bullets: [
        'Designed for low-literacy and multilingual users in underserved communities with an intuitive voice-driven conversational interface.',
        'Integrated NLP symptom analysis pipelines to translate free-form spoken complaints into preliminary medical insights.',
        'Minimized reliance on complex UI hierarchies, making health assistance accessible to anyone with a microphone.'
      ]
    },
    atithi: {
      title: 'ATITHI — Guest House Management SaaS',
      category: 'Hospitality SaaS',
      tech: ['Python (Flask)', 'HTML5', 'CSS3', 'JavaScript', 'SQL'],
      bullets: [
        'End-to-end guest house management streamlining room allocations, customer records, and administrative reservations.',
        'Implemented secure authentication, CRUD operations, and centralized operational dashboards for hospitality administrators.'
      ]
    }
  };

  function openProjectDetailModal(id) {
    const data = projectDetails[id];
    if (!data) return;

    SoundFX.uiClick();
    const modal = document.getElementById('project-modal');
    const content = document.getElementById('project-modal-body');

    content.innerHTML = `
      <div style="margin-bottom: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #FFDF73;">
        ${data.category}
      </div>
      <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 26px; margin-bottom: 16px; color: #FFFFFF;">
        ${data.title}
      </h2>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
        ${data.tech.map((t) => `<span class="tech-tag" style="background: rgba(212,175,55,0.15); border-color: rgba(212,175,55,0.3); color: #FFDF73;">${t}</span>`).join('')}
      </div>
      <h4 style="color: #FFDF73; margin-bottom: 12px; font-size: 15px;">Key Architecture & Deliverables:</h4>
      <ul style="list-style: none; padding: 0; margin-bottom: 24px;">
        ${data.bullets.map((b) => `<li style="position: relative; padding-left: 20px; margin-bottom: 10px; font-size: 14px; color: #D1D5DB; line-height: 1.6;"><span style="position: absolute; left: 0; color: #D4AF37;">✦</span>${b}</li>`).join('')}
      </ul>
      <div style="display: flex; gap: 12px;">
        <a href="https://github.com/Mr-Saransh" target="_blank" class="btn btn-gold" style="padding: 8px 18px; font-size: 13px;">
          View on GitHub ↗
        </a>
      </div>
    `;

    modal.classList.add('active');
  }

  // --------------------------------------------------------------------------
  // 6. CV VIEWER MODAL
  // --------------------------------------------------------------------------
  function openCVModal() {
    SoundFX.uiClick();
    const modal = document.getElementById('cv-modal');
    if (modal) modal.classList.add('active');
  }

  function initModals() {
    const projectModal = document.getElementById('project-modal');
    const cvModal = document.getElementById('cv-modal');
    const closeBtns = document.querySelectorAll('.modal-close-btn');

    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        SoundFX.uiClick();
        if (projectModal) projectModal.classList.remove('active');
        if (cvModal) cvModal.classList.remove('active');
      });
    });

    [projectModal, cvModal].forEach((m) => {
      if (m) {
        m.addEventListener('click', (e) => {
          if (e.target === m) {
            SoundFX.uiClick();
            m.classList.remove('active');
          }
        });
      }
    });

    const openCVButtons = document.querySelectorAll('.btn-open-cv');
    openCVButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCVModal();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. SOUND TOGGLE BUTTON UI
  // --------------------------------------------------------------------------
  function updateSoundButtonUI(enabled) {
    const btn = document.getElementById('nav-sound-btn');
    if (btn) {
      btn.innerHTML = enabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    }
  }

  function initSoundToggle() {
    const btn = document.getElementById('nav-sound-btn');
    if (btn) {
      updateSoundButtonUI(!SoundFX.isMuted());
      btn.addEventListener('click', () => {
        const enabled = SoundFX.toggleMute();
        updateSoundButtonUI(enabled);
        if (enabled) SoundFX.uiClick();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. INITIALIZE ALL ON DOM LOAD
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    SoundFX.initOnFirstInteraction();
    initBackgroundCanvas();
    initCyberArcade();
    initTerminal();
    initProjectCards();
    initModals();
    initSoundToggle();
  });
})();
