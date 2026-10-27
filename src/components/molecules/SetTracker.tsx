import styled from 'styled-components'
import { useAppStore } from '../../store'
import type { RoutineEntry } from '../../model'

const Grid = styled.div`display: flex; flex-wrap: wrap; gap: .55rem; margin-top: .9rem;`
const SetButton = styled.button<{ $done: boolean }>`
  width: 49px; height: 49px; border-radius: 13px; font-weight: 750;
  border: 1px solid ${({ theme, $done }) => $done ? theme.accent : theme.border};
  background: ${({ theme, $done }) => $done ? theme.accent : theme.elevated};
  color: ${({ theme, $done }) => $done ? theme.onAccent : theme.text};
  &:hover { border-color: ${({ theme }) => theme.accent}; }
`

export function SetTracker({ entry }: { entry: RoutineEntry }) {
  const marks = useAppStore(state => state.completed[entry.id])
  const toggleSet = useAppStore(state => state.toggleSet)
  const exercises = useAppStore(state => state.exercises)
  const name = exercises.find(exercise => exercise.id === entry.exerciseId)?.name
  return (
    <div>
      <strong>{name ?? 'Ejercicio eliminado'}</strong>
      <Grid aria-label={`Series de ${name ?? 'ejercicio'}`}>
        {Array.from({ length: entry.sets }, (_, index) => (
          <SetButton key={index} $done={marks?.[index] ?? false}
            aria-label={`${name}, serie ${index + 1}, ${marks?.[index] ? 'completada' : 'pendiente'}`}
            aria-pressed={marks?.[index] ?? false} onClick={() => toggleSet(entry.id, index)}>
            {marks?.[index] ? '✓' : index + 1}
          </SetButton>
        ))}
      </Grid>
    </div>
  )
}
