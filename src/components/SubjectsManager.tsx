import { useState } from 'react'
import type { Subject } from '../types'

interface SubjectsManagerProps {
  subjects: Subject[]
  onCreate: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

const SUBJECT_ICONS = ['📐', '✍️', '📖', '🌍', '🎨', '🎵', '⚽', '🔬', '💻', '🧮']

export default function SubjectsManager({ subjects, onCreate, onRename, onDelete }: SubjectsManagerProps) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function submitNew(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    onCreate(newName.trim())
    setNewName('')
  }

  function startEdit(subject: Subject) {
    setEditingId(subject.id)
    setEditingName(subject.name)
  }

  function saveEdit() {
    if (editingId && editingName.trim()) onRename(editingId, editingName.trim())
    setEditingId(null)
  }

  return (
    <div>
      <header className="bg-white border-b-4 border-lemon px-5 py-4 sticky top-0 z-10">
        <h1 className="font-display text-xl font-extrabold text-slate-800">Tantárgyak 📚</h1>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">
        <p className="text-slate-500 mb-5">
          Ez a közös tantárgy-katalógus. Innen tudod majd hozzárendelni a tantárgyakat az egyes tanulókhoz, és
          beállítani, mennyit érnek a jegyeik.
        </p>

        <form onSubmit={submitNew} className="flex gap-2 mb-6">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Új tantárgy neve, pl. Matek"
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none bg-white"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="btn-pop bg-grape text-white font-display font-bold px-5 rounded-2xl shadow-popsm disabled:opacity-40"
          >
            + Hozzáad
          </button>
        </form>

        {subjects.length === 0 && (
          <div className="bg-white rounded-3xl border-4 border-dashed border-slate-200 p-10 text-center">
            <div className="text-5xl mb-3">📖</div>
            <p className="text-slate-500 font-semibold">Még nincs felvéve tantárgy.</p>
          </div>
        )}

        <ul className="space-y-2">
          {subjects.map((subject, i) => (
            <li
              key={subject.id}
              className="bg-white rounded-2xl border-4 border-slate-100 px-4 py-3 flex items-center gap-3"
            >
              <span className="text-2xl shrink-0">{SUBJECT_ICONS[i % SUBJECT_ICONS.length]}</span>
              {editingId === subject.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  className="flex-1 min-w-0 px-2 py-1 rounded-lg border-2 border-grape focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => startEdit(subject)}
                  className="flex-1 min-w-0 font-semibold text-slate-700 truncate cursor-text"
                >
                  {subject.name}
                </span>
              )}
              <button
                onClick={() => startEdit(subject)}
                className="text-slate-400 hover:text-grape px-1 shrink-0"
                title="Átnevezés"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  if (confirm(`Biztosan törlöd a(z) "${subject.name}" tantárgyat? Ez minden hozzárendelést is töröl.`))
                    onDelete(subject.id)
                }}
                className="text-slate-300 hover:text-bubblegum px-1 shrink-0"
                title="Törlés"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
