/**
 * IRON VIGIL — WAR OF THE IMPERIUM (WARHAMMER 40,000 THEME)
 * PROMPT DEFINITIVO V4 — MOTOR DE COMBATE 3D WEBGL (THREE.JS + GSAP + WEB AUDIO API)
 * Dois Modos Completos: Modo Space Marine (Campanha) & Modo Dreadnought: Endless War
 * Combate Avançado: Parry, Execuções, Esquiva, Combos Melee, Arsenal Completo,
 * Inteligência Artificial Tática, Hordas Tyranids e Chaos, Destruição e Responsividade.
 */

/* ==========================================================================
   1. MÓDULO DE BALANCEAMENTO NUMÉRICO (BALANCE & BALANCEMANAGER)
   Centraliza todos os parâmetros do jogo em uma única estrutura robusta.
   ========================================================================== */
const BALANCE = {
  player: {
    hp: 150,
    armor: 100,
    speedNormal: 195,
    speedSprint: 265, // 135% da velocidade normal
    grenadesInitial: 2,
    dodgeSpeed: 460,
    dodgeDuration: 0.28,
    dodgeCooldown: 0.75,
    dodgeInvuln: 0.28,
    parryWindow: 0.35,
    parryCooldown: 0.7,
    executionInvuln: 1.1,
    executionArmorRestore: 30,
    executionHpRestore: 20
  },

  weapons: {
    bolt_rifle: {
      name: 'BOLT RIFLE',
      damage: 32,
      fireRate: 0.18,
      mag: 30,
      maxMag: 30,
      ammo: 180,
      maxAmmo: 270,
      reloadTime: 1.3,
      spread: 0.035,
      projSpeed: 950,
      range: 800,
      type: 'bolter',
      critMult: 1.8
    },
    heavy_bolter: {
      name: 'HEAVY BOLTER',
      damage: 22,
      fireRate: 0.10,
      mag: 60,
      maxMag: 60,
      ammo: 360,
      maxAmmo: 480,
      reloadTime: 2.2,
      spread: 0.075,
      projSpeed: 980,
      range: 850,
      movePenalty: 0.85,
      type: 'heavy_bolter',
      critMult: 1.6
    },
    auto_bolt_rifle: {
      name: 'AUTO BOLT RIFLE',
      damage: 20,
      fireRate: 0.09,
      mag: 45,
      maxMag: 45,
      ammo: 270,
      maxAmmo: 360,
      reloadTime: 1.4,
      spread: 0.065,
      projSpeed: 920,
      range: 750,
      type: 'bolter',
      critMult: 1.5
    },
    stalker_bolt: {
      name: 'STALKER BOLT RIFLE',
      damage: 85,
      fireRate: 0.65,
      mag: 10,
      maxMag: 10,
      ammo: 60,
      maxAmmo: 90,
      reloadTime: 1.6,
      spread: 0.005,
      projSpeed: 1300,
      range: 1100,
      type: 'stalker',
      critMult: 2.5
    },
    plasma_incinerator: {
      name: 'PLASMA INCINERATOR',
      damage: 90,
      fireRate: 0.70,
      mag: 15,
      maxMag: 15,
      ammo: 60,
      maxAmmo: 90,
      reloadTime: 1.8,
      projSpeed: 640,
      range: 850,
      splashRadius: 90,
      splashDamage: 60,
      type: 'plasma',
      heatPerShot: 16
    },
    melta_gun: {
      name: 'MELTA GUN',
      damage: 160,
      fireRate: 1.10,
      mag: 5,
      maxMag: 5,
      ammo: 25,
      maxAmmo: 40,
      reloadTime: 2.0,
      projSpeed: 800,
      range: 360,
      splashRadius: 65,
      type: 'melta'
    },
    grenade_launcher: {
      name: 'GRENADE LAUNCHER',
      damage: 150,
      fireRate: 0.90,
      mag: 6,
      maxMag: 6,
      ammo: 24,
      maxAmmo: 36,
      reloadTime: 2.1,
      projSpeed: 500,
      range: 700,
      splashRadius: 120,
      splashDamage: 110,
      type: 'grenade'
    },
    bolt_pistol: {
      name: 'BOLT PISTOL',
      damage: 25,
      fireRate: 0.25,
      mag: 12,
      maxMag: 12,
      ammo: 96,
      maxAmmo: 144,
      reloadTime: 0.9,
      spread: 0.03,
      projSpeed: 900,
      range: 650,
      type: 'pistol'
    },
    plasma_pistol: {
      name: 'PLASMA PISTOL',
      damage: 65,
      fireRate: 0.60,
      mag: 8,
      maxMag: 8,
      ammo: 48,
      maxAmmo: 72,
      reloadTime: 1.2,
      projSpeed: 600,
      range: 700,
      splashRadius: 60,
      type: 'plasma'
    },
    heavy_bolt_pistol: {
      name: 'HEAVY BOLT PISTOL',
      damage: 45,
      fireRate: 0.40,
      mag: 10,
      maxMag: 10,
      ammo: 60,
      maxAmmo: 90,
      reloadTime: 1.1,
      spread: 0.04,
      projSpeed: 950,
      range: 700,
      type: 'bolter'
    }
  },

  melee: {
    chainsword: {
      name: 'CHAINSWORD',
      damage: 75,
      fireRate: 0.32,
      range: 100,
      arc: 2.2,
      comboCount: 3,
      type: 'chainsword'
    },
    power_sword: {
      name: 'POWER SWORD',
      damage: 125,
      fireRate: 0.45,
      range: 115,
      arc: 2.5,
      type: 'power_sword'
    },
    thunder_hammer: {
      name: 'THUNDER HAMMER',
      damage: 240,
      fireRate: 0.85,
      range: 130,
      arc: 3.0,
      stunDuration: 1.8,
      shockwaveRadius: 130,
      type: 'thunder_hammer'
    },
    combat_knife: {
      name: 'COMBAT KNIFE',
      damage: 50,
      fireRate: 0.20,
      range: 85,
      arc: 1.7,
      type: 'combat_knife'
    }
  },

  dreadnought: {
    hull: 2500,
    armor: 1500,
    energy: 100,
    energyRecharge: 10,
    speed: 135,
    stompDamage: 320,
    stompRadius: 180,
    stompCooldown: 6.0,
    stompEnergy: 30,
    furyDuration: 8.0,
    furyCooldown: 25.0,
    furyEnergy: 50,
    coolingRate: 22,
    maxHeat: 100,

    weapons: {
      assault_cannon: {
        name: 'ASSAULT CANNON',
        damage: 32,
        fireRate: 0.065,
        heatRate: 7.5,
        ammo: 1200,
        maxAmmo: 1200,
        projSpeed: 1050,
        spread: 0.05,
        type: 'assault_cannon'
      },
      heavy_flamer: {
        name: 'HEAVY FLAMER',
        damage: 42,
        fireRate: 0.08,
        heatRate: 11.0,
        ammo: 600,
        maxAmmo: 600,
        projSpeed: 580,
        range: 380,
        type: 'flamer'
      },
      multi_melta: {
        name: 'MULTI-MELTA',
        damage: 220,
        fireRate: 0.95,
        heatRate: 24.0,
        ammo: 80,
        maxAmmo: 80,
        projSpeed: 820,
        range: 440,
        splashRadius: 75,
        type: 'melta'
      },
      missile_pod: {
        name: 'MISSILE POD',
        damage: 180,
        fireRate: 1.2,
        heatRate: 20.0,
        ammo: 60,
        maxAmmo: 60,
        projSpeed: 520,
        range: 750,
        splashRadius: 110,
        type: 'missile'
      },
      power_fist: {
        name: 'POWER FIST',
        damage: 450,
        fireRate: 0.65,
        range: 120,
        heatRate: 0,
        ammo: Infinity,
        type: 'power_fist'
      },
      chainfist: {
        name: 'CHAINFIST',
        damage: 550,
        fireRate: 0.75,
        range: 115,
        heatRate: 0,
        ammo: Infinity,
        type: 'chainfist'
      }
    }
  },

  enemies: {
    termagant: {
      name: 'Termagant',
      faction: 'tyranid',
      hp: 45,
      speed: 165,
      damage: 12,
      range: 420,
      rangedCooldown: 1.4,
      threatCost: 5,
      score: 75,
      radius: 16,
      scale: 0.8
    },
    hormagaunt: {
      name: 'Hormagaunt',
      faction: 'tyranid',
      hp: 55,
      speed: 230,
      damage: 18,
      threatCost: 6,
      score: 90,
      radius: 17,
      scale: 0.85
    },
    tyranid_warrior: {
      name: 'Tyranid Warrior',
      faction: 'tyranid',
      hp: 280,
      speed: 135,
      damage: 35,
      range: 480,
      rangedCooldown: 2.0,
      threatCost: 20,
      score: 350,
      radius: 26,
      scale: 1.3
    },
    ravener: {
      name: 'Ravener',
      faction: 'tyranid',
      hp: 190,
      speed: 270,
      damage: 28,
      threatCost: 18,
      score: 300,
      radius: 22,
      scale: 1.15
    },
    carnifex: {
      name: 'Carnifex',
      faction: 'tyranid',
      hp: 1250,
      armor: 400,
      speed: 115,
      damage: 65,
      threatCost: 65,
      score: 2500,
      radius: 44,
      scale: 2.2,
      isMiniboss: true
    },
    tyranid_prime: {
      name: 'Tyranid Prime',
      faction: 'tyranid',
      hp: 650,
      speed: 155,
      damage: 45,
      threatCost: 35,
      score: 1000,
      radius: 30,
      scale: 1.5,
      isElite: true
    },
    cultist: {
      name: 'Chaos Cultist',
      faction: 'chaos',
      hp: 40,
      speed: 145,
      damage: 10,
      range: 400,
      rangedCooldown: 1.5,
      threatCost: 4,
      score: 50,
      radius: 15,
      scale: 0.8
    },
    chaos_marine: {
      name: 'Chaos Space Marine',
      faction: 'chaos',
      hp: 210,
      armor: 80,
      speed: 120,
      damage: 24,
      range: 520,
      rangedCooldown: 2.1,
      threatCost: 16,
      score: 250,
      radius: 22,
      scale: 1.15
    },
    possessed: {
      name: 'Possessed',
      faction: 'chaos',
      hp: 175,
      speed: 215,
      damage: 32,
      threatCost: 15,
      score: 280,
      radius: 20,
      scale: 1.1
    },
    daemon: {
      name: 'Blood Daemon',
      faction: 'chaos',
      hp: 100,
      speed: 225,
      damage: 26,
      threatCost: 12,
      score: 180,
      radius: 18,
      scale: 0.95
    },
    chaos_champion: {
      name: 'Chaos Champion - Herald of the Warp',
      faction: 'chaos',
      hp: 1800,
      armor: 600,
      speed: 135,
      damage: 55,
      threatCost: 150,
      score: 8000,
      radius: 42,
      scale: 2.0,
      isBoss: true
    }
  }
};

/* ==========================================================================
   2. GERENCIADOR DE SALVAMENTO (SAVEMANAGER)
   Persistência em LocalStorage com validação de dados e fallback seguro.
   ========================================================================== */
class SaveManager {
  static KEY = 'IRON_VIGIL_STORAGE_V4';

  static getDefaultData() {
    return {
      highScore: 0,
      endlessBestWave: 0,
      totalKills: 0,
      bossKills: 0,
      upgrades: {
        damageLevel: 0,
        armorLevel: 0,
        hullLevel: 0,
        heatSinkLevel: 0,
        stompLevel: 0,
        energyLevel: 0
      },
      settings: {
        masterVolume: 80,
        sfxVolume: 85,
        musicVolume: 65,
        graphics: 'high',
        shake: true,
        gore: true
      }
    };
  }

  static load() {
    try {
      const raw = localStorage.getItem(SaveManager.KEY);
      if (!raw) return SaveManager.getDefaultData();
      const parsed = JSON.parse(raw);
      return { ...SaveManager.getDefaultData(), ...parsed };
    } catch (e) {
      console.warn('Falha ao carregar dados do LocalStorage, restaurando padrões.', e);
      return SaveManager.getDefaultData();
    }
  }

