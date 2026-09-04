import { useState } from 'react'
import type { AppData } from '../types'
import {
  STUDENT_COLORS,
  currentMonthKey,
  formatHuf,
  formatMonthLabel,
  gradeBasedTotal,
  shiftMonth,
  studentMonthTotal,
  todaysActivities,
} from '../utils'
import { Avatar } from './Avatars'

interface OverviewProps {
  data: AppData
  onSelectStudent: (id: string) => void
  onLogout: () => void
}

export default function Overview({ data, onSelectStudent, onLogout }: OverviewProps) {
  const [month, setMonth] = useState(currentMonthKey())

  return (
    <div>
      <header className="bg-white border-b-4 border-lemon px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🦄💰</span>
          <h1 className="font-display text-lg sm:text-2xl font-extrabold text-grape">Zsebpénz Kaland</h1>
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-semibold text-slate-500 hover:text-bubblegum transition-colors"
        >
          Kilépés
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-800">Szia! 👋</h2>
            <p className="text-slate-500">A tanulóid havi állása</p>
          </div>
          <div className="flex items-center gap-1 bg-white border-2 border-slate-200 rounded-xl px-1 py-1">
            <button
              onClick={() => setMonth((m) => shiftMonth(m, -1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold"
              title="Előző hónap"
            >
              ‹
            </button>
            <span className="px-2 text-sm font-semibold text-slate-700 min-w-[7.5rem] text-center">
              {formatMonthLabel(month)}
            </span>
            <button
              onClick={() => setMonth((m) => shiftMonth(m, 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold"
              title="Következő hónap"
            >
              ›
            </button>
          </div>
        </div>

        {data.students.length === 0 ? (
          <div className="bg-white rounded-3xl border-4 border-dashed border-slate-200 p-10 text-center">
            <div className="text-5xl mb-3">🧸</div>
            <p className="text-slate-500 font-semibold">Még nincs felvéve tanuló.</p>
            <p className="text-slate-400 text-sm">Ugorj a "Tanulók" fülre a felvitelhez!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {data.students.map((student) => {
              const c = STUDENT_COLORS[student.color]
              const baseAllowance = student.baseAllowance ?? 0
              const grades = gradeBasedTotal(data.assignments, data.monthlyGrades, student.id, month)
              const total = studentMonthTotal(
                data.assignments,
                data.monthlyGrades,
                student.id,
                month,
                baseAllowance,
              )
              const subjectCount = data.assignments.filter((a) => a.studentId === student.id).length
              const todayActivities = todaysActivities(data.activities, student.id)
              return (
                <button
                  key={student.id}
                  onClick={() => onSelectStudent(student.id)}
                  className={`text-left bg-white rounded-3xl border-4 ${c.border} p-5 shadow-pop btn-pop`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-16 h-16 rounded-2xl ${c.bg} flex items-center justify-center overflow-hidden`}>
                      <Avatar id={student.avatar} size={56} />
                    </div>
                    <div>
                      <div className="font-display text-lg font-bold text-slate-800">{student.name}</div>
                      <div className="text-xs text-slate-400 font-semibold">{subjectCount} tantárgy</div>
                    </div>
                  </div>
                  {todayActivities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {todayActivities.map((a) => (
                        <span
                          key={a.id}
                          className="inline-flex items-center gap-1 bg-lemon/30 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                        >
                          {a.icon} {a.name} · {a.startTime}
                        </span>
                      ))}
                    </div>
                  )}
                  {baseAllowance > 0 ? (
                    <div className={`rounded-2xl ${c.bg} px-4 py-3 space-y-1`}>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span>Fix</span>
                        <span>{formatHuf(baseAllowance)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span>Eredményekből</span>
                        <span>{formatHuf(grades)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-black/10">
                        <span className="text-sm font-semibold text-slate-600">Összesen</span>
                        <span className={`font-display text-xl font-extrabold ${c.text}`}>{formatHuf(total)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`rounded-2xl ${c.bg} px-4 py-3 flex items-center justify-between`}>
                      <span className="text-sm font-semibold text-slate-500">Havi zsebpénz</span>
                      <span className={`font-display text-xl font-extrabold ${c.text}`}>{formatHuf(total)}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
