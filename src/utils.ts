import type { Activity, Assignment, MonthlyGrade, StudentColor } from './types'

export function formatHuf(amount: number): string {
  return new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(amount) + ' Ft'
}

/** Compact number without the "Ft" suffix, for tight spaces like mini timelines. */
export function formatHufCompact(amount: number): string {
  return new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(amount)
}

export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7)
}

const MONTH_NAMES = [
  'január', 'február', 'március', 'április', 'május', 'június',
  'július', 'augusztus', 'szeptember', 'október', 'november', 'december',
]

export function formatMonthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${y}. ${MONTH_NAMES[m - 1]}`
}

export function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1 + delta, 1))
  return date.toISOString().slice(0, 7)
}

export function studentAssignments(assignments: Assignment[], studentId: string): Assignment[] {
  return assignments.filter((a) => a.studentId === studentId)
}

export function gradeForAssignment(
  monthlyGrades: MonthlyGrade[],
  assignmentId: string,
  month: string,
): MonthlyGrade | undefined {
  return monthlyGrades.find((g) => g.assignmentId === assignmentId && g.month === month)
}

export function assignmentValue(assignment: Assignment, monthlyGrades: MonthlyGrade[], month: string): number {
  const entry = gradeForAssignment(monthlyGrades, assignment.id, month)
  if (!entry) return 0
  return assignment.values[entry.grade] ?? 0
}

export function gradeBasedTotal(
  assignments: Assignment[],
  monthlyGrades: MonthlyGrade[],
  studentId: string,
  month: string,
): number {
  return studentAssignments(assignments, studentId).reduce(
    (sum, a) => sum + assignmentValue(a, monthlyGrades, month),
    0,
  )
}

export function studentMonthTotal(
  assignments: Assignment[],
  monthlyGrades: MonthlyGrade[],
  studentId: string,
  month: string,
  baseAllowance = 0,
): number {
  return baseAllowance + gradeBasedTotal(assignments, monthlyGrades, studentId, month)
}

export function monthsWithData(monthlyGrades: MonthlyGrade[], assignmentIds: string[]): string[] {
  const relevant = new Set(assignmentIds)
  const keys = new Set(monthlyGrades.filter((g) => relevant.has(g.assignmentId)).map((g) => g.month))
  keys.add(currentMonthKey())
  return Array.from(keys).sort().reverse()
}

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec',
]

export function formatMonthShort(key: string): string {
  const m = Number(key.split('-')[1])
  return MONTH_NAMES_SHORT[m - 1]
}

/** yyyy-mm keys for January through December of the given year (defaults to the current year). */
export function monthsOfYear(year: number = new Date().getFullYear()): string[] {
  return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`)
}

export const STUDENT_COLORS: Record<StudentColor, { bg: string; border: string; text: string; solid: string }> = {
  grape: { bg: 'bg-grape/10', border: 'border-grape', text: 'text-grape', solid: 'bg-grape' },
  bubblegum: { bg: 'bg-bubblegum/10', border: 'border-bubblegum', text: 'text-bubblegum', solid: 'bg-bubblegum' },
  tangerine: { bg: 'bg-tangerine/10', border: 'border-tangerine', text: 'text-tangerine', solid: 'bg-tangerine' },
  mint: { bg: 'bg-mint/10', border: 'border-mint', text: 'text-mint', solid: 'bg-mint' },
  sky: { bg: 'bg-sky/10', border: 'border-sky', text: 'text-sky', solid: 'bg-sky' },
}

export const GRADE_COLORS: Record<number, string> = {
  1: '#FF5D6C',
  2: '#FF9F45',
  3: '#FFD93D',
  4: '#8CE99A',
  5: '#3DDC97',
}

export const STUDENT_EMOJIS = ['🦄', '🐯', '🐼', '🦊', '🐸', '🐵', '🐨', '🦁', '🐶', '🐱', '🐰', '🦋']

export const DAY_NAMES = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']
export const DAY_NAMES_SHORT = ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo']
/** Display order for a Monday-first weekly view (values are Date.getDay() indices). */
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
/** School week: Monday through Friday only. */
export const SCHOOL_DAY_ORDER = [1, 2, 3, 4, 5]

export function todayDayOfWeek(): number {
  return new Date().getDay()
}

export function studentActivities(activities: Activity[], studentId: string): Activity[] {
  return activities.filter((a) => a.studentId === studentId)
}

export function todaysActivities(activities: Activity[], studentId: string): Activity[] {
  const today = todayDayOfWeek()
  return studentActivities(activities, studentId)
    .filter((a) => a.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export const ACTIVITY_ICONS = [
  '⚽', '🏀', '🎾', '🏊', '🩰', '🎨', '🎹', '🥋', '🏓', '🚴', '🏸', '♟️', '🎤', '🎭', '🧗', '🏒',
]

