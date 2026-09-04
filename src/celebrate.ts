import confetti from 'canvas-confetti'
import type { Grade } from './types'
import { GRADE_COLORS } from './utils'

// canvas-confetti's runtime supports shapeFromText (used to draw emoji particles),
// but the bundled @types package doesn't declare it yet.
const confettiWithShapeFromText = confetti as unknown as {
  shapeFromText: (opts: { text: string; scalar?: number }) => unknown
}

const shapeCache = new Map<string, unknown>()

function getShape(emoji: string, scalar = 3): unknown {
  let shape = shapeCache.get(emoji)
  if (!shape) {
    shape = confettiWithShapeFromText.shapeFromText({ text: emoji, scalar })
    shapeCache.set(emoji, shape)
  }
  return shape
}

function shakeScreen(): void {
  document.body.classList.add('shake-big')
  window.setTimeout(() => document.body.classList.remove('shake-big'), 600)
}

function flashScreen(color: string): void {
  const el = document.createElement('div')
  Object.assign(el.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '9999',
    background: color,
    opacity: '0.6',
    transition: 'opacity 0.6s ease-out',
  })
  document.body.appendChild(el)
  requestAnimationFrame(() => {
    el.style.opacity = '0'
  })
  window.setTimeout(() => el.remove(), 650)
}

function burstExplosion(delay: number, particleCount: number, spread: number, scalar: number) {
  window.setTimeout(() => {
    confetti({
      particleCount,
      startVelocity: 45,
      gravity: 0.8,
      spread,
      ticks: 120,
      origin: { y: 0.5, x: 0.5 },
      shapes: [getShape('💥', scalar), getShape('🔥', scalar)] as never,
      scalar,
    })
  }, delay)
}

/** Bomb explosion for a fail (1), sad rain for a near-fail (2), confetti scaled by grade for 3-5. */
export function celebrateGrade(grade: Grade): void {
  if (grade === 1) {
    shakeScreen()
    flashScreen(GRADE_COLORS[1])
    burstExplosion(0, 40, 360, 4)
    burstExplosion(120, 30, 360, 3.5)
    burstExplosion(260, 20, 260, 3)
    return
  }
  if (grade === 2) {
    flashScreen('#8FA3C4')
    confetti({
      particleCount: 30,
      startVelocity: 25,
      gravity: 0.7,
      spread: 70,
      ticks: 200,
      origin: { y: 0.6, x: 0.5 },
      shapes: [getShape('😢', 3.5), getShape('💧', 2.5)] as never,
      scalar: 3,
    })
    return
  }
  confetti({
    particleCount: grade >= 4 ? 90 : 40,
    spread: 70,
    startVelocity: grade >= 4 ? 45 : 35,
    origin: { y: 0.6 },
    colors: [GRADE_COLORS[1], GRADE_COLORS[2], GRADE_COLORS[3], GRADE_COLORS[4], GRADE_COLORS[5]],
  })
  if (grade === 5) {
    window.setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        startVelocity: 40,
        origin: { y: 0.6 },
        colors: [GRADE_COLORS[4], GRADE_COLORS[5], '#FFD93D'],
      })
    }, 150)
  }
}
