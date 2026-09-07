// One-off import: adds Dávid's Kedd-Péntek school timetable (from a photo,
// Hétfő already entered manually) into Firestore — creates any missing
// subjects/assignments and the timetable entries. "Foci" entries are
// skipped per instruction. Best-effort reading of a child's handwriting —
// entries can be corrected afterward via the in-app timetable editor.
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

// Real bell schedule (Soskúti iskola).
const PERIOD_TIMES = ['08:10', '09:05', '10:05', '11:00', '12:00', '13:00', '14:00']

// dayOfWeek: 2=Kedd .. 5=Péntek. Hétfő already entered by the parent.
const SCHEDULE = {
  2: ['Népi j.', 'Matek', 'Rajz', 'Rajz', 'Magyar'],
  3: ['Magyar', 'Angol', 'Tesi', 'Köri', 'Ének'],
  4: ['Matek', 'Magyar', 'Magyar', 'Hittan', 'Tesi', 'Infó'],
  5: ['Tesi', null, null, 'Magyar', 'Szolf'],
}

const ICONS = {
  Matek: '🧮',
  Magyar: '📖',
  Angol: '🌍',
  Tesi: '🏃',
  'Népi j.': '🎭',
  Rajz: '🎨',
  Köri: '🌱',
  Ének: '🎵',
  Hittan: '🙏',
  Infó: '💻',
  Szolf: '🎵',
}

async function main() {
  const ref = db.doc('app/data')
  const snap = await ref.get()
  const data = snap.data()

  const david = data.students?.find((s) => s.name === 'Dávid')
  if (!david) {
    console.error('No student named "Dávid" found — aborting without changes.')
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
    let assignment = assignments.find((a) => a.studentId === david.id && a.subjectId === subjectId)
    if (!assignment) {
      assignment = { id: uid(), studentId: david.id, subjectId, values: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
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
        (t) => t.studentId === david.id && t.dayOfWeek === Number(dayOfWeek) && t.startTime === startTime,
      )
      if (exists) return
      timetable.push({ id: uid(), studentId: david.id, subjectId: subject.id, dayOfWeek: Number(dayOfWeek), startTime })
      added++
    })
  }

  await ref.update({ subjects, assignments, timetable })
  console.log(`Done — added ${added} timetable entries for Dávid.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
