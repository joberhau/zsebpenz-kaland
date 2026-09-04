import { useState } from 'react'
import type { AvatarId, Student, StudentColor } from '../types'
import { STUDENT_COLORS } from '../utils'
import { AVATARS } from './Avatars'

interface StudentFormModalProps {
  initial?: Student
  onCancel: () => void
  onSave: (name: string, avatar: AvatarId, color: StudentColor) => void
}

const COLORS: StudentColor[] = ['grape', 'bubblegum', 'tangerine', 'mint', 'sky']

export default function StudentFormModal({ initial, onCancel, onSave }: StudentFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [avatar, setAvatar] = useState<AvatarId>(initial?.avatar ?? 'girl')
  const [color, setColor] = useState<StudentColor>(initial?.color ?? 'grape')

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-popin my-6">
        <h3 className="font-display text-2xl font-bold text-slate-800 mb-4">
          {initial ? 'Tanuló szerkesztése ✏️' : 'Új tanuló felvétele 🎉'}
        </h3>

        <label className="text-sm font-semibold text-slate-600 ml-1">Név</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="pl. Anna"
          className="w-full mt-1 mb-4 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
        />

        <label className="text-sm font-semibold text-slate-600 ml-1">Kabala</label>
        <div className="grid grid-cols-3 gap-2 mt-1 mb-4">
          {AVATARS.map(({ id, label, Component }) => (
            <button
              key={id}
              onClick={() => setAvatar(id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-2 ${
                avatar === id ? 'border-grape bg-grape/10' : 'border-transparent bg-slate-100'
              }`}
            >
              <Component size={52} />
              <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight px-1">
                {label}
              </span>
            </button>
          ))}
        </div>

        <label className="text-sm font-semibold text-slate-600 ml-1">Szín</label>
        <div className="flex gap-2 mt-1 mb-6">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-9 h-9 rounded-full ${STUDENT_COLORS[c].solid} ${
                color === c ? 'ring-4 ring-offset-2 ring-slate-300' : ''
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200"
          >
            Mégse
          </button>
          <button
            onClick={() => name.trim() && onSave(name.trim(), avatar, color)}
            disabled={!name.trim()}
            className="btn-pop flex-1 py-3 rounded-2xl font-display font-bold text-white bg-mint shadow-pop disabled:opacity-40"
          >
            Mentés
          </button>
        </div>
      </div>
    </div>
  )
}
