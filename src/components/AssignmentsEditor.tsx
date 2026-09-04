import { useState } from 'react'
import type { Assignment, Grade, Subject } from '../types'
import { GRADE_COLORS } from '../utils'
import { uid } from '../storage'

interface AssignmentsEditorProps {
  studentId: string
  subjects: Subject[]
  assignments: Assignment[]
  onChange: (assignments: Assignment[]) => void
}

const GRADES: Grade[] = [1, 2, 3, 4, 5]

export default function AssignmentsEditor({ studentId, subjects, assignments, onChange }: AssignmentsEditorProps) {
  const assigned = assignments.filter((a) => a.studentId === studentId)
  const assignedSubjectIds = new Set(assigned.map((a) => a.subjectId))
  const available = subjects
    .filter((s) => !assignedSubjectIds.has(s.id))
    .sort((a, b) => a.name.localeCompare(b.name, 'hu'))
  const [pickerId, setPickerId] = useState('')

  function updateValues(assignmentId: string, grade: Grade, raw: string) {
    const num = raw === '' ? 0 : Math.max(0, Number(raw))
    onChange(
      assignments.map((a) => (a.id === assignmentId ? { ...a, values: { ...a.values, [grade]: num } } : a)),
    )
  }

  function addAssignment() {
    if (!pickerId) return
    const newAssignment: Assignment = {
      id: uid(),
      studentId,
      subjectId: pickerId,
      values: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
    onChange([...assignments, newAssignment])
    setPickerId('')
  }

  function removeAssignment(id: string) {
    onChange(assignments.filter((a) => a.id !== id))
  }

  return (
    <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
      <h3 className="font-display text-lg font-bold text-slate-800 mb-1">Tantárgyak és jegyértékek 📚</h3>
      <p className="text-sm text-slate-400 mb-4">
        Add meg, hogy egy-egy jegy (1–5) mennyit ér ennél a tanulónál tantárgyanként.
      </p>

      {subjects.length === 0 ? (
        <p className="text-slate-400">
          Nincs még tantárgy a katalógusban. Vedd fel őket a "Tantárgyak" fülön!
        </p>
      ) : (
        <>
          {available.length > 0 && (
            <div className="flex gap-2 mb-5">
              <select
                value={pickerId}
                onChange={(e) => setPickerId(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-slate-200 bg-white focus:border-grape focus:outline-none"
              >
                <option value="">Válassz tantárgyat...</option>
                {available.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addAssignment}
                disabled={!pickerId}
                className="btn-pop bg-sky text-white font-semibold px-4 rounded-xl shadow-popsm text-sm disabled:opacity-40"
              >
                + Hozzárendel
              </button>
            </div>
          )}

          {assigned.length === 0 ? (
            <p className="text-center text-slate-400 py-6">
              Ehhez a tanulóhoz még nincs hozzárendelve tantárgy.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2 min-w-[560px]">
                <thead>
                  <tr className="text-xs text-slate-400 font-semibold">
                    <th className="text-left pl-2">Tantárgy</th>
                    {GRADES.map((g) => (
                      <th key={g} className="text-center">
                        <span
                          className="inline-flex w-7 h-7 rounded-full items-center justify-center text-white font-bold"
                          style={{ backgroundColor: GRADE_COLORS[g] }}
                        >
                          {g}
                        </span>
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...assigned]
                    .sort((a, b) => {
                      const nameA = subjects.find((s) => s.id === a.subjectId)?.name ?? ''
                      const nameB = subjects.find((s) => s.id === b.subjectId)?.name ?? ''
                      return nameA.localeCompare(nameB, 'hu')
                    })
                    .map((assignment) => {
                    const subject = subjects.find((s) => s.id === assignment.subjectId)
                    return (
                      <tr key={assignment.id} className="bg-slate-50">
                        <td className="rounded-l-2xl p-2 font-semibold text-slate-700">
                          {subject?.name ?? '(törölt tantárgy)'}
                        </td>
                        {GRADES.map((g) => (
                          <td key={g} className="p-1 text-center">
                            <input
                              type="number"
                              min={0}
                              value={assignment.values[g]}
                              onChange={(e) => updateValues(assignment.id, g, e.target.value)}
                              className="w-20 text-center bg-white border-2 border-slate-200 rounded-lg py-1 focus:border-grape focus:outline-none"
                            />
                          </td>
                        ))}
                        <td className="rounded-r-2xl p-2 text-center">
                          <button
                            onClick={() => removeAssignment(assignment.id)}
                            className="text-slate-300 hover:text-bubblegum font-bold text-lg px-2"
                            title="Eltávolítás"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
