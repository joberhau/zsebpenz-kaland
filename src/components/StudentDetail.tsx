import { useState } from 'react'
import type { AppData } from '../types'
import { STUDENT_COLORS, currentMonthKey, formatHuf, gradeBasedTotal, studentMonthTotal } from '../utils'
import { Avatar } from './Avatars'
import AssignmentsEditor from './AssignmentsEditor'
import MonthlyGrades from './MonthlyGrades'
import ActivitiesSchedule from './ActivitiesSchedule'
import PrintableSubjectTable from './PrintableSubjectTable'

interface StudentDetailProps {
  studentId: string
  data: AppData
  onBack: () => void
  onUpdateData: (patch: Partial<AppData>) => void
  onDeleteStudent: () => void
}

type Tab = 'grades' | 'subjects' | 'activities'

export default function StudentDetail({ studentId, data, onBack, onUpdateData, onDeleteStudent }: StudentDetailProps) {
  const [tab, setTab] = useState<Tab>('grades')
  const student = data.students.find((s) => s.id === studentId)
  if (!student) return null

  const colors = STUDENT_COLORS[student.color]
  const baseAllowance = student.baseAllowance ?? 0
  const month = currentMonthKey()
  const grades = gradeBasedTotal(data.assignments, data.monthlyGrades, studentId, month)
  const total = studentMonthTotal(data.assignments, data.monthlyGrades, studentId, month, baseAllowance)

  return (
    <div>
      <div className="print:hidden">
      <header className={`px-5 py-4 sticky top-0 z-10 bg-white border-b-4 ${colors.border}`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-slate-600 text-xl font-bold px-1 shrink-0"
              title="Vissza"
            >
              ←
            </button>
            <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center overflow-hidden shrink-0`}>
              <Avatar id={student.avatar} size={40} />
            </div>
            <h1 className="font-display text-lg font-extrabold text-slate-800 truncate">{student.name}</h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => window.print()}
              className="text-sm font-semibold text-slate-400 hover:text-grape"
              title="Jegyértékek nyomtatása"
            >
              🖨️ Nyomtatás
            </button>
            <button
              onClick={() => {
                if (confirm(`Biztosan törlöd ${student.name} adatait?`)) onDeleteStudent()
              }}
              className="text-sm font-semibold text-slate-400 hover:text-bubblegum"
            >
              Törlés
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">
        <div className={`rounded-3xl ${colors.bg} border-4 ${colors.border} px-6 py-5 mb-6`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-slate-600">E havi összegyűjtött zsebpénz</span>
            <span className={`font-display text-3xl font-extrabold ${colors.text}`}>{formatHuf(total)}</span>
          </div>
          {baseAllowance > 0 && (
            <div className="text-xs text-slate-400 font-semibold mt-1">
              Fix: {formatHuf(baseAllowance)} + Tanulási: {formatHuf(grades)}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl border-4 border-slate-100 w-fit">
          <button
            onClick={() => setTab('grades')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors ${
              tab === 'grades' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Havi eredmény 📝
          </button>
          <button
            onClick={() => setTab('subjects')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors ${
              tab === 'subjects' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Tantárgyaim 📚
          </button>
          <button
            onClick={() => setTab('activities')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors ${
              tab === 'activities' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Edzések 🏃
          </button>
        </div>

        {tab === 'grades' && (
          <MonthlyGrades
            studentId={studentId}
            color={student.color}
            baseAllowance={baseAllowance}
            subjects={data.subjects}
            assignments={data.assignments}
            monthlyGrades={data.monthlyGrades}
            onChange={(monthlyGrades) => onUpdateData({ monthlyGrades })}
          />
        )}
        {tab === 'subjects' && (
          <AssignmentsEditor
            studentId={studentId}
            subjects={data.subjects}
            assignments={data.assignments}
            onChange={(assignments) => onUpdateData({ assignments })}
          />
        )}
        {tab === 'activities' && (
          <ActivitiesSchedule
            studentId={studentId}
            activities={data.activities}
            onChange={(activities) => onUpdateData({ activities })}
          />
        )}
      </main>
      </div>

      <PrintableSubjectTable student={student} subjects={data.subjects} assignments={data.assignments} />
    </div>
  )
}
