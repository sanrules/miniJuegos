import { type SoundType } from '../data/animals';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function playAnimalSound(type: SoundType) {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    gain.connect(c.destination);

    switch (type) {
      case 'roar': {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, c.currentTime);
        osc.frequency.linearRampToValueAtTime(80, c.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.5);
        break;
      }
      case 'trumpet': {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, c.currentTime);
        const vibrato = c.createOscillator();
        vibrato.frequency.setValueAtTime(30, c.currentTime);
        const vGain = c.createGain();
        vGain.gain.setValueAtTime(50, c.currentTime);
        vibrato.connect(vGain).connect(osc.frequency);
        vibrato.start(c.currentTime);
        gain.gain.setValueAtTime(0.3, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.6);
        vibrato.stop(c.currentTime + 0.6);
        break;
      }
      case 'chirp': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1500, c.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.2);
        break;
      }
      case 'splash': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.4);
        break;
      }
      case 'boing': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, c.currentTime);
        osc.frequency.linearRampToValueAtTime(600, c.currentTime + 0.08);
        osc.frequency.linearRampToValueAtTime(200, c.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.35);
        break;
      }
    }
  } catch {
    // audio no disponible
  }
}
