import styled from 'styled-components'
import { useAppStore } from '../../store'
import type { RoutineEntry } from '../../model'
import { SetWeight } from './SetWeight'

const Heading = styled.div`display:flex; align-items:center; gap:.65rem; min-width:0;`
const Number = styled.span`
  flex:none; display:grid; place-items:center; width:32px; height:32px; border-radius:9px;
  background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.muted}; font-size:.85rem;
`
const Name = styled.strong`flex:1; min-width:0; overflow-wrap:anywhere;`
const Complete = styled.span`color:${({ theme }) => theme.success}; font-weight:900; font-size:1.15rem;`
const Grid = styled.div`display: flex; flex-wrap: wrap; gap: .45rem .8rem; margin-top: .9rem;`
const SetRow = styled.div`display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.35rem 1rem; width:100%; padding:.4rem 0; border-top:1px solid ${({ theme }) => theme.border};`
const SetButton = styled.button<{ $done: boolean }>`
  display:inline-flex; align-items:center; gap:.45rem; min-height:44px; padding:0 .25rem 0 0;
  border:0; background:transparent; color:${({ theme }) => theme.text};
  font-weight:${({ $done }) => $done ? 750 : 500};
  &:hover { color:${({ theme }) => theme.success}; }
`
const Indicator = styled.span<{ $done: boolean }>`
  display:grid; place-items:center; width:29px; height:29px; flex:none;
  border-radius:50%; border:2px solid ${({ theme, $done }) => $done ? theme.success : theme.muted};
  background:${({ theme, $done }) => $done ? theme.success : 'transparent'};
  color:${({ theme }) => theme.onSuccess}; line-height:1; font-weight:900;
`

export function SetTracker({ entry, index }: { entry: RoutineEntry; index: number }) {
  const marks = useAppStore(state => state.completed[entry.id])
  const toggleSet = useAppStore(state => state.toggleSet)
  const exercises = useAppStore(state => state.exercises)
  const name = exercises.find(exercise => exercise.id === entry.exerciseId)?.name
  const complete = entry.sets > 0 && Array.from({ length: entry.sets }, (_, i) => marks?.[i] ?? false).every(Boolean)
  return (
    <div>
      <Heading>
        <Number aria-hidden="true">{index}</Number>
        <Name>{name ?? 'Ejercicio eliminado'}</Name>
        {complete && <Complete role="img" aria-label="Ejercicio completado">✓</Complete>}
      </Heading>
      <Grid aria-label={`Series de ${name ?? 'ejercicio'}`}>
        {Array.from({ length: entry.sets }, (_, index) => (<SetRow key={index}>
          <SetButton key={index} $done={marks?.[index] ?? false}
            aria-label={`${name}, serie ${index + 1}, ${marks?.[index] ? 'completada' : 'pendiente'}`}
            aria-pressed={marks?.[index] ?? false} onClick={() => toggleSet(entry.id, index)}>
            <Indicator $done={marks?.[index] ?? false} aria-hidden="true">{marks?.[index] ? '✓' : ''}</Indicator>
            <span>Serie {index + 1}</span>
          </SetButton>
          <SetWeight entryId={entry.id} index={index} exerciseName={name ?? 'ejercicio'} />
        </SetRow>))}
      </Grid>
    </div>
  )
}
