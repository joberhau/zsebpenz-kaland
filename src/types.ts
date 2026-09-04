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

/** A weekly-recurring training/activity slot for a student (e.g. foci, Monday 16:00-17:00). */
export interface Activity {
  id: string
  studentId: string
  name: string
  icon: string
  dayOfWeek: number // 0=Sunday .. 6=Saturday, matching Date.getDay()
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
}

export interface AppData {
  subjects: Subject[]
  students: Student[]
  assignments: Assignment[]
  monthlyGrades: MonthlyGrade[]
  activities: Activity[]
}
