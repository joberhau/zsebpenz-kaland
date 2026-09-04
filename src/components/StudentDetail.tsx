import { useState } from 'react'
import type { AppData } from '../types'
import { STUDENT_COLORS, bonusMonthTotal, currentMonthKey, formatHuf, gradeBasedTotal, studentMonthTotal } from '../utils'
import { printSubjectTable, printTimetable } from '../print'
import { Avatar } from './Avatars'
import AssignmentsEditor from './AssignmentsEditor'
import MonthlyGrades from './MonthlyGrades'
import ActivitiesSchedule from './ActivitiesSchedule'
import Timetable from './Timetable'
import AbsenceLog from './AbsenceLog'
import BonusLog from './BonusLog'

interface StudentDetailProps {
  studentId: string
  data: AppData
  onBack: () => void
  onUpdateData: (patch: Partial<AppData>) => void
  onDeleteStudent: () => void
}

type Tab = 'grades' | 'subjects' | 'activities' | 'timetable' | 'absences' | 'bonus'

export default function StudentDetail({ studentId, data, onBack, onUpdateData, onDeleteStudent }: StudentDetailProps) {
  const [tab, setTab] = useState<Tab>('grades')
  const student = data.students.find((s) => s.id === studentId)
  if (!student) return null

  const colors = STUDENT_COLORS[student.color]
  const baseAllowance = student.baseAllowance ?? 0
  const month = currentMonthKey()
  const grades = gradeBasedTotal(data.assignments, data.monthlyGrades, studentId, month)
  const bonus = bonusMonthTotal(data.bonuses, studentId, month)
  const total = studentMonthTotal(data.assignments, data.monthlyGrades, studentId, month, baseAllowance, data.bonuses)

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
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => printSubjectTable(student, data.subjects, data.assignments)}
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
          {(baseAllowance > 0 || bonus !== 0) && (
            <div className="text-xs text-slate-400 font-semibold mt-1">
              Fix: {formatHuf(baseAllowance)} + Tanulási: {formatHuf(grades)}
              {bonus !== 0 && ` ${bonus > 0 ? '+' : ''}${formatHuf(bonus)} (bónusz/levonás)`}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl border-4 border-slate-100 w-fit overflow-x-auto max-w-full">
          <button
            onClick={() => setTab('grades')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors shrink-0 ${
              tab === 'grades' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Havi eredmény 📝
          </button>
          <button
            onClick={() => setTab('subjects')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors shrink-0 ${
              tab === 'subjects' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Tantárgyaim 📚
          </button>
          <button
            onClick={() => setTab('activities')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors shrink-0 ${
              tab === 'activities' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Események 📅
          </button>
          <button
            onClick={() => setTab('timetable')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors shrink-0 ${
              tab === 'timetable' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Órarend 📐
          </button>
          <button
            onClick={() => setTab('absences')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors shrink-0 ${
              tab === 'absences' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Hiányzások 🤒
          </button>
          <button
            onClick={() => setTab('bonus')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold transition-colors shrink-0 ${
              tab === 'bonus' ? `${colors.solid} text-white` : 'text-slate-500'
            }`}
          >
            Bónusz 🌟
          </button>
        </div>

        {tab === 'grades' && (
          <MonthlyGrades
            studentId={studentId}
            color={student.color}
            baseAllowance={baseAllowance}
            bonuses={data.bonuses}
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
        {tab === 'timetable' && (
          <Timetable
            studentId={studentId}
            subjects={data.subjects}
            assignments={data.assignments}
            timetable={data.timetable}
            onChange={(timetable) => onUpdateData({ timetable })}
            onPrint={() => printTimetable(student, data.subjects, data.timetable)}
          />
        )}
        {tab === 'absences' && (
          <AbsenceLog
            studentId={studentId}
            absences={data.absences}
            onChange={(absences) => onUpdateData({ absences })}
          />
        )}
        {tab === 'bonus' && (
          <BonusLog
            studentId={studentId}
            bonuses={data.bonuses}
            onChange={(bonuses) => onUpdateData({ bonuses })}
          />
        )}
      </main>
    </div>
  )
}
