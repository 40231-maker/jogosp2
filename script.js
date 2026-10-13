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
    hp: 180,
    armor: 120,
    speedNormal: 190,
    speedSprint: 245, // Sprint forte, mas controlável
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

class BalanceManager {
  static data = BALANCE;

  static getPlayer() {
    return this.data.player;
  }

  static getWeapon(key) {
    return this.data.weapons[key] || this.data.weapons.bolt_rifle;
  }

  static getMelee(key) {
    return this.data.melee[key] || this.data.melee.chainsword;
  }

  static getDreadnought() {
    return this.data.dreadnought;
  }

  static getDreadnoughtWeapon(key) {
    return this.data.dreadnought.weapons[key] || this.data.dreadnought.weapons.assault_cannon;
  }

  static getEnemy(typeKey) {
    return this.data.enemies[typeKey] || this.data.enemies.cultist;
  }

  /**
   * Calcula parâmetros dinâmicos de onda sem inflar a vida dos inimigos para níveis absurdos.
   * Modula composição de tropas, orçamento de ameaça e taxa de drop de cura/munição.
   */
  static calculateDynamicDifficulty(waveNum, playerHpRatio = 1.0, mode = 'MARINE') {
    let threatMultiplier = 1.0;
    if (playerHpRatio > 0.8) {
      threatMultiplier = 1.06; // Jogador está bem de vida, leve aumento de pressão
    } else if (playerHpRatio < 0.35) {
      threatMultiplier = 0.88; // Jogador ferido, reduz levemente pressão para manter ritmo tenso porém justo
    }

    const baseBudget = mode === 'MARINE'
      ? Math.round((35 + waveNum * 28) * threatMultiplier)
      : Math.round(Math.min(90 + waveNum * 35, 550) * threatMultiplier);

    // Ajuste dinâmico de taxa de drop
    const medkitChance = playerHpRatio < 0.4 ? 0.38 : 0.22;
    const ammoChance = 0.28;

    return {
      threatBudget: baseBudget,
      medkitChance,
      ammoChance,
      maxSimultaneous: mode === 'MARINE' ? 12 : 24
    };
  }
}
window.BalanceManager = BalanceManager;

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
    this.masterGainNode = null;
    this.sfxGainNode = null;
    this.musicGainNode = null;
    this.masterVolume = 0.8;
    this.sfxVolume = 0.85;
    this.musicVolume = 0.65;
    this.initialized = false;
    this.musicPlaying = false;
    this.musicTimeout = null;
    this.musicOscs = [];
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        // Grafo de áudio principal
        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGainNode.connect(this.ctx.destination);

        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGainNode.connect(this.masterGainNode);

        this.musicGainNode = this.ctx.createGain();
        this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.musicGainNode.connect(this.masterGainNode);

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

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  setMusicVolume(val) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
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
      this.resume();
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

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGainNode || this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.9);

      this.musicTimeout = setTimeout(playChordBeat, 850);
    };

    playChordBeat();
  }

  stopProceduralCombatMusic() {
    this.musicPlaying = false;
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  // Toque fúnebre / Acorde de Derrota
  playGameOver() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(82.4, t);
    osc.frequency.exponentialRampToValueAtTime(32.7, t + 2.5);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.6);

    osc.connect(gain);
    gain.connect(this.sfxGainNode || this.ctx.destination);
    osc.start(t);
    osc.stop(t + 2.7);
  }

  // Fanfarra triunfal do Imperador / Vitória
  playVictory() {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const notes = [130.81, 164.81, 196.00, 261.63];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.18);
      gain.gain.setValueAtTime(0.4, t + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.18 + 1.6);
      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);
      osc.start(t + idx * 0.18);
      osc.stop(t + idx * 0.18 + 1.7);
    });
  }
}

/* ==========================================================================
   4. RENDERIZADOR TRIDIMENSIONAL WEBGL (THREE.JS + THREE RENDERER)
   Configura cena 3D, câmera isométrica dinâmica, iluminação e sombras suaves.
   ========================================================================== */
class ThreeRenderer {
  static showFallbackError(msg) {
    const overlay = document.getElementById('webgl-error-overlay');
    const txt = document.getElementById('webgl-error-msg');
    if (txt) txt.innerText = msg;
    if (overlay) overlay.classList.remove('hidden');
    console.error('IRON VIGIL WebGL Error:', msg);
  }

