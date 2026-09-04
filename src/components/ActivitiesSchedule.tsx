import { useState } from 'react'
import type { Activity } from '../types'
import { uid } from '../storage'
import { ACTIVITY_ICONS, DAY_NAMES, DAY_ORDER, studentActivities, todayDayOfWeek } from '../utils'

interface ActivitiesScheduleProps {
  studentId: string
  activities: Activity[]
  onChange: (activities: Activity[]) => void
}

export default function ActivitiesSchedule({ studentId, activities, onChange }: ActivitiesScheduleProps) {
  const mine = studentActivities(activities, studentId)
  const today = todayDayOfWeek()

  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ACTIVITY_ICONS[0])
  const [dayOfWeek, setDayOfWeek] = useState(1)
  const [startTime, setStartTime] = useState('16:00')
  const [endTime, setEndTime] = useState('17:00')

  function addActivity(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const activity: Activity = { id: uid(), studentId, name: name.trim(), icon, dayOfWeek, startTime, endTime }
    onChange([...activities, activity])
    setName('')
  }

  function removeActivity(id: string) {
    onChange(activities.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-1">Új esemény 📅</h3>
        <p className="text-sm text-slate-400 mb-4">Heti rendszerességgel ismétlődik ugyanazon a napon.</p>

        <form onSubmit={addActivity} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex flex-wrap gap-1.5 bg-slate-50 rounded-2xl p-2 flex-1">
              {ACTIVITY_ICONS.map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl ${
                    icon === i ? 'bg-grape/10 ring-2 ring-grape' : 'hover:bg-white'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Név, pl. Foci"
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
          />

          <div>
            <label className="text-sm font-semibold text-slate-600 ml-1">Nap</label>
            <div className="flex gap-1.5 mt-1">
              {DAY_ORDER.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDayOfWeek(d)}
                  className={`flex-1 py-2 rounded-xl font-semibold text-sm ${
                    dayOfWeek === d ? 'bg-grape text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {DAY_NAMES[d].slice(0, 2)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-600 ml-1">Mettől</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-600 ml-1">Meddig</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-grape focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-pop w-full bg-grape text-white font-display font-bold text-lg py-3 rounded-2xl shadow-pop disabled:opacity-40"
          >
            Hozzáadás 🎉
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border-4 border-slate-100 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-4">Heti rend 📅</h3>

        {mine.length === 0 ? (
          <p className="text-center text-slate-400 py-4">Még nincs felvéve edzés/foglalkozás.</p>
        ) : (
          <div className="space-y-4">
            {DAY_ORDER.map((d) => {
              const dayActivities = mine
                .filter((a) => a.dayOfWeek === d)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
              if (dayActivities.length === 0) return null
              return (
                <div key={d}>
                  <div className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${d === today ? 'text-grape' : 'text-slate-400'}`}>
                    {DAY_NAMES[d]} {d === today && '· ma'}
                  </div>
                  <ul className="space-y-2">
                    {dayActivities.map((activity) => (
                      <li
                        key={activity.id}
                        className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3"
                      >
                        <span className="text-2xl shrink-0">{activity.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-700 truncate">{activity.name}</div>
                          <div className="text-xs text-slate-400">
                            {activity.startTime}–{activity.endTime}
                          </div>
                        </div>
                        <button
                          onClick={() => removeActivity(activity.id)}
                          className="text-slate-300 hover:text-bubblegum font-bold px-1 shrink-0"
                          title="Törlés"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
