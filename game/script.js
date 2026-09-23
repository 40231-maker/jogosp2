/**
 * WAR OF THE IMPERIUM - JOGO 2D TOP-DOWN (WARHAMMER 40,000 THEMED)
 * Vanilla JavaScript puro, HTML5 Canvas API e Web Audio API.
 * Sem frameworks externos, totalmente auto-contido.
 */

/* ==========================================================================
   1. GERENCIADOR DE ÁUDIO PROCEDURAL (WEB AUDIO API)
   Gera efeitos sonoros sintetizados em tempo real, sem necessidade de arquivos.
   ========================================================================== */
class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterVolume = 0.8;
    this.sfxEnabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API não suportada neste ambiente.', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tiros do Bolter: Impacto mecânico pesado com estalo e queda de frequência
  playBolter() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.09);

    gain.gain.setValueAtTime(0.35 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    // Ruído percussivo de impacto metálico
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4 * this.masterVolume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
    noise.start(t);
    noise.stop(t + 0.08);
  }

  // Plasma Gun: Carga futurista, zumbido brilhante e descarga de energia
  playPlasma() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.25);

    gain.gain.setValueAtTime(0.4 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  // Explosão de Plasma ou Barril
  playExplosion(isPlasma = false) {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const dur = isPlasma ? 0.4 : 0.6;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isPlasma ? 800 : 400, t);
    filter.frequency.linearRampToValueAtTime(60, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.55 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + dur);
  }

  // Power Sword: Corte elétrico com zumbido disruptor
  playSwordSwing() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.2);

    gain.gain.setValueAtTime(0.45 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Dano no Jogador (Ceramite deflect / grunt)
  playPlayerHurt() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    gain.gain.setValueAtTime(0.35 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  // Inimigo Sofre Dano / Morre
  playEnemyDeath() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180 + Math.random() * 50, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.18);

    gain.gain.setValueAtTime(0.25 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Alerta de Início de Onda (Corneta de Guerra Imperial)
  playWaveStart() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const notes = [130.81, 164.81, 196.00]; // Dó, Mi, Sol solenes
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);

      gain.gain.setValueAtTime(0.25 * this.masterVolume, t + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8 + idx * 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.1);
      osc.stop(t + 0.9 + idx * 0.1);
    });
  }

  // Rugido do Boss ao entrar na arena
  playBossRoar() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, t);
    osc.frequency.linearRampToValueAtTime(130, t + 0.4);
    osc.frequency.exponentialRampToValueAtTime(40, t + 1.2);

    gain.gain.setValueAtTime(0.5 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 1.2);
  }

  // Vitória
  playVictory() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 523.25];
    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.3 * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 2.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.0);
    });
  }

  // Game Over (Sino fúnebre sombrio)
  playGameOver() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(98, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 1.8);

    gain.gain.setValueAtTime(0.5 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 2.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 2.0);
  }

  // Troca de Armas
  playWeaponSwitch() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(580, t + 0.05);

    gain.gain.setValueAtTime(0.18 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }
}

/* ==========================================================================
   2. SISTEMA DE PARTÍCULAS E DECALQUES DE SANGUE
   ========================================================================== */
class Particle {
  constructor(x, y, vx, vy, color, size, life, type = 'spark') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.type = type;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 6;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.vRot * dt;
    this.life -= dt;

    if (this.type === 'spark' || this.type === 'casing') {
      this.vx *= 0.94;
      this.vy *= 0.94;
    } else if (this.type === 'smoke') {
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.size += dt * 4;
    }
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'spark') {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else if (this.type === 'smoke') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'casing') {
      // Cápsula de bolter de latão dourado
      ctx.fillStyle = '#f5c542';
      ctx.fillRect(-3, -1.5, 6, 3);
      ctx.fillStyle = '#b8891f';
      ctx.fillRect(-3, -1.5, 1.5, 3);
    }

    ctx.restore();
  }
}

// Decalque de sangue ou marca de queimadura fixada no chão
class FloorDecal {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.life = 45; // Permanece por bastante tempo
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.65, this.life / 10);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Texto flutuante de dano e pontuação
class FloatingText {
  constructor(x, y, text, color = '#fff', isCrit = false) {
    this.x = x + (Math.random() - 0.5) * 16;
    this.y = y;
    this.text = text;
    this.color = color;
    this.isCrit = isCrit;
    this.life = 0.9;
    this.vy = -45;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / 0.9);
    ctx.font = this.isCrit ? '900 16px "Orbitron", monospace' : '700 13px "Share Tech Mono", monospace';
    ctx.fillStyle = this.color;
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.decals = [];
    this.floatingTexts = [];
    this.maxDecals = 120;
    this.maxParticles = 250;
  }

  addSpark(x, y, color = '#ffaa33', count = 5) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 180;
      this.particles.push(
        new Particle(
          x, y,
          Math.cos(angle) * speed, Math.sin(angle) * speed,
          color, 2 + Math.random() * 3, 0.25 + Math.random() * 0.35, 'spark'
        )
      );
    }
  }

  addSmoke(x, y, count = 3, color = 'rgba(120, 120, 130, 0.4)') {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 35;
      this.particles.push(
        new Particle(
          x, y,
          Math.cos(angle) * speed, Math.sin(angle) * speed,
          color, 6 + Math.random() * 8, 0.6 + Math.random() * 0.5, 'smoke'
        )
      );
    }
  }

  addCasing(x, y, dirAngle) {
    if (this.particles.length >= this.maxParticles) return;
    const ejectAngle = dirAngle + Math.PI / 2 + (Math.random() - 0.5) * 0.4;
    const speed = 70 + Math.random() * 60;
    this.particles.push(
      new Particle(
        x, y,
        Math.cos(ejectAngle) * speed, Math.sin(ejectAngle) * speed,
        '#f5c542', 3, 0.6 + Math.random() * 0.4, 'casing'
      )
    );
  }

  addBlood(x, y, count = 10, isDemon = false) {
    const color = isDemon ? '#781515' : '#8f0d14';
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 150;
      this.particles.push(
        new Particle(
          x, y,
          Math.cos(angle) * speed, Math.sin(angle) * speed,
          color, 3 + Math.random() * 4, 0.4 + Math.random() * 0.3, 'spark'
        )
      );
    }

    // Marca no chão
    if (this.decals.length >= this.maxDecals) {
      this.decals.shift();
    }
    this.decals.push(new FloorDecal(x, y, 6 + Math.random() * 12, color));
  }

  addFloatingText(x, y, text, color = '#fff', isCrit = false) {
    this.floatingTexts.push(new FloatingText(x, y, text, color, isCrit));
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].update(dt);
      if (this.floatingTexts[i].life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    for (let i = this.decals.length - 1; i >= 0; i--) {
      this.decals[i].life -= dt;
      if (this.decals[i].life <= 0) {
        this.decals.splice(i, 1);
      }
    }
  }

  drawDecals(ctx) {
    for (let i = 0; i < this.decals.length; i++) {
      this.decals[i].draw(ctx);
    }
  }

  drawParticles(ctx) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(ctx);
    }
    for (let i = 0; i < this.floatingTexts.length; i++) {
      this.floatingTexts[i].draw(ctx);
    }
  }

  clear() {
    this.particles = [];
    this.decals = [];
    this.floatingTexts = [];
  }
}

/* ==========================================================================
   3. ARMAS E PROJÉTEIS
   ========================================================================== */
class Projectile {
  constructor(x, y, angle, type, damage, shooter = 'player') {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.type = type; // 'bolter', 'plasma', 'chaos_bolt'
    this.damage = damage;
    this.shooter = shooter;
    this.toRemove = false;

    if (type === 'bolter') {
      this.speed = 920;
      this.radius = 4;
      this.range = 800;
      this.color = '#ffd15c';
    } else if (type === 'plasma') {
      this.speed = 580;
      this.radius = 8;
      this.range = 950;
      this.color = '#00f0ff';
      this.splashRadius = 85;
      this.splashDamage = 60;
    } else if (type === 'chaos_bolt') {
      this.speed = 460;
      this.radius = 6;
      this.range = 750;
      this.color = '#ff2a4a';
    }

    this.traveled = 0;
  }

  update(dt, game) {
    const dist = this.speed * dt;
    this.x += Math.cos(this.angle) * dist;
    this.y += Math.sin(this.angle) * dist;
    this.traveled += dist;

    // Rastro do projétil
    if (this.type === 'plasma' && Math.random() < 0.6) {
      game.particles.addSpark(this.x, this.y, '#00e5ff', 1);
    } else if (this.type === 'chaos_bolt' && Math.random() < 0.6) {
      game.particles.addSpark(this.x, this.y, '#ff1133', 1);
    }

    if (this.traveled >= this.range) {
      this.explode(game);
    }
  }

