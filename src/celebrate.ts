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

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

const FIREWORK_COLORS = ['#FFD93D', '#FF5DA2', '#3DDC97', '#3DB2FF', '#7C4DFF', '#FF9F45']

/** Classic randomized-burst fireworks display, fired across the sky for ~1.8s. */
function fireworks(): void {
  const duration = 1800
  const end = Date.now() + duration
  const interval = window.setInterval(() => {
    const timeLeft = end - Date.now()
    if (timeLeft <= 0) {
      window.clearInterval(interval)
      return
    }
    const particleCount = Math.round(45 * (timeLeft / duration))
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 70,
      gravity: 0.7,
      origin: { x: randomInRange(0.1, 0.35), y: randomInRange(0.1, 0.5) },
      colors: FIREWORK_COLORS,
    })
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 70,
      gravity: 0.7,
      origin: { x: randomInRange(0.65, 0.9), y: randomInRange(0.1, 0.5) },
      colors: FIREWORK_COLORS,
    })
  }, 220)
}

/** Bomb explosion for a fail (1), sad rain for a near-fail (2), confetti for 3-4, fireworks for a 5. */
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
    window.setTimeout(fireworks, 300)
  }
}
