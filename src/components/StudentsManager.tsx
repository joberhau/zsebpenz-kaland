import { useState } from 'react'
import type { AvatarId, Student, StudentColor } from '../types'
import { STUDENT_COLORS, formatHuf } from '../utils'
import { Avatar } from './Avatars'
import StudentFormModal from './StudentFormModal'

interface StudentsManagerProps {
  students: Student[]
  onSelectStudent: (id: string) => void
  onCreate: (name: string, avatar: AvatarId, color: StudentColor, baseAllowance: number) => void
  onUpdate: (id: string, name: string, avatar: AvatarId, color: StudentColor, baseAllowance: number) => void
  onDelete: (id: string) => void
}

export default function StudentsManager({
  students,
  onSelectStudent,
  onCreate,
  onUpdate,
  onDelete,
}: StudentsManagerProps) {
  const [modal, setModal] = useState<'add' | Student | null>(null)

  return (
    <div>
      <header className="bg-white border-b-4 border-lemon px-5 py-4 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold text-slate-800">Tanulók 🧒</h1>
        <button
          onClick={() => setModal('add')}
          className="btn-pop bg-grape text-white font-display font-bold px-4 py-2.5 rounded-2xl shadow-popsm text-sm"
        >
          + Új tanuló
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">
        <p className="text-slate-500 mb-5">
          Itt veheted fel és kezelheted a tanulóidat. A tantárgyaikat és a jegyek díjazását a tanuló nevére
          kattintva állíthatod be.
        </p>

        {students.length === 0 && (
          <div className="bg-white rounded-3xl border-4 border-dashed border-slate-200 p-10 text-center">
            <div className="text-5xl mb-3">🧸</div>
            <p className="text-slate-500 font-semibold">Még nincs felvéve tanuló.</p>
          </div>
        )}

        <div className="space-y-3">
          {students.map((student) => {
            const c = STUDENT_COLORS[student.color]
            return (
              <div
                key={student.id}
                className={`bg-white rounded-3xl border-4 ${c.border} p-4 flex items-center gap-3`}
              >
                <button
                  onClick={() => onSelectStudent(student.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center overflow-hidden shrink-0`}>
                    <Avatar id={student.avatar} size={50} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold text-slate-800 truncate">{student.name}</div>
                    {(student.baseAllowance ?? 0) > 0 && (
                      <div className="text-xs text-slate-400 font-semibold">
                        Fix: {formatHuf(student.baseAllowance)}/hó
                      </div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setModal(student)}
                  className="text-slate-400 hover:text-grape text-lg px-2 shrink-0"
                  title="Szerkesztés"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Biztosan törlöd ${student.name} adatait?`)) onDelete(student.id)
                  }}
                  className="text-slate-300 hover:text-bubblegum text-lg px-2 shrink-0"
                  title="Törlés"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      </main>

      {modal === 'add' && (
        <StudentFormModal
          onCancel={() => setModal(null)}
          onSave={(name, avatar, color, baseAllowance) => {
            onCreate(name, avatar, color, baseAllowance)
            setModal(null)
          }}
        />
      )}
      {modal && modal !== 'add' && (
        <StudentFormModal
          initial={modal}
          onCancel={() => setModal(null)}
          onSave={(name, avatar, color, baseAllowance) => {
            onUpdate(modal.id, name, avatar, color, baseAllowance)
            setModal(null)
          }}
        />
      )}
    </div>
  )
}