  explode(game) {
    this.toRemove = true;
    if (this.type === 'plasma') {
      game.sound.playExplosion(true);
      game.particles.addSpark(this.x, this.y, '#00f0ff', 18);
      game.particles.addSmoke(this.x, this.y, 8, 'rgba(0, 200, 255, 0.4)');
      game.camera.shake(5, 0.2);

      // Dano de área do plasma
      for (const enemy of game.enemies) {
        const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (d <= this.splashRadius + enemy.radius) {
          enemy.takeDamage(this.splashDamage, game, false);
        }
      }
      // Dano em barris
      for (const barrel of game.map.barrels) {
        if (!barrel.exploded) {
          const d = Math.hypot(barrel.x - this.x, barrel.y - this.y);
          if (d <= this.splashRadius + barrel.radius) {
            barrel.takeDamage(this.splashDamage, game);
          }
        }
      }
    } else if (this.type === 'bolter') {
      game.particles.addSpark(this.x, this.y, '#ffcc44', 4);
      game.particles.addSmoke(this.x, this.y, 2);
    } else if (this.type === 'chaos_bolt') {
      game.particles.addSpark(this.x, this.y, '#ff2244', 6);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.type === 'bolter') {
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#ffbb33';
      ctx.shadowBlur = 6;
      ctx.fillRect(-7, -2, 14, 4);
    } else if (this.type === 'plasma') {
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (this.type === 'chaos_bolt') {
      ctx.fillStyle = '#ff3355';
      ctx.shadowColor = '#ff0033';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Golpe da Power Sword (efeito de arco elétrico corpo a corpo)
class MeleeSlash {
  constructor(x, y, angle, range = 85, arc = 1.8) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.range = range;
    this.arc = arc; // Em radianos
    this.life = 0.16;
    this.maxLife = 0.16;
  }

  update(dt) {
    this.life -= dt;
  }

  draw(ctx) {
    const progress = 1 - (this.life / this.maxLife);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.strokeStyle = `rgba(100, 220, 255, ${1 - progress})`;
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.arc(0, 0, this.range, -this.arc / 2, this.arc / 2);
    ctx.stroke();

    // Faíscas elétricas internas
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.range - 4, -this.arc / 2 + 0.2, this.arc / 2 - 0.2);
    ctx.stroke();

    ctx.restore();
  }
}

/* ==========================================================================
   4. JOGADOR (SPACE MARINE)
   ========================================================================== */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.speed = 195; // Movimento com peso militar de armadura pesada
    this.vx = 0;
    this.vy = 0;
    this.aimAngle = 0;

    // Atributos de Vida e Armadura
    this.maxHp = 100;
    this.hp = 100;
    this.maxArmor = 50;
    this.armor = 50;

    // Armas e Munição
    this.currentWeaponIndex = 1; // 1: Bolter, 2: Plasma Gun, 3: Power Sword
    this.weapons = {
      1: {
        name: 'BOLTER',
        damage: 38,
        fireRate: 0.16,
        lastFireTime: 0,
        ammo: 120,
        maxAmmo: 240,
        mag: 30,
        maxMag: 30,
        type: 'bolter'
      },
      2: {
        name: 'PLASMA GUN',
        damage: 100,
        fireRate: 0.72,
        lastFireTime: 0,
        ammo: 30,
        maxAmmo: 60,
        mag: 10,
        maxMag: 10,
        type: 'plasma'
      },
      3: {
        name: 'POWER SWORD',
        damage: 180,
        fireRate: 0.48,
        lastFireTime: 0,
        ammo: Infinity,
        maxAmmo: Infinity,
        mag: 1,
        maxMag: 1,
        type: 'sword'
      }
    };

    this.swordCooldown = 0; // Cooldown dedicado para ataque com espaço
    this.isReloading = false;
    this.reloadTimer = 0;
    this.reloadDuration = 1.4;

    this.walkCycle = 0;
    this.muzzleFlash = 0;
  }

