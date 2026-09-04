import { useState } from 'react'
import { clearPassword, hasPassword, setPassword, verifyPassword } from '../auth'

interface LoginProps {
  onEnter: () => void
}

export default function Login({ onEnter }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'setup'>(() => (hasPassword() ? 'login' : 'setup'))
  const [password, setPasswordInput] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 4) {
      setError('Legalább 4 karakter legyen a jelszó.')
      return
    }
    if (password !== confirmPassword) {
      setError('A két jelszó nem egyezik.')
      return
    }
    setBusy(true)
    await setPassword(password)
    setBusy(false)
    onEnter()
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const ok = await verifyPassword(password)
    setBusy(false)
    if (ok) {
      onEnter()
    } else {
      setError('Hibás jelszó, próbáld újra.')
      setPasswordInput('')
    }
  }

  function handleForgot() {
    if (confirm('Ez törli a jelenlegi szülői jelszót, és újat kell beállítanod. Folytatod?')) {
      clearPassword()
      setMode('setup')
      setPassword('')
      setConfirmPassword('')
      setError('')
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

        {mode === 'setup' ? (
          <form className="space-y-3" onSubmit={handleSetup}>
            <p className="text-sm text-slate-500 bg-slate-50 rounded-2xl px-4 py-3">
              Első belépés — állíts be egy szülői jelszót, amivel legközelebb bejelentkezel.
            </p>
            <div>
              <label className="text-sm font-semibold text-slate-600 ml-1">Új jelszó</label>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 ml-1">Jelszó megerősítése</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Jelszó beállítása 🚀
            </button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-semibold text-slate-600 ml-1">Szülői jelszó</label>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPasswordInput(e.target.value)}
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
            <button
              type="button"
              onClick={handleForgot}
              className="w-full text-center text-xs text-slate-400 hover:text-bubblegum font-semibold pt-1"
            >
              Elfelejtettem a jelszót
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
