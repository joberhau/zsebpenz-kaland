// Runs on a GitHub Actions cron schedule. Checks whether any student's
// "Esemény" (Activity) starts within `notificationLeadMinutes` from now
// (Europe/Budapest time) and sends a push notification via FCM to every
// registered device, deduping so the same occurrence is never sent twice.
import admin from 'firebase-admin'

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
if (!serviceAccountJson) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT env var')
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
})

const db = admin.firestore()
const TOLERANCE_MINUTES = 5

const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

function budapestNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Budapest',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const get = (type) => parts.find((p) => p.type === type)?.value
  const dayOfWeek = DAY_INDEX[get('weekday')]
  const hour = Number(get('hour')) % 24
  const minute = Number(get('minute'))
  const dateKey = `${get('year')}-${get('month')}-${get('day')}`
  return { dayOfWeek, minutesOfDay: hour * 60 + minute, dateKey }
}

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

async function main() {
  const { dayOfWeek, minutesOfDay, dateKey } = budapestNow()

  const dataSnap = await db.doc('app/data').get()
  if (!dataSnap.exists) {
    console.log('No app/data document yet — nothing to do.')
    return
  }
  const data = dataSnap.data()
  const activities = data.activities ?? []
  const students = data.students ?? []
  const leadMinutes = data.notificationLeadMinutes ?? 60

  const due = activities.filter((a) => {
    if (a.dayOfWeek !== dayOfWeek) return false
    const target = timeToMinutes(a.startTime) - leadMinutes
    return Math.abs(minutesOfDay - target) <= TOLERANCE_MINUTES
  })

  if (due.length === 0) {
    console.log('No activities due for a reminder right now.')
    return
  }

  const tokensSnap = await db.collection('pushTokens').get()
  const tokens = tokensSnap.docs.map((d) => d.id)
  if (tokens.length === 0) {
    console.log('No registered push tokens — nothing to send to.')
    return
  }

  for (const activity of due) {
    const sentRef = db.doc(`sentNotifications/${activity.id}_${dateKey}`)
    const sentSnap = await sentRef.get()
    if (sentSnap.exists) {
      console.log(`Already notified for ${activity.id} on ${dateKey}, skipping.`)
      continue
    }

    const student = students.find((s) => s.id === activity.studentId)
    const studentName = student?.name ?? 'Valaki'
    const when = leadMinutes === 0 ? 'most kezdődik' : `${activity.startTime}-kor kezdődik`
    const body = `${studentName}: ${activity.icon ?? ''} ${activity.name} ${when}!`.trim()

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title: 'Zsebpénz Kaland', body },
    })

    console.log(`Sent "${body}" to ${response.successCount}/${tokens.length} device(s).`)

    // Clean up tokens the browser has since unregistered.
    const staleTokens = []
    response.responses.forEach((r, i) => {
      if (!r.success && r.error?.code === 'messaging/registration-token-not-registered') {
        staleTokens.push(tokens[i])
      }
    })
    await Promise.all(staleTokens.map((t) => db.doc(`pushTokens/${t}`).delete()))

    await sentRef.set({ sentAt: admin.firestore.FieldValue.serverTimestamp() })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
