import confetti from 'canvas-confetti'
import type { Grade } from './types'
import { GRADE_COLORS } from './utils'

// canvas-confetti's runtime supports shapeFromText (used to draw emoji particles),
// but the bundled @types package doesn't declare it yet.
const confettiWithShapeFromText = confetti as unknown as {
  shapeFromText: (opts: { text: string; scalar?: number }) => unknown
}

let sadShape: unknown = null

function getSadShape(): unknown {
  if (!sadShape) {
    sadShape = confettiWithShapeFromText.shapeFromText({ text: '😢', scalar: 3 })
  }
  return sadShape
}

/** Confetti for a good grade (4-5), a light burst for an average one (3), sad faces falling for a bad one (1-2). */
export function celebrateGrade(grade: Grade): void {
  if (grade <= 2) {
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
