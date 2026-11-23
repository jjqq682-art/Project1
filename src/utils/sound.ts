// Procedural tabletop sound effects & ambient rain generator using Web Audio API

let audioCtx: AudioContext | null = null;
let rainNode: AudioBufferSourceNode | null = null;
let rainGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Ignore autoplay restrictions
    });
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'triangle',
  volume = 0.08,
  delay = 0
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export const soundFx = {
  cardDraw(enabled: boolean) {
    if (!enabled) return;
    playTone(330, 0.09, 'triangle', 0.06, 0);
    playTone(440, 0.12, 'sine', 0.05, 0.04);
  },

  cardFlip(enabled: boolean) {
    if (!enabled) return;
    playTone(392, 0.07, 'sine', 0.05, 0);
    playTone(587.33, 0.14, 'triangle', 0.06, 0.045);
  },

  choiceTick(enabled: boolean) {
    if (!enabled) return;
    playTone(523.25, 0.08, 'sine', 0.06, 0);
    playTone(659.25, 0.12, 'triangle', 0.05, 0.05);
  },

  bossHit(enabled: boolean) {
    if (!enabled) return;
    playTone(150, 0.08, 'sawtooth', 0.06, 0);
    playTone(110, 0.14, 'triangle', 0.07, 0.03);
    playTone(440, 0.09, 'sine', 0.04, 0.06);
  },

  diceRoll(enabled: boolean) {
    if (!enabled) return;
    const notes = [293.66, 349.23, 392.0, 440.0, 523.25];
    notes.forEach((freq, i) => {
      playTone(freq, 0.06, 'triangle', 0.05, i * 0.055);
    });
  },

  questClear(enabled: boolean) {
    if (!enabled) return;
    playTone(440, 0.14, 'triangle', 0.07, 0);
    playTone(554.37, 0.14, 'triangle', 0.07, 0.08);
    playTone(659.25, 0.16, 'triangle', 0.07, 0.16);
    playTone(880, 0.35, 'sine', 0.08, 0.24);
  },

  levelUp(enabled: boolean) {
    if (!enabled) return;
    const fanfare = [523.25, 659.25, 783.99, 1046.5];
    fanfare.forEach((freq, idx) => {
      playTone(freq, 0.22, 'triangle', 0.07, idx * 0.09);
    });
  },

  pageTurn(enabled: boolean) {
    if (!enabled) return;
    playTone(260, 0.07, 'sine', 0.04, 0);
  },

  startAmbientRain() {
    const ctx = getAudioContext();
    if (!ctx || rainNode) return;

    // 2-second soft filtered brown-ish noise buffer for calm reading rain ambience
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 2.4;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 680;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.075, ctx.currentTime + 0.6);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    rainNode = source;
    rainGain = gain;
  },

  stopAmbientRain() {
    if (!rainNode || !audioCtx) return;
    try {
      if (rainGain) {
        rainGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.1);
      }
      const nodeToStop = rainNode;
      window.setTimeout(() => {
        try {
          nodeToStop.stop();
          nodeToStop.disconnect();
        } catch {
          // Ignore already stopped
        }
      }, 220);
    } catch {
      // Ignore cleanup errors
    }
    rainNode = null;
    rainGain = null;
  },
};