  takeDamage(amount, game) {
    if (this.hp <= 0) return;

    // Armadura absorve até 75% do dano enquanto estiver ativa
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, amount * 0.75);
      this.armor -= absorbed;
      amount -= absorbed;
      game.particles.addSpark(this.x, this.y, '#38bdf8', 6);
    }

    this.hp = Math.max(0, this.hp - amount);
    game.sound.playPlayerHurt();
    game.camera.shake(7, 0.25);
    game.triggerDamageVignette();
    game.particles.addBlood(this.x, this.y, 5);

    if (this.hp <= 0) {
      game.triggerGameOver();
    }
  }

  switchWeapon(index, game) {
    if (index === this.currentWeaponIndex || !this.weapons[index]) return;
    this.currentWeaponIndex = index;
    this.isReloading = false;
    game.sound.playWeaponSwitch();
    game.updateHUDWeapons();
  }

  reload(game) {
    const w = this.weapons[this.currentWeaponIndex];
    if (w.type === 'sword' || this.isReloading) return;
    if (w.mag >= w.maxMag || w.ammo <= 0) return;

    this.isReloading = true;
    this.reloadTimer = this.reloadDuration;
    game.sound.playWeaponSwitch();
  }

  fire(game) {
    if (this.isReloading) return;
    const now = performance.now() / 1000;
    const w = this.weapons[this.currentWeaponIndex];

    if (now - w.lastFireTime < w.fireRate) return;

    if (w.type === 'sword') {
      this.performSwordSlash(game);
      w.lastFireTime = now;
      return;
    }

    if (w.mag <= 0) {
      this.reload(game);
      return;
    }

    // Disparo de Bolter ou Plasma
    w.lastFireTime = now;
    w.mag--;
    this.muzzleFlash = 0.08;

    // Posição da ponta do cano
    const gunOffsetDist = 26;
    const gunSideOffset = 10;
    const spawnX = this.x + Math.cos(this.aimAngle) * gunOffsetDist - Math.sin(this.aimAngle) * gunSideOffset;
    const spawnY = this.y + Math.sin(this.aimAngle) * gunOffsetDist + Math.cos(this.aimAngle) * gunSideOffset;

    if (w.type === 'bolter') {
      const spread = (Math.random() - 0.5) * 0.08;
      game.projectiles.push(new Projectile(spawnX, spawnY, this.aimAngle + spread, 'bolter', w.damage, 'player'));
      game.sound.playBolter();
      game.particles.addCasing(this.x, this.y, this.aimAngle);
      game.particles.addSpark(spawnX, spawnY, '#ffaa22', 3);
      game.camera.shake(1.5, 0.08);
    } else if (w.type === 'plasma') {
      game.projectiles.push(new Projectile(spawnX, spawnY, this.aimAngle, 'plasma', w.damage, 'player'));
      game.sound.playPlasma();
      game.particles.addSpark(spawnX, spawnY, '#00f0ff', 6);
      game.camera.shake(3.5, 0.15);
    }

    game.updateHUDAmmo();
  }

  performSwordSlash(game) {
    const now = performance.now() / 1000;
    if (now - this.swordCooldown < 0.45) return;
    this.swordCooldown = now;

    game.sound.playSwordSwing();
    game.slashes.push(new MeleeSlash(this.x, this.y, this.aimAngle, 95, 2.0));
    game.camera.shake(2.8, 0.12);

    const hitRange = 95;
    const hitArc = 2.0;
    let hitCount = 0;

    for (const enemy of game.enemies) {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= hitRange + enemy.radius) {
        let angleToEnemy = Math.atan2(dy, dx);
        let diff = Math.abs(angleToEnemy - this.aimAngle);
        while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);

        if (diff <= hitArc / 2) {
          enemy.takeDamage(this.weapons[3].damage, game, true);
          game.particles.addBlood(enemy.x, enemy.y, 8, enemy.type === 'demon');
          game.particles.addSpark(enemy.x, enemy.y, '#85d7ff', 8);
          hitCount++;
        }
      }
    }

    // Barris cortados
    for (const barrel of game.map.barrels) {
      if (!barrel.exploded) {
        const d = Math.hypot(barrel.x - this.x, barrel.y - this.y);
        if (d <= hitRange + barrel.radius) {
          barrel.takeDamage(100, game);
        }
      }
    }
  }

  update(dt, game) {
    // Atualiza recarga
    if (this.isReloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        const w = this.weapons[this.currentWeaponIndex];
        const needed = w.maxMag - w.mag;
        const toLoad = Math.min(needed, w.ammo);
        w.mag += toLoad;
        w.ammo -= toLoad;
        game.updateHUDAmmo();
      }
    }

    // Muzzle Flash
    if (this.muzzleFlash > 0) {
      this.muzzleFlash -= dt;
    }

    // Movimentação com entrada de teclado WASD
    let moveX = 0;
    let moveY = 0;
    if (game.keys['KeyW'] || game.keys['ArrowUp']) moveY -= 1;
    if (game.keys['KeyS'] || game.keys['ArrowDown']) moveY += 1;
    if (game.keys['KeyA'] || game.keys['ArrowLeft']) moveX -= 1;
    if (game.keys['KeyD'] || game.keys['ArrowRight']) moveX += 1;

    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071;
      moveY *= 0.7071;
    }

    this.vx = moveX * this.speed;
    this.vy = moveY * this.speed;

    const nextX = this.x + this.vx * dt;
    const nextY = this.y + this.vy * dt;

    // Resolução de colisão com paredes e obstáculos
    const resolved = game.map.resolveCircleCollision(this.x, this.y, nextX, nextY, this.radius);
    this.x = resolved.x;
    this.y = resolved.y;

    if (this.vx !== 0 || this.vy !== 0) {
      this.walkCycle += dt * 10;
    }

    // Mirar arma para posição do mouse no mundo
    const worldMouseX = game.mouse.x + game.camera.x;
    const worldMouseY = game.mouse.y + game.camera.y;
    this.aimAngle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x);

    // Disparo contínuo com botão esquerdo
    if (game.mouse.isDown) {
      this.fire(game);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.aimAngle);

    // Efeito de passos
    const bob = Math.sin(this.walkCycle) * 2;

    // Sombra da Armadura
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 3, 22, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mochila de Energia (Power Pack dos Space Marines)
    ctx.fillStyle = '#1c222e';
    ctx.fillRect(-17, -11, 10, 22);
    // Vents esféricos laterais da mochila
    ctx.fillStyle = '#2d3748';
    ctx.beginPath();
    ctx.arc(-13, -13, 5, 0, Math.PI * 2);
    ctx.arc(-13, 13, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f3ce70';
    ctx.fillRect(-14, -2, 4, 4);

    // Tronco e Peitoral da Armadura de Ceramite
    ctx.fillStyle = '#222938';
    ctx.beginPath();
    ctx.ellipse(-2, 0, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Águia Imperial Dourada no peito
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-2, -3, 5, 6);

    // Ombreiras Gigantes Blindadas (Pauldrons)
    // Ombreira Esquerda
    ctx.fillStyle = '#181e2b';
    ctx.beginPath();
    ctx.ellipse(-2, -15 + bob * 0.5, 9, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ombreira Direita (segura arma)
    ctx.fillStyle = '#181e2b';
    ctx.beginPath();
    ctx.ellipse(-2, 15 - bob * 0.5, 9, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Braços segurando o armamento
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(4, -8, 12, 6);
    ctx.fillRect(4, 3, 16, 6);

    // Desenho da Arma ativa
    const currentW = this.weapons[this.currentWeaponIndex];
    if (currentW.type === 'bolter') {
      // Bolter pesado preto e dourado
      ctx.fillStyle = '#11141a';
      ctx.fillRect(10, 2, 22, 7);
      ctx.fillStyle = '#9e812d';
      ctx.fillRect(12, 3, 6, 5);
      // Cano duplo de ventilação
      ctx.fillStyle = '#444';
      ctx.fillRect(32, 3, 3, 5);
    } else if (currentW.type === 'plasma') {
      // Plasma Gun com espiras azuis brilhantes
      ctx.fillStyle = '#161d26';
      ctx.fillRect(10, 1, 24, 9);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(14, 2, 12, 7);
      ctx.shadowBlur = 0;
    } else if (currentW.type === 'sword') {
      // Power Sword com lâmina energética reluzente
      ctx.fillStyle = '#555';
      ctx.fillRect(10, 4, 10, 4); // Guarda
      ctx.fillStyle = '#bdf4ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
      ctx.fillRect(20, 5, 26, 3);
      ctx.shadowBlur = 0;
    }

    // Muzzle Flash
    if (this.muzzleFlash > 0) {
      ctx.fillStyle = currentW.type === 'plasma' ? '#00ffff' : '#ffea78';
      ctx.beginPath();
      ctx.arc(36, 5, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Capacete Space Marine (com lentes ópticas iluminadas)
    ctx.fillStyle = '#222938';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3b475c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Grade frontal do respirador (vox grill)
    ctx.fillStyle = '#11141a';
    ctx.fillRect(5, -3, 3, 6);

    // Visores / Lentes Vermelhas Iluminadas
    ctx.fillStyle = '#ff2233';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 6;
    ctx.fillRect(4, -5, 3, 2.5);
    ctx.fillRect(4, 2.5, 3, 2.5);
    ctx.shadowBlur = 0;

    ctx.restore();
  }
}

/* ==========================================================================
   5. INIMIGOS E BOSS (CHAOS CHAMPION)
   ========================================================================== */
class Enemy {
  constructor(x, y, type = 'soldier') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.toRemove = false;
    this.attackCooldown = 0;

    if (type === 'soldier') {
      // Cultista básico
      this.radius = 16;
      this.maxHp = 50;
      this.hp = 50;
      this.speed = 155;
      this.damage = 10;
      this.scoreValue = 100;
      this.color = '#7d6853';
    } else if (type === 'marine') {
      // Chaos Marine
      this.radius = 21;
      this.maxHp = 170;
      this.hp = 170;
      this.speed = 115;
      this.damage = 22;
      this.scoreValue = 250;
      this.color = '#3b1216';
      this.rangedCooldown = 2.0;
    } else if (type === 'demon') {
      // Demônio do Caos (veloz e feroz)
      this.radius = 17;
      this.maxHp = 85;
      this.hp = 85;
      this.speed = 210;
      this.damage = 24;
      this.scoreValue = 350;
      this.color = '#aa1919';
    }
  }

  takeDamage(amount, game, isCrit = false) {
    this.hp -= amount;
    game.particles.addFloatingText(this.x, this.y, `-${Math.round(amount)}`, isCrit ? '#f3ce70' : '#ffffff', isCrit);
    game.particles.addBlood(this.x, this.y, 4, this.type === 'demon');

    if (this.hp <= 0 && !this.toRemove) {
      this.toRemove = true;
      game.sound.playEnemyDeath();
      game.addScore(this.scoreValue, this.x, this.y);
      game.killsCount++;
      game.particles.addBlood(this.x, this.y, 14, this.type === 'demon');

      // Chance de derrubar munição ou kit médico
      if (Math.random() < 0.28) {
        game.map.spawnPickup(this.x, this.y);
      }
    }
  }

  update(dt, game) {
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    const dx = game.player.x - this.x;
    const dy = game.player.y - this.y;
    const dist = Math.hypot(dx, dy);

    const angle = Math.atan2(dy, dx);
    this.angle = angle;

    // Disparo à distância para Chaos Marine
    if (this.type === 'marine') {
      if (!this.rangedTimer) this.rangedTimer = 1.5;
      this.rangedTimer -= dt;
      if (this.rangedTimer <= 0 && dist < 550 && dist > 120) {
        this.rangedTimer = 2.2 + Math.random() * 0.8;
        game.projectiles.push(new Projectile(this.x, this.y, angle, 'chaos_bolt', 16, 'enemy'));
        game.particles.addSpark(this.x, this.y, '#ff1133', 4);
      }
    }

    // Movimentação em direção ao jogador com evasão de outros inimigos
    let moveSpeed = this.speed;
    let targetX = this.x + Math.cos(angle) * moveSpeed * dt;
    let targetY = this.y + Math.sin(angle) * moveSpeed * dt;

    // Resolução de colisão com mapa
    const resolved = game.map.resolveCircleCollision(this.x, this.y, targetX, targetY, this.radius);
    this.x = resolved.x;
    this.y = resolved.y;

    // Ataque corpo a corpo no jogador
    if (dist <= this.radius + game.player.radius + 4) {
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 0.8;
        game.player.takeDamage(this.damage, game);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle || 0);

    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    if (this.type === 'soldier') {
      // Cultista traidor com capuz e arma de cano serrado
      ctx.fillStyle = '#4a3b2c';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Olhos amarelos corrompidos
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(4, -3, 2, 2);
      ctx.fillRect(4, 1, 2, 2);

      // Arma improvisada
      ctx.fillStyle = '#333';
      ctx.fillRect(6, 2, 12, 3);
    } else if (this.type === 'marine') {
      // Chaos Marine corrompido com chifres e armadura espinhosa
      ctx.fillStyle = '#22080a';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#a87922';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Chifres heréticos saindo do elmo
      ctx.strokeStyle = '#c49a3c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-4, -14);
      ctx.lineTo(-12, -22);
      ctx.moveTo(-4, 14);
      ctx.lineTo(-12, 22);
      ctx.stroke();

      // Visor verde doente ou vermelho
      ctx.fillStyle = '#33ff55';
      ctx.fillRect(6, -4, 3, 3);
      ctx.fillRect(6, 1, 3, 3);

      // Bolter corrompido
      ctx.fillStyle = '#111';
      ctx.fillRect(8, 4, 16, 6);
    } else if (this.type === 'demon') {
      // Demônio carmesim esguio com chifres e olhos incandescentes
      ctx.fillStyle = '#8f0d14';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Garras e chifres
      ctx.fillStyle = '#200508';
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(-14, -18);
      ctx.lineTo(-2, -10);
      ctx.moveTo(-6, 10);
      ctx.lineTo(-14, 18);
      ctx.lineTo(-2, 10);
      ctx.fill();

      // Olhos incandescentes
      ctx.fillStyle = '#ffff33';
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 8;
      ctx.fillRect(6, -4, 3, 3);
      ctx.fillRect(6, 1, 3, 3);
      ctx.shadowBlur = 0;
    }

    // Mini barra de vida sobre o inimigo
    if (this.hp < this.maxHp) {
      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.rotate(-this.angle);
      ctx.fillStyle = '#000';
      ctx.fillRect(-15, -24, 30, 4);
      ctx.fillStyle = this.type === 'marine' ? '#ff3344' : '#ffbb33';
      ctx.fillRect(-15, -24, 30 * pct, 4);
    }

    ctx.restore();
  }
}

// BOSS: CHAOS CHAMPION (HERALD OF THE WARP)
class BossChampion extends Enemy {
  constructor(x, y) {
    super(x, y, 'boss');
    this.radius = 38;
    this.maxHp = 1000;
    this.hp = 1000;
    this.speed = 135;
    this.damage = 35;
    this.scoreValue = 5000;

    // Fases e Padrões de Ataque
    this.state = 'chase'; // 'chase', 'charging', 'casting', 'summoning'
    this.stateTimer = 2.5;
    this.chargeDir = 0;
    this.chargeSpeed = 380;
    this.summonMilestones = [750, 500, 250];

    this.auraAngle = 0;
  }

  takeDamage(amount, game, isCrit = false) {
    super.takeDamage(amount, game, isCrit);
    game.updateBossHUD(this.hp, this.maxHp);

    // Checa invocação de reforços por HP
    if (this.summonMilestones.length > 0 && this.hp <= this.summonMilestones[0]) {
      this.summonMilestones.shift();
      this.triggerSummon(game);
    }
  }

  triggerSummon(game) {
    game.sound.playBossRoar();
    game.camera.shake(8, 0.4);
    game.particles.addSmoke(this.x, this.y, 20, 'rgba(150, 10, 30, 0.6)');
    game.particles.addSpark(this.x, this.y, '#ff1133', 30);

    // Invoca servos cultistas e demônios
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 / 3) * i;
      const sx = this.x + Math.cos(angle) * 75;
      const sy = this.y + Math.sin(angle) * 75;
      const type = Math.random() < 0.5 ? 'demon' : 'soldier';
      game.enemies.push(new Enemy(sx, sy, type));
      game.aliveEnemiesCount++;
    }
    game.updateHUDEnemies();
  }

  update(dt, game) {
    this.auraAngle += dt * 3;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    const dx = game.player.x - this.x;
    const dy = game.player.y - this.y;
    const dist = Math.hypot(dx, dy);
    this.angle = Math.atan2(dy, dx);

    this.stateTimer -= dt;

    if (this.state === 'chase') {
      // Perseguição normal
      const tx = this.x + Math.cos(this.angle) * this.speed * dt;
      const ty = this.y + Math.sin(this.angle) * this.speed * dt;
      const res = game.map.resolveCircleCollision(this.x, this.y, tx, ty, this.radius);
      this.x = res.x;
      this.y = res.y;

      if (this.stateTimer <= 0) {
        // Alterna entre investir furiosa ou rajada do caos
        if (Math.random() < 0.5) {
          this.state = 'charging';
          this.stateTimer = 1.3;
          this.chargeDir = this.angle;
          game.sound.playBossRoar();
          game.camera.shake(6, 0.3);
        } else {
          this.state = 'casting';
          this.stateTimer = 1.6;
          this.castChaosVolley(game);
        }
      }
    } else if (this.state === 'charging') {
      // Investida berserk em linha reta deixando rastro de fogo
      const cx = this.x + Math.cos(this.chargeDir) * this.chargeSpeed * dt;
      const cy = this.y + Math.sin(this.chargeDir) * this.chargeSpeed * dt;
      const res = game.map.resolveCircleCollision(this.x, this.y, cx, cy, this.radius);
      this.x = res.x;
      this.y = res.y;

      game.particles.addSpark(this.x, this.y, '#ff3311', 2);
      if (Math.random() < 0.3) {
        game.particles.addSmoke(this.x, this.y, 2, 'rgba(80, 0, 10, 0.5)');
      }

      if (this.stateTimer <= 0) {
        this.state = 'chase';
        this.stateTimer = 2.8;
      }
    } else if (this.state === 'casting') {
      if (this.stateTimer <= 0) {
        this.state = 'chase';
        this.stateTimer = 2.4;
      }
    }

    // Ataque de contato devastador
    if (dist <= this.radius + game.player.radius + 6) {
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 0.9;
        game.player.takeDamage(this.damage, game);
        game.camera.shake(7, 0.25);
      }
    }
  }

  castChaosVolley(game) {
    game.sound.playExplosion(false);
    game.camera.shake(5, 0.25);
    const numShots = 8;
    for (let i = 0; i < numShots; i++) {
      const shotAngle = (Math.PI * 2 / numShots) * i + (Math.random() - 0.5) * 0.2;
      game.projectiles.push(new Projectile(this.x, this.y, shotAngle, 'chaos_bolt', 18, 'boss'));
    }
    game.particles.addSpark(this.x, this.y, '#ff0033', 20);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Aura demoníaca rotativa do Caos
    ctx.strokeStyle = 'rgba(255, 30, 50, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 8 + Math.sin(this.auraAngle) * 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.rotate(this.angle);

    // Sombra imensa
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Armadura de Exterminador Profanada (Chaos Terminator Plate)
    ctx.fillStyle = '#1a0507';
    ctx.beginPath();
    ctx.ellipse(0, 0, 28, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cda851';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Espigões e Troféus de Crânios nas costas
    ctx.fillStyle = '#e8dfc8';
    ctx.fillRect(-22, -18, 6, 6);
    ctx.fillRect(-22, 12, 6, 6);
    ctx.fillRect(-26, -3, 6, 6);

    // Ombreiras colossais com chifres dourados curvados
    ctx.fillStyle = '#2e0a0e';
    ctx.beginPath();
    ctx.ellipse(0, -26, 16, 12, 0.3, 0, Math.PI * 2);
    ctx.ellipse(0, 26, 16, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    // Espada Demoníaca Negra reluzente com runas carmesim
    ctx.fillStyle = '#080808';
    ctx.fillRect(16, 12, 38, 8);
    ctx.fillStyle = '#ff1122';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 12;
    ctx.fillRect(20, 14, 30, 4);
    ctx.shadowBlur = 0;

    // Cabeça do Campeão do Caos
    ctx.fillStyle = '#110204';
    ctx.beginPath();
    ctx.arc(6, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Olhos flamejantes
    ctx.fillStyle = '#ff1133';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.fillRect(12, -6, 4, 3);
    ctx.fillRect(12, 3, 4, 3);
    ctx.shadowBlur = 0;

    ctx.restore();
  }
}

/* ==========================================================================
   6. MAPA DA INSTALAÇÃO IMPERIAL E OBJETOS INTERATIVOS
   ========================================================================== */
class Barrel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.hp = 30;
    this.exploded = false;
  }

  takeDamage(amount, game) {
    if (this.exploded) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.explode(game);
    }
  }

  explode(game) {
    this.exploded = true;
    game.sound.playExplosion(false);
    game.camera.shake(9, 0.35);
    game.particles.addSpark(this.x, this.y, '#ff6611', 25);
    game.particles.addSmoke(this.x, this.y, 14, 'rgba(80, 20, 10, 0.6)');
    game.particles.addBlood(this.x, this.y, 4); // Marca de fuligem

    const blastRadius = 120;
    const blastDmg = 130;

    // Dano aos inimigos próximos
    for (const enemy of game.enemies) {
      const d = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (d <= blastRadius + enemy.radius) {
        enemy.takeDamage(blastDmg, game, true);
      }
    }

    // Dano ao jogador se estiver perto
    const pDist = Math.hypot(game.player.x - this.x, game.player.y - this.y);
    if (pDist <= blastRadius + game.player.radius) {
      game.player.takeDamage(40, game);
    }

    // Detonação em cadeia de outros barris
    for (const b of game.map.barrels) {
      if (!b.exploded) {
        const d = Math.hypot(b.x - this.x, b.y - this.y);
        if (d <= blastRadius + b.radius) {
          b.takeDamage(blastDmg, game);
        }
      }
    }
  }

  draw(ctx) {
    if (this.exploded) {
      // Restos queimados do barril
      ctx.save();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    // Barril de Promécio Vermelho Imperial
    ctx.fillStyle = '#8f1515';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2b0606';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Marca de perigo / caveira
    ctx.fillStyle = '#ffd15c';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8f1515';
    ctx.fillRect(-2, -2, 4, 4);

    ctx.restore();
  }
}

