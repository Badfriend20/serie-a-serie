import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useAppStore } from '../../store'
import { Button } from '../atoms/Button'
import { ProgressBar } from '../atoms/ProgressBar'
import { Surface } from '../atoms/Surface'
import { SetTracker } from '../molecules/SetTracker'
import { getRoutineProgress } from '../../model'
import { DEFAULT_REST_SECONDS } from '../../config'
import { useRestTimer } from '../../useRestTimer'
import { RestTimerControls } from '../molecules/RestTimerControls'

const Header = styled.div`display:flex; justify-content:space-between; align-items:start; gap:1rem; h2 { margin:0; font-size:1.25rem; overflow-wrap:anywhere; }`
const StickySummary = styled.div`
  position: sticky; top: 0; z-index: 2; margin: -1.25rem -1.25rem 0;
  padding: 1rem 1.25rem .85rem; background: ${({ theme }) => theme.surface};
  border-bottom: 1px solid ${({ theme }) => theme.border}; border-radius: 20px 20px 0 0;
`
const Score = styled.div`display:grid; justify-items:end; gap:.35rem; flex:none;`
const Percent = styled.strong`color:${({ theme }) => theme.success}; font-size:1.7rem; line-height:1; font-variant-numeric:tabular-nums;`
const Muted = styled.p`color:${({ theme }) => theme.muted}; margin:.25rem 0 0; font-size:.88rem;`
const Progress = styled.div`margin-top:1rem;`
const Completion = styled.div`padding:.8rem 1rem; margin-top:1rem; border-radius:12px; background:${({ theme }) => theme.successSurface}; color:${({ theme }) => theme.success}; font-weight:750;`
const burst = keyframes`
  0% { opacity:0; transform:translate(-50%, -50%) scale(.4); }
  15% { opacity:1; }
  100% { opacity:0; transform:translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--spin)); }
`
const arrive = keyframes`
  0% { opacity:0; transform:scale(.75); }
  20% { opacity:1; transform:scale(1.08); }
  35%, 75% { opacity:1; transform:scale(1); }
  100% { opacity:0; transform:scale(1); }
`
const Celebration = styled.div`
  position:fixed; inset:0; z-index:10; display:grid; place-items:center; pointer-events:none;
  @media (prefers-reduced-motion: reduce) { display:none; }
`
const FestiveBadge = styled.div`
  z-index:1; max-width:calc(100vw - 2rem); padding:1rem 1.25rem;
  border:2px solid ${({ theme }) => theme.success}; border-radius:18px;
  background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.text};
  box-shadow:${({ theme }) => theme.raisedShadow}; font-size:1.2rem; font-weight:800; text-align:center;
  animation:${arrive} 1.8s ease-out both;
`
const Confetti = styled.span<{ $index: number }>`
  --x:${({ $index }) => Math.round(Math.cos($index * Math.PI / 6) * (115 + $index % 3 * 25))}px;
  --y:${({ $index }) => Math.round(Math.sin($index * Math.PI / 6) * (115 + $index % 3 * 25))}px;
  --spin:${({ $index }) => ($index % 2 ? 270 : -270)}deg;
  position:absolute; top:50%; left:50%; width:8px; height:12px; border-radius:2px;
  background:${({ theme, $index }) => $index % 2 ? theme.accent : theme.success};
  animation:${burst} 1.5s ease-out ${({ $index }) => $index % 4 * .04}s both;
`
const Actions = styled.div`display:flex; flex-wrap:wrap; gap:.45rem; margin-top:1.1rem;`
const Items = styled.div`display:grid; gap:1rem; margin-top:1.2rem;`
const Item = styled.div`padding:1rem; background:${({ theme }) => theme.elevated}; border:1px solid ${({ theme }) => theme.border}; border-radius:15px;`

export function RoutineCard({ id }: { id: string }) {
  const routines = useAppStore(state => state.routines)
  const routine = routines.find(item => item.id === id)
  const completed = useAppStore(state => state.completed)
  const weightsKg = useAppStore(state => state.weightsKg)
  const resetRoutineMarks = useAppStore(state => state.resetRoutineMarks)
  const resetRoutineWeights = useAppStore(state => state.resetRoutineWeights)
  const timer = useRestTimer(id)
  const { total, done, percent, complete } = routine ? getRoutineProgress(routine, completed) : { total: 0, done: 0, percent: 0, complete: false }
  const wasComplete = useRef(complete)
  const [celebrating, setCelebrating] = useState(false)
  const hasWeights = routine?.entries.some(entry => weightsKg[entry.id] !== undefined) ?? false
  useEffect(() => {
    const justCompleted = complete && !wasComplete.current
    wasComplete.current = complete
    if (!justCompleted) {
      if (!complete) setCelebrating(false)
      return
    }
    setCelebrating(true)
    const timeout = window.setTimeout(() => setCelebrating(false), 1800)
    return () => window.clearTimeout(timeout)
  }, [complete])
  return (
    <Surface id={`routine-${id}`} aria-label={routine?.name}>
      <StickySummary>
        <Header>
          <div><h2>{routine?.name}</h2><Muted>{done} de {total} series completas</Muted></div>
          <Score><Percent>{percent}%</Percent></Score>
        </Header>
        <Progress><ProgressBar value={percent} label={`Avance de ${routine?.name}`} /></Progress>
        <RestTimerControls enabled={timer.enabled} remaining={timer.remaining} onToggle={timer.toggle} onSkip={timer.stop} />
      </StickySummary>
      {complete && <Completion role="status">✓ ¡Rutina completada!</Completion>}
      {celebrating && <Celebration aria-hidden="true">
        <FestiveBadge>🎉 ¡Rutina completada!</FestiveBadge>
        {Array.from({ length: 12 }, (_, index) => <Confetti key={index} $index={index} />)}
      </Celebration>}
      {routine?.entries.length ? <Items>{routine.entries.map((entry, index) => (
        <Item key={entry.id}>
          <SetTracker entry={entry} index={index + 1} onSetCompleted={() => {
            if (routine && getRoutineProgress(routine, useAppStore.getState().completed).complete) timer.stop()
            else timer.start(entry.restSeconds ?? DEFAULT_REST_SECONDS)
          }} />
        </Item>
      ))}</Items> : <Muted>Sin ejercicios. Agrégalos en la pestaña Rutinas.</Muted>}
      <Actions>
        <Button size="small" variant="quiet" disabled={done === 0} onClick={() => {
          if (window.confirm('¿Reiniciar las series completadas de esta rutina? Los pesos se conservarán.')) {
            resetRoutineMarks(id)
            timer.stop()
          }
        }}><span aria-hidden="true">↻</span> Reiniciar series</Button>
        <Button size="small" variant="quiet" disabled={!hasWeights} onClick={() => {
          if (window.confirm('¿Borrar los pesos de los ejercicios de esta rutina? Las series completadas se conservarán.')) resetRoutineWeights(id)
        }}><span aria-hidden="true">⌫</span> Borrar pesos</Button>
      </Actions>
    </Surface>
  )
}
