/**
 * Audio synthesis helper using Web Speech API with Chinese language support
 * and Web Audio sound effects for calligraphy practice.
 */

export interface ChineseVoice {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isDefault: boolean;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth || typeof this.synth.getVoices !== 'function') return;
    try {
      const v = this.synth.getVoices();
      this.voices = Array.isArray(v) ? v : [];
    } catch {
      this.voices = [];
    }
  }

  public getChineseVoices(): ChineseVoice[] {
    if (!this.synth) return [];
    if (!Array.isArray(this.voices) || this.voices.length === 0) {
      this.loadVoices();
    }

    if (!Array.isArray(this.voices)) {
      this.voices = [];
      return [];
    }

    const chineseVoices = this.voices.filter(v => 
      v && (
        (v.lang && (v.lang.startsWith('zh') || v.lang.includes('cmn'))) ||
        (v.name && (
          v.name.toLowerCase().includes('chinese') ||
          v.name.toLowerCase().includes('mandarin') ||
          v.name.toLowerCase().includes('xiaoxiao') ||
          v.name.toLowerCase().includes('ting-ting')
        ))
      )
    );

    return chineseVoices.map(v => ({
      voice: v,
      name: v.name || 'Chinese Voice',
      lang: v.lang || 'zh-CN',
      isDefault: Boolean(v.default)
    }));
  }

  public speak(
    text: string, 
    options: {
      rate?: number;
      pitch?: number;
      voiceName?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (e: SpeechSynthesisErrorEvent) => void;
    } = {}
  ): void {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = options.rate ?? 0.85; // Default slightly relaxed for learners
    utterance.pitch = options.pitch ?? 1.0;

    const voices = this.getChineseVoices();
    if (options.voiceName) {
      const selected = voices.find(v => v.name === options.voiceName);
      if (selected) utterance.voice = selected.voice;
    } else if (voices.length > 0) {
      // Pick best default: prefer Mainland Chinese zh-CN or natural voice
      const preferred = voices.find(v => 
        v.lang === 'zh-CN' || 
        v.name.includes('Xiaoxiao') || 
        v.name.includes('Yunxi') || 
        v.name.includes('Google') ||
        v.name.includes('Natural')
      ) || voices[0];
      utterance.voice = preferred.voice;
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Play subtle traditional chime or ink sound on canvas clear/stroke
   */
  public playEffect(type: 'clear' | 'bell' | 'stroke'): void {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (type === 'clear') {
        // Gentle whoosh / bell tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.25); // E4
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'bell') {
        // Eastern bell chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(1046.5, now); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.7);
        osc2.stop(now + 0.7);
      }
    } catch {
      // Ignore audio context errors if browser blocks autoplay
    }
  }
}

export const speechService = new SpeechService();
