import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { AppData, Assignment, Student, Subject } from './types'

const DOC_REF = doc(db, 'app', 'data')

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function seedData(): AppData {
  const subjects: Subject[] = [
    { id: uid(), name: 'Matek', icon: '🧮' },
    { id: uid(), name: 'Írás', icon: '✍️' },
    { id: uid(), name: 'Olvasás', icon: '📖' },
    { id: uid(), name: 'Angol', icon: '🌍' },
  ]
  const [matek, iras, olvasas, angol] = subjects

  const anna: Student = { id: uid(), name: 'Anna', avatar: 'girl', color: 'bubblegum', baseAllowance: 0 }

  const assignments: Assignment[] = [
    { id: uid(), studentId: anna.id, subjectId: matek.id, values: { 1: 0, 2: 0, 3: 0, 4: 500, 5: 1000 } },
    { id: uid(), studentId: anna.id, subjectId: iras.id, values: { 1: 0, 2: 0, 3: 0, 4: 500, 5: 1000 } },
    { id: uid(), studentId: anna.id, subjectId: olvasas.id, values: { 1: 0, 2: 0, 3: 0, 4: 250, 5: 500 } },
    { id: uid(), studentId: anna.id, subjectId: angol.id, values: { 1: 0, 2: 0, 3: 0, 4: 250, 5: 500 } },
  ]

  return {
    subjects,
    students: [anna],
    assignments,
    monthlyGrades: [],
    activities: [],
    timetable: [],
    absences: [],
    bonuses: [],
  }
}

function emptyData(): AppData {
  return {
    subjects: [],
    students: [],
    assignments: [],
    monthlyGrades: [],
    activities: [],
    timetable: [],
    absences: [],
    bonuses: [],
  }
}

let seedAttempted = false

/** Live-subscribes to the shared app data document; seeds example data on first ever run. */
export function subscribeData(callback: (data: AppData) => void): () => void {
  return onSnapshot(DOC_REF, (snap) => {
    if (snap.exists()) {
      const raw = snap.data() as Partial<AppData>
      callback({
        subjects: raw.subjects ?? [],
        students: raw.students ?? [],
        assignments: raw.assignments ?? [],
        monthlyGrades: raw.monthlyGrades ?? [],
        activities: raw.activities ?? [],
        timetable: raw.timetable ?? [],
        absences: raw.absences ?? [],
        bonuses: raw.bonuses ?? [],
      })
    } else {
      callback(emptyData())
      if (!seedAttempted) {
        seedAttempted = true
        setDoc(DOC_REF, seedData()).catch(() => {
          seedAttempted = false
        })
      }
    }
  })
}

export async function saveData(data: AppData): Promise<void> {
  await setDoc(DOC_REF, data)
}

export { uid }
