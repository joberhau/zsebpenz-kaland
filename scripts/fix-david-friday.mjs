// One-off correction: Dávid's Péntek schedule is Tesi, Matek, Magyar, Magyar, Szolfézs
// (periods 1-5). Renames the "Szolf" subject to "Szolfézs" and fills in the
// missing Matek/Magyar periods.
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

const PERIOD_TIMES = ['08:10', '09:05', '10:05', '11:00', '12:00']
const FRIDAY_SCHEDULE = ['Tesi', 'Matek', 'Magyar', 'Magyar', 'Szolfézs']

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
  let timetable = [...(data.timetable ?? [])]

  // Rename "Szolf" -> "Szolfézs" if it exists.
  const szolf = subjects.find((s) => s.name === 'Szolf')
  if (szolf) {
    szolf.name = 'Szolfézs'
    console.log('Renamed subject: Szolf -> Szolfézs')
  }

  function ensureSubject(name) {
    let subject = subjects.find((s) => s.name === name)
    if (!subject) {
      subject = { id: uid(), name, icon: '📚' }
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

  // Remove all existing Friday (5) entries for Dávid, then rebuild from the corrected schedule.
  timetable = timetable.filter((t) => !(t.studentId === david.id && t.dayOfWeek === 5))

  FRIDAY_SCHEDULE.forEach((name, i) => {
    const subject = ensureSubject(name)
    ensureAssignment(subject.id)
    timetable.push({ id: uid(), studentId: david.id, subjectId: subject.id, dayOfWeek: 5, startTime: PERIOD_TIMES[i] })
  })

  await ref.update({ subjects, assignments, timetable })
  console.log('Done — Péntek fixed for Dávid.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
