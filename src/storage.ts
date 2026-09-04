import type { AppData, Assignment, Student, Subject } from './types'

const STORAGE_KEY = 'zsebpenz-kaland-data-v2'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function seedData(): AppData {
  const subjects: Subject[] = [
    { id: uid(), name: 'Matek' },
    { id: uid(), name: 'Írás' },
    { id: uid(), name: 'Olvasás' },
    { id: uid(), name: 'Angol' },
  ]
  const [matek, iras, olvasas, angol] = subjects

  const anna: Student = { id: uid(), name: 'Anna', avatar: 'girl', color: 'bubblegum' }

  const assignments: Assignment[] = [
    { id: uid(), studentId: anna.id, subjectId: matek.id, values: { 1: 0, 2: 0, 3: 0, 4: 500, 5: 1000 } },
    { id: uid(), studentId: anna.id, subjectId: iras.id, values: { 1: 0, 2: 0, 3: 0, 4: 500, 5: 1000 } },
    { id: uid(), studentId: anna.id, subjectId: olvasas.id, values: { 1: 0, 2: 0, 3: 0, 4: 250, 5: 500 } },
    { id: uid(), studentId: anna.id, subjectId: angol.id, values: { 1: 0, 2: 0, 3: 0, 4: 250, 5: 500 } },
  ]

  return { subjects, students: [anna], assignments, monthlyGrades: [] }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedData()
      saveData(seeded)
      return seeded
    }
    return JSON.parse(raw) as AppData
  } catch {
    return seedData()
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export { uid }
