// One-off import: adds Anna's real school timetable (from a photo) into
// Firestore — creates any missing subjects, assignments (default 0 Ft
// values, reusing existing assignments/subjects where they already exist),
// and the Monday-Friday timetable entries.
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
if (!serviceAccountJson) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT env var')
  process.exit(1)
}

initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) })
const db = getFirestore()

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

// dayOfWeek: 1=Hétfő .. 5=Péntek. Real bell schedule (Soskúti iskola).
const PERIOD_TIMES = ['08:10', '09:05', '10:05', '11:00', '12:00']

const SCHEDULE = {
  1: ['Matek', 'Olvasás', 'Népi j.', 'Nyelvtan', 'Tesi'],
  2: ['Matek', 'Olvasás', 'Infó', 'Ének/Szolfézs', 'Tesi'],
  3: ['Olvasás', 'Írás', 'Angol', 'Etika/Hittan', null],
  4: ['Matek', 'Olvasás', 'Technika', 'Néptánc', 'Ének/Rajz'],
  5: ['Matek', 'Nyelvtan', 'Rajz', 'Rajz', 'Tesi'],
}

const ICONS = {
  Nyelvtan: '🗣️',
  'Népi j.': '🎭',
  Infó: '💻',
  'Ének/Szolfézs': '🎵',
  'Etika/Hittan': '🙏',
  Technika: '🔧',
  Néptánc: '💃',
  'Ének/Rajz': '🎨',
  Rajz: '🎨',
  Tesi: '🏃',
}

async function main() {
  const ref = db.doc('app/data')
  const snap = await ref.get()
  const data = snap.data()

  const anna = data.students?.find((s) => s.name === 'Anna')
  if (!anna) {
    console.error('No student named "Anna" found — aborting without changes.')
    process.exit(1)
  }

  const subjects = [...(data.subjects ?? [])]
  const assignments = [...(data.assignments ?? [])]
  const timetable = [...(data.timetable ?? [])]

  function ensureSubject(name) {
    let subject = subjects.find((s) => s.name === name)
    if (!subject) {
      subject = { id: uid(), name, icon: ICONS[name] ?? '📚' }
      subjects.push(subject)
      console.log(`Created subject: ${name}`)
    }
    return subject
  }

  function ensureAssignment(subjectId) {
    let assignment = assignments.find((a) => a.studentId === anna.id && a.subjectId === subjectId)
    if (!assignment) {
      assignment = { id: uid(), studentId: anna.id, subjectId, values: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
      assignments.push(assignment)
    }
    return assignment
  }

  let added = 0
  for (const [dayOfWeek, periods] of Object.entries(SCHEDULE)) {
    periods.forEach((name, i) => {
      if (!name) return
      const subject = ensureSubject(name)
      ensureAssignment(subject.id)
      const startTime = PERIOD_TIMES[i]
      const exists = timetable.some(
        (t) => t.studentId === anna.id && t.dayOfWeek === Number(dayOfWeek) && t.startTime === startTime,
      )
      if (exists) return
      timetable.push({ id: uid(), studentId: anna.id, subjectId: subject.id, dayOfWeek: Number(dayOfWeek), startTime })
      added++
    })
  }

  await ref.update({ subjects, assignments, timetable })
  console.log(`Done — added ${added} timetable entries for Anna.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
