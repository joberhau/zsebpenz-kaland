import type { Homework } from '../types'

interface HomeworkListProps {
  studentId: string
  homework: Homework[]
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function HomeworkList({ studentId, homework }: HomeworkListProps) {
  const today = todayKey()
  const mine = homework
    .filter((h) => h.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-1">Házi feladatok 📓</h3>
        <p className="text-sm text-slate-400 mb-4">Automatikusan szinkronizálva a KRÉTA rendszerből.</p>

        {mine.length === 0 ? (
          <p className="text-center text-slate-400 py-4">
            Nincs szinkronizált házi feladat. Ha nálad ez még nincs bekötve, szólj, és beállítjuk!
          </p>
        ) : (
          <ul className="space-y-2">
            {mine.map((entry) => (
              <li
                key={entry.id}
                className={`rounded-2xl px-4 py-3 ${entry.date === today ? 'bg-lemon/30' : 'bg-slate-50'}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-slate-700">{entry.subject}</span>
                  <span className="text-xs text-slate-400 shrink-0">
                    {entry.date} {entry.date === today && '· ma'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{entry.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