// Suprimentos e Stims Médicos
class Pickup {
  constructor(x, y, type = 'ammo') {
    this.x = x;
    this.y = y;
    this.type = type; // 'ammo' ou 'medkit'
    this.radius = 14;
    this.bob = Math.random() * Math.PI * 2;
  }

  update(dt, game) {
    this.bob += dt * 4;
    const d = Math.hypot(game.player.x - this.x, game.player.y - this.y);
    if (d <= this.radius + game.player.radius) {
      if (this.type === 'ammo') {
        game.player.weapons[1].ammo = Math.min(game.player.weapons[1].maxAmmo, game.player.weapons[1].ammo + 60);
        game.player.weapons[2].ammo = Math.min(game.player.weapons[2].maxAmmo, game.player.weapons[2].ammo + 10);
        game.sound.playWeaponSwitch();
        game.particles.addFloatingText(this.x, this.y, '+MUNIÇÃO', '#ffd15c', true);
      } else {
        game.player.hp = Math.min(game.player.maxHp, game.player.hp + 35);
        game.player.armor = Math.min(game.player.maxArmor, game.player.armor + 25);
        game.sound.playWeaponSwitch();
        game.particles.addFloatingText(this.x, this.y, '+VIDA & ARMOR', '#38bdf8', true);
      }
      game.updateHUDVitals();
      game.updateHUDAmmo();
      return true; // Coletado
    }
    return false;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y + Math.sin(this.bob) * 3);

