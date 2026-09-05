import { useState } from 'react'
import { enablePush, getPushStatus, type PushStatus } from '../push'

interface PushSettingsModalProps {
  notificationLeadMinutes: number
  onChangeLeadMinutes: (minutes: number) => void
  onClose: () => void
}

const LEAD_OPTIONS = [
  { value: 0, label: 'Esemény kezdetekor' },
  { value: 15, label: '15 perccel előtte' },
  { value: 30, label: '30 perccel előtte' },
  { value: 60, label: '1 órával előtte' },
  { value: 120, label: '2 órával előtte' },
]

export default function PushSettingsModal({
  notificationLeadMinutes,
  onChangeLeadMinutes,
  onClose,
}: PushSettingsModalProps) {
  const [status, setStatus] = useState<PushStatus>(getPushStatus)
  const [busy, setBusy] = useState(false)

  async function handleEnable() {
    setBusy(true)
    const result = await enablePush()
    setStatus(result)
    setBusy(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-popin">
        <h3 className="font-display text-2xl font-bold text-slate-800 mb-1">Értesítések 🔔</h3>
        <p className="text-sm text-slate-400 mb-5">
          Kapj emlékeztetőt a telefonodon, mielőtt egy esemény elkezdődik.
        </p>

        {status === 'unsupported' && (
          <p className="bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-500 mb-5">
            Ezen a böngészőn/eszközön nem támogatottak a push értesítések.
          </p>
        )}
        {status === 'denied' && (
          <p className="bg-bubblegum/10 rounded-2xl px-4 py-3 text-sm text-bubblegum mb-5">
            Az értesítések le vannak tiltva ennél az oldalnál — engedélyezd a böngésző beállításaiban.
          </p>
        )}
        {status === 'granted' && (
          <p className="bg-mint/10 rounded-2xl px-4 py-3 text-sm text-mint font-semibold mb-5">
            ✓ Az értesítések be vannak kapcsolva ezen az eszközön.
          </p>
        )}
        {status === 'default' && (
          <button
            onClick={handleEnable}
            disabled={busy}
            className="btn-pop w-full mb-5 bg-grape text-white font-display font-bold text-lg py-3 rounded-2xl shadow-pop disabled:opacity-60"
          >
            {busy ? 'Kérés folyamatban...' : 'Értesítések bekapcsolása 🔔'}
          </button>
        )}

        <label className="text-sm font-semibold text-slate-600 ml-1">Emlékeztető ideje</label>
        <div className="grid grid-cols-1 gap-2 mt-1 mb-6">
          {LEAD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChangeLeadMinutes(opt.value)}
              className={`text-left px-4 py-2.5 rounded-2xl font-semibold text-sm ${
                notificationLeadMinutes === opt.value ? 'bg-grape text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200"
        >
          Bezárás
        </button>
      </div>
    </div>
  )
}
