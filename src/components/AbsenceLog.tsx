import { useState } from 'react'
import type { Absence, AbsenceReason } from '../types'
import { uid } from '../storage'

interface AbsenceLogProps {
  studentId: string
  absences: Absence[]
  onChange: (absences: Absence[]) => void
}

const REASONS: { id: AbsenceReason; label: string; icon: string }[] = [
  { id: 'sick', label: 'Beteg volt', icon: '🤒' },
  { id: 'medical', label: 'Orvosi vizsgálat', icon: '🩺' },
  { id: 'family', label: 'Családi ok', icon: '👨‍👩‍👧' },
  { id: 'other', label: 'Egyéb', icon: '📌' },
]

function reasonInfo(reason: AbsenceReason) {
  return REASONS.find((r) => r.id === reason) ?? REASONS[3]
}

export default function AbsenceLog({ studentId, absences, onChange }: AbsenceLogProps) {
  const mine = absences
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date))

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [reason, setReason] = useState<AbsenceReason>('sick')
  const [note, setNote] = useState('')
  const [search, setSearch] = useState('')

  function addEntry(e: React.FormEvent) {
    e.preventDefault()
    const entry: Absence = { id: uid(), studentId, date, reason, note: note.trim() || undefined }
    onChange([...absences, entry])
    setNote('')
  }

  function removeEntry(id: string) {
    onChange(absences.filter((a) => a.id !== id))
  }

  const filtered = search.trim()
    ? mine.filter((a) => {
        const q = search.trim().toLowerCase()
        return (
          reasonInfo(a.reason).label.toLowerCase().includes(q) ||
          (a.note ?? '').toLowerCase().includes(q) ||
          a.date.includes(q)
        )
      })
    : mine

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-1">Hiányzás rögzítése 🤒</h3>
        <p className="text-sm text-slate-400 mb-4">
          Ha a tanuló hiányzott vagy beteg volt, itt tudod naplózni — később visszakereshető.
        </p>

        <form onSubmit={addEntry} className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1">Dátum</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1">Ok</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {REASONS.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setReason(r.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl font-semibold text-sm ${
                    reason === r.id ? 'bg-grape text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span className="text-lg">{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1">Megjegyzés (opcionális)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="pl. pulmonológiai kontroll"
              className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="btn-pop w-full bg-grape text-white font-display font-bold text-lg py-3 rounded-2xl shadow-pop"
          >
            Mentés 📝
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-display text-lg font-bold text-slate-800">Napló</h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Keresés..."
            className="px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm focus:border-grape focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-4">
            {mine.length === 0 ? 'Még nincs rögzített hiányzás.' : 'Nincs találat.'}
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((entry) => {
              const info = reasonInfo(entry.reason)
              return (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3"
                >
                  <span className="text-2xl shrink-0">{info.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-700 truncate">{info.label}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {entry.date} {entry.note ? `· ${entry.note}` : ''}
                    </div>
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
        )}
      </div>
    </div>
  )
}