    if (this.type === 'ammo') {
      ctx.fillStyle = '#223322';
      ctx.fillRect(-9, -7, 18, 14);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(-4, -4, 8, 8);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-9, -7, 18, 14);
      ctx.fillStyle = '#ff2233';
      ctx.fillRect(-7, -2, 14, 4);
      ctx.fillRect(-2, -6, 4, 12);
    }

    ctx.restore();
  }
}

class GameMap {
  constructor() {
    this.width = 2500;
    this.height = 2000;
    this.walls = [];
    this.barrels = [];
    this.pickups = [];
    this.decorations = [];

    // Ponto de Extração (Ativado após o Boss)
    this.extractionZone = {
      x: 320,
      y: 320,
      radius: 65,
      active: false
    };

    this.buildImperialFacility();
  }

  buildImperialFacility() {
    // 1. Limites Externos
    this.walls.push({ x: 0, y: 0, w: this.width, h: 40 });
    this.walls.push({ x: 0, y: this.height - 40, w: this.width, h: 40 });
    this.walls.push({ x: 0, y: 0, w: 40, h: this.height });
    this.walls.push({ x: this.width - 40, y: 0, w: 40, h: this.height });

    // 2. Setor 1: Hangar de Entrada (Top-Left: x: 40..600, y: 40..600)
    this.walls.push({ x: 600, y: 40, w: 30, h: 220 });
    this.walls.push({ x: 600, y: 380, w: 30, h: 220 });
    this.walls.push({ x: 40, y: 600, w: 220, h: 30 });
    this.walls.push({ x: 380, y: 600, w: 250, h: 30 });

    // 3. Setor 2: Corredores Industriais e Tubulações (Centro Superior: x: 630..1400, y: 40..700)
    this.walls.push({ x: 800, y: 180, w: 400, h: 30 });
    this.walls.push({ x: 1000, y: 320, w: 30, h: 260 });
    this.walls.push({ x: 750, y: 480, w: 280, h: 30 });

    // 4. Setor 3: Sala de Máquinas e Santuário dos Geradores (Direita: x: 1400..2460, y: 40..800)
    this.walls.push({ x: 1400, y: 40, w: 30, h: 260 });
    this.walls.push({ x: 1400, y: 420, w: 30, h: 380 });
    // Pilares centrais dos geradores
    this.walls.push({ x: 1700, y: 240, w: 90, h: 90 });
    this.walls.push({ x: 2100, y: 240, w: 90, h: 90 });
    this.walls.push({ x: 1700, y: 500, w: 90, h: 90 });
    this.walls.push({ x: 2100, y: 500, w: 90, h: 90 });

    // 5. Setor 4: Área de Combate e Postos Fortificados (Inferior Esquerda: x: 40..1100, y: 700..1960)
    this.walls.push({ x: 40, y: 1100, w: 400, h: 30 });
    this.walls.push({ x: 560, y: 1100, w: 540, h: 30 });
    this.walls.push({ x: 450, y: 1300, w: 30, h: 320 });
    this.walls.push({ x: 750, y: 1500, w: 300, h: 30 });

    // 6. Setor 5: Arena do Boss (Catedral Profanada: x: 1200..2460, y: 900..1960)
    this.walls.push({ x: 1100, y: 800, w: 30, h: 450 });
    this.walls.push({ x: 1100, y: 1400, w: 30, h: 560 });
    this.walls.push({ x: 1100, y: 900, w: 500, h: 30 });
    this.walls.push({ x: 1800, y: 900, w: 660, h: 30 });

    // Colunas Góticas na Arena do Boss
    this.walls.push({ x: 1500, y: 1200, w: 60, h: 60 });
    this.walls.push({ x: 1950, y: 1200, w: 60, h: 60 });
    this.walls.push({ x: 1500, y: 1650, w: 60, h: 60 });
    this.walls.push({ x: 1950, y: 1650, w: 60, h: 60 });

    // Adiciona Barris de Promécio Explosivos em pontos estratégicos
    const barrelCoords = [
      { x: 520, y: 180 }, { x: 550, y: 180 },
      { x: 920, y: 240 }, { x: 1150, y: 460 },
      { x: 1800, y: 380 }, { x: 2000, y: 380 },
      { x: 320, y: 1250 }, { x: 680, y: 1400 },
      { x: 1420, y: 1350 }, { x: 2050, y: 1350 }, { x: 1720, y: 1750 }
    ];
    barrelCoords.forEach(c => this.barrels.push(new Barrel(c.x, c.y)));

    // Suprimentos iniciais no hangar
    this.pickups.push(new Pickup(420, 200, 'ammo'));
    this.pickups.push(new Pickup(220, 440, 'medkit'));
    this.pickups.push(new Pickup(1600, 380, 'ammo'));
    this.pickups.push(new Pickup(580, 1380, 'medkit'));
  }

  spawnPickup(x, y) {
    const type = Math.random() < 0.65 ? 'ammo' : 'medkit';
    this.pickups.push(new Pickup(x, y, type));
  }

  // Resolução de colisão circular com as paredes (AABB x Círculo)
  resolveCircleCollision(oldX, oldY, newX, newY, radius) {
    let finalX = newX;
    let finalY = newY;

    for (const w of this.walls) {
      // Ponto mais próximo no retângulo
      const closestX = Math.max(w.x, Math.min(finalX, w.x + w.w));
      const closestY = Math.max(w.y, Math.min(finalY, w.y + w.h));

      const dx = finalX - closestX;
      const dy = finalY - closestY;
      const distSq = dx * dx + dy * dy;

      if (distSq < radius * radius) {
        const dist = Math.sqrt(distSq);
        if (dist === 0) {
          finalX = oldX;
          finalY = oldY;
        } else {
          const overlap = radius - dist;
          finalX += (dx / dist) * overlap;
          finalY += (dy / dist) * overlap;
        }
      }
    }

    // Colisão com barris sólidos não explodidos
    for (const b of this.barrels) {
      if (!b.exploded) {
        const dx = finalX - b.x;
        const dy = finalY - b.y;
        const dist = Math.hypot(dx, dy);
        const minDist = radius + b.radius;
        if (dist < minDist && dist > 0) {
          const overlap = minDist - dist;
          finalX += (dx / dist) * overlap;
          finalY += (dy / dist) * overlap;
        }
      }
    }

    return { x: finalX, y: finalY };
  }

