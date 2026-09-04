import { useState } from 'react'
import type { Assignment, Subject, TimetableEntry } from '../types'
import { uid } from '../storage'
import { DAY_NAMES, SCHOOL_DAY_ORDER, todayDayOfWeek } from '../utils'

interface TimetableProps {
  studentId: string
  subjects: Subject[]
  assignments: Assignment[]
  timetable: TimetableEntry[]
  onChange: (timetable: TimetableEntry[]) => void
}

export default function Timetable({ studentId, subjects, assignments, timetable, onChange }: TimetableProps) {
  const mySubjects = assignments
    .filter((a) => a.studentId === studentId)
    .map((a) => subjects.find((s) => s.id === a.subjectId))
    .filter((s): s is Subject => Boolean(s))
    .sort((a, b) => a.name.localeCompare(b.name, 'hu'))

  const myEntries = timetable.filter((t) => t.studentId === studentId)
  const today = todayDayOfWeek()

  const [subjectId, setSubjectId] = useState(mySubjects[0]?.id ?? '')
  const [dayOfWeek, setDayOfWeek] = useState(1)
  const [startTime, setStartTime] = useState('08:00')

  function addEntry(e: React.FormEvent) {
    e.preventDefault()
    if (!subjectId) return
    const entry: TimetableEntry = { id: uid(), studentId, subjectId, dayOfWeek, startTime }
    onChange([...timetable, entry])
  }

  function removeEntry(id: string) {
    onChange(timetable.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-1">Új óra hozzáadása 📐</h3>
        <p className="text-sm text-slate-400 mb-4">
          A már hozzárendelt tantárgyaid közül választhatsz a "Tantárgyaim" fülön beállítottak alapján.
        </p>

        {mySubjects.length === 0 ? (
          <p className="text-slate-400">
            Ehhez a tanulóhoz még nincs tantárgy hozzárendelve. Állítsd be a "Tantárgyaim" fülön!
          </p>
        ) : (
          <form onSubmit={addEntry} className="space-y-3">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none bg-white"
            >
              {mySubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>

            <div>
              <label className="text-sm font-semibold text-slate-600 ml-1">Nap</label>
              <div className="flex gap-1.5 mt-1">
                {SCHOOL_DAY_ORDER.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDayOfWeek(d)}
                    className={`flex-1 py-2 rounded-xl font-semibold text-sm ${
                      dayOfWeek === d ? 'bg-grape text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {DAY_NAMES[d].slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 ml-1">Kezdés</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn-pop w-full bg-grape text-white font-display font-bold text-lg py-3 rounded-2xl shadow-pop"
            >
              Hozzáadás 🎉
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-4">Aktuális hét 📅</h3>

        {myEntries.length === 0 ? (
          <p className="text-center text-slate-400 py-4">Még nincs felvéve óra.</p>
        ) : (
          <div className="space-y-4">
            {SCHOOL_DAY_ORDER.map((d) => {
              const dayEntries = myEntries
                .filter((t) => t.dayOfWeek === d)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
              if (dayEntries.length === 0) return null
              return (
                <div key={d}>
                  <div className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${d === today ? 'text-grape' : 'text-slate-400'}`}>
                    {DAY_NAMES[d]} {d === today && '· ma'}
                  </div>
                  <ul className="space-y-2">
                    {dayEntries.map((entry) => {
                      const subject = subjects.find((s) => s.id === entry.subjectId)
                      return (
                        <li
                          key={entry.id}
                          className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3"
                        >
                          <span className="text-2xl shrink-0">{subject?.icon ?? '📐'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-700 truncate">
                              {subject?.name ?? '(törölt tantárgy)'}
                            </div>
                            <div className="text-xs text-slate-400">{entry.startTime}</div>
                          </div>
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="text-slate-300 hover:text-bubblegum font-bold px-1 shrink-0"
                            title="Törlés"
                          >
                            ✕
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
