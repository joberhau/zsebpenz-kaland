import { useState } from 'react'

const CLIENT_ID = 'kreta-ellenorzo-mobile-android'
const HMAC_KEY_BYTES = new Uint8Array([98, 97, 83, 115, 120, 79, 119, 108, 85, 49, 106, 77])

function toBase64(buffer: ArrayBuffer): string {
  let binary = ''
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte)
  return btoa(binary)
}

async function signHmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', HMAC_KEY_BYTES, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return toBase64(signature)
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Standalone, Firestore-free test screen for the unofficial KRÉTA v3 API. Nothing here is saved anywhere. */
export default function KretaTest() {
  const [institute, setInstitute] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [result, setResult] = useState('')

  function appendLog(line: string) {
    setLog((prev) => [...prev, line])
  }

  async function runTest(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setLog([])
    setResult('')
    try {
      appendLog('Nonce lekérése...')
      const nonceRes = await fetch('https://idp.e-kreta.hu/nonce')
      if (!nonceRes.ok) throw new Error(`Nonce hiba: ${nonceRes.status}`)
      const nonce = await nonceRes.text()
      appendLog('Nonce OK.')

      appendLog('Bejelentkezés...')
      const message = institute.toUpperCase() + nonce + username.toUpperCase()
      const key = await signHmac(message)

      const body = new URLSearchParams({
        userName: username,
        password,
        institute_code: institute,
        grant_type: 'password',
        client_id: CLIENT_ID,
      })

      const tokenRes = await fetch('https://idp.e-kreta.hu/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'X-AuthorizationPolicy-Key': key,
          'X-AuthorizationPolicy-Version': 'v2',
          'X-AuthorizationPolicy-Nonce': nonce,
        },
        body,
      })
      const tokenText = await tokenRes.text()
      if (!tokenRes.ok) throw new Error(`Bejelentkezés hiba: ${tokenRes.status} ${tokenText}`)
      const tokenJson = JSON.parse(tokenText)
      if (!tokenJson.access_token) throw new Error(`Nincs access_token a válaszban: ${tokenText}`)
      appendLog('Bejelentkezés OK.')

      const today = new Date()
      const fromDate = isoDate(today)
      const toDate = isoDate(new Date(today.getTime() + 7 * 86400000))
      appendLog(`Órarend lekérése (${fromDate} .. ${toDate})...`)
      const timetableRes = await fetch(
        `https://${institute}.ekreta.hu/ellenorzo/V3/Sajat/OrarendElemek?datumTol=${fromDate}&datumIg=${toDate}`,
        { headers: { Authorization: `Bearer ${tokenJson.access_token}` } },
      )
      const timetableText = await timetableRes.text()
      if (!timetableRes.ok) throw new Error(`Órarend hiba: ${timetableRes.status} ${timetableText}`)
      const lessons = JSON.parse(timetableText)
      appendLog(`Kész — ${lessons.length} óra.`)
      setResult(JSON.stringify(lessons, null, 2))
    } catch (err) {
      appendLog(`HIBA: ${err instanceof Error ? err.message : String(err)}`)
      if (err instanceof TypeError) {
        appendLog('(Ez gyakran azt jelenti, hogy a böngésző CORS miatt blokkolta a kérést — a KRÉTA szervere nem mobil appból érkező kérésnek látja ezt.)')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF7EE] p-5">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
          <h1 className="font-display text-xl font-bold text-slate-800 mb-1">KRÉTA teszt 🧪</h1>
          <p className="text-sm text-slate-400 mb-4">
            Semmi nem kerül mentésre — csak a böngésződ beszél közvetlenül a KRÉTA szerverével, és itt megjelenik a
            válasz.
          </p>
          <form onSubmit={runTest} className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-slate-600 ml-1">Intézménykód</label>
              <input
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
                placeholder="pl. klik032355001"
                className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 ml-1">Felhasználónév</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 ml-1">Jelszó</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !institute || !username || !password}
              className="btn-pop w-full bg-grape text-white font-display font-bold text-lg py-3 rounded-2xl shadow-pop disabled:opacity-40"
            >
              {loading ? 'Tesztelés...' : 'Teszt indítása'}
            </button>
          </form>
        </div>

        {log.length > 0 && (
          <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-slate-800 mb-2">Napló</h2>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap">{log.join('\n')}</pre>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-slate-800 mb-2">Órarend válasz (nyers)</h2>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap overflow-x-auto">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