  draw(ctx, viewX, viewY, viewW, viewH) {
    // 1. Piso Industrial em Grelhas Metálicas
    ctx.fillStyle = '#0f1218';
    ctx.fillRect(viewX, viewY, viewW, viewH);

    // Linhas de placas de aço
    ctx.strokeStyle = '#181e28';
    ctx.lineWidth = 1;
    const tileSize = 80;
    const startX = Math.floor(viewX / tileSize) * tileSize;
    const startY = Math.floor(viewY / tileSize) * tileSize;

    ctx.beginPath();
    for (let x = startX; x < viewX + viewW + tileSize; x += tileSize) {
      ctx.moveTo(x, viewY);
      ctx.lineTo(x, viewY + viewH);
    }
    for (let y = startY; y < viewY + viewH + tileSize; y += tileSize) {
      ctx.moveTo(viewX, y);
      ctx.lineTo(viewX + viewW, y);
    }
    ctx.stroke();

    // 2. Zona de Extração (Ponto de pouso com Aquila Imperial)
    const ez = this.extractionZone;
    ctx.save();
    ctx.translate(ez.x, ez.y);
    ctx.strokeStyle = ez.active ? '#00e5ff' : '#445566';
    ctx.lineWidth = 4;
    ctx.strokeRect(-ez.radius, -ez.radius, ez.radius * 2, ez.radius * 2);

    // Faixas diagonais amarelas e pretas de hangar
    ctx.fillStyle = ez.active ? 'rgba(0, 229, 255, 0.15)' : 'rgba(80, 90, 100, 0.08)';
    ctx.fillRect(-ez.radius + 4, -ez.radius + 4, ez.radius * 2 - 8, ez.radius * 2 - 8);

    // Letra E de Extração
    ctx.fillStyle = ez.active ? '#00e5ff' : '#667788';
    ctx.font = '900 36px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EXTRACT', 0, 0);
    ctx.restore();

    // 3. Suprimentos (Pickups)
    for (const p of this.pickups) {
      p.draw(ctx);
    }

    // 4. Barris
    for (const b of this.barrels) {
      b.draw(ctx);
    }

    // 5. Paredes e Pilares Blindados
    ctx.fillStyle = '#1c222e';
    ctx.strokeStyle = '#3e4a5e';
    ctx.lineWidth = 2;

    for (const w of this.walls) {
      // Otimização: Não renderiza fora da câmera
      if (w.x + w.w < viewX || w.x > viewX + viewW || w.y + w.h < viewY || w.y > viewY + viewH) {
        continue;
      }

      ctx.fillStyle = '#181e28';
      ctx.fillRect(w.x, w.y, w.w, w.h);

      // Topo metálico com relevo e parafusos
      ctx.strokeStyle = '#48566e';
      ctx.strokeRect(w.x, w.y, w.w, w.h);

      // Faixas amarelas e pretas de aviso em paredes específicas
      if (w.w >= 100 && w.h <= 40) {
        ctx.fillStyle = '#b89423';
        for (let fx = w.x + 8; fx < w.x + w.w - 15; fx += 25) {
          ctx.fillRect(fx, w.y + 4, 10, w.h - 8);
        }
      }
    }
  }
}

/* ==========================================================================
   7. CÂMERA E CONTROLE DE VISUALIZAÇÃO
   ========================================================================== */
class Camera {
  constructor(viewportW, viewportH, mapW, mapH) {
    this.x = 0;
    this.y = 0;
    this.viewportW = viewportW;
    this.viewportH = viewportH;
    this.mapW = mapW;
    this.mapH = mapH;

    this.shakeAmount = 0;
    this.shakeDuration = 0;
  }

  resize(w, h) {
    this.viewportW = w;
    this.viewportH = h;
  }

  shake(amount, duration) {
    this.shakeAmount = Math.max(this.shakeAmount, amount);
    this.shakeDuration = Math.max(this.shakeDuration, duration);
  }

  update(dt, targetX, targetY) {
    // Seguir o jogador suavemente
    const targetCamX = targetX - this.viewportW / 2;
    const targetCamY = targetY - this.viewportH / 2;

    this.x += (targetCamX - this.x) * 0.12;
    this.y += (targetCamY - this.y) * 0.12;

    // Restringir aos limites do mapa
    this.x = Math.max(0, Math.min(this.x, this.mapW - this.viewportW));
    this.y = Math.max(0, Math.min(this.y, this.mapH - this.viewportH));

    // Tremor de tela (Screen Shake)
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      const offsetX = (Math.random() - 0.5) * this.shakeAmount * 2;
      const offsetY = (Math.random() - 0.5) * this.shakeAmount * 2;
      this.x += offsetX;
      this.y += offsetY;

      if (this.shakeDuration <= 0) {
        this.shakeAmount = 0;
      }
    }
  }
}

/* ==========================================================================
   8. MINIMAPA TÁTICO
   ========================================================================== */
class Minimap {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = 160;
  }

  draw(game) {
    const ctx = this.ctx;
    const map = game.map;
    ctx.clearRect(0, 0, this.size, this.size);

    const scaleX = this.size / map.width;
    const scaleY = this.size / map.height;

    // Fundo escuro do radar
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, this.size, this.size);

    // Linhas de paredes principais
    ctx.fillStyle = '#2d3748';
    for (const w of map.walls) {
      ctx.fillRect(w.x * scaleX, w.y * scaleY, Math.max(1, w.w * scaleX), Math.max(1, w.h * scaleY));
    }

    // Ponto de Extração
    const ez = map.extractionZone;
    ctx.fillStyle = ez.active ? '#00e5ff' : '#4a5568';
    ctx.beginPath();
    ctx.arc(ez.x * scaleX, ez.y * scaleY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Inimigos (Pontos Vermelhos)
    ctx.fillStyle = '#ff2233';
    for (const e of game.enemies) {
      const ex = e.x * scaleX;
      const ey = e.y * scaleY;
      ctx.fillRect(ex - 1.5, ey - 1.5, e.type === 'boss' ? 5 : 3, e.type === 'boss' ? 5 : 3);
    }

    // Jogador (Ponto Dourado com seta direcional)
    const px = game.player.x * scaleX;
    const py = game.player.y * scaleY;
    ctx.fillStyle = '#f3ce70';
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();

    // Cone de visão do jogador no radar
    ctx.strokeStyle = 'rgba(243, 206, 112, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(
      px + Math.cos(game.player.aimAngle - 0.4) * 10,
      py + Math.sin(game.player.aimAngle - 0.4) * 10
    );
    ctx.moveTo(px, py);
    ctx.lineTo(
      px + Math.cos(game.player.aimAngle + 0.4) * 10,
      py + Math.sin(game.player.aimAngle + 0.4) * 10
    );
    ctx.stroke();
  }
}

