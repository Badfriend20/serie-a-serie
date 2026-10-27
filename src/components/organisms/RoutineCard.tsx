import styled from 'styled-components'
import { useAppStore } from '../../store'
import { Button } from '../atoms/Button'
import { ProgressBar } from '../atoms/ProgressBar'
import { Surface } from '../atoms/Surface'
import { SetTracker } from '../molecules/SetTracker'
import { getRoutineProgress } from '../../model'

const Header = styled.div`display:flex; justify-content:space-between; align-items:start; gap:1rem; h2 { margin:0; font-size:1.25rem; overflow-wrap:anywhere; }`
const Score = styled.div`display:grid; justify-items:end; gap:.35rem; flex:none;`
const Percent = styled.strong`color:${({ theme }) => theme.success}; font-size:1.7rem; line-height:1; font-variant-numeric:tabular-nums;`
const Muted = styled.p`color:${({ theme }) => theme.muted}; margin:.25rem 0 0; font-size:.88rem;`
const Progress = styled.div`margin-top:1rem;`
const Completion = styled.div`padding:.8rem 1rem; margin-top:1rem; border-radius:12px; background:${({ theme }) => theme.successSurface}; color:${({ theme }) => theme.success}; font-weight:750;`
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
  const { total, done, percent, complete } = routine ? getRoutineProgress(routine, completed) : { total: 0, done: 0, percent: 0, complete: false }
  const hasWeights = routine?.entries.some(entry => weightsKg[entry.id] !== undefined) ?? false
  return (
    <Surface id={`routine-${id}`} aria-label={routine?.name}>
      <Header>
        <div><h2>{routine?.name}</h2><Muted>{done} de {total} series completas</Muted></div>
        <Score><Percent>{percent}%</Percent></Score>
      </Header>
      <Progress><ProgressBar value={percent} label={`Avance de ${routine?.name}`} /></Progress>
      {complete && <Completion role="status">✓ ¡Rutina completada!</Completion>}
      {routine?.entries.length ? <Items>{routine.entries.map((entry, index) => (
        <Item key={entry.id}>
          <SetTracker entry={entry} index={index + 1} />
        </Item>
      ))}</Items> : <Muted>Sin ejercicios. Agrégalos en la pestaña Rutinas.</Muted>}
      <Actions>
        <Button size="small" variant="quiet" disabled={done === 0} onClick={() => {
          if (window.confirm('¿Reiniciar las series completadas de esta rutina? Los pesos se conservarán.')) resetRoutineMarks(id)
        }}><span aria-hidden="true">↻</span> Reiniciar series</Button>
        <Button size="small" variant="quiet" disabled={!hasWeights} onClick={() => {
          if (window.confirm('¿Borrar los pesos de los ejercicios de esta rutina? Las series completadas se conservarán.')) resetRoutineWeights(id)
        }}><span aria-hidden="true">⌫</span> Borrar pesos</Button>
      </Actions>
    </Surface>
  )
}
