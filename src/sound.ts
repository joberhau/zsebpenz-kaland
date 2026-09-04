let audioCtx: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new Ctor()
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

function tone(ctx: AudioContext, freq: number, startTime: number, duration: number, gainPeak = 0.22) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

/** Plays a short synthesized chime, happier/brighter for better grades. No audio assets needed. */
export function playGradeSound(grade: number): void {
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    if (grade >= 4) {
      tone(ctx, 523.25, now, 0.15) // C5
      tone(ctx, 659.25, now + 0.09, 0.15) // E5
      tone(ctx, 783.99, now + 0.18, 0.3) // G5
    } else if (grade === 3) {
      tone(ctx, 523.25, now, 0.15) // C5
      tone(ctx, 587.33, now + 0.1, 0.22) // D5
    } else {
      tone(ctx, 392.0, now, 0.14) // G4
      tone(ctx, 349.23, now + 0.09, 0.2) // F4
    }
  } catch {
    // Web Audio unavailable — fail silently, sound is a nice-to-have.
  }
}

let noiseBuffer: AudioBuffer | null = null

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const seconds = 0.15
    const size = Math.floor(ctx.sampleRate * seconds)
    noiseBuffer = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
  }
  return noiseBuffer
}

function clap(ctx: AudioContext, buffer: AudioBuffer, time: number, gainPeak: number) {
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 1200 + Math.random() * 3000
  bandpass.Q.value = 0.6
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(gainPeak, time + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06 + Math.random() * 0.05)
  source.connect(bandpass)
  bandpass.connect(gain)
  gain.connect(ctx.destination)
  source.start(time)
  source.stop(time + 0.15)
}

function whistle(ctx: AudioContext, time: number, gainPeak = 0.16) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(900, time)
  osc.frequency.linearRampToValueAtTime(2600, time + 0.22)
  osc.frequency.linearRampToValueAtTime(2000, time + 0.4)
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(gainPeak, time + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.42)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(time)
  osc.stop(time + 0.45)
}

function whoop(ctx: AudioContext, time: number, gainPeak = 0.18) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(320, time)
  osc.frequency.exponentialRampToValueAtTime(880, time + 0.14)
  osc.frequency.exponentialRampToValueAtTime(500, time + 0.32)
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 2200
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(gainPeak, time + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  osc.start(time)
  osc.stop(time + 0.38)
}

function boom(ctx: AudioContext, time: number, gainPeak = 0.4) {
  // low thump
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(160, time)
  osc.frequency.exponentialRampToValueAtTime(35, time + 0.32)
  oscGain.gain.setValueAtTime(gainPeak, time)
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.38)
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.start(time)
  osc.stop(time + 0.4)

  // crackle
  const noise = ctx.createBufferSource()
  noise.buffer = getNoiseBuffer(ctx)
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 2200
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(gainPeak * 0.5, time)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22)
  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  noise.start(time)
  noise.stop(time + 0.22)
}

/** A single firework "boom" — low thump + crackle. Call once per firework burst. */
export function playFireworkBoom(): void {
  try {
    const ctx = getContext()
    boom(ctx, ctx.currentTime, 0.35 + Math.random() * 0.15)
  } catch {
    // Web Audio unavailable — fail silently, sound is a nice-to-have.
  }
}

/** Procedurally synthesized ovation — claps, whistles and cartoon "whoop!" cheers. No audio assets needed. */
export function playApplause(): void {
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    const buffer = getNoiseBuffer(ctx)
    const duration = 1.8
    const clapCount = 70
    for (let i = 0; i < clapCount; i++) {
      const t = Math.pow(Math.random(), 1.4) * duration // denser near the start, tapering off
      const gainPeak = 0.12 + Math.random() * 0.16
      clap(ctx, buffer, now + t, gainPeak)
    }
    whistle(ctx, now + 0.1)
    whistle(ctx, now + 0.75)
    whoop(ctx, now + 0.05)
    whoop(ctx, now + 0.5)
    whoop(ctx, now + 1.0)
  } catch {
    // Web Audio unavailable — fail silently, sound is a nice-to-have.
  }
}
