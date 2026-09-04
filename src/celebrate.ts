import confetti from 'canvas-confetti'
import type { Grade } from './types'
import { GRADE_COLORS } from './utils'

// canvas-confetti's runtime supports shapeFromText (used to draw emoji particles),
// but the bundled @types package doesn't declare it yet.
const confettiWithShapeFromText = confetti as unknown as {
  shapeFromText: (opts: { text: string; scalar?: number }) => unknown
}

let sadShape: unknown = null
let explosionShape: unknown = null

function getSadShape(): unknown {
  if (!sadShape) {
    sadShape = confettiWithShapeFromText.shapeFromText({ text: '😢', scalar: 3 })
  }
  return sadShape
}

function getExplosionShape(): unknown {
  if (!explosionShape) {
    explosionShape = confettiWithShapeFromText.shapeFromText({ text: '💥', scalar: 3 })
  }
  return explosionShape
}

function shakeScreen(): void {
  document.body.classList.add('shake')
  window.setTimeout(() => document.body.classList.remove('shake'), 400)
}

/** Bomb explosion for a fail (1), sad faces for a near-fail (2), confetti scaled by grade for 3-5. */
export function celebrateGrade(grade: Grade): void {
  if (grade === 1) {
    shakeScreen()
    confetti({
      particleCount: 24,
      startVelocity: 35,
      gravity: 0.9,
      spread: 360,
      ticks: 100,
      origin: { y: 0.5, x: 0.5 },
      shapes: [getExplosionShape()] as never,
      scalar: 1,
    })
    return
  }
  if (grade === 2) {
    confetti({
      particleCount: 16,
      startVelocity: 8,
      gravity: 0.5,
      spread: 50,
      ticks: 150,
      origin: { y: -0.05, x: 0.5 },
      shapes: [getSadShape()] as never,
      scalar: 1,
    })
    return
  }
  confetti({
    particleCount: grade >= 4 ? 60 : 24,
    spread: 65,
    origin: { y: 0.6 },
    colors: [GRADE_COLORS[1], GRADE_COLORS[2], GRADE_COLORS[3], GRADE_COLORS[4], GRADE_COLORS[5]],
  })
}
