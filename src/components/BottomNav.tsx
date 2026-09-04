type Tab = 'overview' | 'students' | 'subjects'

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Áttekintés', icon: '🏠' },
  { id: 'students', label: 'Tanulók', icon: '🧒' },
  { id: 'subjects', label: 'Tantárgyak', icon: '📚' },
]

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t-4 border-lemon z-20 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-5xl mx-auto grid grid-cols-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-2.5 font-display font-bold text-xs transition-colors ${
              active === tab.id ? 'text-grape' : 'text-slate-400'
            }`}
          >
            <span className={`text-2xl ${active === tab.id ? 'animate-wiggle' : ''}`}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
