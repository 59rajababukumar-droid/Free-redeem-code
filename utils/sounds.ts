
class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private bgMusic: HTMLAudioElement;
  private isMusicPlaying: boolean = false;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Royalty-free Cyberpunk/Sci-fi background loop
    this.bgMusic = new Audio('https://cdn.pixabay.com/audio/2021/08/09/audio_9ec60b0933.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0;
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setMuted(isMuted: boolean) {
    this.muted = isMuted;
    
    // Handle background music muting instantly
    if (this.bgMusic) {
      if (isMuted) {
        this.bgMusic.volume = 0;
      } else if (this.isMusicPlaying) {
        this.bgMusic.volume = 0.2; // Restore to default volume
      }
    }
  }

  playBgMusic() {
    if (this.isMusicPlaying) return; // Prevent restart if already playing
    this.isMusicPlaying = true;

    if (this.muted) {
      this.bgMusic.volume = 0;
      this.bgMusic.play().catch(e => console.warn("Audio play failed", e));
      return;
    }

    this.bgMusic.volume = 0;
    this.bgMusic.play().then(() => {
      this.fadeMusic(0.2);
    }).catch(e => {
      console.warn("Autoplay blocked, waiting for interaction", e);
      // One-time listener to start music on first user interaction
      const startOnInteraction = () => {
        this.playBgMusic();
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('touchstart', startOnInteraction);
      };
      document.addEventListener('click', startOnInteraction);
      document.addEventListener('touchstart', startOnInteraction);
    });
  }

  stopBgMusic() {
    if (!this.isMusicPlaying) return;
    this.isMusicPlaying = false;
    
    this.fadeMusic(0, () => {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    });
  }

  private fadeMusic(target: number, callback?: () => void) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    
    const step = 0.01;
    this.fadeInterval = setInterval(() => {
      // If user muted during fade, abort fade and stay at 0
      if (this.muted && target > 0) {
        this.bgMusic.volume = 0;
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        return;
      }

      let current = this.bgMusic.volume;
      // Precision issue workaround
      if (Math.abs(current - target) <= step) {
        this.bgMusic.volume = target;
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        if (callback) callback();
      } else {
        this.bgMusic.volume = current < target ? current + step : current - step;
      }
    }, 50);
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  playPop() {
    this.playTone(400, 'sine', 0.1, 0.1);
  }

  playCoin() {
    this.playTone(1200, 'sine', 0.2, 0.1);
    setTimeout(() => this.playTone(1500, 'sine', 0.2, 0.1), 50);
  }

  playSuccess() {
    const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    tones.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.1), i * 100);
    });
  }

  playCrash() {
    this.playTone(150, 'sawtooth', 0.5, 0.1);
    this.playTone(100, 'sine', 0.8, 0.2);
  }
}

export const sounds = new SoundManager();
