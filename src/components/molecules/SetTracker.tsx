import styled from 'styled-components'
import { useAppStore } from '../../store'
import type { RoutineEntry } from '../../model'
import { ExerciseWeight } from './ExerciseWeight'

const Heading = styled.div`display:flex; align-items:center; gap:.65rem; min-width:0;`
const Number = styled.span`
  flex:none; display:grid; place-items:center; width:32px; height:32px; border-radius:9px;
  background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.muted}; font-size:.85rem;
`
const Name = styled.strong`flex:1; min-width:0; overflow-wrap:anywhere;`
const Complete = styled.span`color:${({ theme }) => theme.success}; font-weight:900; font-size:1.15rem;`
const Weight = styled.div`display:flex; align-items:center; flex-wrap:wrap; gap:.4rem 1rem; margin-top:.85rem; padding-top:.7rem; border-top:1px solid ${({ theme }) => theme.border};`
const WeightLabel = styled.span`color:${({ theme }) => theme.muted}; font-size:.85rem; font-weight:650;`
const Grid = styled.div`display:flex; flex-wrap:wrap; gap:.45rem .35rem; margin-top:.9rem;`
const SetButton = styled.button<{ $done: boolean }>`
  display:inline-flex; flex:0 0 calc((100% - .7rem) / 3); min-width:0;
  align-items:center; gap:.25rem; min-height:44px; padding:0;
  border:0; background:transparent; color:${({ theme }) => theme.text};
  font-size:clamp(.7rem, 3vw, .875rem); white-space:nowrap;
  font-weight:${({ $done }) => $done ? 750 : 500};
  &:hover { color:${({ theme }) => theme.success}; }
`
const Indicator = styled.span<{ $done: boolean }>`
  display:grid; place-items:center; width:24px; height:24px; flex:none;
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
        {Array.from({ length: entry.sets }, (_, index) => (
          <SetButton key={index} $done={marks?.[index] ?? false}
            aria-label={`${name}, serie ${index + 1}, ${marks?.[index] ? 'completada' : 'pendiente'}`}
            aria-pressed={marks?.[index] ?? false} onClick={() => toggleSet(entry.id, index)}>
            <Indicator $done={marks?.[index] ?? false} aria-hidden="true">{marks?.[index] ? '✓' : ''}</Indicator>
            <span>Serie {index + 1}</span>
          </SetButton>
        ))}
      </Grid>
      <Weight><WeightLabel>Peso (opcional)</WeightLabel><ExerciseWeight entryId={entry.id} exerciseName={name ?? 'ejercicio'} /></Weight>
    </div>
  )
}
