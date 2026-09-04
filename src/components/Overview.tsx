import { useEffect, useState } from 'react'
import type { AppData } from '../types'
import {
  STUDENT_COLORS,
  bonusMonthTotal,
  currentMonthKey,
  formatHuf,
  formatHufCompact,
  formatMonthLabel,
  formatMonthShort,
  gradeBasedTotal,
  monthsOfYear,
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

const HEADLINE_KEY = 'zsebpenz-kaland-headline-offset'

function loadHeadlineOffset(): number {
  const raw = localStorage.getItem(HEADLINE_KEY)
  return raw === '-1' ? -1 : 0
}

export default function Overview({ data, onSelectStudent, onLogout }: OverviewProps) {
  const [headlineOffset, setHeadlineOffset] = useState(loadHeadlineOffset)
  const currentYear = new Date().getFullYear()
  const yearMonths = monthsOfYear(currentYear)
  const headlineMonth = shiftMonth(currentMonthKey(), headlineOffset)

  useEffect(() => {
    localStorage.setItem(HEADLINE_KEY, String(headlineOffset))
  }, [headlineOffset])

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
            <p className="text-slate-500">A tanulóid havi állása és éves idővonala</p>
          </div>
          <div className="flex bg-white border-2 border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setHeadlineOffset(-1)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                headlineOffset === -1 ? 'bg-grape text-white' : 'text-slate-500'
              }`}
            >
              Előző hónap
            </button>
            <button
              onClick={() => setHeadlineOffset(0)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                headlineOffset === 0 ? 'bg-grape text-white' : 'text-slate-500'
              }`}
            >
              Aktuális hónap
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
              const grades = gradeBasedTotal(data.assignments, data.monthlyGrades, student.id, headlineMonth)
              const bonus = bonusMonthTotal(data.bonuses, student.id, headlineMonth)
              const total = studentMonthTotal(
                data.assignments,
                data.monthlyGrades,
                student.id,
                headlineMonth,
                baseAllowance,
                data.bonuses,
              )
              const subjectCount = data.assignments.filter((a) => a.studentId === student.id).length
              const todayActivities = todaysActivities(data.activities, student.id)
              return (
                <button
                  key={student.id}
                  onClick={() => onSelectStudent(student.id)}
                  className={`text-left bg-white rounded-3xl border-4 ${c.border} p-4 shadow-pop btn-pop flex gap-3`}
                >
                  {/* Left-edge yearly timeline */}
                  <div className="relative shrink-0 w-[4.75rem] pl-3 py-1">
                    <div className="absolute left-1 top-1 bottom-1 w-0.5 bg-slate-200" />
                    {yearMonths.map((m) => {
                      const isHeadline = m === headlineMonth
                      const amount = studentMonthTotal(
                        data.assignments,
                        data.monthlyGrades,
                        student.id,
                        m,
                        baseAllowance,
                        data.bonuses,
                      )
                      return (
                        <div key={m} className="relative flex flex-col leading-tight py-[3px]">
                          <span
                            className={`absolute -left-3 top-0.5 w-2 h-2 rounded-full border ${
                              isHeadline ? `${c.solid} border-transparent` : 'bg-white border-slate-300'
                            }`}
                          />
                          <span className={`text-[9px] font-bold uppercase ${isHeadline ? c.text : 'text-slate-400'}`}>
                            {formatMonthShort(m)}
                          </span>
                          <span className={`text-[9px] font-semibold ${amount > 0 ? 'text-slate-600' : 'text-slate-300'}`}>
                            {amount > 0 ? formatHufCompact(amount) : '—'}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Right: usual card content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center overflow-hidden shrink-0`}>
                        <Avatar id={student.avatar} size={48} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display text-lg font-bold text-slate-800 truncate">{student.name}</div>
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
                    {baseAllowance > 0 || bonus !== 0 ? (
                      <div className={`rounded-2xl ${c.bg} px-4 py-3 space-y-1`}>
                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                          <span>Fix</span>
                          <span>{formatHuf(baseAllowance)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                          <span>Eredményekből</span>
                          <span>{formatHuf(grades)}</span>
                        </div>
                        {bonus !== 0 && (
                          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                            <span>Bónusz/levonás</span>
                            <span>
                              {bonus > 0 ? '+' : ''}
                              {formatHuf(bonus)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-black/10">
                          <span className="text-sm font-semibold text-slate-600 capitalize">
                            {formatMonthLabel(headlineMonth)}
                          </span>
                          <span className={`font-display text-xl font-extrabold ${c.text}`}>{formatHuf(total)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className={`rounded-2xl ${c.bg} px-4 py-3 flex items-center justify-between`}>
                        <span className="text-sm font-semibold text-slate-500 capitalize">
                          {formatMonthLabel(headlineMonth)}
                        </span>
                        <span className={`font-display text-xl font-extrabold ${c.text}`}>{formatHuf(total)}</span>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
