import type { Assignment, Student, Subject, TimetableEntry } from './types'
import { formatHuf } from './utils'

const PAGE_STYLE = `
  body { font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; color: #111; padding: 32px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  h2 { font-size: 15px; font-weight: normal; margin: 0 0 20px; color: #444; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #000; padding: 8px 12px; }
  th { text-align: center; }
  td:first-child, th:first-child { text-align: left; }
  td:not(:first-child), th:not(:first-child) { text-align: center; }
  table.centered td, table.centered th { text-align: center; }
  .meta { font-size: 12px; color: #666; margin-top: 24px; }
`

function openPrintWindow(title: string, bodyHtml: string) {
  const win = window.open('', '_blank', 'width=800,height=1000')
  if (!win) {
    alert('A böngésző letiltotta a felugró ablakot — engedélyezd, majd próbáld újra.')
    return
  }
  win.document.open()
  win.document.write(
    `<!doctype html><html lang="hu"><head><meta charset="utf-8"><title>${title}</title><style>${PAGE_STYLE}</style></head><body>${bodyHtml}</body></html>`,
  )
  win.document.close()
  win.focus()
  win.onload = () => {
    win.print()
  }
  // Fallback in case onload doesn't fire (some browsers with document.write).
  setTimeout(() => win.print(), 200)
}

const GRADES = [1, 2, 3, 4, 5] as const

export function printSubjectTable(student: Student, subjects: Subject[], assignments: Assignment[]) {
  const rows = assignments
    .map((a) => ({ assignment: a, subject: subjects.find((s) => s.id === a.subjectId) }))
    .filter((r) => r.subject)
    .sort((a, b) => a.subject!.name.localeCompare(b.subject!.name, 'hu'))

  const body = `
    <h1>Zsebpénz Kaland</h1>
    <h2>${student.name} — jegyenkénti zsebpénz-értékek</h2>
    <table>
      <thead>
        <tr><th>Tantárgy</th>${GRADES.map((g) => `<th>${g}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows
          .map(
            ({ assignment, subject }) =>
              `<tr><td>${subject!.name}</td>${GRADES.map((g) => `<td>${formatHuf(assignment.values[g])}</td>`).join('')}</tr>`,
          )
          .join('')}
      </tbody>
    </table>
    <p class="meta">Nyomtatva: ${new Date().toLocaleDateString('hu-HU')}</p>
  `
  openPrintWindow(`${student.name} — jegyértékek`, body)
}

const SCHOOL_DAYS = [1, 2, 3, 4, 5, 6]
const SCHOOL_DAY_NAMES: Record<number, string> = {
  1: 'Hétfő',
  2: 'Kedd',
  3: 'Szerda',
  4: 'Csütörtök',
  5: 'Péntek',
  6: 'Szombat',
}

export function printTimetable(student: Student, subjects: Subject[], timetable: TimetableEntry[]) {
  const byDay = SCHOOL_DAYS.map((d) =>
    timetable
      .filter((t) => t.studentId === student.id && t.dayOfWeek === d)
      .map((t) => ({ entry: t, subject: subjects.find((s) => s.id === t.subjectId) }))
      .sort((a, b) => a.entry.startTime.localeCompare(b.entry.startTime)),
  )
  const maxRows = Math.max(1, ...byDay.map((d) => d.length))

  const bodyRows = Array.from({ length: maxRows }, (_, row) =>
    byDay
      .map((dayEntries) => {
        const item = dayEntries[row]
        if (!item) return '<td>&nbsp;</td>'
        return `<td>${item.subject?.name ?? '(törölt tantárgy)'}<br><span style="font-size:11px;color:#666">${item.entry.startTime}</span></td>`
      })
      .join(''),
  )

  const body = `
    <h1>Zsebpénz Kaland</h1>
    <h2>${student.name} — órarend</h2>
    <table class="centered">
      <thead>
        <tr>${SCHOOL_DAYS.map((d) => `<th>${SCHOOL_DAY_NAMES[d]}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${bodyRows.map((r) => `<tr>${r}</tr>`).join('')}
      </tbody>
    </table>
    <p class="meta">Nyomtatva: ${new Date().toLocaleDateString('hu-HU')}</p>
  `
  openPrintWindow(`${student.name} — órarend`, body)
}
