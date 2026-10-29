import { useEffect, useState } from 'react'
import { TIMER_FINISHED_DISPLAY_MS, TIMER_TICK_MS } from './config'
import { readUiState, saveUiState } from './uiState'

type TimerState = { routineId: string; enabled: boolean; endsAt: number | null }

const initialState = (routineId: string): TimerState => {
  try {
    const saved = JSON.parse(readUiState('timer') ?? 'null') as Partial<TimerState> | null
    if (saved?.routineId === routineId && typeof saved.enabled === 'boolean' &&
        (saved.endsAt === null || (typeof saved.endsAt === 'number' && Number.isFinite(saved.endsAt)))) {
      return { routineId, enabled: saved.enabled,
        endsAt: saved.enabled && saved.endsAt && saved.endsAt > Date.now() - TIMER_FINISHED_DISPLAY_MS ? saved.endsAt : null }
    }
  } catch { /* Ignore an invalid saved timer. */ }
  return { routineId, enabled: false, endsAt: null }
}

export function useRestTimer(routineId: string) {
  const [timer, setTimer] = useState(() => initialState(routineId))
  const [now, setNow] = useState(() => Date.now())
  const remaining = timer.endsAt === null ? null : Math.max(0, Math.ceil((timer.endsAt - now) / 1000))
  const update = (next: TimerState) => {
    setTimer(next)
    saveUiState('timer', JSON.stringify(next))
  }
  useEffect(() => {
    if (!timer.enabled || timer.endsAt === null) return
    const interval = window.setInterval(() => setNow(Date.now()), TIMER_TICK_MS)
    return () => window.clearInterval(interval)
  }, [timer.enabled, timer.endsAt])
  useEffect(() => {
    if (remaining !== 0 || timer.endsAt === null) return
    const timeout = window.setTimeout(() => update({ ...timer, endsAt: null }), TIMER_FINISHED_DISPLAY_MS)
    return () => window.clearTimeout(timeout)
  }, [remaining, timer])
  return {
    enabled: timer.enabled,
    remaining,
    toggle: (enabled: boolean) => update({ routineId, enabled, endsAt: null }),
    start: (seconds: number) => {
      if (!timer.enabled) return
      const current = Date.now()
      setNow(current)
      update({ routineId, enabled: true, endsAt: current + seconds * 1000 })
    },
    stop: () => {
      if (timer.endsAt !== null) update({ ...timer, endsAt: null })
    }
  }
}
