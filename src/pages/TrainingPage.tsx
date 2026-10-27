import { useState } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../store'
import { RoutineCard } from '../components/organisms/RoutineCard'
import { RoutinePicker } from '../components/organisms/RoutinePicker'

const Stack = styled.div`display:grid; gap:1rem; align-content:start;`
const Note = styled.p`color:${({ theme }) => theme.muted}; margin:0;`

export function TrainingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const routines = useAppStore(state => state.routines)
  const activeId = selectedId === '' ? '' : routines.some(routine => routine.id === selectedId)
    ? selectedId! : routines[0]?.id ?? ''
  return (
    <Stack>
      <div><h1>Entrenar</h1><Note>Marca tus series y registra el peso si lo deseas. Todo se guarda en este dispositivo.</Note></div>
      {routines.length ? <>
        <RoutinePicker activeId={activeId} onSelect={id => setSelectedId(activeId === id ? '' : id)} />
        {activeId ? <RoutineCard key={activeId} id={activeId} /> : <Note>Elige una rutina para ver sus series.</Note>}
      </> : <Note>Todavía no hay rutinas. Ve a Rutinas para crear la primera.</Note>}
    </Stack>
  )
}