  static save(data) {
    try {
      localStorage.setItem(SaveManager.KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Falha ao gravar no LocalStorage.', e);
    }
  }
}

/* ==========================================================================
   3. SISTEMA DE ÁUDIO PROCEDURAL SINTETIZADO (WEB AUDIO API)
   Efeitos sonoros hiper-detalhados e trilha sonora gótica industrial dinâmica.
   ========================================================================== */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterVolume = 0.8;
    this.sfxVolume = 0.85;
    this.musicVolume = 0.65;
    this.initialized = false;
    this.musicPlaying = false;
    this.musicOscs = [];
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
        this.startProceduralCombatMusic();
      }
    } catch (e) {
      console.warn('Web Audio API não inicializada.', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  get effectiveSfxVolume() {
    return this.masterVolume * this.sfxVolume;
  }

  // Disparo de Bolter (Impacto estrondoso + estalo metálico)
  playBolter() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.1);

    gain.gain.setValueAtTime(0.4 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.11);

    // Ruído explosivo da ogiva de massa reativa
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.07);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45 * vol, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
    noise.start(t);
    noise.stop(t + 0.09);
  }

  // Heavy Bolter (Trovoada contínua de canhão)
  playHeavyBolter() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(24, t + 0.13);

    gain.gain.setValueAtTime(0.48 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Plasma Incinerator / Pistol (Zumbido eletromagnético + disparo térmico)
  playPlasma() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.28);

    gain.gain.setValueAtTime(0.45 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Melta Gun (Feixe térmico de micro-ondas superaquecido)
  playMelta() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const dur = 0.35;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);
    filter.Q.setValueAtTime(3.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
  }

  // Chainsword (Rugido acelerado do motor de serra)
  playChainsword() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(290, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.3);

    gain.gain.setValueAtTime(0.42 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  // Power Sword (Campo de força disruptor crepitante)
  playPowerSword() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.24);

    gain.gain.setValueAtTime(0.45 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Thunder Hammer (Golpe sísmico trovejante)
  playThunderHammer() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.45);

    gain.gain.setValueAtTime(0.7 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.48);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // PARRY (Clang metálico reflexivo estridente)
  playParrySuccess() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const freqs = [880, 1320, 1760];
    freqs.forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.3 * vol, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  // EXECUÇÃO (Impacto triturador brutal de osso e armadura)
  playExecution() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.38);

    gain.gain.setValueAtTime(0.7 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.42);
  }

  // Dreadnought: Canhão Rotativo (Assault Cannon BRRRRRTT)
  playAssaultCannon() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180 + Math.random() * 40, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.05);

    gain.gain.setValueAtTime(0.32 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.065);
  }

  // Dreadnought: Ground Stomp (Sub-grave esmagador)
  playDreadStomp() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.6);

    gain.gain.setValueAtTime(0.85 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.68);
  }

  // Explosão de Barril / Míssil
  playExplosion(isLarge = false) {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const dur = isLarge ? 0.75 : 0.45;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLarge ? 300 : 500, t);
    filter.frequency.linearRampToValueAtTime(40, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime((isLarge ? 0.8 : 0.55) * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
  }

  // Passos Mecânicos Pesados (Pneumático)
  playMechanicalStep() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(75, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.12);

    gain.gain.setValueAtTime(0.35 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Rugido do Chefe / Carnifex
  playBossRoar() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const vol = this.effectiveSfxVolume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.5);
    osc.frequency.exponentialRampToValueAtTime(35, t + 1.4);

    gain.gain.setValueAtTime(0.6 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 1.5);
  }

  // Música de Combate Sintetizada Procedural
  startProceduralCombatMusic() {
    if (this.musicPlaying || !this.ctx) return;
    this.musicPlaying = true;

    // Loop de pads graves e arpeggios sombrios em escala modal gótica
    const scale = [65.41, 77.78, 87.31, 98.00, 116.54, 130.81]; // Dó Dórico
    let step = 0;

    const playChordBeat = () => {
      if (!this.musicPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const baseFreq = scale[step % scale.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, t);

      const vol = this.masterVolume * this.musicVolume * 0.12;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.9);

      setTimeout(playChordBeat, 850);
    };

    playChordBeat();
  }
}

/* ==========================================================================
   4. RENDERIZADOR TRIDIMENSIONAL WEBGL (THREE.JS + THREE RENDERER)
   Configura cena 3D, câmera isométrica dinâmica, iluminação e sombras suaves.
   ========================================================================== */
class ThreeRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07090d);
    this.scene.fog = new THREE.FogExp2(0x07090d, 0.0012);

    // Câmera Isométrica com perspectiva militar
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 3000);
    this.camera.position.set(0, 520, 420);
    this.camera.lookAt(0, 0, 0);

    // Renderizador WebGL
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.trauma = 0;
    this.initLights();
  }

  initLights() {
    // Luz ambiente gótica rica e equilibrada
    const amb = new THREE.AmbientLight(0x758296, 1.3);
    this.scene.add(amb);

    // Luz Direcional Principal (Sol / Holofote Superior) com Sombras
    this.dirLight = new THREE.DirectionalLight(0xfff6e4, 1.8);
    this.dirLight.position.set(400, 700, 300);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 100;
    this.dirLight.shadow.camera.far = 1800;
    const d = 1100;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    // Luz de realce azulada (Contraste militar frio)
    const rimLight = new THREE.DirectionalLight(0x286095, 0.8);
    rimLight.position.set(-500, 300, -400);
    this.scene.add(rimLight);

    // Holofote tático que acompanha o jogador (Luma-globe da armadura)
    this.playerLight = new THREE.PointLight(0xfff5e6, 2.0, 600);
    this.playerLight.position.set(0, 50, 0);
    this.scene.add(this.playerLight);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setGraphicsQuality(preset) {
    if (preset === 'low') {
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(0.85);
    } else if (preset === 'medium') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
      this.renderer.setPixelRatio(1.0);
    } else if (preset === 'high') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else if (preset === 'ultra') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }
  }

  addCameraShake(amount) {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  updateCamera(targetX, targetZ, dt) {
    const desiredX = targetX;
    const desiredZ = targetZ + 420;
    const desiredY = 520;

    // Interpolação suave de seguimento
    this.camera.position.x += (desiredX - this.camera.position.x) * 0.1;
    this.camera.position.z += (desiredZ - this.camera.position.z) * 0.1;
    this.camera.position.y += (desiredY - this.camera.position.y) * 0.1;

    // Shake de câmera baseado em decaimento de trauma
    if (this.trauma > 0) {
      const shakePower = this.trauma * this.trauma * 24;
      this.camera.position.x += (Math.random() - 0.5) * shakePower;
      this.camera.position.y += (Math.random() - 0.5) * shakePower;
      this.camera.position.z += (Math.random() - 0.5) * shakePower;
      this.trauma = Math.max(0, this.trauma - dt * 2.2);
    }

    this.camera.lookAt(targetX, 10, targetZ);

    // Reposiciona a luz direcional e holofote tático
    this.dirLight.position.set(targetX + 400, 700, targetZ + 300);
    this.dirLight.target.position.set(targetX, 0, targetZ);
    this.dirLight.target.updateMatrixWorld();
    if (this.playerLight) {
      this.playerLight.position.set(targetX, 50, targetZ);
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

/* ==========================================================================
   5. FÁBRICA PROCEDURAL DE MODELOS 3D E MATERIAIS (MODELFACTORY)
   Cria personagens tridimensionais detalhados, Dreadnought articulado,
   hordas Tyranids e Chaos com materiais metálicos PBR e sem dependências externas.
   ========================================================================== */
class ModelFactory {
  // Textura procedural de metal polido e desgastado
  static createMetalTexture(primaryColor = '#222938', scratchColor = '#4a5568') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, 256, 256);

    // Ranhuras e desgaste de batalha
    ctx.strokeStyle = scratchColor;
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 45, y + (Math.random() - 0.5) * 45);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // MODELO 3D: SPACE MARINE (ADEPTUS ASTARTES)
  static createSpaceMarine() {
    const group = new THREE.Group();

    // Materiais PBR Metálicos
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x1c2434, // Azul marinho profundo / Armadura de Ceramite
      metalness: 0.65,
      roughness: 0.35
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Dourado Imperial das bordas e Aquila
      metalness: 0.85,
      roughness: 0.25
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.8,
      roughness: 0.4
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff1525 // Lentes vermelhas ameaçadoras
    });

    // 1. Peitoral Blindado (Ceramite Breastplate)
    const chestGeo = new THREE.BoxGeometry(22, 24, 16);
    const chestMesh = new THREE.Mesh(chestGeo, armorMat);
    chestMesh.position.y = 24;
    chestMesh.castShadow = true;
    group.add(chestMesh);

    // Águia Imperial (Aquila Dourada) no Peito
    const aquilaGeo = new THREE.BoxGeometry(14, 6, 2);
    const aquilaMesh = new THREE.Mesh(aquilaGeo, goldMat);
    aquilaMesh.position.set(0, 26, 8.5);
    group.add(aquilaMesh);

    // 2. Capacete Tático de Combate (Helmet com Vox Grill)
    const helmGeo = new THREE.CylinderGeometry(7, 8, 12, 12);
    const helmMesh = new THREE.Mesh(helmGeo, armorMat);
    helmMesh.position.set(0, 42, 0);
    helmMesh.castShadow = true;
    group.add(helmMesh);

    // Visores / Lentes Vermelhas Iluminadas
    const eyeGeo = new THREE.BoxGeometry(4, 2, 2);
    const eyeL = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eyeL.position.set(-3.2, 42, 7.5);
    const eyeR = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eyeR.position.set(3.2, 42, 7.5);
    group.add(eyeL);
    group.add(eyeR);

    // Grade do Respirador (Vox Grill)
    const voxGeo = new THREE.BoxGeometry(4, 5, 3);
    const voxMesh = new THREE.Mesh(voxGeo, darkMat);
    voxMesh.position.set(0, 38, 7.5);
    group.add(voxMesh);

    // 3. Ombreiras Colossais (Pauldrons)
    const pauldronGeo = new THREE.SphereGeometry(9, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const pauldronL = new THREE.Mesh(pauldronGeo, armorMat);
    pauldronL.position.set(-17, 32, 0);
    pauldronL.rotation.z = Math.PI / 2 + 0.3;
    pauldronL.castShadow = true;

    // Borda dourada da ombreira esquerda
    const rimL = new THREE.Mesh(new THREE.TorusGeometry(8.5, 1.2, 8, 16), goldMat);
    rimL.position.set(-17, 32, 0);
    rimL.rotation.y = Math.PI / 2;
    group.add(pauldronL);
    group.add(rimL);

    const pauldronR = new THREE.Mesh(pauldronGeo, armorMat);
    pauldronR.position.set(17, 32, 0);
    pauldronR.rotation.z = -Math.PI / 2 - 0.3;
    pauldronR.castShadow = true;

    const rimR = new THREE.Mesh(new THREE.TorusGeometry(8.5, 1.2, 8, 16), goldMat);
    rimR.position.set(17, 32, 0);
    rimR.rotation.y = Math.PI / 2;
    group.add(pauldronR);
    group.add(rimR);

    // 4. Mochila de Suporte e Reator (Power Pack com Escapes Esféricos)
    const packGeo = new THREE.BoxGeometry(16, 20, 10);
    const packMesh = new THREE.Mesh(packGeo, darkMat);
    packMesh.position.set(0, 26, -11);
    packMesh.castShadow = true;
    group.add(packMesh);

    // Vents esféricos laterais da mochila
    const ventGeo = new THREE.SphereGeometry(4.5, 10, 8);
    const ventL = new THREE.Mesh(ventGeo, darkMat);
    ventL.position.set(-9, 34, -11);
    const ventR = new THREE.Mesh(ventGeo, darkMat);
    ventR.position.set(9, 34, -11);
    group.add(ventL);
    group.add(ventR);

    // 5. Braços e Arma Segurada em 3D
    const armGeo = new THREE.CylinderGeometry(4, 4.5, 14, 8);
    const armL = new THREE.Mesh(armGeo, armorMat);
    armL.position.set(-13, 20, 6);
    armL.rotation.x = Math.PI / 3;
    group.add(armL);

    const armR = new THREE.Mesh(armGeo, armorMat);
    armR.position.set(13, 20, 6);
    armR.rotation.x = Math.PI / 3;
    group.add(armR);

    // Arma no braço direito (Bolter 3D acoplado)
    const weaponGroup = new THREE.Group();
    const gunBody = new THREE.Mesh(new THREE.BoxGeometry(6, 9, 26), darkMat);
    gunBody.position.set(0, 0, 0);
    gunBody.castShadow = true;
    weaponGroup.add(gunBody);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 8), darkMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 1, 15);
    weaponGroup.add(barrel);

    const gunTrim = new THREE.Mesh(new THREE.BoxGeometry(6.4, 4, 10), goldMat);
    gunTrim.position.set(0, 2, 2);
    weaponGroup.add(gunTrim);

    weaponGroup.position.set(10, 16, 16);
    group.add(weaponGroup);
    group.weaponGroup = weaponGroup;

    // 6. Pernas e Greaves Blindadas
    const legGeo = new THREE.BoxGeometry(8, 18, 9);
    const legL = new THREE.Mesh(legGeo, armorMat);
    legL.position.set(-6, 9, 0);
    legL.castShadow = true;
    const legR = new THREE.Mesh(legGeo, armorMat);
    legR.position.set(6, 9, 0);
    legR.castShadow = true;
    group.add(legL);
    group.add(legR);

    group.legs = [legL, legR];
    return group;
  }

  // MODELO 3D: DREADNOUGHT (CASTRAFERRUM / REDEMPTOR WAR MACHINE)
  static createDreadnought() {
    const group = new THREE.Group();

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x182030, // Cerâmica pesada de blindagem
      metalness: 0.75,
      roughness: 0.3
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc99c30,
      metalness: 0.85,
      roughness: 0.25
    });

    const mechanicalMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      metalness: 0.9,
      roughness: 0.35
    });

    const visorGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff // Visor sensorial ciano luminoso
    });

    // 1. Sarcófago Central Blindado (Chassis principal do guerreiro sepultado)
    const sarcophagusGeo = new THREE.BoxGeometry(50, 48, 44);
    const sarcophagus = new THREE.Mesh(sarcophagusGeo, hullMat);
    sarcophagus.position.y = 55;
    sarcophagus.castShadow = true;
    group.add(sarcophagus);

    // Placa frontal chanfrada com Águia Dourada
    const frontPlateGeo = new THREE.BoxGeometry(38, 36, 6);
    const frontPlate = new THREE.Mesh(frontPlateGeo, hullMat);
    frontPlate.position.set(0, 55, 23);
    group.add(frontPlate);

    const crestGeo = new THREE.BoxGeometry(24, 10, 3);
    const crest = new THREE.Mesh(crestGeo, goldTrimMat);
    crest.position.set(0, 60, 26);
    group.add(crest);

    // Fenda Sensorial / Visor Central
    const visorGeo = new THREE.BoxGeometry(16, 4, 3);
    const visor = new THREE.Mesh(visorGeo, visorGlowMat);
    visor.position.set(0, 48, 26.5);
    group.add(visor);

    // Chaminés de Exaustão Térmica duplas no topo
    const exhaustGeo = new THREE.CylinderGeometry(5, 6, 22, 10);
    const exL = new THREE.Mesh(exhaustGeo, mechanicalMat);
    exL.position.set(-18, 86, -14);
    exL.castShadow = true;
    const exR = new THREE.Mesh(exhaustGeo, mechanicalMat);
    exR.position.set(18, 86, -14);
    exR.castShadow = true;
    group.add(exL);
    group.add(exR);

    // 2. Braço Esquerdo (Assault Cannon - 6 Canos Rotativos de Alta Cadência)
    const leftArmGroup = new THREE.Group();
    const shoulderL = new THREE.Mesh(new THREE.BoxGeometry(16, 20, 20), hullMat);
    shoulderL.position.set(-34, 55, 0);
    shoulderL.castShadow = true;
    leftArmGroup.add(shoulderL);

    // Carcaça da metralhadora rotativa
    const cannonHousing = new THREE.Mesh(new THREE.CylinderGeometry(9, 10, 24, 12), mechanicalMat);
    cannonHousing.rotation.x = Math.PI / 2;
    cannonHousing.position.set(-36, 48, 16);
    leftArmGroup.add(cannonHousing);

    // 6 Canos giratórios
    const barrelsGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 28, 8), mechanicalMat);
      bMesh.rotation.x = Math.PI / 2;
      bMesh.position.set(Math.cos(angle) * 5.5, Math.sin(angle) * 5.5, 26);
      barrelsGroup.add(bMesh);
    }
    barrelsGroup.position.set(-36, 48, 0);
    leftArmGroup.add(barrelsGroup);
    leftArmGroup.barrels = barrelsGroup;
    group.add(leftArmGroup);
    group.leftArm = leftArmGroup;

    // 3. Braço Direito (Power Fist - Punho Hidráulico de Esmagamento Titânico)
    const rightArmGroup = new THREE.Group();
    const shoulderR = new THREE.Mesh(new THREE.BoxGeometry(16, 20, 20), hullMat);
    shoulderR.position.set(34, 55, 0);
    shoulderR.castShadow = true;
    rightArmGroup.add(shoulderR);

    // Punho com garras trituradoras
    const fistGeo = new THREE.BoxGeometry(18, 22, 26);
    const fistMesh = new THREE.Mesh(fistGeo, hullMat);
    fistMesh.position.set(36, 46, 16);
    fistMesh.castShadow = true;
    rightArmGroup.add(fistMesh);

    // 3 Garras frontais articuladas
    for (let i = -1; i <= 1; i++) {
      const clawGeo = new THREE.BoxGeometry(3.5, 12, 10);
      const claw = new THREE.Mesh(clawGeo, goldTrimMat);
      claw.position.set(36 + i * 5, 44, 32);
      rightArmGroup.add(claw);
    }
    group.add(rightArmGroup);
    group.rightArm = rightArmGroup;

    // 4. Pernas Hidráulicas Gigantes e Pés de Esteira
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(14, 16, 16, 10), mechanicalMat);
    pelvis.position.set(0, 26, 0);
    group.add(pelvis);

    const legGeo = new THREE.BoxGeometry(14, 28, 16);
    const footGeo = new THREE.BoxGeometry(22, 10, 32);

    const legL = new THREE.Mesh(legGeo, mechanicalMat);
    legL.position.set(-20, 18, 0);
    legL.castShadow = true;
    const footL = new THREE.Mesh(footGeo, hullMat);
    footL.position.set(-20, 5, 4);
    footL.castShadow = true;
    group.add(legL);
    group.add(footL);

    const legR = new THREE.Mesh(legGeo, mechanicalMat);
    legR.position.set(20, 18, 0);
    legR.castShadow = true;
    const footR = new THREE.Mesh(footGeo, hullMat);
    footR.position.set(20, 5, 4);
    footR.castShadow = true;
    group.add(legR);
    group.add(footR);

    group.legs = [legL, legR];
    group.feet = [footL, footR];

    return group;
  }

  // MODELO 3D: INIMIGOS TYRANIDS (Hormagaunt, Warrior, Carnifex)
  static createTyranid(type = 'hormagaunt') {
    const group = new THREE.Group();

    const chitinMat = new THREE.MeshStandardMaterial({
      color: type === 'carnifex' ? 0x2b060d : 0x4a121e, // Vermelho carmesim de quitina
      roughness: 0.45,
      metalness: 0.2
    });

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xd4cebd, // Espigões e garras ósseas
      roughness: 0.6,
      metalness: 0.1
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffee00 // Olhos insectóides amarelos
    });

    const isLarge = (type === 'carnifex' || type === 'tyranid_warrior' || type === 'tyranid_prime');

    // Corpo alongado com carapaça segmentada
    const bodyGeo = new THREE.ConeGeometry(isLarge ? 14 : 7, isLarge ? 38 : 22, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, chitinMat);
    bodyMesh.rotation.x = Math.PI / 2;
    bodyMesh.position.set(0, isLarge ? 18 : 10, 0);
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Cabeça com crista e mandíbulas afiadas
    const headGeo = new THREE.ConeGeometry(isLarge ? 10 : 5, isLarge ? 22 : 12, 6);
    const headMesh = new THREE.Mesh(headGeo, chitinMat);
    headMesh.rotation.x = -Math.PI / 2;
    headMesh.position.set(0, isLarge ? 22 : 12, isLarge ? 18 : 11);
    headMesh.castShadow = true;
    group.add(headMesh);

    // Olhos amarelos
    const eyeGeo = new THREE.BoxGeometry(2, 2, 2);
    const eye1 = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eye1.position.set(-3, isLarge ? 23 : 13, isLarge ? 20 : 12);
    const eye2 = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eye2.position.set(3, isLarge ? 23 : 13, isLarge ? 20 : 12);
    group.add(eye1);
    group.add(eye2);

    // Garras Ceifadoras Duplas (Scything Talons)
    const talonGeo = new THREE.BoxGeometry(isLarge ? 4 : 2, isLarge ? 28 : 16, isLarge ? 3 : 1.5);
    const talonL = new THREE.Mesh(talonGeo, boneMat);
    talonL.position.set(isLarge ? -14 : -8, isLarge ? 16 : 8, isLarge ? 12 : 7);
    talonL.rotation.z = Math.PI / 4;
    talonL.rotation.y = 0.3;
    talonL.castShadow = true;

    const talonR = new THREE.Mesh(talonGeo, boneMat);
    talonR.position.set(isLarge ? 14 : 8, isLarge ? 16 : 8, isLarge ? 12 : 7);
    talonR.rotation.z = -Math.PI / 4;
    talonR.rotation.y = -0.3;
    talonR.castShadow = true;

    group.add(talonL);
    group.add(talonR);
    group.talons = [talonL, talonR];

    // Se for Carnifex: Carapaça massiva com espinhos dorsais
    if (type === 'carnifex') {
      const shieldShell = new THREE.Mesh(new THREE.SphereGeometry(18, 8, 8), chitinMat);
      shieldShell.scale.set(1.4, 0.9, 1.2);
      shieldShell.position.set(0, 24, -2);
      group.add(shieldShell);
    }

    return group;
  }

  // MODELO 3D: INIMIGOS CHAOS (Cultist, Chaos Marine, Possessed, Chaos Champion)
  static createChaosEnemy(type = 'chaos_marine') {
    const group = new THREE.Group();

    const isBoss = (type === 'chaos_champion');
    const isMarine = (type === 'chaos_marine' || isBoss);

    const armorColor = isBoss ? 0x1f0609 : (isMarine ? 0x24080c : 0x3d3024);
    const armorMat = new THREE.MeshStandardMaterial({
      color: armorColor,
      metalness: 0.65,
      roughness: 0.4
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0x9c792b, // Ouro envelhecido herético
      metalness: 0.8,
      roughness: 0.3
    });

    const eyeMat = new THREE.MeshBasicMaterial({
      color: isBoss ? 0xff002b : 0x33ff55 // Olhos verdes corrompidos ou vermelhos
    });

    const scale = isBoss ? 1.9 : (isMarine ? 1.15 : 0.85);

    // Tronco
    const chestGeo = new THREE.BoxGeometry(18 * scale, 22 * scale, 14 * scale);
    const chestMesh = new THREE.Mesh(chestGeo, armorMat);
    chestMesh.position.y = 20 * scale;
    chestMesh.castShadow = true;
    group.add(chestMesh);

    // Cabeça
    const headGeo = new THREE.BoxGeometry(10 * scale, 12 * scale, 10 * scale);
    const headMesh = new THREE.Mesh(headGeo, armorMat);
    headMesh.position.set(0, 34 * scale, 0);
    headMesh.castShadow = true;
    group.add(headMesh);

    // Chifres do Caos saindo do capacete
    if (isMarine) {
      const hornGeo = new THREE.ConeGeometry(2 * scale, 14 * scale, 6);
      const hornL = new THREE.Mesh(hornGeo, goldTrimMat);
      hornL.position.set(-6 * scale, 42 * scale, -2 * scale);
      hornL.rotation.z = Math.PI / 4;
      const hornR = new THREE.Mesh(hornGeo, goldTrimMat);
      hornR.position.set(6 * scale, 42 * scale, -2 * scale);
      hornR.rotation.z = -Math.PI / 4;
      group.add(hornL);
      group.add(hornR);
    }

    // Visores luminosos
    const eyeGeo = new THREE.BoxGeometry(3 * scale, 1.5 * scale, 1.5 * scale);
    const eL = new THREE.Mesh(eyeGeo, eyeMat);
    eL.position.set(-2.5 * scale, 34 * scale, 5.2 * scale);
    const eR = new THREE.Mesh(eyeGeo, eyeMat);
    eR.position.set(2.5 * scale, 34 * scale, 5.2 * scale);
    group.add(eL);
    group.add(eR);

    // Se for o Chefe: Grande Espada Demoníaca Negra com runas carmesim
    if (isBoss) {
      const swordGroup = new THREE.Group();
      const blade = new THREE.Mesh(new THREE.BoxGeometry(4, 55, 10), new THREE.MeshStandardMaterial({
        color: 0x080808,
        metalness: 0.95,
        roughness: 0.2
      }));
      blade.position.set(0, 20, 0);
      blade.castShadow = true;
      swordGroup.add(blade);

      const hilt = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 16, 8), goldTrimMat);
      hilt.position.set(0, -12, 0);
      swordGroup.add(hilt);

      swordGroup.position.set(22, 20, 16);
      swordGroup.rotation.x = Math.PI / 4;
      group.add(swordGroup);
      group.sword = swordGroup;
    }

    return group;
  }

  // CENÁRIO 3D: PISO METÁLICO MODULAR E PAREDES DA FORTALEZA IMPERIAL
  static createFloorMesh(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base de aço escovado
    ctx.fillStyle = '#141822';
    ctx.fillRect(0, 0, 512, 512);

    // Borda metálica da placa
    ctx.strokeStyle = '#273347';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 506, 506);

    // Grelhas e painel central
    ctx.strokeStyle = '#1b2331';
    ctx.lineWidth = 3;
    ctx.strokeRect(64, 64, 384, 384);

    // Parafusos nos cantos das placas
    ctx.fillStyle = '#7a8ba6';
    const rivets = [20, 492];
    rivets.forEach(rx => {
      rivets.forEach(ry => {
        ctx.beginPath();
        ctx.arc(rx, ry, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / 160, height / 160);

    const geo = new THREE.PlaneGeometry(width, height);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      metalness: 0.55,
      roughness: 0.45
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    return mesh;
  }

  static createWallMesh(w, h, depth = 50) {
    const geo = new THREE.BoxGeometry(w, depth, h);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x161c26,
      metalness: 0.7,
      roughness: 0.4
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = depth / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  static createBarrelMesh() {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(14, 14, 28, 14);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x8a151b, // Vermelho de Promécio imperial
      metalness: 0.6,
      roughness: 0.35
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 14;
    mesh.castShadow = true;
    group.add(mesh);

    // Anéis metálicos pretos do barril
    const ringGeo = new THREE.TorusGeometry(14.2, 1.2, 8, 16);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x222, metalness: 0.8 });
    const r1 = new THREE.Mesh(ringGeo, ringMat);
    r1.rotation.x = Math.PI / 2;
    r1.position.y = 8;
    const r2 = new THREE.Mesh(ringGeo, ringMat);
    r2.rotation.x = Math.PI / 2;
    r2.position.y = 20;
    group.add(r1);
    group.add(r2);

    return group;
  }
}

/* ==========================================================================
   6. SISTEMA DE PARTÍCULAS E EFEITOS 3D (PARTICLESYSTEM3D)
   Projéteis 3D, faíscas metálicas, fumaça, capsulas expelidas e decalques de sangue.
   ========================================================================== */
class Particle3D {
  constructor(mesh, vx, vy, vz, life, type = 'spark') {
    this.mesh = mesh;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.life = life;
    this.maxLife = life;
    this.type = type;
  }

  update(dt) {
    this.mesh.position.x += this.vx * dt;
    this.mesh.position.y += this.vy * dt;
    this.mesh.position.z += this.vz * dt;
    this.life -= dt;

    if (this.type === 'casing') {
      this.vy -= 400 * dt; // Gravidade na cápsula
      if (this.mesh.position.y < 1) {
        this.mesh.position.y = 1;
        this.vx *= 0.6;
        this.vz *= 0.6;
      }
    } else if (this.type === 'smoke') {
      this.mesh.scale.addScalar(dt * 1.5);
    }
  }
}

class ParticleSystem3D {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
  }

  addSparks(x, y, z, colorHex = 0xffaa22, count = 6) {
    const geo = new THREE.BoxGeometry(2, 2, 2);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 160;
      const vx = Math.cos(angle) * speed;
      const vz = Math.sin(angle) * speed;
      const vy = 40 + Math.random() * 80;

      this.particles.push(new Particle3D(mesh, vx, vy, vz, 0.25 + Math.random() * 0.2, 'spark'));
    }
  }

  addCasing(x, y, z, aimAngle) {
    const geo = new THREE.CylinderGeometry(1.2, 1.2, 4, 6);
    const mat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.z = Math.PI / 2;
    this.scene.add(mesh);

    const ejectAngle = aimAngle + Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    const speed = 90 + Math.random() * 60;
    const vx = Math.cos(ejectAngle) * speed;
    const vz = Math.sin(ejectAngle) * speed;
    const vy = 120 + Math.random() * 60;

    this.particles.push(new Particle3D(mesh, vx, vy, vz, 0.8, 'casing'));
  }

  addExplosionFX(x, z, isLarge = false) {
    this.addSparks(x, 15, z, 0xff5511, isLarge ? 30 : 16);
    // Shockwave ring
    const ringGeo = new THREE.RingGeometry(2, isLarge ? 120 : 75, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffaa33, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 2, z);
    this.scene.add(ring);

    const p = new Particle3D(ring, 0, 0, 0, 0.35, 'ring');
    this.particles.push(p);
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(dt);
      if (p.type === 'ring') {
        p.mesh.scale.addScalar(dt * 4);
        p.mesh.material.opacity = p.life / p.maxLife;
      }
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  clear() {
    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
    }
    this.particles = [];
  }
}

