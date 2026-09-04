import { useState } from 'react'
import type { Bonus } from '../types'
import { uid } from '../storage'
import { formatHuf } from '../utils'

interface BonusLogProps {
  studentId: string
  bonuses: Bonus[]
  onChange: (bonuses: Bonus[]) => void
}

export default function BonusLog({ studentId, bonuses, onChange }: BonusLogProps) {
  const mine = bonuses.filter((b) => b.studentId === studentId).sort((a, b) => b.date.localeCompare(a.date))

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')
  const [amountText, setAmountText] = useState('')
  const [sign, setSign] = useState<1 | -1>(1)

  function addEntry(e: React.FormEvent) {
    e.preventDefault()
    const amount = Math.max(0, Number(amountText) || 0)
    if (!description.trim() || amount === 0) return
    const entry: Bonus = { id: uid(), studentId, date, description: description.trim(), amount: amount * sign }
    onChange([...bonuses, entry])
    setDescription('')
    setAmountText('')
  }

  function removeEntry(id: string) {
    onChange(bonuses.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-1">Bónusz / levonás 🌟</h3>
        <p className="text-sm text-slate-400 mb-4">
          Egyszeri, jegyektől független összeg egy adott napra — pl. verseny eredménye, vagy levonás valamiért.
        </p>

        <form onSubmit={addEntry} className="space-y-3">
          <div className="flex bg-slate-100 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setSign(1)}
              className={`flex-1 py-2.5 rounded-xl font-display font-bold transition-colors ${
                sign === 1 ? 'bg-mint text-white shadow' : 'text-slate-500'
              }`}
            >
              ➕ Bónusz
            </button>
            <button
              type="button"
              onClick={() => setSign(-1)}
              className={`flex-1 py-2.5 rounded-xl font-display font-bold transition-colors ${
                sign === -1 ? 'bg-bubblegum text-white shadow' : 'text-slate-500'
              }`}
            >
              ➖ Levonás
            </button>
          </div>

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
            <label className="text-sm font-semibold text-slate-600 ml-1">Esemény / indoklás</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="pl. Szavaló verseny — jó eredmény"
              className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1">Összeg (Ft)</label>
            <input
              type="number"
              min={0}
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              placeholder="0"
              className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className={`btn-pop w-full font-display font-bold text-lg py-3 rounded-2xl shadow-pop text-white ${
              sign === 1 ? 'bg-mint' : 'bg-bubblegum'
            }`}
          >
            Mentés {sign === 1 ? '🎉' : '📌'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-4">Napló</h3>

        {mine.length === 0 ? (
          <p className="text-center text-slate-400 py-4">Még nincs rögzített bónusz/levonás.</p>
        ) : (
          <ul className="space-y-2">
            {mine.map((entry) => {
              const positive = entry.amount >= 0
              return (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3"
                >
                  <span className="text-2xl shrink-0">{positive ? '🌟' : '📌'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-700 truncate">{entry.description}</div>
                    <div className="text-xs text-slate-400">{entry.date}</div>
                  </div>
                  <span className={`font-display font-bold shrink-0 ${positive ? 'text-mint' : 'text-bubblegum'}`}>
                    {positive ? '+' : ''}
                    {formatHuf(entry.amount)}
                  </span>
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
