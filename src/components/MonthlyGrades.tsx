import { useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import type { Assignment, Grade, MonthlyGrade, StudentColor, Subject } from '../types'
import { uid } from '../storage'
import { playGradeSound } from '../sound'
import {
  GRADE_COLORS,
  STUDENT_COLORS,
  assignmentValue,
  currentMonthKey,
  formatHuf,
  formatMonthLabel,
  formatMonthShort,
  gradeForAssignment,
  monthsOfYear,
  shiftMonth,
  studentMonthTotal,
} from '../utils'

interface MonthlyGradesProps {
  studentId: string
  color: StudentColor
  baseAllowance: number
  subjects: Subject[]
  assignments: Assignment[]
  monthlyGrades: MonthlyGrade[]
  onChange: (monthlyGrades: MonthlyGrade[]) => void
}

const GRADES: Grade[] = [1, 2, 3, 4, 5]

export default function MonthlyGrades({
  studentId,
  color,
  baseAllowance,
  subjects,
  assignments,
  monthlyGrades,
  onChange,
}: MonthlyGradesProps) {
  const studentAssignments = assignments.filter((a) => a.studentId === studentId)
  const currentYear = new Date().getFullYear()
  const yearMonths = useMemo(() => monthsOfYear(currentYear), [currentYear])
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey())
  const colors = STUDENT_COLORS[color]
  const total = studentMonthTotal(assignments, monthlyGrades, studentId, selectedMonth, baseAllowance)

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
    playGradeSound(grade)
  }

  function clearGrade(assignmentId: string) {
    const existing = gradeForAssignment(monthlyGrades, assignmentId, selectedMonth)
    if (!existing) return
    onChange(monthlyGrades.filter((g) => g.id !== existing.id))
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
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="font-display font-bold text-slate-600">
                        {current ? formatHuf(value) : '—'}
                      </span>
                      {current && (
                        <button
                          onClick={() => clearGrade(assignment.id)}
                          className="text-slate-300 hover:text-bubblegum font-bold px-1"
                          title="Jegy törlése"
                        >
                          ✕
                        </button>
                      )}
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

      <div className={`rounded-3xl ${colors.bg} border-4 ${colors.border} px-6 py-5`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-semibold text-slate-600">Összesen {formatMonthLabel(selectedMonth)}</span>
          <span className={`font-display text-3xl font-extrabold ${colors.text}`}>{formatHuf(total)}</span>
        </div>
        {baseAllowance > 0 && (
          <div className="text-xs text-slate-400 font-semibold mt-1">
            Fix: {formatHuf(baseAllowance)} + Tanulási: {formatHuf(total - baseAllowance)}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h4 className="font-display font-bold text-slate-700 mb-4 text-sm">Éves idővonal · {currentYear}</h4>
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
          {yearMonths.map((m) => {
            const isSelected = m === selectedMonth
            const isCurrent = m === currentMonthKey()
            const amount = studentMonthTotal(assignments, monthlyGrades, studentId, m, baseAllowance)
            return (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className="relative flex items-center justify-between w-full py-2 text-left"
              >
                <span
                  className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 ${
                    isSelected ? `${colors.solid} border-transparent` : 'bg-white border-slate-300'
                  }`}
                />
                <span className={`text-sm font-semibold ${isSelected ? colors.text : 'text-slate-600'}`}>
                  {formatMonthShort(m)}
                  {isCurrent && <span className="text-slate-400 font-normal"> · ma</span>}
                </span>
                <span className={`font-semibold ${amount > 0 ? 'text-slate-700' : 'text-slate-300'}`}>
                  {formatHuf(amount)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
