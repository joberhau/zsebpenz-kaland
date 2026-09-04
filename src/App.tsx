import { useEffect, useState } from 'react'
import type { AppData, AvatarId, Student, StudentColor } from './types'
import { loadData, saveData, uid } from './storage'
import Login from './components/Login'
import Overview from './components/Overview'
import StudentsManager from './components/StudentsManager'
import SubjectsManager from './components/SubjectsManager'
import StudentDetail from './components/StudentDetail'
import BottomNav from './components/BottomNav'

type View = 'login' | 'app'
type Tab = 'overview' | 'students' | 'subjects'

export default function App() {
  const [view, setView] = useState<View>('login')
  const [tab, setTab] = useState<Tab>('overview')
  const [data, setData] = useState<AppData>(() => loadData())
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  useEffect(() => {
    saveData(data)
  }, [data])

  function updateData(patch: Partial<AppData>) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  function addStudent(name: string, avatar: AvatarId, color: StudentColor) {
    const student: Student = { id: uid(), name, avatar, color }
    setData((prev) => ({ ...prev, students: [...prev.students, student] }))
  }

  function updateStudent(id: string, name: string, avatar: AvatarId, color: StudentColor) {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === id ? { ...s, name, avatar, color } : s)),
    }))
  }

  function deleteStudent(id: string) {
    setData((prev) => {
      const removedAssignmentIds = new Set(
        prev.assignments.filter((a) => a.studentId === id).map((a) => a.id),
      )
      return {
        ...prev,
        students: prev.students.filter((s) => s.id !== id),
        assignments: prev.assignments.filter((a) => a.studentId !== id),
        monthlyGrades: prev.monthlyGrades.filter((g) => !removedAssignmentIds.has(g.assignmentId)),
      }
    })
    setSelectedStudentId(null)
  }

  function addSubject(name: string) {
    setData((prev) => ({ ...prev, subjects: [...prev.subjects, { id: uid(), name }] }))
  }

  function renameSubject(id: string, name: string) {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, name } : s)),
    }))
  }

  function deleteSubject(id: string) {
    setData((prev) => {
      const removedAssignmentIds = new Set(
        prev.assignments.filter((a) => a.subjectId === id).map((a) => a.id),
      )
      return {
        ...prev,
        subjects: prev.subjects.filter((s) => s.id !== id),
        assignments: prev.assignments.filter((a) => a.subjectId !== id),
        monthlyGrades: prev.monthlyGrades.filter((g) => !removedAssignmentIds.has(g.assignmentId)),
      }
    })
  }

  if (view === 'login') {
    return <Login onEnter={() => setView('app')} />
  }

  if (selectedStudentId) {
    return (
      <div className="min-h-screen bg-[#FFF7EE]">
        <StudentDetail
          studentId={selectedStudentId}
          data={data}
          onBack={() => setSelectedStudentId(null)}
          onUpdateData={updateData}
          onDeleteStudent={() => deleteStudent(selectedStudentId)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF7EE] pb-20">
      {tab === 'overview' && (
        <Overview data={data} onSelectStudent={setSelectedStudentId} onLogout={() => setView('login')} />
      )}
      {tab === 'students' && (
        <StudentsManager
          students={data.students}
          onSelectStudent={setSelectedStudentId}
          onCreate={addStudent}
          onUpdate={updateStudent}
          onDelete={deleteStudent}
        />
      )}
      {tab === 'subjects' && (
        <SubjectsManager
          subjects={data.subjects}
          onCreate={addSubject}
          onRename={renameSubject}
          onDelete={deleteSubject}
        />
      )}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
