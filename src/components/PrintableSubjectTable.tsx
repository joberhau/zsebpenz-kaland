import type { Assignment, Student, Subject } from '../types'
import { formatHuf } from '../utils'

interface PrintableSubjectTableProps {
  student: Student
  subjects: Subject[]
  assignments: Assignment[]
}

const GRADES = [1, 2, 3, 4, 5] as const

export default function PrintableSubjectTable({ student, subjects, assignments }: PrintableSubjectTableProps) {
  const rows = assignments
    .map((a) => ({ assignment: a, subject: subjects.find((s) => s.id === a.subjectId) }))
    .filter((r) => r.subject)
    .sort((a, b) => a.subject!.name.localeCompare(b.subject!.name, 'hu'))

  return (
    <div className="hidden print:block p-8 text-black">
      <h1 className="text-2xl font-bold mb-1">Zsebpénz Kaland</h1>
      <h2 className="text-lg mb-4">
        {student.name} — jegyenkénti zsebpénz-értékek
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-black px-3 py-2 text-left">Tantárgy</th>
            {GRADES.map((g) => (
              <th key={g} className="border border-black px-3 py-2">
                {g}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ assignment, subject }) => (
            <tr key={assignment.id}>
              <td className="border border-black px-3 py-2">{subject!.name}</td>
              {GRADES.map((g) => (
                <td key={g} className="border border-black px-3 py-2 text-center">
                  {formatHuf(assignment.values[g])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm mt-6 text-gray-600">Nyomtatva: {new Date().toLocaleDateString('hu-HU')}</p>
    </div>
  )
}