/* ==========================================================================
   7. PROJÉTEIS TRIDIMENSIONAL (PROJECTILE3D)
   Suporta Bolter, Plasma, Melta, Granadas e Rajadas Heréticas.
   ========================================================================== */
class Projectile3D {
  constructor(scene, x, z, angle, type, damage, shooter = 'player') {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.y = 16;
    this.angle = angle;
    this.type = type;
    this.damage = damage;
    this.shooter = shooter;
    this.toRemove = false;
    this.traveled = 0;

    let color = 0xffd15c;
    let radius = 3;
    this.speed = 950;
    this.range = 800;

    if (type === 'plasma') {
      color = 0x00f0ff;
      radius = 7;
      this.speed = 640;
      this.splashRadius = 90;
    } else if (type === 'melta') {
      color = 0xff7700;
      radius = 12;
      this.speed = 800;
      this.range = 360;
    } else if (type === 'chaos_bolt') {
      color = 0xff2244;
      radius = 5;
      this.speed = 520;
    } else if (type === 'missile') {
      color = 0xffaa00;
      radius = 6;
      this.speed = 560;
      this.splashRadius = 110;
    }

    const geo = new THREE.SphereGeometry(radius, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, this.y, z);
    this.scene.add(this.mesh);
  }

  update(dt, game) {
    const dist = this.speed * dt;
    this.x += Math.cos(this.angle) * dist;
    this.z += Math.sin(this.angle) * dist;
    this.traveled += dist;
    this.mesh.position.set(this.x, this.y, this.z);

    if (this.traveled >= this.range) {
      this.explode(game);
    }
  }

  explode(game) {
    if (this.toRemove) return;
    this.toRemove = true;
    this.scene.remove(this.mesh);

    if (this.type === 'plasma' || this.type === 'missile') {
      game.sound.playExplosion(false);
      game.renderer.addCameraShake(0.18);
      game.particles.addExplosionFX(this.x, this.z, false);

      // Dano de área
      for (const enemy of game.enemies) {
        const d = Math.hypot(enemy.x - this.x, enemy.z - this.z);
        if (d <= this.splashRadius + enemy.radius) {
          enemy.takeDamage(this.damage * 0.7, game, false);
        }
      }
      for (const barrel of game.mapBarrels) {
        if (!barrel.exploded) {
          const d = Math.hypot(barrel.x - this.x, barrel.z - this.z);
          if (d <= this.splashRadius + barrel.radius) {
            barrel.takeDamage(100, game);
          }
        }
      }
    } else {
      game.particles.addSparks(this.x, this.y, this.z, this.type === 'chaos_bolt' ? 0xff2244 : 0xffcc33, 4);
    }
  }
}

/* ==========================================================================
   8. JOGADOR: MODO SPACE MARINE (ADEPTUS ASTARTES)
   Controles completos: WASD, Sprint, Mira 360°, Esquiva (I-Frames),
   Parry ativo, Execuções brutais, Troca de 4 Armas e Granadas.
   ========================================================================== */
class SpaceMarinePlayer {
  constructor(scene, x, z) {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.radius = 20;
    this.angle = 0;
    this.model = ModelFactory.createSpaceMarine();
    this.model.position.set(x, 0, z);
    this.scene.add(this.model);

    // Atributos do BalanceManager
    this.maxHp = BALANCE.player.hp;
    this.hp = this.maxHp;
    this.maxArmor = BALANCE.player.armor;
    this.armor = this.maxArmor;
    this.speed = BALANCE.player.speedNormal;
    this.grenades = BALANCE.player.grenadesInitial;

    // Estados e Cooldowns
    this.isDodging = false;
    this.dodgeTimer = 0;
    this.dodgeCooldown = 0;
    this.dodgeDirX = 0;
    this.dodgeDirZ = 0;

    this.isParrying = false;
    this.parryTimer = 0;
    this.parryCooldown = 0;

    this.isExecuting = false;
    this.executionTimer = 0;

    this.isReloading = false;
    this.reloadTimer = 0;
    this.walkCycle = 0;
    this.lastFireTime = 0;

    // Inventário do Marine (Slots 1, 2, 3, 4)
    this.activeSlot = 1;
    this.weapons = {
      1: { ...BALANCE.weapons.bolt_rifle },
      2: { ...BALANCE.weapons.bolt_pistol },
      3: { ...BALANCE.melee.chainsword },
      4: { ...BALANCE.weapons.heavy_bolter }
    };
  }

  takeDamage(amount, game, canParry = false) {
    if (this.isExecuting || this.dodgeTimer > 0) return; // Invulnerabilidade ativa

    // Teste de PARRY Bem-sucedido!
    if (this.isParrying && canParry) {
      game.sound.playParrySuccess();
      game.renderer.addCameraShake(0.2);
      game.triggerScreenFlash('parry');
      game.particles.addSparks(this.x, 24, this.z, 0xffea70, 20);

      // Atordoa e coloca inimigos próximos em estado EXECUTÁVEL
      for (const enemy of game.enemies) {
        const d = Math.hypot(enemy.x - this.x, enemy.z - this.z);
        if (d < 160) {
          enemy.stun(2.5);
          enemy.isExecutable = true;
        }
      }
      return;
    }

    // Absorção de Armadura de Ceramite (absorve até 75%)
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, amount * 0.75);
      this.armor -= absorbed;
      amount -= absorbed;
      game.particles.addSparks(this.x, 24, this.z, 0x38bdf8, 5);
    }

    this.hp = Math.max(0, this.hp - amount);
    game.sound.playBolter();
    game.renderer.addCameraShake(0.25);
    game.triggerDamageVignette();
    game.updateHUDVitals();

    if (this.hp <= 0) {
      game.triggerGameOver();
    }
  }

  performDodge(inputDirX, inputDirZ) {
    if (this.dodgeCooldown > 0 || this.isExecuting) return;
    this.isDodging = true;
    this.dodgeTimer = BALANCE.player.dodgeDuration;
    this.dodgeCooldown = BALANCE.player.dodgeCooldown;

    const len = Math.hypot(inputDirX, inputDirZ);
    if (len > 0) {
      this.dodgeDirX = inputDirX / len;
      this.dodgeDirZ = inputDirZ / len;
    } else {
      this.dodgeDirX = Math.cos(this.angle);
      this.dodgeDirZ = Math.sin(this.angle);
    }
  }

  performParry(game) {
    if (this.parryCooldown > 0 || this.isExecuting || this.isDodging) return;
    this.isParrying = true;
    this.parryTimer = BALANCE.player.parryWindow;
    this.parryCooldown = BALANCE.player.parryCooldown;
    game.sound.playPowerSword();
    game.particles.addSparks(this.x, 24, this.z, 0x85d7ff, 8);
  }

  performExecution(game) {
    if (this.isExecuting) return;

    // Busca o inimigo atordoado/executável mais próximo
    let target = null;
    let minDist = 140;

    for (const enemy of game.enemies) {
      if (enemy.isExecutable && !enemy.toRemove) {
        const d = Math.hypot(enemy.x - this.x, enemy.z - this.z);
        if (d < minDist) {
          minDist = d;
          target = enemy;
        }
      }
    }

    if (!target) return;

    this.isExecuting = true;
    this.executionTimer = BALANCE.player.executionInvuln;
    this.angle = Math.atan2(target.z - this.z, target.x - this.x);

    game.sound.playExecution();
    game.renderer.addCameraShake(0.4);
    game.triggerScreenFlash('red');

    // Teleporta próximo ao alvo para finalização cinematográfica
    this.x = target.x - Math.cos(this.angle) * 35;
    this.z = target.z - Math.sin(this.angle) * 35;

    // Destrói o inimigo instantaneamente
    target.takeDamage(9999, game, true);

    // Recupera Armadura e Vida
    this.armor = Math.min(this.maxArmor, this.armor + BALANCE.player.executionArmorRestore);
    this.hp = Math.min(this.maxHp, this.hp + BALANCE.player.executionHpRestore);
    game.updateHUDVitals();
  }

  throwGrenade(game) {
    if (this.grenades <= 0 || this.isExecuting) return;
    this.grenades--;
    document.getElementById('hud-grenades-count').innerText = this.grenades;

    const targetX = this.x + Math.cos(this.angle) * 340;
    const targetZ = this.z + Math.sin(this.angle) * 340;

    setTimeout(() => {
      game.sound.playExplosion(true);
      game.renderer.addCameraShake(0.35);
      game.particles.addExplosionFX(targetX, targetZ, true);

      for (const enemy of game.enemies) {
        const d = Math.hypot(enemy.x - targetX, enemy.z - targetZ);
        if (d < 170) {
          enemy.takeDamage(180, game, true);
        }
      }
    }, 450);
  }

  switchSlot(slotNumber, game) {
    if (slotNumber === this.activeSlot || !this.weapons[slotNumber]) return;
    this.activeSlot = slotNumber;
    this.isReloading = false;
    game.sound.playBolter();
    game.updateHUDWeapons();
  }

  reload(game) {
    const w = this.weapons[this.activeSlot];
    if (!w.mag || this.isReloading || w.mag >= w.maxMag || w.ammo <= 0) return;
    this.isReloading = true;
    this.reloadTimer = w.reloadTime;
    game.sound.playBolter();
    game.updateHUDAmmo();
  }

  fire(game) {
    if (this.isReloading || this.isExecuting || this.isDodging) return;
    const now = performance.now() / 1000;
    const w = this.weapons[this.activeSlot];

    if (now - this.lastFireTime < w.fireRate) return;
    this.lastFireTime = now;

    // ATAQUE CORPO A CORPO (SLOT 3 MELEE)
    if (w.arc) {
      if (w.type === 'chainsword') game.sound.playChainsword();
      else if (w.type === 'power_sword') game.sound.playPowerSword();
      else if (w.type === 'thunder_hammer') game.sound.playThunderHammer();
      else game.sound.playPowerSword();

      game.renderer.addCameraShake(0.12);
      const hitRadius = w.range;
      const hitArc = w.arc;

      for (const enemy of game.enemies) {
        const dx = enemy.x - this.x;
        const dz = enemy.z - this.z;
        const dist = Math.hypot(dx, dz);
        if (dist <= hitRadius + enemy.radius) {
          let a = Math.atan2(dz, dx);
          let diff = Math.abs(a - this.angle);
          while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);

          if (diff <= hitArc / 2) {
            enemy.takeDamage(w.damage, game, true);
            game.particles.addSparks(enemy.x, 20, enemy.z, 0x85d7ff, 8);
          }
        }
      }
      return;
    }

    // DISPARO DE ARMAS DE FOGO
    if (w.mag <= 0) {
      this.reload(game);
      return;
    }

    w.mag--;
    game.updateHUDAmmo();

    const spawnX = this.x + Math.cos(this.angle) * 32 - Math.sin(this.angle) * 10;
    const spawnZ = this.z + Math.sin(this.angle) * 32 + Math.cos(this.angle) * 10;
    const spreadAngle = this.angle + (Math.random() - 0.5) * (w.spread || 0.04);

    if (w.type === 'bolter' || w.type === 'pistol') {
      game.sound.playBolter();
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, spreadAngle, 'bolter', w.damage, 'player'));
      game.particles.addCasing(this.x, 24, this.z, this.angle);
    } else if (w.type === 'heavy_bolter') {
      game.sound.playHeavyBolter();
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, spreadAngle, 'bolter', w.damage, 'player'));
      game.particles.addCasing(this.x, 24, this.z, this.angle);
      game.renderer.addCameraShake(0.1);
    } else if (w.type === 'plasma') {
      game.sound.playPlasma();
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, spreadAngle, 'plasma', w.damage, 'player'));
    } else if (w.type === 'melta') {
      game.sound.playMelta();
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, spreadAngle, 'melta', w.damage, 'player'));
      game.renderer.addCameraShake(0.18);
    } else if (w.type === 'stalker') {
      game.sound.playBolter();
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, spreadAngle, 'stalker', w.damage, 'player'));
      game.renderer.addCameraShake(0.15);
    } else if (w.type === 'grenade') {
      game.sound.playExplosion(false);
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, spreadAngle, 'missile', w.damage, 'player'));
      game.renderer.addCameraShake(0.1);
    }
  }

  update(dt, game) {
    // Cooldowns
    if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt;
    if (this.parryCooldown > 0) this.parryCooldown -= dt;

    if (this.parryTimer > 0) {
      this.parryTimer -= dt;
      if (this.parryTimer <= 0) this.isParrying = false;
    }

    if (this.executionTimer > 0) {
      this.executionTimer -= dt;
      if (this.executionTimer <= 0) this.isExecuting = false;
      this.model.position.set(this.x, 0, this.z);
      this.model.rotation.y = -this.angle + Math.PI / 2;
      return;
    }

    // Atualiza Recarga
    if (this.isReloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        const w = this.weapons[this.activeSlot];
        const needed = w.maxMag - w.mag;
        const toLoad = Math.min(needed, w.ammo);
        w.mag += toLoad;
        w.ammo -= toLoad;
        game.updateHUDAmmo();
      }
    }

    // Movimentação
    if (this.isDodging) {
      this.dodgeTimer -= dt;
      this.x += this.dodgeDirX * BALANCE.player.dodgeSpeed * dt;
      this.z += this.dodgeDirZ * BALANCE.player.dodgeSpeed * dt;
      if (this.dodgeTimer <= 0) this.isDodging = false;
    } else {
      let moveX = 0;
      let moveZ = 0;
      if (game.keys['KeyW'] || game.keys['ArrowUp']) moveZ -= 1;
      if (game.keys['KeyS'] || game.keys['ArrowDown']) moveZ += 1;
      if (game.keys['KeyA'] || game.keys['ArrowLeft']) moveX -= 1;
      if (game.keys['KeyD'] || game.keys['ArrowRight']) moveX += 1;

      // Integração com Joystick Virtual Mobile
      if (game.touchMoveX !== 0 || game.touchMoveZ !== 0) {
        moveX = game.touchMoveX;
        moveZ = game.touchMoveZ;
      }

      if (moveX !== 0 && moveZ !== 0) {
        moveX *= 0.7071;
        moveZ *= 0.7071;
      }

      const isSprinting = game.keys['ShiftLeft'] || game.keys['ShiftRight'];
      let currentSpeed = isSprinting ? BALANCE.player.speedSprint : BALANCE.player.speedNormal;

      // Penalidade de arma pesada
      const activeW = this.weapons[this.activeSlot];
      if (activeW && activeW.movePenalty) currentSpeed *= activeW.movePenalty;

      this.x += moveX * currentSpeed * dt;
      this.z += moveZ * currentSpeed * dt;

      if (moveX !== 0 || moveZ !== 0) {
        this.walkCycle += dt * 10;
        this.model.legs[0].rotation.x = Math.sin(this.walkCycle) * 0.45;
        this.model.legs[1].rotation.x = -Math.sin(this.walkCycle) * 0.45;
      }
    }

    // Limites de Arena
    this.x = Math.max(-1100, Math.min(1100, this.x));
    this.z = Math.max(-950, Math.min(950, this.z));

    // Rotação para mirar onde o mouse/toque está no mundo
    this.angle = game.mouseWorldAngle;
    this.model.position.set(this.x, 0, this.z);
    this.model.rotation.y = -this.angle + Math.PI / 2;

    // Disparo contínuo com mouse down
    if (game.mouseDown && !this.isDodging) {
      this.fire(game);
    }
  }
}

