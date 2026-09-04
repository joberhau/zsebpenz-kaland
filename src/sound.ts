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
