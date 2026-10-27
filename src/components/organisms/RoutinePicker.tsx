import styled from 'styled-components'
import { getRoutineProgress } from '../../model'
import { useAppStore } from '../../store'

const Picker = styled.div`padding: .55rem 0 .8rem;`
const Caption = styled.p`margin: 0 0 .55rem; color: ${({ theme }) => theme.muted}; font-size: .75rem; font-weight: 800; letter-spacing: .075em; text-transform: uppercase;`
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem;
  @media (min-width: 700px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
`
const Tile = styled.button<{ $active: boolean }>`
  min-width: 0; min-height: 70px; padding: .7rem .8rem; text-align: left;
  border: 2px solid ${({ theme, $active }) => $active ? theme.accentStrong : theme.border};
  border-radius: 14px; background: ${({ theme, $active }) => $active ? theme.surface : theme.elevated};
  color: ${({ theme }) => theme.text};
  &:hover { border-color: ${({ theme }) => theme.accentStrong}; }
`
const Top = styled.span`display:flex; justify-content:space-between; align-items:start; gap:.4rem; font-weight:750; line-height:1.2; overflow-wrap:anywhere;`
const Percent = styled.span`flex:none; color:${({ theme }) => theme.success}; font-variant-numeric:tabular-nums; font-size:.85rem;`
const Detail = styled.span`display:block; margin-top:.4rem; color:${({ theme }) => theme.muted}; font-size:.75rem;`

export function RoutinePicker({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const routines = useAppStore(state => state.routines)
  const completed = useAppStore(state => state.completed)
  return (
    <Picker>
      <Caption>Selecciona tu rutina · toca la activa para plegarla</Caption>
      <Grid aria-label="Seleccionar rutina">
        {routines.map(routine => {
          const progress = getRoutineProgress(routine, completed)
          return <Tile key={routine.id} $active={activeId === routine.id}
            aria-expanded={activeId === routine.id} aria-controls={activeId === routine.id ? `routine-${routine.id}` : undefined}
            onClick={() => onSelect(routine.id)}>
            <Top><span>{routine.name}</span><Percent>{progress.complete ? '✓ ' : ''}{progress.percent}%</Percent></Top>
            <Detail>{progress.done} de {progress.total} series</Detail>
          </Tile>
        })}
      </Grid>
    </Picker>
  )
}
