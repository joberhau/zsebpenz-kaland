// One-off diagnostic helper: adds a test Activity starting a couple of
// minutes from now (Europe/Budapest) for the first student, so
// send-notifications.mjs has something fresh (non-deduped) to send.
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
if (!serviceAccountJson) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT env var')
  process.exit(1)
}

initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) })
const db = getFirestore()

function budapestNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Budapest',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type)?.value
  const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { dayOfWeek: DAY_INDEX[get('weekday')], hour: Number(get('hour')), minute: Number(get('minute')) }
}

function fmt(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

async function main() {
  const ref = db.doc('app/data')
  const snap = await ref.get()
  const data = snap.data()
  const student = data.students?.[0]
  if (!student) {
    console.error('No students found — nothing to attach the test activity to.')
    process.exit(1)
  }

  const { dayOfWeek, hour, minute } = budapestNow()
  let startMinute = minute + 2
  let startHour = hour
  if (startMinute >= 60) {
    startMinute -= 60
    startHour += 1
  }
  const startTime = fmt(startHour, startMinute)
  const endMinute = startMinute + 15 >= 60 ? startMinute + 15 - 60 : startMinute + 15
  const endHour = startMinute + 15 >= 60 ? startHour + 1 : startHour
  const endTime = fmt(endHour, endMinute)

  const activity = {
    id: 'diag-' + Date.now().toString(36),
    studentId: student.id,
    name: '🧪 Push teszt',
    icon: '🧪',
    dayOfWeek,
    startTime,
    endTime,
  }

  await ref.update({ activities: [...(data.activities ?? []), activity] })
  console.log(`Added test activity for ${student.name} at ${startTime} (id: ${activity.id}).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