/* ==========================================================================
   9. JOGADOR: MODO DREADNOUGHT (ENDLESS WAR)
   Chassis colossais de 2500 Hull / 1500 Armor, Armamento independente
   em ambos os braços (Assault Cannon, Flamer, Power Fist), Ground Stomp,
   Dreadnought Fury, superaquecimento do reator e passos que tremem a terra.
   ========================================================================== */
class DreadnoughtPlayer {
  constructor(scene, x, z) {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.radius = 36;
    this.angle = 0;
    this.model = ModelFactory.createDreadnought();
    this.model.position.set(x, 0, z);
    this.scene.add(this.model);

    // Atributos do Dreadnought
    this.maxHull = BALANCE.dreadnought.hull;
    this.hull = this.maxHull;
    this.maxArmor = BALANCE.dreadnought.armor;
    this.armor = this.maxArmor;
    this.energy = BALANCE.dreadnought.energy;
    this.heat = 0; // 0% a 100%
    this.speed = BALANCE.dreadnought.speed;

    // Habilidades
    this.stompCooldown = 0;
    this.furyCooldown = 0;
    this.furyActive = false;
    this.furyTimer = 0;

    this.leftArmWeapon = { ...BALANCE.dreadnought.weapons.assault_cannon };
    this.rightArmWeapon = { ...BALANCE.dreadnought.weapons.power_fist };

    this.walkCycle = 0;
    this.stepTimer = 0;
    this.lastFireL = 0;
    this.lastFireR = 0;
  }

  takeDamage(amount, game) {
    if (this.furyActive) amount *= 0.5; // Redução maciça de dano na Fúria

    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, amount * 0.8);
      this.armor -= absorbed;
      amount -= absorbed;
      game.particles.addSparks(this.x, 40, this.z, 0x38bdf8, 8);
    }

    this.hull = Math.max(0, this.hull - amount);
    game.sound.playHeavyBolter();
    game.renderer.addCameraShake(0.28);
    game.triggerDamageVignette();
    game.updateHUDVitals();

    // Emissão de fumaça conforme integridade do casco cai
    if (this.hull < this.maxHull * 0.4) {
      game.particles.addSparks(this.x, 50, this.z, 0xff3300, 4);
    }

    if (this.hull <= 0) {
      game.triggerGameOver();
    }
  }

  performStomp(game) {
    if (this.stompCooldown > 0 || this.energy < BALANCE.dreadnought.stompEnergy) return;
    this.energy -= BALANCE.dreadnought.stompEnergy;
    this.stompCooldown = BALANCE.dreadnought.stompCooldown;

    game.sound.playDreadStomp();
    game.renderer.addCameraShake(0.5);
    game.particles.addExplosionFX(this.x, this.z, true);

    const radius = BALANCE.dreadnought.stompRadius;
    const damage = BALANCE.dreadnought.stompDamage;

    for (const enemy of game.enemies) {
      const d = Math.hypot(enemy.x - this.x, enemy.z - this.z);
      if (d <= radius + enemy.radius) {
        enemy.takeDamage(damage, game, true);
        // Empurrão de impacto
        const pushAngle = Math.atan2(enemy.z - this.z, enemy.x - this.x);
        enemy.x += Math.cos(pushAngle) * 60;
        enemy.z += Math.sin(pushAngle) * 60;
      }
    }
  }

  activateFury(game) {
    if (this.furyCooldown > 0 || this.energy < BALANCE.dreadnought.furyEnergy) return;
    this.energy -= BALANCE.dreadnought.furyEnergy;
    this.furyActive = true;
    this.furyTimer = BALANCE.dreadnought.furyDuration;
    this.furyCooldown = BALANCE.dreadnought.furyCooldown;
    this.heat = 0;

    game.sound.playBossRoar();
    game.renderer.addCameraShake(0.4);
    game.triggerScreenFlash('parry');
  }

  fireLeftArm(game) {
    if (this.heat >= 100 && !this.furyActive) return; // Superaquecido!
    const now = performance.now() / 1000;
    const w = this.leftArmWeapon;
    if (now - this.lastFireL < (this.furyActive ? w.fireRate * 0.7 : w.fireRate)) return;
    this.lastFireL = now;

    if (!this.furyActive) this.heat = Math.min(100, this.heat + w.heatRate);

    const spawnX = this.x + Math.cos(this.angle) * 45 - Math.sin(this.angle) * 36;
    const spawnZ = this.z + Math.sin(this.angle) * 45 + Math.cos(this.angle) * 36;

    if (w.type === 'assault_cannon') {
      game.sound.playAssaultCannon();
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, this.angle + (Math.random() - 0.5) * 0.06, 'bolter', w.damage, 'player'));
      game.renderer.addCameraShake(0.04);
      if (this.model.leftArm.barrels) this.model.leftArm.barrels.rotation.z += 0.6;
    } else if (w.type === 'flamer') {
      game.sound.playMelta();
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, this.angle, 'melta', w.damage, 'player'));
    }
  }

  fireRightArm(game) {
    const now = performance.now() / 1000;
    const w = this.rightArmWeapon;
    if (now - this.lastFireR < w.fireRate) return;
    this.lastFireR = now;

    if (w.type === 'power_fist' || w.type === 'chainfist') {
      game.sound.playExecution();
      game.renderer.addCameraShake(0.25);
      const reach = w.range;

      for (const enemy of game.enemies) {
        const d = Math.hypot(enemy.x - this.x, enemy.z - this.z);
        if (d <= reach + enemy.radius) {
          enemy.takeDamage(w.damage * (this.furyActive ? 1.5 : 1.0), game, true);
          game.particles.addSparks(enemy.x, 30, enemy.z, 0xffcc00, 14);
        }
      }
    }
  }

  update(dt, game) {
    // Recarga de Energia e Dissipação de Calor
    this.energy = Math.min(100, this.energy + BALANCE.dreadnought.energyRecharge * dt);
    if (!this.furyActive) {
      this.heat = Math.max(0, this.heat - BALANCE.dreadnought.coolingRate * dt);
    }

    if (this.stompCooldown > 0) this.stompCooldown -= dt;
    if (this.furyCooldown > 0) this.furyCooldown -= dt;

    if (this.furyActive) {
      this.furyTimer -= dt;
      if (this.furyTimer <= 0) this.furyActive = false;
    }

    // Movimentação Pesada
    let moveX = 0;
    let moveZ = 0;
    if (game.keys['KeyW'] || game.keys['ArrowUp']) moveZ -= 1;
    if (game.keys['KeyS'] || game.keys['ArrowDown']) moveZ += 1;
    if (game.keys['KeyA'] || game.keys['ArrowLeft']) moveX -= 1;
    if (game.keys['KeyD'] || game.keys['ArrowRight']) moveX += 1;

    if (game.touchMoveX !== 0 || game.touchMoveZ !== 0) {
      moveX = game.touchMoveX;
      moveZ = game.touchMoveZ;
    }

    if (moveX !== 0 && moveZ !== 0) {
      moveX *= 0.7071;
      moveZ *= 0.7071;
    }

    this.x += moveX * this.speed * dt;
    this.z += moveZ * this.speed * dt;

    if (moveX !== 0 || moveZ !== 0) {
      this.walkCycle += dt * 6;
      this.stepTimer += dt;
      if (this.stepTimer > 0.42) {
        this.stepTimer = 0;
        game.sound.playMechanicalStep();
        game.renderer.addCameraShake(0.08);
      }
      this.model.legs[0].rotation.x = Math.sin(this.walkCycle) * 0.35;
      this.model.legs[1].rotation.x = -Math.sin(this.walkCycle) * 0.35;
    }

    this.x = Math.max(-1100, Math.min(1100, this.x));
    this.z = Math.max(-950, Math.min(950, this.z));

    this.angle = game.mouseWorldAngle;
    this.model.position.set(this.x, 0, this.z);
    this.model.rotation.y = -this.angle + Math.PI / 2;

    // Disparos com Mouse
    if (game.mouseDown) {
      this.fireLeftArm(game);
    }
  }
}

/* ==========================================================================
   10. INIMIGOS E INTELIGÊNCIA ARTIFICIAL TÁTICA (ENEMY & ENEMYAI)
   Máquina de Estados Finita: IDLE, CHASE, FLANK, ATTACK, STUNNED, EXECUTABLE, DEAD.
   Telegrafia visual de golpes, cercamento em bando e suporte a hordas massivas.
   ========================================================================== */
class Enemy3D {
  constructor(scene, x, z, typeKey) {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.typeKey = typeKey;
    this.config = BALANCE.enemies[typeKey] || BALANCE.enemies.cultist;

    this.maxHp = this.config.hp;
    this.hp = this.maxHp;
    this.armor = this.config.armor || 0;
    this.speed = this.config.speed;
    this.damage = this.config.damage;
    this.radius = this.config.radius;
    this.score = this.config.score;

    this.state = 'CHASE'; // 'IDLE', 'CHASE', 'FLANK', 'ATTACK', 'STUNNED', 'DEAD'
    this.stunTimer = 0;
    this.attackCooldown = 0;
    this.rangedTimer = Math.random() * 1.5;
    this.isExecutable = false;
    this.toRemove = false;
    this.angle = 0;

    // Cria modelo 3D correspondente
    if (this.config.faction === 'tyranid') {
      this.model = ModelFactory.createTyranid(typeKey);
    } else {
      this.model = ModelFactory.createChaosEnemy(typeKey);
    }
    this.model.position.set(x, 0, z);
    this.scene.add(this.model);
  }

  stun(duration = 2.0) {
    this.state = 'STUNNED';
    this.stunTimer = duration;
    this.isExecutable = true;
  }

  takeDamage(amount, game, isCrit = false) {
    if (this.toRemove) return;

    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, amount * 0.6);
      this.armor -= absorbed;
      amount -= absorbed;
    }

    this.hp -= amount;
    game.particles.addSparks(this.x, 20, this.z, 0xaa1515, 6);

    // Se a vida ficar baixa (<25%), fica executável para o Space Marine!
    if (this.hp > 0 && this.hp <= this.maxHp * 0.25 && !this.config.isBoss) {
      this.isExecutable = true;
    }

    if (this.hp <= 0) {
      this.die(game);
    }
  }

  die(game) {
    if (this.toRemove) return;
    this.toRemove = true;
    game.sound.playExplosion(false);
    game.addScore(this.score, this.x, this.z);
    game.killsCount++;

    // Remove mesh da cena
    this.scene.remove(this.model);

    // Chance de derrubar munição ou cura
    if (Math.random() < 0.25) {
      game.spawnPickup(this.x, this.z);
    }
  }

  update(dt, game) {
    if (this.toRemove) return;

    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    // Estado Atordoado / Executável
    if (this.state === 'STUNNED') {
      this.stunTimer -= dt;
      if (this.stunTimer <= 0) {
        this.state = 'CHASE';
        this.isExecutable = false;
      }
      return;
    }

    const player = game.activePlayer;
    const dx = player.x - this.x;
    const dz = player.z - this.z;
    const dist = Math.hypot(dx, dz);
    this.angle = Math.atan2(dz, dx);

    // Disparo à distância (se possuir ataque ranged)
    if (this.config.range && dist < this.config.range && dist > 140) {
      this.rangedTimer -= dt;
      if (this.rangedTimer <= 0) {
        this.rangedTimer = this.config.rangedCooldown || 2.0;
        // Tipo de projétil baseado na facção
        const projType = this.config.faction === 'tyranid' ? 'chaos_bolt' : 'chaos_bolt';
        game.projectiles.push(new Projectile3D(this.scene, this.x, this.z, this.angle, projType, this.damage, 'enemy'));
      }
    }

    // Flanqueamento inteligente para hordas rápidas
    let moveDir = this.angle;
    if (this.config.speed > 200 && dist > 180) {
      const flankOffset = Math.sin(performance.now() * 0.003 + this.x) * 0.45;
      moveDir += flankOffset;
    }

    // Movimentação em direção ao jogador
    this.x += Math.cos(moveDir) * this.speed * dt;
    this.z += Math.sin(moveDir) * this.speed * dt;

    this.model.position.set(this.x, 0, this.z);
    this.model.rotation.y = -this.angle + Math.PI / 2;

    // Ataque corpo a corpo no jogador
    if (dist <= this.radius + player.radius + 8) {
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 0.85;
        // Ataques que podem sofrer Parry
        player.takeDamage(this.damage, game, true);
      }
    }
  }
}

