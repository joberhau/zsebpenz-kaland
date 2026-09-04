import type { AppData } from '../types'
import { STUDENT_COLORS, currentMonthKey, formatHuf, formatMonthLabel, studentMonthTotal, todaysActivities } from '../utils'
import { Avatar } from './Avatars'

interface OverviewProps {
  data: AppData
  onSelectStudent: (id: string) => void
  onLogout: () => void
}

export default function Overview({ data, onSelectStudent, onLogout }: OverviewProps) {
  const month = currentMonthKey()

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
        <h2 className="font-display text-xl font-bold text-slate-800">Szia! 👋</h2>
        <p className="text-slate-500 mb-5">
          A tanulóid <span className="font-semibold text-slate-700">{formatMonthLabel(month)}</span> havi állása
        </p>

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
              const total = studentMonthTotal(data.assignments, data.monthlyGrades, student.id, month)
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
                  <div className={`rounded-2xl ${c.bg} px-4 py-3 flex items-center justify-between`}>
                    <span className="text-sm font-semibold text-slate-500">Havi zsebpénz</span>
                    <span className={`font-display text-xl font-extrabold ${c.text}`}>{formatHuf(total)}</span>
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
