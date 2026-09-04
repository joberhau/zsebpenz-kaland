import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import type { AppData, AvatarId, Student, StudentColor } from './types'
import { logOut, subscribeAuth } from './auth'
import { saveData, subscribeData, uid } from './storage'
import Login from './components/Login'
import Overview from './components/Overview'
import StudentsManager from './components/StudentsManager'
import SubjectsManager from './components/SubjectsManager'
import StudentDetail from './components/StudentDetail'
import BottomNav from './components/BottomNav'

type Tab = 'overview' | 'students' | 'subjects'

const EMPTY_DATA: AppData = { subjects: [], students: [], assignments: [], monthlyGrades: [], activities: [] }

export default function App() {
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('overview')
  const [data, setData] = useState<AppData>(EMPTY_DATA)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  useEffect(() => {
    return subscribeAuth((u) => {
      setUser(u)
      setAuthLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user) {
      setData(EMPTY_DATA)
      setDataLoading(true)
      return
    }
    setDataLoading(true)
    return subscribeData((d) => {
      setData(d)
      setDataLoading(false)
    })
  }, [user])

  function updateData(patch: Partial<AppData>) {
    setData((prev) => {
      const next = { ...prev, ...patch }
      saveData(next)
      return next
    })
  }

  function addStudent(name: string, avatar: AvatarId, color: StudentColor) {
    const student: Student = { id: uid(), name, avatar, color }
    updateData({ students: [...data.students, student] })
  }

  function updateStudent(id: string, name: string, avatar: AvatarId, color: StudentColor) {
    updateData({
      students: data.students.map((s) => (s.id === id ? { ...s, name, avatar, color } : s)),
    })
  }

  function deleteStudent(id: string) {
    const removedAssignmentIds = new Set(
      data.assignments.filter((a) => a.studentId === id).map((a) => a.id),
    )
    updateData({
      students: data.students.filter((s) => s.id !== id),
      assignments: data.assignments.filter((a) => a.studentId !== id),
      monthlyGrades: data.monthlyGrades.filter((g) => !removedAssignmentIds.has(g.assignmentId)),
      activities: data.activities.filter((a) => a.studentId !== id),
    })
    setSelectedStudentId(null)
  }

  function addSubject(name: string, icon: string) {
    updateData({ subjects: [...data.subjects, { id: uid(), name, icon }] })
  }

  function renameSubject(id: string, name: string) {
    updateData({
      subjects: data.subjects.map((s) => (s.id === id ? { ...s, name } : s)),
    })
  }

  function changeSubjectIcon(id: string, icon: string) {
    updateData({
      subjects: data.subjects.map((s) => (s.id === id ? { ...s, icon } : s)),
    })
  }

  function deleteSubject(id: string) {
    const removedAssignmentIds = new Set(
      data.assignments.filter((a) => a.subjectId === id).map((a) => a.id),
    )
    updateData({
      subjects: data.subjects.filter((s) => s.id !== id),
      assignments: data.assignments.filter((a) => a.subjectId !== id),
      monthlyGrades: data.monthlyGrades.filter((g) => !removedAssignmentIds.has(g.assignmentId)),
    })
  }

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen bg-[#FFF7EE] flex items-center justify-center">
        <div className="text-5xl animate-wiggle">🦄💰</div>
      </div>
    )
  }

  if (!user) {
    return <Login />
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
        <Overview data={data} onSelectStudent={setSelectedStudentId} onLogout={() => logOut()} />
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
          onIconChange={changeSubjectIcon}
          onDelete={deleteSubject}
        />
      )}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