  static disposeHierarchy(obj) {
    if (!obj) return;
    obj.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        } else {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      }
    });
  }

  constructor(canvas) {
    this.canvas = canvas;

    if (typeof THREE === 'undefined') {
      ThreeRenderer.showFallbackError('Não foi possível carregar a biblioteca 3D Three.js. Verifique os arquivos em libs/ ou sua conexão de rede.');
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x343b36);
    // Fog leve: mantém profundidade sem apagar os mapas em máquinas com pouca luz.
    this.scene.fog = new THREE.FogExp2(0x414940, 0.00027);

    // Câmera Isométrica com perspectiva militar
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 3000);
    this.camera.position.set(0, 520, 420);
    this.camera.lookAt(0, 0, 0);

    // Renderizador WebGL com tratamento de erro
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.76;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } catch (err) {
      ThreeRenderer.showFallbackError('Falha ao inicializar a aceleração gráfica WebGL. Verifique as configurações de hardware do seu navegador.');
      return;
    }

    this.trauma = 0;
    this.initLights();
  }

  initLights() {
    // Luz ambiente gótica rica e equilibrada
    const amb = new THREE.AmbientLight(0x9ba7ad, 0.68);
    this.scene.add(amb);
    // Luz hemisférica de preenchimento para que superfícies escuras continuem legíveis.
    const hemi = new THREE.HemisphereLight(0xaabac4, 0x33291e, 0.56);
    this.scene.add(hemi);

    // Luz Direcional Principal (Sol / Holofote Superior) com Sombras
    this.dirLight = new THREE.DirectionalLight(0xd9d1bd, 0.96);
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
    const rimLight = new THREE.DirectionalLight(0x4c7895, 0.36);
    rimLight.position.set(-500, 300, -400);
    this.scene.add(rimLight);

    // Holofote tático que acompanha o jogador (Luma-globe da armadura)
    this.playerLight = new THREE.PointLight(0xd8d0bd, 0.46, 380);
    this.playerLight.position.set(0, 50, 0);
    this.scene.add(this.playerLight);
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setGraphicsQuality(preset) {
    if (!this.renderer) return;
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
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
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

    // Espada de energia: punho ceramítico, guarda metálica e lâmina azul emissiva.
    const powerSword = new THREE.Group();
    const hiltMat = new THREE.MeshStandardMaterial({ color: 0x171c26, metalness: 0.82, roughness: 0.28 });
    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 10, 8), hiltMat);
    hilt.rotation.x = Math.PI / 2;
    powerSword.add(hilt);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(10, 2.5, 3), goldMat);
    guard.position.z = 5;
    powerSword.add(guard);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x9deeff, emissive: 0x168cff, emissiveIntensity: 2.2, metalness: 0.35, roughness: 0.18 });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 28), bladeMat);
    blade.position.z = 20;
    powerSword.add(blade);
    const bladeCore = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.35, 25), new THREE.MeshBasicMaterial({ color: 0xe6ffff }));
    bladeCore.position.z = 20;
    powerSword.add(bladeCore);
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 6), goldMat);
    pommel.position.z = -5;
    powerSword.add(pommel);
    powerSword.position.set(-13, 16, 8);
    powerSword.rotation.x = -0.18;
    powerSword.visible = false;
    group.add(powerSword);
    group.powerSword = powerSword;

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

    // Detalhes extras de blindagem: placas de ombro, rebites e luzes de estado.
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x29364a, metalness: 0.72, roughness: 0.42 });
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xc18b2a, metalness: 0.55, roughness: 0.48 });
    for (const side of [-1, 1]) {
      const shoulderPlate = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 24), panelMat);
      shoulderPlate.position.set(side * 35, 68, -1);
      shoulderPlate.rotation.z = side * -0.12;
      shoulderPlate.castShadow = true;
      group.add(shoulderPlate);
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 6), goldTrimMat);
      rivet.position.set(side * 35, 73, 11);
      group.add(rivet);
      const statusLight = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 1.5), visorGlowMat);
      statusLight.position.set(side * 19, 67, 23.5);
      group.add(statusLight);
    }
    const frontHazard = new THREE.Mesh(new THREE.BoxGeometry(20, 3, 2), hazardMat);
    frontHazard.position.set(0, 34, 25.5);
    group.add(frontHazard);

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

    // Base de aço escovado com variação tonal e desgaste industrial.
    ctx.fillStyle = '#111722';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const alpha = 0.025 + Math.random() * 0.07;
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '125,145,170' : '0,0,0'},${alpha})`;
      ctx.fillRect(x, y, 2 + Math.random() * 24, 1);
    }

    // Placas modulares com chanfros, linhas técnicas e sulcos de manutenção.
    ctx.fillStyle = '#171f2b';
    ctx.fillRect(12, 12, 488, 488);
    ctx.strokeStyle = '#354254';
    ctx.lineWidth = 5;
    ctx.strokeRect(5, 5, 502, 502);
    ctx.strokeStyle = '#080c12';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, 480, 480);
    ctx.strokeStyle = '#273447';
    ctx.lineWidth = 3;
    ctx.strokeRect(58, 58, 396, 396);
    ctx.strokeRect(86, 86, 340, 340);

    // Divisões da placa e grelhas de ventilação.
    ctx.strokeStyle = '#202c3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(256, 18); ctx.lineTo(256, 494);
    ctx.moveTo(18, 256); ctx.lineTo(494, 256);
    ctx.stroke();
    for (const side of [0, 1]) {
      for (let i = 0; i < 9; i++) {
        ctx.fillStyle = '#080c12';
        ctx.fillRect(104 + i * 9, side ? 454 : 48, 5, 14);
        ctx.fillRect(side ? 454 : 48, 104 + i * 9, 14, 5);
      }
    }

    // Faixas de segurança amarelo-imperiais nos cantos.
    ctx.save();
    ctx.strokeStyle = '#80672f';
    ctx.lineWidth = 9;
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(28, 28, 456, 456);
    ctx.restore();

    // Símbolo técnico central discreto.
    ctx.strokeStyle = 'rgba(190,155,76,0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, 38, 0, Math.PI * 2);
    ctx.arc(256, 256, 29, 0, Math.PI * 2);
    ctx.moveTo(256, 210); ctx.lineTo(256, 302);
    ctx.moveTo(210, 256); ctx.lineTo(302, 256);
    ctx.stroke();

    // Parafusos metálicos com núcleo escuro.
    const rivets = [20, 492];
    rivets.forEach(rx => {
      rivets.forEach(ry => {
        ctx.fillStyle = '#8998ad';
        ctx.beginPath(); ctx.arc(rx, ry, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#242d3a';
        ctx.beginPath(); ctx.arc(rx, ry, 2.5, 0, Math.PI * 2); ctx.fill();
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
  static getBoxGeo() {
    if (!this._boxGeo) this._boxGeo = new THREE.BoxGeometry(2, 2, 2);
    return this._boxGeo;
  }
  static getCasingGeo() {
    if (!this._casingGeo) this._casingGeo = new THREE.CylinderGeometry(1.2, 1.2, 4, 6);
    return this._casingGeo;
  }
  static getCasingMat() {
    if (!this._casingMat) this._casingMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    return this._casingMat;
  }

  constructor(scene) {
    this.scene = scene;
    this.particles = [];
  }

  addSparks(x, y, z, colorHex = 0xffaa22, count = 6) {
    const geo = ParticleSystem3D.getBoxGeo();
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
    const geo = ParticleSystem3D.getCasingGeo();
    const mat = ParticleSystem3D.getCasingMat();
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
    this.addSparks(x, 15, z, 0xff5511, isLarge ? 28 : 14);
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
        if (p.type === 'ring') {
          if (p.mesh.geometry) p.mesh.geometry.dispose();
          if (p.mesh.material) p.mesh.material.dispose();
        } else if (p.type === 'spark') {
          if (p.mesh.material) p.mesh.material.dispose();
        }
        this.particles.splice(i, 1);
      }
    }
  }

  clear() {
    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      if (p.type === 'ring') {
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        if (p.mesh.material) p.mesh.material.dispose();
      } else if (p.type === 'spark') {
        if (p.mesh.material) p.mesh.material.dispose();
      }
    }
    this.particles = [];
  }
}

/* ==========================================================================
   7. PROJÉTEIS TRIDIMENSIONAL (PROJECTILE3D) COM POOLING E CACHE GEOMÉTRICO
   Suporta Bolter, Plasma, Melta, Granadas e Rajadas Heréticas.
   ========================================================================== */
const ProjectileShared = {
  geos: {},
  mats: {},
  getGeo(radius) {
    if (!this.geos[radius]) {
      this.geos[radius] = new THREE.SphereGeometry(radius, 8, 8);
    }
    return this.geos[radius];
  },
  getMat(color) {
    if (!this.mats[color]) {
      this.mats[color] = new THREE.MeshBasicMaterial({ color });
    }
    return this.mats[color];
  }
};

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

    const geo = ProjectileShared.getGeo(radius);
    const mat = ProjectileShared.getMat(color);
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

// Colisão circular simples para o cenário 3D (movimento no plano X/Z).
// Inclui os quatro pilares centrais e mantém os personagens dentro da arena.
function resolveArenaCollision(entity, game, collideWithEnemies = false) {
  const radius = entity.radius || 20;
  // Colisores acompanham os objetos sólidos do mapa ativo. Isso evita colisões
  // fantasmas com pilares do cenário antigo que já não são visíveis.
  const obstacles = game && game.mapColliders ? game.mapColliders : [];
  for (const o of obstacles) {
    if (o.type === 'circle') {
      let dx = entity.x - o.x, dz = entity.z - o.z;
      let dist = Math.hypot(dx, dz);
      const minDist = radius + o.r;
      if (dist < minDist) {
        if (dist < 0.001) { dx = 1; dz = 0; dist = 1; }
        const push = minDist - dist;
        entity.x += (dx / dist) * push;
        entity.z += (dz / dist) * push;
      }
      continue;
    }
    // Círculo contra retângulo orientado (OBB): o colisor usa a mesma
    // rotação do objeto visível, evitando os cantos fantasma das barricadas inclinadas.
    const halfW = o.w / 2, halfD = o.d / 2;
    const rot = Number(o.r) || 0;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    const offX = entity.x - o.x, offZ = entity.z - o.z;
    let localX = offX * cos - offZ * sin;
    let localZ = offX * sin + offZ * cos;
    const nearestX = Math.max(-halfW, Math.min(localX, halfW));
    const nearestZ = Math.max(-halfD, Math.min(localZ, halfD));
    let dx = localX - nearestX, dz = localZ - nearestZ;
    const dist = Math.hypot(dx, dz);
    if (dist < radius) {
      if (dist > 0.001) {
        const push = radius - dist;
        localX += dx / dist * push;
        localZ += dz / dist * push;
      } else {
        const left = Math.abs(localX + halfW);
        const right = Math.abs(halfW - localX);
        const top = Math.abs(localZ + halfD);
        const bottom = Math.abs(halfD - localZ);
        const m = Math.min(left, right, top, bottom);
        if (m === left) localX = -halfW - radius;
        else if (m === right) localX = halfW + radius;
        else if (m === top) localZ = -halfD - radius;
        else localZ = halfD + radius;
      }
      entity.x = o.x + localX * cos + localZ * sin;
      entity.z = o.z - localX * sin + localZ * cos;
    }
  }
  if (collideWithEnemies && game && game.enemies) {
    for (const enemy of game.enemies) {
      if (enemy.toRemove || enemy === entity) continue;
      let dx = entity.x - enemy.x, dz = entity.z - enemy.z;
      let dist = Math.hypot(dx, dz);
      const minDist = radius + (enemy.radius || 16);
      if (dist < minDist) {
        if (dist < 0.001) { dx = 1; dz = 0; dist = 1; }
        const push = minDist - dist;
        entity.x += (dx / dist) * push;
        entity.z += (dz / dist) * push;
      }
    }
  }
  entity.x = Math.max(-1090 + radius, Math.min(1090 - radius, entity.x));
  entity.z = Math.max(-910 + radius, Math.min(910 - radius, entity.z));
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
    this.reloadWeapon = null;
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
    this.reloadWeapon = null;
    this.reloadTimer = 0;
    game.sound.playBolter();
    game.updateHUDWeapons();
  }

  reload(game) {
    const w = this.weapons[this.activeSlot];
    // mag == 0 é um pente vazio válido; não usar `!w.mag`, pois isso bloqueia a recarga.
    if (!w || w.arc || w.mag === undefined || w.mag === null || this.isReloading || w.mag >= w.maxMag || w.ammo <= 0) return;
    this.isReloading = true;
    this.reloadWeapon = w; // mantém referência à arma que iniciou a recarga
    this.reloadTimer = Math.max(0.1, Number(w.reloadTime) || 1.2);
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
    if (this.model) {
      if (this.model.powerSword) this.model.powerSword.visible = this.activeSlot === 3;
      if (this.model.weaponGroup) this.model.weaponGroup.visible = this.activeSlot !== 3;
    }
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
        const w = this.reloadWeapon || this.weapons[this.activeSlot];
        if (w && !w.arc && Number.isFinite(w.ammo) && w.ammo > 0) {
          const needed = Math.max(0, w.maxMag - w.mag);
          const toLoad = Math.min(needed, w.ammo);
          w.mag += toLoad;
          w.ammo -= toLoad;
        }
        this.reloadWeapon = null;
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
    resolveArenaCollision(this, game, true);

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
    const w = this.leftArmWeapon;
    if (w.ammo !== undefined && w.ammo <= 0) return; // Sem munição no braço esquerdo

    const now = performance.now() / 1000;
    if (now - this.lastFireL < (this.furyActive ? w.fireRate * 0.7 : w.fireRate)) return;
    this.lastFireL = now;

    if (!this.furyActive) this.heat = Math.min(100, this.heat + w.heatRate);
    if (w.ammo !== undefined && w.ammo !== Infinity) {
      w.ammo = Math.max(0, w.ammo - 1);
      game.updateHUDAmmo();
    }

    const spawnX = this.x + Math.cos(this.angle) * 45 - Math.sin(this.angle) * 36;
    const spawnZ = this.z + Math.sin(this.angle) * 45 + Math.cos(this.angle) * 36;

    if (w.type === 'assault_cannon') {
      game.sound.playAssaultCannon();
      game.projectiles.push(new Projectile3D(this.scene, spawnX, spawnZ, this.angle + (Math.random() - 0.5) * 0.06, 'bolter', w.damage, 'player'));
      game.renderer.addCameraShake(0.04);
      if (this.model.leftArm && this.model.leftArm.barrels) this.model.leftArm.barrels.rotation.z += 0.6;
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
    resolveArenaCollision(this, game, false);

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
    // Campanha Space Marine: inimigos ameaçadores sem dano ou perseguição excessivos.
    this.speed = this.config.speed * 0.88;
    this.damage = this.config.damage * 0.82;
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

    // Remove mesh da cena e libera recursos de GPU
    this.scene.remove(this.model);
    ThreeRenderer.disposeHierarchy(this.model);

    // Chance de derrubar munição ou cura com balanceamento dinâmico
    const p = game.activePlayer;
    const hpRatio = p ? (p.hp !== undefined ? p.hp / p.maxHp : p.hull / p.maxHull) : 1.0;
    const diff = BalanceManager.calculateDynamicDifficulty(game.waveManager.currentWave, hpRatio, game.mode);
    const dropRoll = Math.random();
    if (dropRoll < diff.medkitChance) {
      game.spawnPickup(this.x, this.z, 'medkit');
    } else if (dropRoll < diff.medkitChance + diff.ammoChance) {
      game.spawnPickup(this.x, this.z, 'ammo');
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
    // Inimigos se separam entre si para evitar que uma horda vire uma única pilha.
    resolveArenaCollision(this, game, true);
    // No modo Dreadnought, mantém uma zona física ao redor do chassi: inimigos
    // podem cercar e atacar, mas não entram no volume visual do mecha.
    if (game.mode === 'DREADNOUGHT' || game.mode === 'DREAD') {
      const dxP = this.x - player.x, dzP = this.z - player.z;
      const dP = Math.hypot(dxP, dzP) || 0.001;
      const safeRadius = (player.radius || 36) + (this.radius || 16) + 24;
      if (dP < safeRadius) {
        this.x = player.x + dxP / dP * safeRadius;
        this.z = player.z + dzP / dP * safeRadius;
      }
    }

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

  die(game) {
    super.die(game);
    document.getElementById('boss-hud-bar').classList.add('hidden');
    game.saveData.bossKills++;
    SaveManager.save(game.saveData);
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
    ThreeRenderer.disposeHierarchy(this.model);

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
        if (player.leftArmWeapon && player.leftArmWeapon.ammo !== undefined && player.leftArmWeapon.ammo !== Infinity) {
          player.leftArmWeapon.ammo = Math.min(player.leftArmWeapon.maxAmmo || 1200, player.leftArmWeapon.ammo + 240);
        }
      } else {
        if (player.hp !== undefined) player.hp = Math.min(player.maxHp, player.hp + 40);
        if (player.hull !== undefined) player.hull = Math.min(player.maxHull, player.hull + 400);
        if (player.armor !== undefined) player.armor = Math.min(player.maxArmor, player.armor + 50);
      }
      game.sound.playBolter();
      game.updateHUDVitals();
      game.updateHUDAmmo();
      this.scene.remove(this.mesh);
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      if (this.mesh.material) this.mesh.material.dispose();
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
class CombatDirector {
  constructor(game) {
    this.game = game;
    this.currentWave = 1;
    this.maxCampaignWaves = 5;
    this.waveSpawnQueue = [];
    this.spawnTimer = 0;
    this.squadPauseTimer = 0;
    this.spawnBurstCounter = 0;
  }

  get maxSimultaneousEnemies() {
    return this.game.mode === 'MARINE' ? 16 : 24;
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
      for (let i = 0; i < 5; i++) this.waveSpawnQueue.push('termagant');
      for (let i = 0; i < 3; i++) this.waveSpawnQueue.push('hormagaunt');
      for (let i = 0; i < 2; i++) this.waveSpawnQueue.push('chaos_marine');
    } else if (waveNum === 3) {
      for (let i = 0; i < 6; i++) this.waveSpawnQueue.push('hormagaunt');
      for (let i = 0; i < 3; i++) this.waveSpawnQueue.push('tyranid_warrior');
      for (let i = 0; i < 2; i++) this.waveSpawnQueue.push('possessed');
    } else if (waveNum === 4) {
      for (let i = 0; i < 6; i++) this.waveSpawnQueue.push('chaos_marine');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('ravener');
      for (let i = 0; i < 1; i++) this.waveSpawnQueue.push('carnifex');
    } else if (waveNum === 5) {
      // Chefe Final: Chaos Champion
      this.waveSpawnQueue.push('chaos_champion');
      for (let i = 0; i < 5; i++) this.waveSpawnQueue.push('chaos_marine');
      for (let i = 0; i < 4; i++) this.waveSpawnQueue.push('daemon');
      document.getElementById('boss-hud-bar').classList.remove('hidden');
    }

    this.game.aliveEnemiesCount = this.waveSpawnQueue.length;
    this.game.updateHUDEnemies();
    this.spawnTimer = 0.5;
  }

  startEndlessWave(waveNum) {
    this.currentWave = waveNum;
    this.waveSpawnQueue = [];
    this.game._waveTransitioning = false; // Libera flag de transição
    this.game.sound.playBossRoar();
    this.game.updateHUDWave();

    // Orçamento de Ameaça dinâmico via BalanceManager
    const p = this.game.activePlayer;
    const hpRatio = p ? (p.hull / p.maxHull) : 1.0;
    const diff = BalanceManager.calculateDynamicDifficulty(waveNum, hpRatio, 'DREADNOUGHT');
    const threatBudget = diff.threatBudget;

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
    this.spawnTimer = 0.5;
  }

  update(dt) {
    if (this.waveSpawnQueue.length > 0) {
      // Respeita orçamento de inimigos simultâneos na tela para evitar sobrecarga ou travamentos
      if (this.game.enemies.length >= this.maxSimultaneousEnemies) {
        return;
      }

      if (this.squadPauseTimer > 0) {
        this.squadPauseTimer -= dt;
        return;
      }

      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = 0.65;
        this.spawnBurstCounter++;

        const nextType = this.waveSpawnQueue.shift();
        this.game.spawnEnemy(nextType);

        // Intervalo tático após cada grupo de 4 inimigos
        if (this.spawnBurstCounter >= 4) {
          this.spawnBurstCounter = 0;
          this.squadPauseTimer = 1.6;
        }
      }
    }
  }
}
const WaveManager = CombatDirector;
window.CombatDirector = CombatDirector;

/* ==========================================================================
   15. CONTROLADOR GERAL DO JOGO (GAME ENGINE)
   Orquestra os dois modos de jogo, loop principal, eventos e interface GSAP.
   ========================================================================== */
function createGrungeTexture(base = '#777777', accent = '#343434', size = 256) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
  // Ruído e riscos gerados proceduralmente para quebrar o aspecto plástico.
  for (let i = 0; i < 950; i++) {
    const alpha = 0.04 + Math.random() * 0.2;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = Math.random() > 0.55 ? accent : '#d0c8b3';
    const w = 1 + Math.random() * 18, h = 1 + Math.random() * 4;
    ctx.fillRect(Math.random() * size, Math.random() * size, w, h);
  }
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  for (let y = 16; y < size; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

class Game {
  constructor() {
    this.canvas = document.getElementById('threeCanvas');
    this.renderer = new ThreeRenderer(this.canvas);
    // Se WebGL falhar, o overlay de erro já foi exibido; não continue inicializando a cena.
    if (!this.renderer || !this.renderer.renderer || !this.renderer.scene || !this.renderer.camera) {
      this.initializationFailed = true;
      return;
    }
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
    this.initModeMaps();
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

    // Cenografia imperial: colunas reforçadas, trilhos luminosos, selo central e zonas de perigo.
    this.createArenaDecorations();

    // Barris Explosivos
    this.respawnBarrels();
  }


  createArenaDecorations() {
    const scene = this.renderer.scene;
    const steel = new THREE.MeshStandardMaterial({ color: 0x252e3d, metalness: 0.82, roughness: 0.34 });
    const darkSteel = new THREE.MeshStandardMaterial({ color: 0x090d14, metalness: 0.72, roughness: 0.52 });
    const gold = new THREE.MeshStandardMaterial({ color: 0x9a7738, metalness: 0.78, roughness: 0.3 });
    const cyan = new THREE.MeshStandardMaterial({ color: 0x00b9d4, emissive: 0x006b80, emissiveIntensity: 1.15, metalness: 0.25, roughness: 0.25 });
    const red = new THREE.MeshStandardMaterial({ color: 0x9e1825, emissive: 0x3a050a, emissiveIntensity: 0.65, metalness: 0.45, roughness: 0.35 });

    // Trilhos técnicos luminosos próximos ao perímetro, sem encobrir a área jogável.
    const addBox = (w, h, d, material, x, y, z, castShadow = false) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };
    addBox(2180, 2, 5, cyan, 0, 1.5, -930);
    addBox(2180, 2, 5, cyan, 0, 1.5, 930);
    addBox(5, 2, 1780, cyan, -1130, 1.5, 0);
    addBox(5, 2, 1780, cyan, 1130, 1.5, 0);

    // Contrafortes góticos e colunas em pares ao longo das paredes.
    const columnPositions = [];
    for (const z of [-820, -560, 0, 560, 820]) {
      columnPositions.push({ x: -1080, z }, { x: 1080, z });
    }
    for (const x of [-820, -540, 0, 540, 820]) {
      columnPositions.push({ x, z: -880 }, { x, z: 880 });
    }
    for (const p of columnPositions) {
      const base = new THREE.Mesh(new THREE.BoxGeometry(58, 12, 58), darkSteel);
      base.position.set(p.x, 6, p.z);
      scene.add(base);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(17, 23, 112, 8), steel);
      shaft.position.set(p.x, 68, p.z);
      shaft.castShadow = true; shaft.receiveShadow = true;
      scene.add(shaft);
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 9, 8), gold);
      collar.position.set(p.x, 120, p.z);
      scene.add(collar);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(54, 10, 54), darkSteel);
      cap.position.set(p.x, 130, p.z);
      cap.castShadow = true;
      scene.add(cap);
      const lumen = new THREE.Mesh(new THREE.BoxGeometry(3, 52, 3), red);
      lumen.position.set(p.x, 69, p.z + 19);
      scene.add(lumen);
    }

    // Brasões circulares no chão: anéis de metal e cruz imperial.
    const seal = new THREE.Group();
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x8b6b32, metalness: 0.8, roughness: 0.3, emissive: 0x211604 });
    for (const radius of [95, 112]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, radius === 95 ? 2.5 : 1.4, 8, 72), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 1.1;
      seal.add(ring);
    }
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(112, 1.2, 5), gold);
    crossH.position.y = 1.2;
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 112), gold);
    crossV.position.y = 1.2;
    seal.add(crossH, crossV);
    scene.add(seal);

    // Placas de advertência com faixas diagonais nos quatro quadrantes.
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xc49a43, metalness: 0.45, roughness: 0.45 });
    for (const p of [{x:-720,z:-720},{x:720,z:-720},{x:-720,z:720},{x:720,z:720}]) {
      const pad = addBox(120, 1, 48, darkSteel, p.x, 0.7, p.z);
      for (let i = -2; i <= 2; i++) {
        const stripe = addBox(7, 1.4, 48, hazardMat, p.x + i * 22, 1.6, p.z);
        stripe.rotation.y = 0.28;
      }
      const beacon = new THREE.Mesh(new THREE.BoxGeometry(22, 5, 22), p.z < 0 ? red : cyan);
      beacon.position.set(p.x, 4, p.z + (p.x < 0 ? 35 : -35));
      scene.add(beacon);
    }

    // Grandes placas de reforço e guias de orientação no centro da arena.
    for (const z of [-430, 430]) {
      addBox(720, 1.1, 3, gold, 0, 0.8, z);
      addBox(3, 1.1, 180, gold, -360, 0.8, z > 0 ? 340 : -340);
      addBox(3, 1.1, 180, gold, 360, 0.8, z > 0 ? 340 : -340);
    }
  }

  respawnBarrels() {
    for (const b of this.mapBarrels) {
      if (b.model) {
        this.renderer.scene.remove(b.model);
        ThreeRenderer.disposeHierarchy(b.model);
      }
    }
    this.mapBarrels = [];
    const coords = [
      { x: -500, z: -350 }, { x: -460, z: -350 },
      { x: 500, z: -350 }, { x: 540, z: -350 },
      { x: -400, z: 350 }, { x: 400, z: 350 },
      { x: 0, z: -550 }
    ];
    coords.forEach(c => this.mapBarrels.push(new Barrel3D(this.renderer.scene, c.x, c.z)));
  }


  // Dois cenários próprios: selva alagada/refinaria de promethium (MARINE)
  // e pátio de fundição industrial para o Dreadnought. Inspirados no clima de Inferno.
  initModeMaps() {
    const scene = this.renderer.scene;
    this.baseArenaObjects = scene.children.slice();
    // Esconde apenas o cenário antigo; NUNCA esconda as luzes globais.
    // Ocultar AmbientLight/DirectionalLight fazia os dois mapas ficarem quase pretos.
    this.baseArenaObjects.forEach(o => {
      const isLight = o.isLight === true;
      o.visible = isLight;
    });
    this.modeMaps = { MARINE: new THREE.Group(), DREADNOUGHT: new THREE.Group() };
    scene.add(this.modeMaps.MARINE, this.modeMaps.DREADNOUGHT);
    this.buildInfernoMap(this.modeMaps.MARINE);
    this.buildDreadnoughtMap(this.modeMaps.DREADNOUGHT);
    this.modeMaps.MARINE.visible = false;
    this.modeMaps.DREADNOUGHT.visible = false;
  }

  buildInfernoMap(group) {
    const add = (geo, mat, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(x,y,z); m.rotation.y = ry;
      m.castShadow = true; m.receiveShadow = true; group.add(m); return m;
    };
    const groundTex = createGrungeTexture('#515844', '#2b3127');
    const mudTex = createGrungeTexture('#665744', '#30291f');
    const concreteTex = createGrungeTexture('#777c7b', '#424746');
    const metalTex = createGrungeTexture('#59636a', '#20282d');
    const ground = new THREE.MeshStandardMaterial({color:0x656957, map:groundTex, bumpMap:groundTex, bumpScale:7, roughness:0.98, metalness:0.01});
    const mud = new THREE.MeshStandardMaterial({color:0x62503b, map:mudTex, bumpMap:mudTex, bumpScale:11, roughness:1});
    const concrete = new THREE.MeshStandardMaterial({color:0x777b78, map:concreteTex, bumpMap:concreteTex, bumpScale:4, roughness:0.9, metalness:0.08});
    const metal = new THREE.MeshStandardMaterial({color:0x778187, map:metalTex, bumpMap:metalTex, bumpScale:2.5, roughness:0.42, metalness:0.72});
    const gold = new THREE.MeshStandardMaterial({color:0xb68a43, roughness:0.42, metalness:0.72});
    const promethium = new THREE.MeshStandardMaterial({color:0xb64d20, emissive:0x7c1b05, emissiveIntensity:0.85, roughness:0.3});
    const toxic = new THREE.MeshStandardMaterial({color:0x617a3b, map:groundTex, emissive:0x101b08, emissiveIntensity:0.25, roughness:0.86});
    const swampFloor = add(new THREE.PlaneGeometry(2400,2000), ground,0,-2,0); // chão lamacento
    swampFloor.rotation.x = -Math.PI / 2;
    // Faixas de lama, trilhas de veículos e charcos.
    for (let i=0;i<11;i++) add(new THREE.BoxGeometry(2400,0.8,24+(i%3)*14),mud,0,-0.8,-850+i*170,0.02*(i%2));
    for (const x of [-930,-720,720,930]) {
      add(new THREE.CylinderGeometry(24,34,170,7),toxic,x,84,-420+(Math.abs(x)%3)*220);
      add(new THREE.ConeGeometry(55,110,7),ground,x,220,-420+(Math.abs(x)%3)*220);
    }
    // Bunkers destruídos e barricadas Astra Militarum.
    for (const b of [{x:-760,z:-570,r:-0.12},{x:760,z:560,r:0.18},{x:-880,z:160,r:0.08}]) {
      add(new THREE.BoxGeometry(250,105,150),concrete,b.x,52,b.z,b.r);
      add(new THREE.BoxGeometry(265,13,162),metal,b.x,111,b.z,b.r);
      add(new THREE.BoxGeometry(75,50,12),metal,b.x,43,b.z+78,b.r);
      for(let i=-2;i<=2;i++) add(new THREE.BoxGeometry(9,36,9),gold,b.x+i*35,19,b.z+87,b.r);
    }
    // Grande refinaria de promethium no fundo: tanques, tubulações e chaminés.
    for (const t of [{x:-520,z:-790,r:0},{x:-260,z:-820,r:0},{x:300,z:-810,r:0},{x:560,z:-760,r:0}]) {
      add(new THREE.CylinderGeometry(72,82,190,12),metal,t.x,95,t.z);
      add(new THREE.CylinderGeometry(76,76,10,12),gold,t.x,185,t.z);
      add(new THREE.CylinderGeometry(18,23,260,10),concrete,t.x+95,130,t.z-35);
      add(new THREE.CylinderGeometry(22,22,5,10),promethium,t.x+95,265,t.z-35);
    }
    // Tubulações concentradas no fundo da refinaria: não atravessam a linha de visão
    // nem cortam a área principal de combate. O eixo do cilindro é girado para X.
    for (const z of [-900, -845]) {
      const pipe = add(new THREE.CylinderGeometry(9,9,1050,12),metal,0,76,z);
      pipe.rotation.z = Math.PI / 2;
      for (const x of [-500, -250, 0, 250, 500]) {
        const support = add(new THREE.BoxGeometry(12,34,18),concrete,x,48,z);
      }
      for (const x of [-500, 500]) {
        const collar = add(new THREE.CylinderGeometry(13,13,7,12),gold,x,76,z);
        collar.rotation.z = Math.PI / 2;
      }
    }
    // Torres de geradores e linhas de combustível na área central jogável.
    for (const g of [{x:-410,z:-150},{x:410,z:-150},{x:-410,z:260},{x:410,z:260}]) {
      add(new THREE.BoxGeometry(94,95,94),metal,g.x,47,g.z);
      add(new THREE.BoxGeometry(106,9,106),gold,g.x,96,g.z);
      add(new THREE.CylinderGeometry(24,28,110,8),concrete,g.x,150,g.z);
      add(new THREE.CylinderGeometry(16,16,5,8),promethium,g.x,208,g.z);
      for (const dx of [-36,36]) add(new THREE.BoxGeometry(6,58,7),promethium,g.x+dx,45,g.z+49);
    }
    // Torres de iluminação, focos de fogo e barricadas de borda.
    for (const x of [-1080,-820,820,1080]) {
      add(new THREE.BoxGeometry(16,210,16),metal,x,105,0);
      add(new THREE.BoxGeometry(72,10,22),gold,x,210,0);
      const lamp = new THREE.PointLight(0xff4b18,1.6,360); lamp.position.set(x,195,0); group.add(lamp);
    }
    for (const p of [{x:-600,z:650},{x:0,z:760},{x:600,z:650},{x:-700,z:-60},{x:700,z:-60}]) {
      add(new THREE.BoxGeometry(150,28,32),concrete,p.x,14,p.z,0.25);
      add(new THREE.BoxGeometry(120,3,5),promethium,p.x,30,p.z);
    }
    // Charcos rasos com bordas de lama e reflexos discretos para dar profundidade ao terreno.
    const puddleMat = new THREE.MeshStandardMaterial({ color: 0x34484a, roughness: 0.19, metalness: 0.28, transparent: true, opacity: 0.82 });
    const puddleRim = new THREE.MeshStandardMaterial({ color: 0x514532, roughness: 0.98 });
    const puddles = [
      {x:-860,z:-350,rx:95,rz:42},{x:850,z:300,rx:110,rz:48},
      {x:-610,z:500,rx:78,rz:36},{x:630,z:-500,rx:88,rz:40},
      {x:80,z:850,rx:130,rz:45},{x:-80,z:-900,rx:120,rz:40}
    ];
    for (const p of puddles) {
      const rim = add(new THREE.CircleGeometry(1, 32), puddleRim, p.x, -0.15, p.z);
      rim.rotation.x = -Math.PI / 2; rim.scale.set(p.rx * 1.13, p.rz * 1.13, 1);
      const water = add(new THREE.CircleGeometry(1, 40), puddleMat, p.x, -0.05, p.z);
      water.rotation.x = -Math.PI / 2; water.scale.set(p.rx, p.rz, 1);
    }

    // Vegetação alienígena baixa nas margens: silhuetas de folhas e fungos, sem fechar as rotas.
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x465b32, roughness: 0.92 });
    const leafLight = new THREE.MeshStandardMaterial({ color: 0x56623a, roughness: 0.88 });
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x514a32, roughness: 1 });
    const foliageSpots = [
      [-1080,-720],[-990,-520],[-1090,360],[-970,690],[-760,820],[-520,900],
      [1080,-700],[970,-500],[1100,360],[970,700],[760,830],[520,910],
      [-1040,40],[1040,-30],[-860,560],[860,-590]
    ];
    foliageSpots.forEach(([x,z], idx) => {
      const h = 35 + (idx % 4) * 13;
      add(new THREE.CylinderGeometry(3, 6, h, 5), stemMat, x, h/2, z);
      for (let j=0;j<4;j++) {
        const leaf = add(new THREE.ConeGeometry(12 + (j%2)*5, 38 + (j%3)*8, 5), j%2 ? leafMat : leafLight, x + Math.sin(j*1.7)*13, h*0.45 + j*9, z + Math.cos(j*1.7)*13, j*0.8);
        leaf.rotation.x = (j-1.5)*0.22;
      }
    });

    // Entulho de guerra, placas de blindagem e sacos de areia nas laterais da arena.
    const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x555a56, map: concreteTex, bumpMap: concreteTex, bumpScale: 3, roughness: 0.96 });
    const sandbagMat = new THREE.MeshStandardMaterial({ color: 0x625843, map: mudTex, bumpMap: mudTex, bumpScale: 2, roughness: 1 });
    for (const wreck of [
      {x:-900,z:-120,r:0.32},{x:900,z:110,r:-0.28},{x:-720,z:720,r:-0.4},{x:720,z:-730,r:0.35}
    ]) {
      add(new THREE.BoxGeometry(100, 12, 48), metal, wreck.x, 8, wreck.z, wreck.r);
      add(new THREE.BoxGeometry(58, 8, 32), rubbleMat, wreck.x+22, 18, wreck.z-8, wreck.r+0.25);
      add(new THREE.ConeGeometry(18, 24, 5), rubbleMat, wreck.x-28, 13, wreck.z+16, wreck.r);
      for (let i=0;i<4;i++) add(new THREE.SphereGeometry(12, 7, 5), sandbagMat, wreck.x-38+i*23, 9, wreck.z+55, wreck.r);
    }

    // Emblemas imperiais danificados e sinalização militar nas entradas do complexo.
    const insigniaMat = new THREE.MeshStandardMaterial({ color: 0x79663d, metalness: 0.58, roughness: 0.55 });
    for (const side of [-1,1]) {
      const plaque = add(new THREE.BoxGeometry(110, 70, 8), metal, side*1060, 92, -760);
      add(new THREE.ConeGeometry(20, 48, 4), insigniaMat, side*1060, 103, -766, Math.PI);
      add(new THREE.BoxGeometry(5, 48, 5), gold, side*1060, 92, -767);
      // Luzes de sinalização voltadas para a arena.
      const signal = new THREE.PointLight(0xc94b22, 0.55, 190); signal.position.set(side*1010, 100, -690); group.add(signal);
    }

    // Modelos 3D compostos: transporte blindado destruído, canhão e torres góticas.
    // Construídos por peças separadas para criar silhuetas legíveis sem arquivos externos.
    const armor = new THREE.MeshStandardMaterial({ color: 0x343d3c, map: metalTex, bumpMap: metalTex, bumpScale: 3.5, metalness: 0.62, roughness: 0.68 });
    const armorEdge = new THREE.MeshStandardMaterial({ color: 0x655d49, metalness: 0.68, roughness: 0.52 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x243e43, emissive: 0x061316, emissiveIntensity: 0.3, metalness: 0.35, roughness: 0.24 });
    const makeWreck = (x,z,rot=0) => {
      const root = new THREE.Group(); root.position.set(x,0,z); root.rotation.y=rot; group.add(root);
      const part=(geo,mat,px,py,pz,rx=0,ry=0,rz=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(px,py,pz);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;root.add(m);return m;};
      part(new THREE.BoxGeometry(190,34,104),armor,0,22,0,0,0,0.04);
      part(new THREE.BoxGeometry(126,28,82),armor,-8,51,-5,0.05,0.1,-0.07);
      part(new THREE.BoxGeometry(58,8,62),glass,-5,67,-9);
      part(new THREE.BoxGeometry(220,8,12),armorEdge,0,10,0);
      for(const sx of [-1,1]) for(const sz of [-1,1]) {
        part(new THREE.CylinderGeometry(17,17,22,10),armorEdge,sx*64,13,sz*40,Math.PI/2,0,0);
        part(new THREE.CylinderGeometry(6,6,24,8),armor,sx*64,13,sz*40,Math.PI/2,0,0);
      }
      part(new THREE.BoxGeometry(54,9,9),armorEdge,92,32,-5,0,0,-0.12);
      part(new THREE.CylinderGeometry(5,7,86,8),armor,124,38,-5,0,0,Math.PI/2);
      part(new THREE.ConeGeometry(16,28,5),armor, -86,38,38,0.3,0.2,0.8);
    };
    makeWreck(-870,390,0.38); makeWreck(860,-250,-0.5);

    // Canhão de defesa imperial tombado junto ao perímetro, com base, escudo e tubo longo.
    const turret = new THREE.Group(); turret.position.set(950,0,470); turret.rotation.y=-0.65; group.add(turret);
    const turretPart=(geo,mat,x,y,z,rx=0,ry=0,rz=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;turret.add(m);};
    turretPart(new THREE.CylinderGeometry(58,70,24,10),armorEdge,0,12,0);
    turretPart(new THREE.BoxGeometry(86,46,74),armor,0,45,0,0,0,0.05);
    turretPart(new THREE.BoxGeometry(56,32,54),armorEdge,0,73,-4);
    turretPart(new THREE.CylinderGeometry(10,13,110,10),armor,0,78,-68,Math.PI/2,0,0);
    turretPart(new THREE.CylinderGeometry(16,16,9,10),armorEdge,0,78,-120,Math.PI/2,0,0);
    for(let i=-2;i<=2;i++) turretPart(new THREE.BoxGeometry(5,30,6),armorEdge,i*15,43,39,0,0,i*0.06);

    // Pórticos góticos industriais: pilares, arco segmentado e brasão central.
    const archMat = new THREE.MeshStandardMaterial({ color: 0x484b45, map: concreteTex, bumpMap: concreteTex, bumpScale: 2, roughness: 0.94 });
    for(const x of [-640,640]) {
      const z=-910;
      add(new THREE.BoxGeometry(38,210,42),archMat,x,105,z);
      add(new THREE.BoxGeometry(62,18,58),armorEdge,x,202,z);
      add(new THREE.ConeGeometry(24,62,4),archMat,x,242,z,Math.PI);
    }
    add(new THREE.BoxGeometry(1320,26,46),archMat,0,215,-910);
    add(new THREE.ConeGeometry(40,72,4),armorEdge,0,265,-910,Math.PI);
    add(new THREE.BoxGeometry(14,55,8),gold,0,260,-936);
    add(new THREE.BoxGeometry(46,8,8),gold,0,264,-936);

    // Limites externos escuros para que a arena tenha profundidade sem bloquear a câmera.
    for (const z of [-990,990]) add(new THREE.BoxGeometry(2400,180,22),concrete,0,70,z);
    for (const x of [-1190,1190]) add(new THREE.BoxGeometry(22,180,2000),concrete,x,70,0);
  }

  buildDreadnoughtMap(group) {
    const add = (geo, mat, x, y, z, ry=0) => {
      const m = new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.rotation.y=ry;
      m.castShadow=true; m.receiveShadow=true; group.add(m); return m;
    };
    const steelTex = createGrungeTexture('#69747c', '#252d33');
    const blackTex = createGrungeTexture('#4b555c', '#171c21');
    const steel = new THREE.MeshStandardMaterial({color:0x788185,map:steelTex,bumpMap:steelTex,bumpScale:2.8,metalness:0.72,roughness:0.4});
    const black = new THREE.MeshStandardMaterial({color:0x5b6468,map:blackTex,bumpMap:blackTex,bumpScale:4,metalness:0.48,roughness:0.68});
    const bronze = new THREE.MeshStandardMaterial({color:0x80602e,metalness:0.78,roughness:0.34});
    const red = new THREE.MeshStandardMaterial({color:0x72191b,emissive:0x280304,emissiveIntensity:0.65});
    const blue = new THREE.MeshStandardMaterial({color:0x08758a,emissive:0x003d4c,emissiveIntensity:0.75});
    const furnace = new THREE.MeshStandardMaterial({color:0xa63c14,emissive:0x7b1b04,emissiveIntensity:1.0});
    const foundryFloor = add(new THREE.PlaneGeometry(2400,2000),black,0,-2,0);
    foundryFloor.rotation.x = -Math.PI / 2;
    // Grandes linhas de montagem e pistas para a escala pesada do Dreadnought.
    for (const z of [-760,-500,-240,240,500,760]) {
      add(new THREE.BoxGeometry(2200,3,7),bronze,0,0.2,z);
      add(new THREE.BoxGeometry(2200,1,2),blue,0,2,z+16);
    }
    // Prensas, torres de fundição e colunas massivas junto às bordas.
    for (const x of [-1040,-760,760,1040]) for (const z of [-720,0,720]) {
      add(new THREE.BoxGeometry(125,260,125),steel,x,130,z);
      add(new THREE.BoxGeometry(165,22,165),black,x,265,z);
      add(new THREE.BoxGeometry(18,145,8),red,x,135,z+66);
      add(new THREE.CylinderGeometry(38,52,34,8),bronze,x,285,z);
    }
    // Reatores enormes e condutas de energia na metade traseira.
    for (const x of [-520,-180,180,520]) {
      add(new THREE.CylinderGeometry(62,75,240,12),steel,x,120,-780);
      add(new THREE.CylinderGeometry(48,48,8,12),furnace,x,245,-780);
      add(new THREE.CylinderGeometry(18,18,210,10),bronze,x+100,150,-760,0.15);
    }
    // Condutas de grande diâmetro junto à parede traseira; a arena central fica livre.
    for (const z of [-900, -835]) {
      const pipe = add(new THREE.CylinderGeometry(15,15,1000,12),steel,0,78,z);
      pipe.rotation.z = Math.PI / 2;
      for (const x of [-470,-235,0,235,470]) add(new THREE.BoxGeometry(18,38,22),black,x,51,z);
      for (const x of [-470,470]) {
        const collar = add(new THREE.CylinderGeometry(20,20,9,12),bronze,x,78,z);
        collar.rotation.z = Math.PI / 2;
      }
    }
    // Plataforma central com anéis de energia e brasão mecânico.
    for (const r of [150,180]) {
      const ring=add(new THREE.TorusGeometry(r,4,8,80),r===150?blue:bronze,0,2,0);
      ring.rotation.x=-Math.PI/2;
    }
    add(new THREE.CylinderGeometry(92,108,8,12),black,0,3,0);
    add(new THREE.CylinderGeometry(58,58,5,12),bronze,0,8,0);
    // Guindastes industriais e braços de manutenção em escala de Dreadnought.
    const craneMat = new THREE.MeshStandardMaterial({ color: 0x454b4e, map: steelTex, bumpMap: steelTex, bumpScale: 2, metalness: 0.68, roughness: 0.62 });
    for(const side of [-1,1]) {
      const x=side*880, z=260;
      add(new THREE.BoxGeometry(38,300,42),craneMat,x,150,z);
      add(new THREE.BoxGeometry(230,24,34),craneMat,x-side*92,290,z);
      add(new THREE.BoxGeometry(14,125,14),bronze,x-side*150,218,z);
      add(new THREE.CylinderGeometry(28,28,26,10),black,x-side*150,145,z);
      add(new THREE.CylinderGeometry(13,13,95,8),steel,x-side*150,91,z);
      add(new THREE.BoxGeometry(88,16,74),black,x,18,z+70);
      for(let k=-2;k<=2;k++) add(new THREE.BoxGeometry(5,10,72),bronze,x+k*15,30,z+70);
    }
    // Carcaça de um servo-guindaste tombado: cabina, esteiras e braço articulado.
    const fallen = new THREE.Group(); fallen.position.set(-780,0,-300); fallen.rotation.y=0.55; group.add(fallen);
    const fp=(geo,mat,x,y,z,rx=0,ry=0,rz=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;fallen.add(m);};
    fp(new THREE.BoxGeometry(150,38,78),black,0,24,0,0,0,-0.1);
    fp(new THREE.BoxGeometry(82,54,65),steel,-12,66,-4,0.12,0.1,-0.18);
    fp(new THREE.BoxGeometry(46,28,7),blue,-12,70,-39);
    fp(new THREE.CylinderGeometry(11,16,135,8),steel,82,68,-5,0,0,-0.85);
    fp(new THREE.ConeGeometry(22,42,6),bronze,138,120,-5,0,0,-0.85);
    for(const side of [-1,1]) for(let i=0;i<4;i++) fp(new THREE.CylinderGeometry(13,13,18,8),bronze,-48+i*30,14,side*43,Math.PI/2,0,0);

    // Grades e barricadas baixas deixam rotas largas para o mecha.
    for (const p of [{x:-560,z:-100},{x:560,z:-100},{x:-560,z:340},{x:560,z:340}]) {
      add(new THREE.BoxGeometry(170,32,36),steel,p.x,16,p.z);
      add(new THREE.BoxGeometry(130,4,5),red,p.x,34,p.z);
    }
    // Paredes perimetrais da fundição.
    for (const z of [-990,990]) add(new THREE.BoxGeometry(2400,220,28),black,0,100,z);
    for (const x of [-1190,1190]) add(new THREE.BoxGeometry(28,220,2000),black,x,100,0);
    // Luzes de caldeira nos cantos para silhuetas dramáticas.
    for (const p of [{x:-950,z:-850},{x:950,z:-850},{x:-950,z:850},{x:950,z:850}]) {
      const furnaceLight = new THREE.PointLight(0xc5411e,0.95,430); furnaceLight.position.set(p.x,110,p.z); group.add(furnaceLight);
    }
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

    // Cache de vetores para mira 3D sem alocação contínua de memória (Zero GC Pressure)
    const _raycaster = new THREE.Raycaster();
    const _mouseVec = new THREE.Vector2();
    const _groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const _intersectTarget = new THREE.Vector3();

    window.addEventListener('mousemove', (e) => {
      _mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      _mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
      _raycaster.setFromCamera(_mouseVec, this.renderer.camera);
      _raycaster.ray.intersectPlane(_groundPlane, _intersectTarget);

      if (this.activePlayer) {
        this.mouseWorldAngle = Math.atan2(_intersectTarget.z - this.activePlayer.z, _intersectTarget.x - this.activePlayer.x);
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

    // Cliques nos Slots de Arma no HUD (Desktop & Touch)
    for (let slotIdx = 1; slotIdx <= 4; slotIdx++) {
      const slotEl = document.getElementById(`slot-${slotIdx}`);
      if (slotEl) {
        slotEl.addEventListener('click', () => {
          if (this.state === 'PLAYING' && this.mode === 'MARINE' && this.activePlayer) {
            this.activePlayer.switchSlot(slotIdx, this);
          }
        });
      }
    }

    // Cliques nas Habilidades do Dreadnought no HUD
    const stompEl = document.getElementById('dread-stomp-btn');
    if (stompEl) {
      stompEl.addEventListener('click', () => {
        if (this.state === 'PLAYING' && this.mode === 'DREADNOUGHT' && this.activePlayer) {
          this.activePlayer.performStomp(this);
        }
      });
    }

    const furyEl = document.getElementById('dread-fury-btn');
    if (furyEl) {
      furyEl.addEventListener('click', () => {
        if (this.state === 'PLAYING' && this.mode === 'DREADNOUGHT' && this.activePlayer) {
          this.activePlayer.activateFury(this);
        }
      });
    }

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

    // Configurações e Persistência
    document.getElementById('cfg-master-volume').addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.sound.setMasterVolume(val / 100);
      document.getElementById('cfg-volume-val').innerText = `${val}%`;
      this.saveData.settings.masterVolume = val;
      SaveManager.save(this.saveData);
    });

    document.getElementById('cfg-sfx-volume').addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.sound.setSfxVolume(val / 100);
      document.getElementById('cfg-sfx-val').innerText = `${val}%`;
      this.saveData.settings.sfxVolume = val;
      SaveManager.save(this.saveData);
    });

    document.getElementById('cfg-music-volume').addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.sound.setMusicVolume(val / 100);
      document.getElementById('cfg-music-val').innerText = `${val}%`;
      this.saveData.settings.musicVolume = val;
      SaveManager.save(this.saveData);
    });

    document.getElementById('cfg-graphics').addEventListener('change', (e) => {
      this.renderer.setGraphicsQuality(e.target.value);
      this.saveData.settings.graphics = e.target.value;
      SaveManager.save(this.saveData);
    });

    document.getElementById('cfg-shake').addEventListener('change', (e) => {
      this.screenShakeEnabled = e.target.checked;
      this.saveData.settings.shake = e.target.checked;
      SaveManager.save(this.saveData);
    });

    document.getElementById('cfg-gore').addEventListener('change', (e) => {
      this.goreEnabled = e.target.checked;
      this.saveData.settings.gore = e.target.checked;
      SaveManager.save(this.saveData);
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
    if (this._isStarting) return;
    this._isStarting = true;
    setTimeout(() => { this._isStarting = false; }, 350);

    this.mode = modeName;
    this.mapColliders = modeName === 'MARINE' ? [
      // Bunkers: a mesma rotação do modelo e dimensões da placa superior visível.
      {x:-760,z:-570,w:265,d:162,r:-0.12}, {x:760,z:560,w:265,d:162,r:0.18}, {x:-880,z:160,w:265,d:162,r:0.08},
      // Geradores centrais e tanques de promethium.
      {x:-410,z:-150,w:108,d:108}, {x:410,z:-150,w:108,d:108}, {x:-410,z:260,w:108,d:108}, {x:410,z:260,w:108,d:108},
      {x:-520,z:-790,w:164,d:164}, {x:-260,z:-820,w:164,d:164}, {x:300,z:-810,w:164,d:164}, {x:560,z:-760,w:164,d:164},
      // Barricadas baixas: OBB com rotação igual à geometria visual (0.25 rad).
      {x:-600,z:650,w:150,d:32,r:0.25}, {x:0,z:760,w:150,d:32,r:0.25}, {x:600,z:650,w:150,d:32,r:0.25}, {x:-700,z:-60,w:150,d:32,r:0.25}, {x:700,z:-60,w:150,d:32,r:0.25},
      // Postes estreitos de iluminação; removida a antiga zona fantasma de 50x70.
      {x:-1080,z:0,w:20,d:20}, {x:-820,z:0,w:20,d:20}, {x:820,z:0,w:20,d:20}, {x:1080,z:0,w:20,d:20},
      // Blindados destruídos e canhão tombado que são sólidos e visíveis no mapa.
      {x:-870,z:390,w:220,d:104,r:0.38}, {x:860,z:-250,w:220,d:104,r:-0.5},
      {x:950,z:470,w:150,d:180,r:-0.65}
    ] : [
      // Prensas e torres de fundição; dimensões acompanham a placa superior de 165x165.
      ...[-1040,-760,760,1040].flatMap(x => [-720,0,720].map(z => ({x,z,w:165,d:165}))),
      // Reatores traseiros.
      ...[-520,-180,180,520].map(x => ({x,z:-780,w:155,d:155})),
      // Barricadas baixas visíveis.
      {x:-560,z:-100,w:170,d:36}, {x:560,z:-100,w:170,d:36}, {x:-560,z:340,w:170,d:36}, {x:560,z:340,w:170,d:36},
      // Servo-guindaste tombado: retângulo orientado com a rotação do modelo.
      {x:-780,z:-300,w:150,d:90,r:0.55}
    ];
    if (this.modeMaps) {
      this.modeMaps.MARINE.visible = modeName === 'MARINE';
      this.modeMaps.DREADNOUGHT.visible = modeName === 'DREADNOUGHT';
    }
    this.state = 'PLAYING';
    this.score = 0;
    this.killsCount = 0;
    this.mouseDown = false;       // Reseta estado do mouse ao reiniciar
    this._waveTransitioning = false; // Reseta flag de transição de onda

    // Remove entidades anteriores e libera recursos GPU
    if (this.activePlayer) {
      this.renderer.scene.remove(this.activePlayer.model);
      ThreeRenderer.disposeHierarchy(this.activePlayer.model);
    }
    for (const e of this.enemies) {
      this.renderer.scene.remove(e.model);
      ThreeRenderer.disposeHierarchy(e.model);
    }
    for (const p of this.projectiles) {
      this.renderer.scene.remove(p.mesh);
    }
    for (const pu of this.pickups) {
      this.renderer.scene.remove(pu.mesh);
      if (pu.mesh.geometry) pu.mesh.geometry.dispose();
      if (pu.mesh.material) pu.mesh.material.dispose();
    }

    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.aliveEnemiesCount = 0;
    this.particles.clear();
    this.respawnBarrels();

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

    // Ativa controles de toque apenas em dispositivos compatíveis
    const touchArea = document.getElementById('touch-controls');
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024) {
      touchArea.classList.add('active');
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
    if (this.mode === 'MARINE' && this.activePlayer && this.activePlayer.weapons) {
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
    } else if (this.mode === 'DREADNOUGHT' && this.activePlayer) {
      const leftName = document.getElementById('dread-arm-left-name');
      const leftAmmo = document.getElementById('dread-arm-left-ammo');
      const rightName = document.getElementById('dread-arm-right-name');
      const rightAmmo = document.getElementById('dread-arm-right-ammo');

      if (this.activePlayer.leftArmWeapon) {
        if (leftName) leftName.innerText = `${this.activePlayer.leftArmWeapon.name}:`;
        if (leftAmmo) leftAmmo.innerText = this.activePlayer.leftArmWeapon.ammo === Infinity ? 'INF' : this.activePlayer.leftArmWeapon.ammo;
      }
      if (this.activePlayer.rightArmWeapon) {
        if (rightName) rightName.innerText = `${this.activePlayer.rightArmWeapon.name}:`;
        if (rightAmmo) rightAmmo.innerText = this.activePlayer.rightArmWeapon.ammo === Infinity ? 'MELEE' : this.activePlayer.rightArmWeapon.ammo;
      }
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
    this.sound.stopProceduralCombatMusic();

    // Limpa todas as entidades ativas da cena e libera memória GPU
    if (this.activePlayer) {
      this.renderer.scene.remove(this.activePlayer.model);
      ThreeRenderer.disposeHierarchy(this.activePlayer.model);
      this.activePlayer = null;
    }
    for (const e of this.enemies) {
      this.renderer.scene.remove(e.model);
      ThreeRenderer.disposeHierarchy(e.model);
    }
    this.enemies = [];
    for (const p of this.projectiles) {
      this.renderer.scene.remove(p.mesh);
    }
    this.projectiles = [];
    for (const pu of this.pickups) {
      this.renderer.scene.remove(pu.mesh);
      if (pu.mesh.geometry) pu.mesh.geometry.dispose();
      if (pu.mesh.material) pu.mesh.material.dispose();
    }
    this.pickups = [];
    this.particles.clear();

    const touchArea = document.getElementById('touch-controls');
    if (touchArea) touchArea.classList.remove('active');

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
    this.sound.playGameOver();

    document.getElementById('boss-hud-bar').classList.add('hidden');
    document.getElementById('execution-prompt').classList.add('hidden');
    const touchArea = document.getElementById('touch-controls');
    if (touchArea) touchArea.classList.remove('active');

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
    this.mouseDown = false;
    this.sound.playVictory();

    document.getElementById('boss-hud-bar').classList.add('hidden');
    document.getElementById('execution-prompt').classList.add('hidden');
    const touchArea = document.getElementById('touch-controls');
    if (touchArea) touchArea.classList.remove('active');

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
        this.updateHUDVitals();
        this.updateHUDAmmo();
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

// Inicialização Principal Resiliente
function initGame() {
  if (window.ironVigilGame) return;
  const game = new Game();
  // Não inicia o loop se o navegador não conseguiu criar o contexto WebGL.
  if (!game || game.initializationFailed || !game.renderer || !game.renderer.renderer) return;
  window.ironVigilGame = game;
  const urlParams = new URLSearchParams(window.location.search);
  const autoMode = urlParams.get('mode');
  if (autoMode === 'marine') {
    game.startMode('MARINE');
  } else if (autoMode === 'dreadnought') {
    game.startMode('DREADNOUGHT');
  }
  requestAnimationFrame((t) => game.loop(t));
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
