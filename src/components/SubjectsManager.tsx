import { useState } from 'react'
import type { Subject } from '../types'

interface SubjectsManagerProps {
  subjects: Subject[]
  onCreate: (name: string, icon: string) => void
  onRename: (id: string, name: string) => void
  onIconChange: (id: string, icon: string) => void
  onDelete: (id: string) => void
}

const SUBJECT_ICONS = [
  '📐', '✍️', '📖', '🌍', '🎨', '🎵', '⚽', '🔬', '💻', '🧮',
  '📚', '🧪', '🏃', '🎭', '🌱', '🗣️', '⏳', '⚗️',
]

const DEFAULT_ICON = SUBJECT_ICONS[0]

export default function SubjectsManager({ subjects, onCreate, onRename, onIconChange, onDelete }: SubjectsManagerProps) {
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState(DEFAULT_ICON)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [iconPickerId, setIconPickerId] = useState<string | null>(null)

  function submitNew(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    onCreate(newName.trim(), newIcon)
    setNewName('')
    setNewIcon(DEFAULT_ICON)
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
          beállítani, mennyit érnek a jegyeik. Egy tantárgy ikonját bármikor megváltoztathatod, ha rákattintasz.
        </p>

        <form onSubmit={submitNew} className="mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIconPickerId((cur) => (cur === 'new' ? null : 'new'))}
              className="w-14 h-14 shrink-0 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-2xl"
              title="Ikon választása"
            >
              {newIcon}
            </button>
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
          </div>
          {iconPickerId === 'new' && (
            <div className="mt-2 bg-white border-2 border-slate-200 rounded-2xl p-2 flex flex-wrap gap-1.5">
              {SUBJECT_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    setNewIcon(icon)
                    setIconPickerId(null)
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl ${
                    newIcon === icon ? 'bg-grape/10 ring-2 ring-grape' : 'hover:bg-slate-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
        </form>

        {subjects.length === 0 && (
          <div className="bg-white rounded-3xl border-4 border-dashed border-slate-200 p-10 text-center">
            <div className="text-5xl mb-3">📖</div>
            <p className="text-slate-500 font-semibold">Még nincs felvéve tantárgy.</p>
          </div>
        )}

        <ul className="space-y-2">
          {[...subjects].sort((a, b) => a.name.localeCompare(b.name, 'hu')).map((subject) => (
            <li key={subject.id} className="bg-white rounded-2xl border-4 border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIconPickerId((cur) => (cur === subject.id ? null : subject.id))}
                  className="text-2xl shrink-0 w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
                  title="Ikon megváltoztatása"
                >
                  {subject.icon ?? DEFAULT_ICON}
                </button>
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
              </div>
              {iconPickerId === subject.id && (
                <div className="mt-2 bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 flex flex-wrap gap-1.5">
                  {SUBJECT_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => {
                        onIconChange(subject.id, icon)
                        setIconPickerId(null)
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl ${
                        subject.icon === icon ? 'bg-grape/10 ring-2 ring-grape' : 'hover:bg-white'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
