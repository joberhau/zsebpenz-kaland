import { useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import type { Assignment, Grade, MonthlyGrade, StudentColor, Subject } from '../types'
import { uid } from '../storage'
import {
  GRADE_COLORS,
  STUDENT_COLORS,
  assignmentValue,
  currentMonthKey,
  formatHuf,
  formatMonthLabel,
  gradeForAssignment,
  monthsWithData,
  shiftMonth,
  studentMonthTotal,
} from '../utils'

interface MonthlyGradesProps {
  studentId: string
  color: StudentColor
  subjects: Subject[]
  assignments: Assignment[]
  monthlyGrades: MonthlyGrade[]
  onChange: (monthlyGrades: MonthlyGrade[]) => void
}

const GRADES: Grade[] = [1, 2, 3, 4, 5]

export default function MonthlyGrades({
  studentId,
  color,
  subjects,
  assignments,
  monthlyGrades,
  onChange,
}: MonthlyGradesProps) {
  const studentAssignments = assignments.filter((a) => a.studentId === studentId)
  const months = useMemo(
    () => monthsWithData(monthlyGrades, studentAssignments.map((a) => a.id)),
    [monthlyGrades, studentAssignments],
  )
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey())
  const colors = STUDENT_COLORS[color]
  const total = studentMonthTotal(assignments, monthlyGrades, studentId, selectedMonth)

  function setGrade(assignmentId: string, grade: Grade) {
    const existing = gradeForAssignment(monthlyGrades, assignmentId, selectedMonth)
    if (existing) {
      onChange(monthlyGrades.map((g) => (g.id === existing.id ? { ...g, grade } : g)))
    } else {
      const entry: MonthlyGrade = { id: uid(), assignmentId, month: selectedMonth, grade }
      onChange([...monthlyGrades, entry])
    }
    confetti({
      particleCount: grade >= 4 ? 60 : 24,
      spread: 65,
      origin: { y: 0.6 },
      colors: [GRADE_COLORS[1], GRADE_COLORS[2], GRADE_COLORS[3], GRADE_COLORS[4], GRADE_COLORS[5]],
    })
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-800">Havi eredmény rögzítése 📝</h3>
            <p className="text-sm text-slate-400">
              A hónap elején írd be az elért jegyet minden tantárgynál.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-1 py-1">
            <button
              onClick={() => setSelectedMonth((m) => shiftMonth(m, -1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white font-bold"
              title="Előző hónap"
            >
              ‹
            </button>
            <span className="px-2 text-sm font-semibold text-slate-700 min-w-[7.5rem] text-center">
              {formatMonthLabel(selectedMonth)}
            </span>
            <button
              onClick={() => setSelectedMonth((m) => shiftMonth(m, 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white font-bold"
              title="Következő hónap"
            >
              ›
            </button>
          </div>
        </div>

        {studentAssignments.length === 0 ? (
          <p className="text-slate-400">
            Ehhez a tanulóhoz még nincs tantárgy hozzárendelve. Állítsd be a "Tantárgyaim" fülön!
          </p>
        ) : (
          <ul className="space-y-3">
            {studentAssignments.map((assignment) => {
              const subject = subjects.find((s) => s.id === assignment.subjectId)
              const current = gradeForAssignment(monthlyGrades, assignment.id, selectedMonth)
              const value = assignmentValue(assignment, monthlyGrades, selectedMonth)
              return (
                <li key={assignment.id} className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2.5 gap-2">
                    <span className="font-semibold text-slate-700 truncate">
                      {subject?.name ?? '(törölt tantárgy)'}
                    </span>
                    <span className="font-display font-bold text-slate-600 shrink-0">
                      {current ? formatHuf(value) : '—'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mb-1.5 ml-0.5">Érdemjegy</div>
                  <div className="flex gap-2">
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(assignment.id, g)}
                        className="flex-1 py-2.5 rounded-xl font-display font-extrabold text-white btn-pop"
                        style={{
                          backgroundColor: GRADE_COLORS[g],
                          outline: current?.grade === g ? '3px solid #3A2E4D' : 'none',
                          outlineOffset: 2,
                          opacity: current && current.grade !== g ? 0.55 : 1,
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className={`rounded-3xl ${colors.bg} border-4 ${colors.border} px-6 py-5 flex items-center justify-between flex-wrap gap-2`}>
        <span className="font-semibold text-slate-600">Összesen {formatMonthLabel(selectedMonth)}</span>
        <span className={`font-display text-3xl font-extrabold ${colors.text}`}>{formatHuf(total)}</span>
      </div>

      {months.length > 1 && (
        <div className="bg-white rounded-3xl border-4 border-slate-100 p-5">
          <h4 className="font-display font-bold text-slate-700 mb-2 text-sm">Korábbi hónapok</h4>
          <ul className="text-sm divide-y divide-slate-100">
            {months
              .filter((m) => m !== selectedMonth)
              .map((m) => (
                <li key={m} className="flex items-center justify-between py-2">
                  <button onClick={() => setSelectedMonth(m)} className="text-slate-500 hover:text-grape font-semibold">
                    {formatMonthLabel(m)}
                  </button>
                  <span className="font-semibold text-slate-700">
                    {formatHuf(studentMonthTotal(assignments, monthlyGrades, studentId, m))}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
