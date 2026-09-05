export type Grade = 1 | 2 | 3 | 4 | 5

export type GradeValues = Record<Grade, number>

export type StudentColor = 'grape' | 'bubblegum' | 'tangerine' | 'mint' | 'sky'
export type AvatarId = 'girl' | 'boy' | 'teen'

export interface Subject {
  id: string
  name: string
  icon: string
}

export interface Student {
  id: string
  name: string
  avatar: AvatarId
  color: StudentColor
  /** Fixed monthly allowance (Ft), independent of grades — grade-based payout adds on top. */
  baseAllowance: number
}

/** A subject assigned to a student, with its own grade -> Ft reward table. */
export interface Assignment {
  id: string
  studentId: string
  subjectId: string
  values: GradeValues
}

/** One recorded grade for a given assignment in a given month (yyyy-mm). */
export interface MonthlyGrade {
  id: string
  assignmentId: string
  month: string
  grade: Grade
}

/** A weekly-recurring event slot for a student (training, foci, tánc, etc.). */
export interface Activity {
  id: string
  studentId: string
  name: string
  icon: string
  dayOfWeek: number // 0=Sunday .. 6=Saturday, matching Date.getDay()
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
}

/** A weekly-recurring school class period, built from the student's already-assigned subjects. */
export interface TimetableEntry {
  id: string
  studentId: string
  subjectId: string
  dayOfWeek: number // 1=Monday .. 5=Friday
  startTime: string // "HH:MM"
}

export type AbsenceReason = 'sick' | 'medical' | 'family' | 'other'

/** A logged absence/illness day for a student, for later look-back. */
export interface Absence {
  id: string
  studentId: string
  date: string // "yyyy-mm-dd"
  reason: AbsenceReason
  note?: string
}

/** An ad-hoc one-off bonus payout on a specific date (e.g. a contest win), parent-defined. */
export interface Bonus {
  id: string
  studentId: string
  date: string // "yyyy-mm-dd"
  description: string
  amount: number
}

export interface AppData {
  subjects: Subject[]
  students: Student[]
  assignments: Assignment[]
  monthlyGrades: MonthlyGrade[]
  activities: Activity[]
  timetable: TimetableEntry[]
  absences: Absence[]
  bonuses: Bonus[]
  /** Minutes before an activity's start time to send a push reminder (0 = at start time). */
  notificationLeadMinutes: number
}
