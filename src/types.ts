export type Grade = 1 | 2 | 3 | 4 | 5

export type GradeValues = Record<Grade, number>

export type StudentColor = 'grape' | 'bubblegum' | 'tangerine' | 'mint' | 'sky'
export type AvatarId = 'girl' | 'boy' | 'teen'

export interface Subject {
  id: string
  name: string
}

export interface Student {
  id: string
  name: string
  avatar: AvatarId
  color: StudentColor
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

export interface AppData {
  subjects: Subject[]
  students: Student[]
  assignments: Assignment[]
  monthlyGrades: MonthlyGrade[]
}