/* ==========================================================================
   11. CHEFE TÁTICO: CHAOS CHAMPION (HERALD OF THE WARP)
   Múltiplas fases de combate, investidas com rastro de fogo,
   chuva de projéteis mágicos do Warp e invocação de servos.
   ========================================================================== */
class BossChampion3D extends Enemy3D {
  constructor(scene, x, z) {
    super(scene, x, z, 'chaos_champion');
    this.phase = 1;
    this.phaseTimer = 2.5;
    this.summonThresholds = [1350, 900, 450];
    this.chargeDir = 0;
  }

  takeDamage(amount, game, isCrit = false) {
    super.takeDamage(amount, game, isCrit);
    game.updateBossHUD(this.hp, this.maxHp);

    if (this.summonThresholds.length > 0 && this.hp <= this.summonThresholds[0]) {
      this.summonThresholds.shift();
      this.summonReinforcements(game);
    }
  }

  summonReinforcements(game) {
    game.sound.playBossRoar();
    game.renderer.addCameraShake(0.35);
    game.particles.addExplosionFX(this.x, this.z, true);

    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 / 4) * i;
      const sx = this.x + Math.cos(a) * 120;
      const sz = this.z + Math.sin(a) * 120;
      game.enemies.push(new Enemy3D(this.scene, sx, sz, Math.random() < 0.5 ? 'possessed' : 'chaos_marine'));
    }
    game.aliveEnemiesCount += 4;
    game.updateHUDEnemies();
  }

  update(dt, game) {
    if (this.toRemove) return;
    this.phaseTimer -= dt;

    const player = game.activePlayer;
    const dx = player.x - this.x;
    const dz = player.z - this.z;
    const dist = Math.hypot(dx, dz);
    this.angle = Math.atan2(dz, dx);

    // Alternância de Padrões Fases
    if (this.phaseTimer <= 0) {
      this.phase = (this.phase % 3) + 1;
      this.phaseTimer = 3.5;

      if (this.phase === 2) {
        // Fase 2: Investida Furiosa
        this.chargeDir = this.angle;
        game.sound.playBossRoar();
      } else if (this.phase === 3) {
        // Fase 3: Rajada Circular do Warp
        game.sound.playExplosion(true);
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 / 8) * i;
          game.projectiles.push(new Projectile3D(this.scene, this.x, this.z, a, 'chaos_bolt', 24, 'boss'));
        }
      }
    }

    if (this.phase === 2) {
      // Investida com velocidade tripla
      this.x += Math.cos(this.chargeDir) * 320 * dt;
      this.z += Math.sin(this.chargeDir) * 320 * dt;
      game.particles.addSparks(this.x, 15, this.z, 0xff3311, 2);
    } else {
      this.x += Math.cos(this.angle) * this.speed * dt;
      this.z += Math.sin(this.angle) * this.speed * dt;
    }

    this.model.position.set(this.x, 0, this.z);
    this.model.rotation.y = -this.angle + Math.PI / 2;

    if (dist <= this.radius + player.radius + 12) {
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 1.0;
        player.takeDamage(this.damage, game, true);
      }
    }
  }
}

/* ==========================================================================
   12. COLETÁVEIS E BARRIS DE PROMÉCIO DESTRUTÍVEIS (PICKUPS & BARRELS)
   ========================================================================== */
class Barrel3D {
  constructor(scene, x, z) {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.radius = 16;
    this.hp = 35;
    this.exploded = false;
    this.model = ModelFactory.createBarrelMesh();
    this.model.position.set(x, 0, z);
    this.scene.add(this.model);
  }

  takeDamage(amount, game) {
    if (this.exploded) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.explode(game);
    }
  }

  explode(game) {
    if (this.exploded) return;
    this.exploded = true;
    this.scene.remove(this.model);

    game.sound.playExplosion(true);
    game.renderer.addCameraShake(0.35);
    game.particles.addExplosionFX(this.x, this.z, true);

    const radius = 130;
    const dmg = 160;

    for (const enemy of game.enemies) {
      const d = Math.hypot(enemy.x - this.x, enemy.z - this.z);
      if (d <= radius + enemy.radius) {
        enemy.takeDamage(dmg, game, true);
      }
    }

    const pDist = Math.hypot(game.activePlayer.x - this.x, game.activePlayer.z - this.z);
    if (pDist <= radius + game.activePlayer.radius) {
      game.activePlayer.takeDamage(45, game);
    }

    // Detonação em cadeia de outros barris
    for (const b of game.mapBarrels) {
      if (!b.exploded) {
        const d = Math.hypot(b.x - this.x, b.z - this.z);
        if (d <= radius + b.radius) {
          b.takeDamage(dmg, game);
        }
      }
    }
  }
}

class Pickup3D {
  constructor(scene, x, z, type = 'ammo') {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.type = type;
    this.radius = 16;

    const geo = new THREE.BoxGeometry(10, 8, 14);
    const mat = new THREE.MeshStandardMaterial({
      color: type === 'ammo' ? 0xd4af37 : 0x22c55e,
      metalness: 0.7,
      roughness: 0.3
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, 8, z);
    this.scene.add(this.mesh);
  }

  update(dt, player, game) {
    this.mesh.rotation.y += dt * 3;
    const d = Math.hypot(player.x - this.x, player.z - this.z);

    if (d <= this.radius + player.radius) {
      if (this.type === 'ammo') {
        if (player.weapons) {
          for (let s = 1; s <= 4; s++) {
            if (player.weapons[s] && player.weapons[s].ammo !== undefined) {
              player.weapons[s].ammo = Math.min(player.weapons[s].maxAmmo, player.weapons[s].ammo + 60);
            }
          }
        }
      } else {
        if (player.hp !== undefined) player.hp = Math.min(player.maxHp, player.hp + 40);
        if (player.hull !== undefined) player.hull = Math.min(player.maxHull, player.hull + 300);
        if (player.armor !== undefined) player.armor = Math.min(player.maxArmor, player.armor + 30);
      }
      game.sound.playBolter();
      game.updateHUDVitals();
      game.updateHUDAmmo();
      this.scene.remove(this.mesh);
      if (this.mesh.geometry) this.mesh.geometry.dispose(); // Evita memory leak
      return true; // Coletado
    }
    return false;
  }
}

/* ==========================================================================
   13. RADAR MINIMAPA TÁTICO
   ========================================================================== */
class MinimapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = 160;
  }

  draw(game) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);

    const arenaW = 2400;
    const arenaH = 2000;
    const scaleX = this.size / arenaW;
    const scaleY = this.size / arenaH;

    // Fundo escuro do radar
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, this.size, this.size);

    // Inimigos (Pontos Vermelhos ou Caveiras)
    for (const e of game.enemies) {
      const ex = (e.x + arenaW / 2) * scaleX;
      const ey = (e.z + arenaH / 2) * scaleY;
      ctx.fillStyle = e.config && e.config.isBoss ? '#ffcc00' : '#ff2e43';
      ctx.beginPath();
      ctx.arc(ex, ey, e.config && e.config.isBoss ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Jogador (Ponto Dourado com cone de visão)
    const px = (game.activePlayer.x + arenaW / 2) * scaleX;
    const py = (game.activePlayer.z + arenaH / 2) * scaleY;

    ctx.fillStyle = '#f5d070';
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 208, 112, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + Math.cos(game.activePlayer.angle) * 12, py + Math.sin(game.activePlayer.angle) * 12);
    ctx.stroke();
  }
}

/* ==========================================================================
   14. COMBAT DIRECTOR & GERENCIADOR DE ONDAS (WAVEMANAGER)
   Controla ritmo, intensidade e orçamento de ameaça para hordas balanceadas.
   ========================================================================== */
class WaveManager {
  constructor(game) {
    this.game = game;
    this.currentWave = 1;
    this.maxCampaignWaves = 5;
    this.waveSpawnQueue = [];
    this.spawnTimer = 0;
  }

  startCampaignWave(waveNum) {
    this.currentWave = waveNum;
    this.waveSpawnQueue = [];
    this.game._waveTransitioning = false; // Libera flag de transição
    this.game.sound.playBossRoar();
    this.game.updateHUDWave();

    if (waveNum === 1) {
      for (let i = 0; i < 6; i++) this.waveSpawnQueue.push('cultist');
      for (let i = 0; i < 3; i++) this.waveSpawnQueue.push('termagant');
    } else if (waveNum === 2) {
      for (let i = 0; i < 6; i++) this.waveSpawnQueue.push('termagant');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('hormagaunt');
      for (let i = 0; i < 2; i++) this.waveSpawnQueue.push('chaos_marine');
    } else if (waveNum === 3) {
      for (let i = 0; i < 8; i++) this.waveSpawnQueue.push('hormagaunt');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('tyranid_warrior');
      for (let i = 0; i < 3; i++) this.waveSpawnQueue.push('possessed');
    } else if (waveNum === 4) {
      for (let i = 0; i < 8; i++) this.waveSpawnQueue.push('chaos_marine');
      for (let i = 0; i < 6; i++) this.waveSpawnQueue.push('ravener');
      for (let i = 0; i < 2; i++) this.waveSpawnQueue.push('carnifex');
    } else if (waveNum === 5) {
      // Chefe Final: Chaos Champion
      this.waveSpawnQueue.push('chaos_champion');
      for (let i = 0; i < 5; i++) this.waveSpawnQueue.push('chaos_marine');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('daemon');
      document.getElementById('boss-hud-bar').classList.remove('hidden');
    }

    this.game.aliveEnemiesCount = this.waveSpawnQueue.length;
    this.game.updateHUDEnemies();
  }

  startEndlessWave(waveNum) {
    this.currentWave = waveNum;
    this.waveSpawnQueue = [];
    this.game._waveTransitioning = false; // Libera flag de transição
    this.game.sound.playBossRoar();
    this.game.updateHUDWave();

    // Orçamento de Ameaça Progressivo com limite para evitar ondas imensas
    const threatBudget = Math.min(40 + waveNum * 25, 500);
    let spent = 0;
    let safetyCounter = 0;

    const availableEnemies = ['cultist', 'termagant', 'hormagaunt', 'daemon', 'possessed', 'chaos_marine', 'tyranid_warrior', 'ravener'];
    if (waveNum >= 3) availableEnemies.push('tyranid_prime');
    if (waveNum >= 5) availableEnemies.push('carnifex');

    while (spent < threatBudget && safetyCounter < 200) {
      safetyCounter++;
      const type = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
      const cost = BALANCE.enemies[type].threatCost;
      if (spent + cost > threatBudget && this.waveSpawnQueue.length > 0) break;
      this.waveSpawnQueue.push(type);
      spent += cost;
    }

    this.game.aliveEnemiesCount = this.waveSpawnQueue.length;
    this.game.updateHUDEnemies();
  }

  update(dt) {
    if (this.waveSpawnQueue.length > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = 0.55;
        const nextType = this.waveSpawnQueue.shift();
        this.game.spawnEnemy(nextType);
      }
    }
  }
}

/* ==========================================================================
   15. CONTROLADOR GERAL DO JOGO (GAME ENGINE)
   Orquestra os dois modos de jogo, loop principal, eventos e interface GSAP.
   ========================================================================== */
class Game {
  constructor() {
    this.canvas = document.getElementById('threeCanvas');
    this.renderer = new ThreeRenderer(this.canvas);
    this.sound = new AudioManager();
    this.particles = new ParticleSystem3D(this.renderer.scene);
    this.minimap = new MinimapRenderer(document.getElementById('minimapCanvas'));
    this.waveManager = new WaveManager(this);

    this.saveData = SaveManager.load();
    this.state = 'TITLE'; // 'TITLE', 'PLAYING', 'PAUSED', 'UPGRADES', 'GAMEOVER', 'VICTORY'
    this.mode = 'MARINE'; // 'MARINE' ou 'DREADNOUGHT'

    this.score = 0;
    this.killsCount = 0;
    this.aliveEnemiesCount = 0;

    this.projectiles = [];
    this.enemies = [];
    this.pickups = [];
    this.mapBarrels = [];

    // Controles e Entradas
    this.keys = {};
    this.mouseDown = false;
    this.mouseWorldAngle = 0;
    this.touchMoveX = 0;
    this.touchMoveZ = 0;

    this.initEnvironment();
    this.initEvents();
    this.initDustBackground();
  }

