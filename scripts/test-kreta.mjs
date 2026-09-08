// One-off TEST script — does NOT write to Firestore. Just proves whether we
// can log into KRÉTA's unofficial v3 mobile API and pull a timetable.
// Login flow reverse-engineered from https://github.com/bczsalba/ekreta-docs-v3
import { createHmac } from 'node:crypto'

const { KRETA_INSTITUTE_CODE, KRETA_USERNAME, KRETA_PASSWORD } = process.env

if (!KRETA_INSTITUTE_CODE || !KRETA_USERNAME || !KRETA_PASSWORD) {
  console.error('Missing KRETA_INSTITUTE_CODE / KRETA_USERNAME / KRETA_PASSWORD env vars')
  process.exit(1)
}

const USER_AGENT = 'hu.ekreta.student/1.0.5/Android/0/0'
const CLIENT_ID = 'kreta-ellenorzo-mobile-android'
// Fixed HMAC key used by the official app to sign the login request (public knowledge, reverse-engineered).
const HMAC_KEY = Buffer.from([98, 97, 83, 115, 120, 79, 119, 108, 85, 49, 106, 77])

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

async function getNonce() {
  const res = await fetch('https://idp.e-kreta.hu/nonce')
  if (!res.ok) throw new Error(`Nonce fetch failed: ${res.status}`)
  return res.text()
}

async function login() {
  const nonce = await getNonce()
  const message = KRETA_INSTITUTE_CODE.toUpperCase() + nonce + KRETA_USERNAME.toUpperCase()
  const key = createHmac('sha512', HMAC_KEY).update(message, 'utf-8').digest('base64')

  const body = new URLSearchParams({
    userName: KRETA_USERNAME,
    password: KRETA_PASSWORD,
    institute_code: KRETA_INSTITUTE_CODE,
    grant_type: 'password',
    client_id: CLIENT_ID,
  })

  const res = await fetch('https://idp.e-kreta.hu/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'User-Agent': USER_AGENT,
      'X-AuthorizationPolicy-Key': key,
      'X-AuthorizationPolicy-Version': 'v2',
      'X-AuthorizationPolicy-Nonce': nonce,
    },
    body,
  })

  const text = await res.text()
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${text}`)
  const json = JSON.parse(text)
  if (!json.access_token) throw new Error(`No access_token in response: ${text}`)
  return json.access_token
}

async function getTimetable(token, fromDate, toDate) {
  const url = `https://${KRETA_INSTITUTE_CODE}.ekreta.hu/ellenorzo/V3/Sajat/OrarendElemek?datumTol=${fromDate}&datumIg=${toDate}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': USER_AGENT },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Timetable fetch failed: ${res.status} ${text}`)
  return JSON.parse(text)
}

async function main() {
  console.log('Logging in...')
  const token = await login()
  console.log('Login OK, got access token.')

  const today = new Date()
  const fromDate = isoDate(today)
  const toDate = isoDate(new Date(today.getTime() + 7 * 86400000))
  console.log(`Fetching timetable ${fromDate} .. ${toDate}...`)
  const lessons = await getTimetable(token, fromDate, toDate)
  console.log(`Got ${lessons.length} lessons.`)

  for (const l of lessons) {
    console.log(
      `${l.Datum?.slice(0, 10)} #${l.Oraszam} ${l.Tantargy?.Nev ?? '?'} — kezdet: ${l.KezdetIdopont?.slice(11, 16)} — HaziFeladatUid: ${l.HaziFeladatUid}`,
    )
  }
}

main().catch((err) => {
  console.error('TEST FAILED:', err.message)
  process.exit(1)
})