/* ==========================================================================
   9. MOTOR CENTRAL DO JOGO (GAME CONTROLLER)
   ========================================================================== */
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.sound = new SoundManager();
    this.particles = new ParticleSystem();
    this.map = new GameMap();
    this.player = new Player(320, 320); // Começa no hangar de entrada
    this.camera = new Camera(window.innerWidth, window.innerHeight, this.map.width, this.map.height);
    this.minimap = new Minimap(document.getElementById('minimapCanvas'));

    this.projectiles = [];
    this.slashes = [];
    this.enemies = [];

    // Estado do Jogo
    this.state = 'TITLE'; // 'TITLE', 'PLAYING', 'PAUSED', 'GAMEOVER', 'VICTORY'
    this.score = 0;
    this.killsCount = 0;
    this.currentWave = 1;
    this.maxWaves = 5;
    this.aliveEnemiesCount = 0;
    this.waveSpawnQueue = [];
    this.spawnTimer = 0;
    this.waveState = 'WAITING'; // 'SPAWNING', 'FIGHTING', 'CLEARED'

    // Entradas do Usuário
    this.keys = {};
    this.mouse = { x: 0, y: 0, isDown: false };

    // Configurações
    this.settings = {
      shake: true,
      gore: true,
      lighting: true
    };

    this.lastTime = performance.now();
    this.initEvents();
    this.initDustAnimation();
    this.resizeCanvas();
  }

  initEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    // Teclado
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Troca rápida de armas: 1, 2, 3
      if (this.state === 'PLAYING') {
        if (e.code === 'Digit1') this.player.switchWeapon(1, this);
        if (e.code === 'Digit2') this.player.switchWeapon(2, this);
        if (e.code === 'Digit3') this.player.switchWeapon(3, this);
        if (e.code === 'KeyR') this.player.reload(this);
        if (e.code === 'Space') {
          e.preventDefault();
          this.player.performSwordSlash(this);
        }
      }

      // Pausa com ESC
      if (e.code === 'Escape') {
        if (this.state === 'PLAYING') {
          this.pauseGame();
        } else if (this.state === 'PAUSED') {
          this.resumeGame();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.mouse.isDown = true;
        this.sound.init(); // Ativa contexto de áudio na primeira interação
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.mouse.isDown = false;
      }
    });

    // Desativa menu de contexto no canvas
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Botões da Tela Inicial e Modais
    document.getElementById('btn-start').addEventListener('click', () => {
      this.sound.init();
      this.startNewGame();
    });

    document.getElementById('btn-how-to-play').addEventListener('click', () => {
      document.getElementById('modal-how-to-play').classList.remove('hidden');
    });

    document.getElementById('btn-close-how').addEventListener('click', () => {
      document.getElementById('modal-how-to-play').classList.add('hidden');
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      document.getElementById('modal-settings').classList.remove('hidden');
    });

    document.getElementById('btn-close-settings').addEventListener('click', () => {
      document.getElementById('modal-settings').classList.add('hidden');
    });

    // Controles de Configurações
    document.getElementById('cfg-master-volume').addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.sound.masterVolume = val / 100;
      document.getElementById('cfg-volume-val').innerText = `${val}%`;
    });

    document.getElementById('cfg-shake').addEventListener('change', (e) => {
      this.settings.shake = e.target.checked;
    });

    document.getElementById('cfg-gore').addEventListener('change', (e) => {
      this.settings.gore = e.target.checked;
    });

    document.getElementById('cfg-lighting').addEventListener('change', (e) => {
      this.settings.lighting = e.target.checked;
    });

    // Menu de Pausa
    document.getElementById('btn-pause-resume').addEventListener('click', () => this.resumeGame());
    document.getElementById('btn-pause-restart').addEventListener('click', () => this.startNewGame());
    document.getElementById('btn-pause-how').addEventListener('click', () => {
      document.getElementById('modal-how-to-play').classList.remove('hidden');
    });
    document.getElementById('btn-pause-menu').addEventListener('click', () => this.returnToTitle());

    // Game Over e Vitória
    document.getElementById('btn-retry').addEventListener('click', () => this.startNewGame());
    document.getElementById('btn-go-menu').addEventListener('click', () => this.returnToTitle());
    document.getElementById('btn-play-again').addEventListener('click', () => this.startNewGame());
    document.getElementById('btn-vic-menu').addEventListener('click', () => this.returnToTitle());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.resize(window.innerWidth, window.innerHeight);
  }

  // Animação de poeira e cinzas na tela de título
  initDustAnimation() {
    const dCanvas = document.getElementById('dustCanvas');
    if (!dCanvas) return;
    const dCtx = dCanvas.getContext('2d');
    dCanvas.width = window.innerWidth;
    dCanvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * dCanvas.width,
        y: Math.random() * dCanvas.height,
        vx: (Math.random() - 0.5) * 20,
        vy: -15 - Math.random() * 30,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
        isRed: Math.random() < 0.35
      });
    }

    const animateDust = () => {
      if (this.state === 'TITLE') {
        dCtx.clearRect(0, 0, dCanvas.width, dCanvas.height);
        for (const p of particles) {
          p.x += p.vx * 0.016;
          p.y += p.vy * 0.016;
          if (p.y < 0) {
            p.y = dCanvas.height;
            p.x = Math.random() * dCanvas.width;
          }
          dCtx.fillStyle = p.isRed ? `rgba(255, 60, 40, ${p.alpha})` : `rgba(220, 210, 190, ${p.alpha})`;
          dCtx.beginPath();
          dCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          dCtx.fill();
        }
      }
      requestAnimationFrame(animateDust);
    };
    animateDust();
  }

  startNewGame() {
    this.state = 'PLAYING';
    this.score = 0;
    this.killsCount = 0;
    this.currentWave = 1;

    // Reseta Player e Mapa
    this.player = new Player(320, 320);
    this.projectiles = [];
    this.slashes = [];
    this.enemies = [];
    this.particles.clear();
    this.map = new GameMap();

    // Oculta telas e exibe HUD
    document.getElementById('screen-title').classList.add('hidden');
    document.getElementById('screen-pause').classList.add('hidden');
    document.getElementById('screen-game-over').classList.add('hidden');
    document.getElementById('screen-victory').classList.add('hidden');
    document.getElementById('boss-hud-bar').classList.add('hidden');
    document.getElementById('extraction-pointer').classList.add('hidden');
    document.getElementById('game-hud').classList.remove('hidden');

    this.updateHUDVitals();
    this.updateHUDWeapons();
    this.updateHUDAmmo();
    this.updateHUDWave();
    this.updateHUDEnemies();

    this.startWave(1);
  }

  pauseGame() {
    this.state = 'PAUSED';
    document.getElementById('screen-pause').classList.remove('hidden');
  }

  resumeGame() {
    this.state = 'PLAYING';
    document.getElementById('screen-pause').classList.add('hidden');
    this.lastTime = performance.now();
  }

  returnToTitle() {
    this.state = 'TITLE';
    document.getElementById('game-hud').classList.add('hidden');
    document.getElementById('screen-pause').classList.add('hidden');
    document.getElementById('screen-game-over').classList.add('hidden');
    document.getElementById('screen-victory').classList.add('hidden');
    document.getElementById('screen-title').classList.remove('hidden');
  }

  triggerGameOver() {
    this.state = 'GAMEOVER';
    this.sound.playGameOver();
    document.getElementById('go-score').innerText = String(this.score).padStart(5, '0');
    document.getElementById('go-wave').innerText = `WAVE 0${this.currentWave}`;
    document.getElementById('go-kills').innerText = this.killsCount;
    document.getElementById('screen-game-over').classList.remove('hidden');
  }

  triggerVictory() {
    this.state = 'VICTORY';
    this.sound.playVictory();
    document.getElementById('vic-score').innerText = String(this.score).padStart(5, '0');
    document.getElementById('vic-kills').innerText = this.killsCount;
    document.getElementById('vic-waves').innerText = `${this.maxWaves} / ${this.maxWaves}`;
    document.getElementById('screen-victory').classList.remove('hidden');
  }

  triggerDamageVignette() {
    const vig = document.getElementById('damage-vignette');
    vig.classList.add('hurt');
    setTimeout(() => vig.classList.remove('hurt'), 220);
  }

  addScore(points, x, y) {
    this.score += points;
    this.particles.addFloatingText(x, y - 10, `+${points}`, '#f3ce70', true);
    document.getElementById('hud-score').innerText = String(this.score).padStart(5, '0');
  }

  /* ---------------- ONDAS E SPAWNING ---------------- */
  startWave(waveNum) {
    this.currentWave = waveNum;
    this.waveState = 'SPAWNING';
    this.waveSpawnQueue = [];
    this.sound.playWaveStart();
    this.updateHUDWave();

    // Definição das Ondas 1 a 5
    if (waveNum === 1) {
      // Onda 1: 5 cultistas
      for (let i = 0; i < 5; i++) this.waveSpawnQueue.push('soldier');
    } else if (waveNum === 2) {
      // Onda 2: 8 inimigos (cultistas + demônios)
      for (let i = 0; i < 5; i++) this.waveSpawnQueue.push('soldier');
      for (let i = 0; i < 3; i++) this.waveSpawnQueue.push('demon');
    } else if (waveNum === 3) {
      // Onda 3: 12 inimigos (cultistas + demônios + chaos marine)
      for (let i = 0; i < 6; i++) this.waveSpawnQueue.push('soldier');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('demon');
      for (let i = 0; i < 2; i++) this.waveSpawnQueue.push('marine');
    } else if (waveNum === 4) {
      // Onda 4: 15 inimigos (força mista herética)
      for (let i = 0; i < 6; i++) this.waveSpawnQueue.push('soldier');
      for (let i = 0; i < 5; i++) this.waveSpawnQueue.push('demon');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('marine');
    } else if (waveNum === 5) {
      // Onda 5: BOSS + Guarda de Honra
      this.waveSpawnQueue.push('boss');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('marine');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('demon');

      // Exibe barra de vida do Boss
      document.getElementById('boss-hud-bar').classList.remove('hidden');
      this.sound.playBossRoar();
    }

    this.aliveEnemiesCount = this.waveSpawnQueue.length;
    this.updateHUDEnemies();
  }

  spawnEnemy(type) {
    // Escolhe ponto de spawn afastado do jogador
    const spawnPoints = [
      { x: 950, y: 350 },
      { x: 1800, y: 350 },
      { x: 750, y: 1350 },
      { x: 1750, y: 1450 },
      { x: 2100, y: 1600 }
    ];

    let pt = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
    if (type === 'boss') {
      // Boss surge no centro da catedral (Arena do Boss)
      pt = { x: 1750, y: 1450 };
      this.enemies.push(new BossChampion(pt.x, pt.y));
    } else {
      this.enemies.push(new Enemy(pt.x + (Math.random() - 0.5) * 80, pt.y + (Math.random() - 0.5) * 80, type));
    }

    this.particles.addSmoke(pt.x, pt.y, 6, 'rgba(180, 20, 30, 0.5)');
    this.particles.addSpark(pt.x, pt.y, '#ff3344', 8);
  }

  onWaveCompleted() {
    this.waveState = 'CLEARED';
    this.addScore(500, this.player.x, this.player.y);

    // Recompensa de onda: Reabastece munição e repara armadura
    this.player.weapons[1].ammo = Math.min(this.player.weapons[1].maxAmmo, this.player.weapons[1].ammo + 60);
    this.player.weapons[2].ammo = Math.min(this.player.weapons[2].maxAmmo, this.player.weapons[2].ammo + 12);
    this.player.armor = Math.min(this.player.maxArmor, this.player.armor + 30);
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 20);
    this.updateHUDVitals();
    this.updateHUDAmmo();

    if (this.currentWave < this.maxWaves) {
      setTimeout(() => {
        if (this.state === 'PLAYING') {
          this.startWave(this.currentWave + 1);
        }
      }, 3500);
    } else {
      // Boss derrotado! Ativa objetivo de extração
      this.activateExtraction();
    }
  }

  activateExtraction() {
    this.map.extractionZone.active = true;
    document.getElementById('boss-hud-bar').classList.add('hidden');
    document.getElementById('hud-objective').innerText = 'NOVO OBJETIVO: Alcance o ponto de extração no Hangar.';
    document.getElementById('hud-objective').style.color = '#00e5ff';
    document.getElementById('extraction-pointer').classList.remove('hidden');
    this.sound.playWaveStart();
  }

  /* ---------------- ATUALIZAÇÃO DA HUD ---------------- */
  updateHUDVitals() {
    const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
    const armorPct = Math.max(0, (this.player.armor / this.player.maxArmor) * 100);

    document.getElementById('hud-hp-bar').style.width = `${hpPct}%`;
    document.getElementById('hud-hp-text').innerText = `${Math.ceil(this.player.hp)} / ${this.player.maxHp}`;

    document.getElementById('hud-armor-bar').style.width = `${armorPct}%`;
    document.getElementById('hud-armor-text').innerText = `${Math.ceil(this.player.armor)} / ${this.player.maxArmor}`;
  }

  updateHUDWeapons() {
    for (let i = 1; i <= 3; i++) {
      const slot = document.getElementById(`weapon-slot-${i}`);
      if (slot) {
        if (i === this.player.currentWeaponIndex) {
          slot.classList.add('active');
        } else {
          slot.classList.remove('active');
        }
      }
    }
    const currentW = this.player.weapons[this.player.currentWeaponIndex];
    document.getElementById('hud-weapon-name').innerText = currentW.name;
    this.updateHUDAmmo();
  }

  updateHUDAmmo() {
    const currentW = this.player.weapons[this.player.currentWeaponIndex];
    const statusEl = document.getElementById('hud-reload-status');
    const barEl = document.getElementById('hud-ammo-bar');
    const textEl = document.getElementById('hud-ammo-text');

    if (currentW.type === 'sword') {
      textEl.innerText = 'ENERGIZADA';
      barEl.style.width = '100%';
      statusEl.innerText = 'CORPO A CORPO';
      statusEl.classList.remove('reloading');
      return;
    }

    if (this.player.isReloading) {
      statusEl.innerText = 'RECARREGANDO...';
      statusEl.classList.add('reloading');
    } else {
      statusEl.innerText = 'PRONTO';
      statusEl.classList.remove('reloading');
    }

    textEl.innerText = `${currentW.mag} / ${currentW.ammo}`;
    const pct = Math.max(0, (currentW.mag / currentW.maxMag) * 100);
    barEl.style.width = `${pct}%`;
  }

  updateHUDWave() {
    document.getElementById('hud-wave').innerText = `WAVE 0${this.currentWave}`;
  }

  updateHUDEnemies() {
    document.getElementById('hud-enemies').innerText = String(this.aliveEnemiesCount).padStart(2, '0');
  }

  updateBossHUD(currentHp, maxHp) {
    const pct = Math.max(0, (currentHp / maxHp) * 100);
    const fill = document.getElementById('boss-health-fill');
    if (fill) fill.style.width = `${pct}%`;
  }

  /* ---------------- LOOP PRINCIPAL ---------------- */
  update(dt) {
    if (this.state !== 'PLAYING') return;

    // Spawner de Inimigos da Onda Atual
    if (this.waveSpawnQueue.length > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = 0.65;
        const nextType = this.waveSpawnQueue.shift();
        this.spawnEnemy(nextType);
      }
    }

    // Atualiza Player
    this.player.update(dt, this);
    this.updateHUDVitals();

    // Atualiza Câmera
    this.camera.update(dt, this.player.x, this.player.y);

    // Atualiza Projéteis
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update(dt, this);

      // Colisão de Projétil com Paredes
      for (const w of this.map.walls) {
        if (p.x >= w.x && p.x <= w.x + w.w && p.y >= w.y && p.y <= w.y + w.h) {
          p.explode(this);
          break;
        }
      }

      // Colisão de Projétil com Barris
      if (!p.toRemove) {
        for (const b of this.map.barrels) {
          if (!b.exploded) {
            const d = Math.hypot(b.x - p.x, b.y - p.y);
            if (d <= b.radius + p.radius) {
              b.takeDamage(p.damage, this);
              p.explode(this);
              break;
            }
          }
        }
      }

      // Colisão com Inimigos (se atirado pelo jogador)
      if (!p.toRemove && p.shooter === 'player') {
        for (const e of this.enemies) {
          const d = Math.hypot(e.x - p.x, e.y - p.y);
          if (d <= e.radius + p.radius) {
            e.takeDamage(p.damage, this, Math.random() < 0.2);
            p.explode(this);
            break;
          }
        }
      }

      // Colisão com Jogador (se atirado por inimigo/boss)
      if (!p.toRemove && (p.shooter === 'enemy' || p.shooter === 'boss')) {
        const d = Math.hypot(this.player.x - p.x, this.player.y - p.y);
        if (d <= this.player.radius + p.radius) {
          this.player.takeDamage(p.damage, this);
          p.explode(this);
        }
      }

      if (p.toRemove) {
        this.projectiles.splice(i, 1);
      }
    }

    // Atualiza Golpes Corpo a Corpo (Slashes)
    for (let i = this.slashes.length - 1; i >= 0; i--) {
      this.slashes[i].update(dt);
      if (this.slashes[i].life <= 0) {
        this.slashes.splice(i, 1);
      }
    }

    // Atualiza Inimigos
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update(dt, this);

      if (e.toRemove) {
        this.enemies.splice(i, 1);
        this.aliveEnemiesCount = Math.max(0, this.aliveEnemiesCount - 1);
        this.updateHUDEnemies();

        // Checa conclusão da onda
        if (this.aliveEnemiesCount === 0 && this.waveSpawnQueue.length === 0) {
          this.onWaveCompleted();
        }
      }
    }

    // Atualiza Coletáveis
    for (let i = this.map.pickups.length - 1; i >= 0; i--) {
      if (this.map.pickups[i].update(dt, this)) {
        this.map.pickups.splice(i, 1);
      }
    }

    // Atualiza Partículas
    this.particles.update(dt);

    // Checa Ponto de Extração
    if (this.map.extractionZone.active) {
      const ez = this.map.extractionZone;
      const d = Math.hypot(this.player.x - ez.x, this.player.y - ez.y);
      if (d <= ez.radius) {
        this.triggerVictory();
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state === 'TITLE') return;

    this.ctx.save();
    // Aplica translação da Câmera
    this.ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));

    // 1. Cenário e Paredes
    this.map.draw(this.ctx, this.camera.x, this.camera.y, this.camera.viewportW, this.camera.viewportH);

    // 2. Decalques no Chão (Sangue e fuligem)
    if (this.settings.gore) {
      this.particles.drawDecals(this.ctx);
    }

    // 3. Inimigos
    for (const e of this.enemies) {
      e.draw(this.ctx);
    }

    // 4. Jogador (Space Marine)
    this.player.draw(this.ctx);

    // 5. Projéteis e Cortes
    for (const p of this.projectiles) {
      p.draw(this.ctx);
    }
    for (const s of this.slashes) {
      s.draw(this.ctx);
    }

    // 6. Partículas e Textos Flutuantes
    this.particles.drawParticles(this.ctx);

    // 7. Iluminação Dinâmica da Lanterna (Se ativada)
    if (this.settings.lighting) {
      this.drawDynamicLighting();
    }

    this.ctx.restore();

    // Renderiza Minimapa Tático
    this.minimap.draw(this);
  }

  drawDynamicLighting() {
    // Escuridão com cone de lanterna e luz em geradores
    this.ctx.save();
    const grad = this.ctx.createRadialGradient(
      this.player.x, this.player.y, 40,
      this.player.x, this.player.y, 420
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.65, 'rgba(5, 7, 10, 0.45)');
    grad.addColorStop(1, 'rgba(2, 3, 5, 0.88)');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(this.camera.x, this.camera.y, this.camera.viewportW, this.camera.viewportH);
    this.ctx.restore();
  }

  loop(currentTime) {
    const dt = Math.min(0.08, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Inicialização do Jogo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  requestAnimationFrame((t) => game.loop(t));
});