  initEnvironment() {
    // Piso de metal modular da catedral/fortaleza
    const floor = ModelFactory.createFloorMesh(2400, 2000);
    this.renderer.scene.add(floor);

    // Paredes de limite e pilares góticos
    const walls = [
      ModelFactory.createWallMesh(2400, 40),
      ModelFactory.createWallMesh(2400, 40),
      ModelFactory.createWallMesh(40, 2000),
      ModelFactory.createWallMesh(40, 2000)
    ];
    walls[0].position.set(0, 25, -1000);
    walls[1].position.set(0, 25, 1000);
    walls[2].position.set(-1200, 25, 0);
    walls[3].position.set(1200, 25, 0);
    walls.forEach(w => this.renderer.scene.add(w));

    // Pilares centrais
    const pillar1 = ModelFactory.createWallMesh(60, 60, 80);
    pillar1.position.set(-300, 40, -200);
    const pillar2 = ModelFactory.createWallMesh(60, 60, 80);
    pillar2.position.set(300, 40, -200);
    const pillar3 = ModelFactory.createWallMesh(60, 60, 80);
    pillar3.position.set(-300, 40, 200);
    const pillar4 = ModelFactory.createWallMesh(60, 60, 80);
    pillar4.position.set(300, 40, 200);
    [pillar1, pillar2, pillar3, pillar4].forEach(p => this.renderer.scene.add(p));

    // Barris Explosivos
    const coords = [
      { x: -500, z: -350 }, { x: -460, z: -350 },
      { x: 500, z: -350 }, { x: 540, z: -350 },
      { x: -400, z: 350 }, { x: 400, z: 350 },
      { x: 0, z: -550 }
    ];
    coords.forEach(c => this.mapBarrels.push(new Barrel3D(this.renderer.scene, c.x, c.z)));
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.renderer.resize();
    });

    // Teclado
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (this.state === 'PLAYING') {
        if (this.mode === 'MARINE') {
          if (e.code === 'Digit1') this.activePlayer.switchSlot(1, this);
          if (e.code === 'Digit2') this.activePlayer.switchSlot(2, this);
          if (e.code === 'Digit3') this.activePlayer.switchSlot(3, this);
          if (e.code === 'Digit4') this.activePlayer.switchSlot(4, this);
          if (e.code === 'KeyR') this.activePlayer.reload(this);
          if (e.code === 'KeyG') this.activePlayer.throwGrenade(this);
          if (e.code === 'KeyF') this.activePlayer.performExecution(this);
          if (e.code === 'Space') {
            e.preventDefault();
            this.activePlayer.performDodge(
              (this.keys['KeyD'] ? 1 : 0) - (this.keys['KeyA'] ? 1 : 0),
              (this.keys['KeyS'] ? 1 : 0) - (this.keys['KeyW'] ? 1 : 0)
            );
          }
        } else if (this.mode === 'DREADNOUGHT') {
          if (e.code === 'KeyE' || e.code === 'Space') {
            e.preventDefault();
            this.activePlayer.performStomp(this);
          }
          if (e.code === 'KeyQ') this.activePlayer.activateFury(this);
        }

        if (e.code === 'Escape') this.pauseGame();
      } else if (this.state === 'PAUSED' && e.code === 'Escape') {
        this.resumeGame();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse Mira 360° em Espaço 3D
    window.addEventListener('mousemove', (e) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouse, this.renderer.camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);

      if (this.activePlayer) {
        this.mouseWorldAngle = Math.atan2(target.z - this.activePlayer.z, target.x - this.activePlayer.x);
      }
    });

    window.addEventListener('mousedown', (e) => {
      this.sound.init();
      if (this.state === 'PLAYING') {
        if (e.button === 0) {
          this.mouseDown = true;
        } else if (e.button === 2) {
          e.preventDefault();
          if (this.mode === 'MARINE') this.activePlayer.performParry(this);
          else if (this.mode === 'DREADNOUGHT') this.activePlayer.fireRightArm(this);
        }
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouseDown = false;
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    // BOTÕES DE MENU PRINCIPAL E MODAIS
    document.getElementById('btn-start-marine').addEventListener('click', () => {
      this.sound.init();
      this.startMode('MARINE');
    });

    document.getElementById('btn-start-dreadnought').addEventListener('click', () => {
      this.sound.init();
      this.startMode('DREADNOUGHT');
    });

    document.getElementById('btn-arsenal').addEventListener('click', () => {
      document.getElementById('modal-loadout').classList.remove('hidden');
    });
    document.getElementById('btn-close-loadout').addEventListener('click', () => {
      document.getElementById('modal-loadout').classList.add('hidden');
    });

    document.getElementById('btn-records').addEventListener('click', () => {
      this.updateRecordsModal();
      document.getElementById('modal-records').classList.remove('hidden');
    });
    document.getElementById('btn-close-records').addEventListener('click', () => {
      document.getElementById('modal-records').classList.add('hidden');
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

    // Pausa, Game Over e Vitória
    document.getElementById('btn-pause-resume').addEventListener('click', () => this.resumeGame());
    document.getElementById('btn-pause-restart').addEventListener('click', () => this.startMode(this.mode));
    document.getElementById('btn-pause-how').addEventListener('click', () => {
      document.getElementById('modal-how-to-play').classList.remove('hidden');
    });
    document.getElementById('btn-pause-menu').addEventListener('click', () => this.returnToTitle());
    document.getElementById('btn-retry').addEventListener('click', () => this.startMode(this.mode));
    document.getElementById('btn-go-menu').addEventListener('click', () => this.returnToTitle());
    document.getElementById('btn-play-again').addEventListener('click', () => this.startMode(this.mode));
    document.getElementById('btn-vic-menu').addEventListener('click', () => this.returnToTitle());

    // Configurações
    document.getElementById('cfg-master-volume').addEventListener('input', (e) => {
      this.sound.masterVolume = parseInt(e.target.value, 10) / 100;
      document.getElementById('cfg-volume-val').innerText = `${e.target.value}%`;
    });
    document.getElementById('cfg-graphics').addEventListener('change', (e) => {
      this.renderer.setGraphicsQuality(e.target.value);
    });

    // CONTROLES DE TOQUE MOBILE (POINTER EVENTS)
    this.initTouchControls();
  }

  initTouchControls() {
    const touchArea = document.getElementById('touch-controls');
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      touchArea.classList.add('active');
    }

    const joystick = document.getElementById('touch-joystick');
    const knob = document.getElementById('touch-joystick-knob');
    let touchId = null;
    let startX = 0;
    let startY = 0;

    joystick.addEventListener('pointerdown', (e) => {
      touchId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      joystick.setPointerCapture(touchId);
    });

    joystick.addEventListener('pointermove', (e) => {
      if (e.pointerId !== touchId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dist = Math.hypot(dx, dy);
      const maxDist = 45;
      const clampedDist = Math.min(dist, maxDist);
      const angle = Math.atan2(dy, dx);

      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;
      knob.style.transform = `translate(${knobX}px, ${knobY}px)`;

      this.touchMoveX = knobX / maxDist;
      this.touchMoveZ = knobY / maxDist;
    });

    const resetJoystick = (e) => {
      if (e.pointerId === touchId) {
        touchId = null;
        this.touchMoveX = 0;
        this.touchMoveZ = 0;
        knob.style.transform = 'translate(0px, 0px)';
      }
    };
    joystick.addEventListener('pointerup', resetJoystick);
    joystick.addEventListener('pointercancel', resetJoystick);

    // Botões touch de ação
    document.getElementById('touch-btn-fire').addEventListener('pointerdown', () => { this.mouseDown = true; });
    document.getElementById('touch-btn-fire').addEventListener('pointerup', () => { this.mouseDown = false; });
    document.getElementById('touch-btn-melee').addEventListener('pointerdown', () => {
      if (this.mode === 'MARINE') {
        this.activePlayer.switchSlot(3, this);
        this.activePlayer.fire(this);
      } else {
        this.activePlayer.fireRightArm(this);
      }
    });
    document.getElementById('touch-btn-dodge').addEventListener('pointerdown', () => {
      if (this.mode === 'MARINE') this.activePlayer.performDodge(this.touchMoveX, this.touchMoveZ);
      else this.activePlayer.performStomp(this);
    });
    document.getElementById('touch-btn-reload').addEventListener('pointerdown', () => {
      if (this.mode === 'MARINE') this.activePlayer.reload(this);
    });
    document.getElementById('touch-btn-parry').addEventListener('pointerdown', () => {
      if (this.mode === 'MARINE') this.activePlayer.performParry(this);
      else this.activePlayer.activateFury(this);
    });
    document.getElementById('touch-btn-switch').addEventListener('pointerdown', () => {
      if (this.mode === 'MARINE') {
        const next = (this.activePlayer.activeSlot % 4) + 1;
        this.activePlayer.switchSlot(next, this);
      }
    });
    document.getElementById('touch-btn-pause').addEventListener('pointerdown', () => this.pauseGame());
  }

  initDustBackground() {
    const dCanvas = document.getElementById('dustCanvas');
    if (!dCanvas) return;
    const dCtx = dCanvas.getContext('2d');
    dCanvas.width = window.innerWidth;
    dCanvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * dCanvas.width,
        y: Math.random() * dCanvas.height,
        vx: (Math.random() - 0.5) * 15,
        vy: -15 - Math.random() * 25,
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.5
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
          dCtx.fillStyle = `rgba(245, 208, 112, ${p.alpha})`;
          dCtx.beginPath();
          dCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          dCtx.fill();
        }
      }
      requestAnimationFrame(animateDust);
    };
    animateDust();
  }

  startMode(modeName) {
    this.mode = modeName;
    this.state = 'PLAYING';
    this.score = 0;
    this.killsCount = 0;
    this.mouseDown = false;       // Reseta estado do mouse ao reiniciar
    this._waveTransitioning = false; // Reseta flag de transição de onda

    // Remove entidades anteriores
    if (this.activePlayer) {
      this.renderer.scene.remove(this.activePlayer.model);
    }
    for (const e of this.enemies) this.renderer.scene.remove(e.model);
    for (const p of this.projectiles) { this.renderer.scene.remove(p.mesh); p.mesh.geometry.dispose(); }
    for (const pu of this.pickups) { this.renderer.scene.remove(pu.mesh); pu.mesh.geometry.dispose(); }

    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.aliveEnemiesCount = 0;
    this.particles.clear();

    // Reseta WaveManager
    this.waveManager.currentWave = 1;
    this.waveManager.waveSpawnQueue = [];
    this.waveManager.spawnTimer = 0;

    // Oculta barra de boss da onda anterior
    document.getElementById('boss-hud-bar').classList.add('hidden');
    document.getElementById('extraction-pointer').classList.add('hidden');

    // Spawna jogador correspondente ao modo
    if (modeName === 'MARINE') {
      this.activePlayer = new SpaceMarinePlayer(this.renderer.scene, 0, 0);
      document.getElementById('hud-mode-badge').innerText = 'SPACE MARINE';
      document.getElementById('marine-vitals').classList.remove('hidden');
      document.getElementById('dread-vitals').classList.add('hidden');
      document.getElementById('marine-weapons-bar').classList.remove('hidden');
      document.getElementById('dread-abilities-bar').classList.add('hidden');
      document.getElementById('marine-ammo-panel').classList.remove('hidden');
      document.getElementById('dread-arms-panel').classList.add('hidden');
      document.getElementById('marine-tools').classList.remove('hidden');
      this.waveManager.startCampaignWave(1);
    } else {
      this.activePlayer = new DreadnoughtPlayer(this.renderer.scene, 0, 0);
      document.getElementById('hud-mode-badge').innerText = 'DREADNOUGHT';
      document.getElementById('marine-vitals').classList.add('hidden');
      document.getElementById('dread-vitals').classList.remove('hidden');
      document.getElementById('marine-weapons-bar').classList.add('hidden');
      document.getElementById('dread-abilities-bar').classList.remove('hidden');
      document.getElementById('marine-ammo-panel').classList.add('hidden');
      document.getElementById('dread-arms-panel').classList.remove('hidden');
      document.getElementById('marine-tools').classList.add('hidden');
      this.waveManager.startEndlessWave(1);
    }

    // Oculta telas e abre HUD
    document.getElementById('screen-title').classList.add('hidden');
    document.getElementById('screen-pause').classList.add('hidden');
    document.getElementById('screen-game-over').classList.add('hidden');
    document.getElementById('screen-victory').classList.add('hidden');
    document.getElementById('modal-upgrades').classList.add('hidden');
    document.getElementById('game-hud').classList.remove('hidden');

    this.updateHUDVitals();
    this.updateHUDWeapons();
    this.updateHUDAmmo();
    document.getElementById('hud-score').innerText = '00000';
  }

  spawnEnemy(typeKey) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 750 + Math.random() * 200;
    const sx = this.activePlayer.x + Math.cos(angle) * dist;
    const sz = this.activePlayer.z + Math.sin(angle) * dist;

    if (typeKey === 'chaos_champion') {
      this.enemies.push(new BossChampion3D(this.renderer.scene, 0, -300));
    } else {
      this.enemies.push(new Enemy3D(this.renderer.scene, sx, sz, typeKey));
    }
  }

  spawnPickup(x, z) {
    const type = Math.random() < 0.6 ? 'ammo' : 'medkit';
    this.pickups.push(new Pickup3D(this.renderer.scene, x, z, type));
  }

  addScore(points, x, z) {
    this.score += points;
    document.getElementById('hud-score').innerText = String(this.score).padStart(5, '0');
  }

  triggerDamageVignette() {
    const vig = document.getElementById('damage-vignette');
    vig.classList.add('hurt');
    setTimeout(() => vig.classList.remove('hurt'), 200);
  }

  triggerScreenFlash(type = 'red') {
    const flash = document.getElementById('screen-flash');
    flash.className = `screen-flash flash-${type}`;
    setTimeout(() => { flash.className = 'screen-flash'; }, 150);
  }

  updateHUDVitals() {
    if (this.mode === 'MARINE') {
      const p = this.activePlayer;
      const hpPct = Math.max(0, (p.hp / p.maxHp) * 100);
      const armorPct = Math.max(0, (p.armor / p.maxArmor) * 100);
      document.getElementById('hud-hp-bar').style.width = `${hpPct}%`;
      document.getElementById('hud-hp-text').innerText = `${Math.ceil(p.hp)} / ${p.maxHp}`;
      document.getElementById('hud-armor-bar').style.width = `${armorPct}%`;
      document.getElementById('hud-armor-text').innerText = `${Math.ceil(p.armor)} / ${p.maxArmor}`;
    } else {
      const d = this.activePlayer;
      const hullPct = Math.max(0, (d.hull / d.maxHull) * 100);
      const armorPct = Math.max(0, (d.armor / d.maxArmor) * 100);
      document.getElementById('hud-hull-bar').style.width = `${hullPct}%`;
      document.getElementById('hud-hull-text').innerText = `${Math.ceil(d.hull)} / ${d.maxHull}`;
      document.getElementById('hud-dread-armor-bar').style.width = `${armorPct}%`;
      document.getElementById('hud-dread-armor-text').innerText = `${Math.ceil(d.armor)} / ${d.maxArmor}`;
      document.getElementById('hud-heat-bar').style.width = `${d.heat}%`;
      document.getElementById('hud-heat-text').innerText = `${Math.ceil(d.heat)}%`;
    }
  }

  updateHUDWeapons() {
    if (this.mode === 'MARINE') {
      for (let i = 1; i <= 4; i++) {
        const slotEl = document.getElementById(`slot-${i}`);
        if (slotEl) {
          if (i === this.activePlayer.activeSlot) slotEl.classList.add('active');
          else slotEl.classList.remove('active');
        }
      }
      const w = this.activePlayer.weapons[this.activePlayer.activeSlot];
      document.getElementById('hud-weapon-name').innerText = w.name;
      this.updateHUDAmmo();
    }
  }

  updateHUDAmmo() {
    if (this.mode === 'MARINE') {
      const w = this.activePlayer.weapons[this.activePlayer.activeSlot];
      const textEl = document.getElementById('hud-ammo-text');
      const barEl = document.getElementById('hud-ammo-bar');
      const statusEl = document.getElementById('hud-reload-status');

      if (w.arc) {
        textEl.innerText = 'ENERGIZADA';
        barEl.style.width = '100%';
        statusEl.innerText = 'MELEE PRONTO';
        statusEl.classList.remove('reloading');
        return;
      }

      if (this.activePlayer.isReloading) {
        statusEl.innerText = 'RECARREGANDO...';
        statusEl.classList.add('reloading');
      } else {
        statusEl.innerText = 'PRONTO';
        statusEl.classList.remove('reloading');
      }

      textEl.innerText = `${w.mag} / ${w.ammo}`;
      barEl.style.width = `${Math.max(0, (w.mag / w.maxMag) * 100)}%`;
    }
  }

  updateHUDWave() {
    const w = this.waveManager.currentWave;
    document.getElementById('hud-wave').innerText = `ONDA ${String(w).padStart(2, '0')}`;
  }

  updateHUDEnemies() {
    document.getElementById('hud-enemies').innerText = String(this.aliveEnemiesCount).padStart(2, '0');
  }

  updateBossHUD(currentHp, maxHp) {
    const pct = Math.max(0, (currentHp / maxHp) * 100);
    document.getElementById('boss-health-fill').style.width = `${pct}%`;
  }

  updateRecordsModal() {
    const bw = this.saveData.endlessBestWave;
    document.getElementById('rec-endless-wave').innerText = `ONDA ${String(bw).padStart(2, '0')}`;
    document.getElementById('rec-high-score').innerText = String(this.saveData.highScore).padStart(5, '0');
    document.getElementById('rec-total-kills').innerText = this.saveData.totalKills;
    document.getElementById('rec-boss-kills').innerText = this.saveData.bossKills;
  }

  pauseGame() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.mouseDown = false; // Evita que botão permaneça pressionado ao pausar
    document.getElementById('screen-pause').classList.remove('hidden');
  }

  resumeGame() {
    if (this.state !== 'PAUSED') return;
    this.state = 'PLAYING';
    document.getElementById('screen-pause').classList.add('hidden');
  }

  returnToTitle() {
    this.state = 'TITLE';
    this.mouseDown = false; // Reseta estado do mouse
    document.getElementById('game-hud').classList.add('hidden');
    document.getElementById('screen-pause').classList.add('hidden');
    document.getElementById('screen-game-over').classList.add('hidden');
    document.getElementById('screen-victory').classList.add('hidden');
    document.getElementById('modal-upgrades').classList.add('hidden');
    document.getElementById('boss-hud-bar').classList.add('hidden');
    document.getElementById('execution-prompt').classList.add('hidden');
    document.getElementById('screen-title').classList.remove('hidden');
  }

  triggerGameOver() {
    if (this.state === 'GAMEOVER') return; // Evita trigger duplo
    this.state = 'GAMEOVER';
    this.mouseDown = false; // Reseta estado do mouse
    this.sound.playBossRoar();

    // Atualiza salvamento
    if (this.score > this.saveData.highScore) this.saveData.highScore = this.score;
    if (this.mode === 'DREADNOUGHT' && this.waveManager.currentWave > this.saveData.endlessBestWave) {
      this.saveData.endlessBestWave = this.waveManager.currentWave;
    }
    this.saveData.totalKills += this.killsCount;
    SaveManager.save(this.saveData);

    const w = this.waveManager.currentWave;
    document.getElementById('go-score').innerText = String(this.score).padStart(5, '0');
    document.getElementById('go-wave').innerText = `ONDA ${String(w).padStart(2, '0')}`;
    document.getElementById('go-kills').innerText = this.killsCount;
    document.getElementById('go-mode').innerText = this.mode;
    document.getElementById('screen-game-over').classList.remove('hidden');
  }

  triggerVictory() {
    this.state = 'VICTORY';
    this.saveData.totalKills += this.killsCount;
    this.saveData.bossKills++;
    if (this.score > this.saveData.highScore) this.saveData.highScore = this.score;
    SaveManager.save(this.saveData);

    document.getElementById('vic-score').innerText = String(this.score).padStart(5, '0');
    document.getElementById('vic-kills').innerText = this.killsCount;
    document.getElementById('vic-waves').innerText = '5 / 5';
    document.getElementById('screen-victory').classList.remove('hidden');
  }

  checkWaveProgression() {
    // Garante que só executa uma vez por onda usando flag de transição
    if (this._waveTransitioning) return;
    if (this.aliveEnemiesCount <= 0 && this.waveManager.waveSpawnQueue.length === 0 && this.enemies.length === 0) {
      this._waveTransitioning = true;
      if (this.mode === 'MARINE') {
        if (this.waveManager.currentWave < this.waveManager.maxCampaignWaves) {
          setTimeout(() => {
            if (this.state === 'PLAYING') {
              this._waveTransitioning = false;
              this.waveManager.startCampaignWave(this.waveManager.currentWave + 1);
            }
          }, 3000);
        } else {
          // Vitória da Campanha!
          this.triggerVictory();
        }
      } else {
        // MODO DREADNOUGHT: UPGRADE SELECTION MODAL ENTRE ONDAS
        this.openUpgradesModal();
      }
    }
  }

  openUpgradesModal() {
    this.state = 'UPGRADES';
    const modal = document.getElementById('modal-upgrades');
    const container = document.getElementById('upgrades-container');
    container.innerHTML = '';

    const upgradePool = [
      { id: 'hull', icon: '🛡', title: '+REFORÇO DE CASCO', desc: 'Aumenta Integridade estrutural em +500 HULL.', apply: () => { this.activePlayer.maxHull += 500; this.activePlayer.hull += 500; } },
      { id: 'armor', icon: '⚡', title: '+BLINDAGEM PESADA', desc: 'Repara totalmente e adiciona +300 ao Escudo.', apply: () => { this.activePlayer.maxArmor += 300; this.activePlayer.armor = this.activePlayer.maxArmor; } },
      { id: 'heatsink', icon: '❄', title: '+DISSIPADORES TÉRMICOS', desc: 'Aumenta dissipação de calor em +30%.', apply: () => { BALANCE.dreadnought.coolingRate += 8; } },
      { id: 'damage', icon: '⚔', title: '+CALIBRE DESTOCADOR', desc: 'Aumenta o dano de todas as armas em +20%.', apply: () => { this.activePlayer.leftArmWeapon.damage *= 1.2; this.activePlayer.rightArmWeapon.damage *= 1.2; } },
      { id: 'stomp', icon: '💥', title: '+IMPACTO DO STOMP', desc: 'Ground Stomp causa +150 de dano e raio maior.', apply: () => { BALANCE.dreadnought.stompDamage += 150; BALANCE.dreadnought.stompRadius += 40; } }
    ];

    // Sorteia 3 opções
    const shuffled = upgradePool.sort(() => 0.5 - Math.random()).slice(0, 3);
    shuffled.forEach(upg => {
      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `
        <div class="upg-icon">${upg.icon}</div>
        <div class="upg-title">${upg.title}</div>
        <div class="upg-desc">${upg.desc}</div>
      `;
      card.addEventListener('click', () => {
        upg.apply();
        modal.classList.add('hidden');
        this.state = 'PLAYING';
        this._waveTransitioning = false; // Permite nova progressão de onda
        this.mouseDown = false; // Garante que não dispare imediatamente
        this.waveManager.startEndlessWave(this.waveManager.currentWave + 1);
      });
      container.appendChild(card);
    });

    modal.classList.remove('hidden');
  }

  // LOOP PRINCIPAL DE COMBATE (60 FPS)
  loop(currentTime) {
    const dt = Math.min(0.08, (currentTime - (this.lastTime || currentTime)) / 1000);
    this.lastTime = currentTime;

    if (this.state === 'PLAYING') {
      // 1. Atualiza Jogador
      this.activePlayer.update(dt, this);

      // 2. Atualiza Spawner de Ondas
      this.waveManager.update(dt);

      // 3. Atualiza Projéteis 3D
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.update(dt, this);

        // Colisão com inimigos
        if (!p.toRemove && p.shooter === 'player') {
          for (const e of this.enemies) {
            const d = Math.hypot(e.x - p.x, e.z - p.z);
            if (d <= e.radius + 6) {
              e.takeDamage(p.damage, this, Math.random() < 0.2);
              p.explode(this);
              break;
            }
          }
        }

        // Colisão com jogador
        if (!p.toRemove && (p.shooter === 'enemy' || p.shooter === 'boss')) {
          const d = Math.hypot(this.activePlayer.x - p.x, this.activePlayer.z - p.z);
          if (d <= this.activePlayer.radius + 6) {
            this.activePlayer.takeDamage(p.damage, this, true);
            p.explode(this);
          }
        }

        if (p.toRemove) {
          this.projectiles.splice(i, 1);
        }
      }

      // 4. Atualiza Inimigos 3D
      let hasExecutableNearby = false;
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        e.update(dt, this);

        if (e.isExecutable && !e.toRemove) {
          const d = Math.hypot(e.x - this.activePlayer.x, e.z - this.activePlayer.z);
          if (d < 160) hasExecutableNearby = true;
        }

        if (e.toRemove) {
          this.enemies.splice(i, 1);
          this.aliveEnemiesCount = Math.max(0, this.aliveEnemiesCount - 1);
          this.updateHUDEnemies();
        }
      }

      // Verifica progressão de onda após remover todos os inimigos marcados
      this.checkWaveProgression();

      // Exibe/oculta prompt de execução
      const execPrompt = document.getElementById('execution-prompt');
      if (hasExecutableNearby && this.mode === 'MARINE') {
        execPrompt.classList.remove('hidden');
      } else {
        execPrompt.classList.add('hidden');
      }

      // 5. Atualiza Coletáveis
      for (let i = this.pickups.length - 1; i >= 0; i--) {
        if (this.pickups[i].update(dt, this.activePlayer, this)) {
          this.pickups.splice(i, 1);
        }
      }

      // 6. Atualiza Partículas 3D
      this.particles.update(dt);

      // 7. Atualiza Câmera Dinâmica
      this.renderer.updateCamera(this.activePlayer.x, this.activePlayer.z, dt);

      // 8. Renderiza Minimapa Tático
      this.minimap.draw(this);

      // 9. Atualiza HUD do Dreadnought em tempo real (calor e energia)
      if (this.mode === 'DREADNOUGHT') {
        this.updateHUDVitals();
        // Atualiza HUD de habilidades do Dreadnought
        const stompBtn = document.getElementById('dread-stomp-btn');
        const furyBtn = document.getElementById('dread-fury-btn');
        const stompCd = document.getElementById('dread-stomp-cd');
        const furyCd = document.getElementById('dread-fury-cd');
        const dp = this.activePlayer;
        if (dp.stompCooldown > 0) {
          stompBtn.classList.remove('ready');
          stompCd.innerText = dp.stompCooldown.toFixed(1) + 's';
        } else {
          stompBtn.classList.add('ready');
          stompCd.innerText = 'OK';
        }
        if (dp.furyCooldown > 0) {
          furyBtn.classList.remove('ready');
          furyCd.innerText = dp.furyActive ? 'ATIVO' : dp.furyCooldown.toFixed(1) + 's';
        } else {
          furyBtn.classList.add('ready');
          furyCd.innerText = dp.furyActive ? 'ATIVO' : 'OK';
        }
      }

      // 10. Atualiza status do parry para o Marine
      if (this.mode === 'MARINE') {
        const parryStatus = document.getElementById('hud-parry-status');
        const mp = this.activePlayer;
        if (mp.isParrying) {
          parryStatus.innerText = 'ATIVO!';
          parryStatus.style.color = '#ffea70';
        } else if (mp.parryCooldown > 0) {
          parryStatus.innerText = mp.parryCooldown.toFixed(1) + 's';
          parryStatus.style.color = '#ff2e43';
        } else {
          parryStatus.innerText = 'PRONTO';
          parryStatus.style.color = '';
        }
      }
    }

    // Renderiza Cena WebGL 3D
    this.renderer.render();

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Inicialização Principal
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const urlParams = new URLSearchParams(window.location.search);
  const autoMode = urlParams.get('mode');
  if (autoMode === 'marine') {
    game.startMode('MARINE');
  } else if (autoMode === 'dreadnought') {
    game.startMode('DREADNOUGHT');
  }
  requestAnimationFrame((t) => game.loop(t));
});
