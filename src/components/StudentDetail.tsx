import { useState } from 'react'
import type { AppData } from '../types'
import { STUDENT_COLORS, currentMonthKey, formatHuf, studentMonthTotal } from '../utils'
import { Avatar } from './Avatars'
import AssignmentsEditor from './AssignmentsEditor'
import MonthlyGrades from './MonthlyGrades'

interface StudentDetailProps {
  studentId: string
  data: AppData
  onBack: () => void
  onUpdateData: (patch: Partial<AppData>) => void
  onDeleteStudent: () => void
}

type Tab = 'grades' | 'subjects'

export default function StudentDetail({ studentId, data, onBack, onUpdateData, onDeleteStudent }: StudentDetailProps) {
  const [tab, setTab] = useState<Tab>('grades')
  const student = data.students.find((s) => s.id === studentId)
  if (!student) return null

  const colors = STUDENT_COLORS[student.color]
  const total = studentMonthTotal(data.assignments, data.monthlyGrades, studentId, currentMonthKey())

  return (
    <div>
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
          <button
            onClick={() => {
              if (confirm(`Biztosan törlöd ${student.name} adatait?`)) onDeleteStudent()
            }}
            className="text-sm font-semibold text-slate-400 hover:text-bubblegum shrink-0"
          >
            Törlés
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">
        <div className={`rounded-3xl ${colors.bg} border-4 ${colors.border} px-6 py-5 mb-6 flex items-center justify-between flex-wrap gap-2`}>
          <span className="font-semibold text-slate-600">E havi összegyűjtött zsebpénz</span>
          <span className={`font-display text-3xl font-extrabold ${colors.text}`}>{formatHuf(total)}</span>
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
        </div>

        {tab === 'grades' ? (
          <MonthlyGrades
            studentId={studentId}
            color={student.color}
            subjects={data.subjects}
            assignments={data.assignments}
            monthlyGrades={data.monthlyGrades}
            onChange={(monthlyGrades) => onUpdateData({ monthlyGrades })}
          />
        ) : (
          <AssignmentsEditor
            studentId={studentId}
            subjects={data.subjects}
            assignments={data.assignments}
            onChange={(assignments) => onUpdateData({ assignments })}
          />
        )}
      </main>
    </div>
  )
}
