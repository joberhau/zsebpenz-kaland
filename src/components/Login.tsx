import { useState } from 'react'
import { friendlyAuthError, signIn } from '../auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email, password)
      // onAuthStateChanged in App.tsx picks up the signed-in user automatically.
    } catch (err) {
      const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : ''
      setError(friendlyAuthError(code))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-grape via-bubblegum to-tangerine flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-10 left-10 text-6xl animate-float">⭐</div>
      <div className="absolute bottom-16 right-16 text-7xl animate-float" style={{ animationDelay: '1s' }}>🪙</div>
      <div className="absolute top-24 right-24 text-5xl animate-wiggle">🎈</div>
      <div className="absolute bottom-24 left-24 text-5xl animate-wiggle" style={{ animationDelay: '0.5s' }}>🎉</div>

      <div className="bg-white rounded-[2rem] shadow-2xl p-8 sm:p-10 w-full max-w-md animate-popin border-4 border-white">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🦄💰</div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-grape">Zsebpénz Kaland</h1>
          <p className="text-slate-500 mt-1">Jó jegy = jó zsebpénz!</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1">E-mail cím</label>
            <input
              autoFocus
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="szulo@pelda.hu"
              className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1">Jelszó</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none transition-colors"
            />
          </div>
          {error && <p className="text-bubblegum text-sm font-semibold ml-1">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="btn-pop w-full mt-2 bg-mint text-white font-display font-bold text-lg py-3 rounded-2xl shadow-pop hover:brightness-105 disabled:opacity-60"
          >
            Belépés 🚀
          </button>
        </form>
      </div>
    </div>
  )
}
