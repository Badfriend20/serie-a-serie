import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../store'
import { Button } from '../components/atoms/Button'
import { TextField } from '../components/atoms/TextField'
import { RoutineEditor } from '../components/organisms/RoutineEditor'
import { MAX_NAME_LENGTH, MAX_ROUTINES } from '../config'

const Stack = styled.div`display:grid; gap:1rem; align-content:start;`
const Form = styled.form`display:flex; gap:.6rem; flex-wrap:wrap; > input { flex:1 1 230px; }`
const List = styled.div`display:grid; gap:.5rem;`
const Group = styled.div<{ $active: boolean }>`
  min-width:0; border:2px solid ${({ theme, $active }) => $active ? theme.accentStrong : theme.border};
  border-radius:14px; overflow:hidden; background:${({ theme }) => theme.surface};
`
const Tile = styled.button<{ $active: boolean }>`
  width:100%; min-height:54px; padding:.7rem 1rem; text-align:left; border:0;
  color:${({ theme }) => theme.text}; background:${({ theme, $active }) => $active ? theme.elevated : theme.surface};
  font-weight:700; overflow-wrap:anywhere;
`
const EditorPanel = styled.div`
  padding:.75rem; border-top:1px solid ${({ theme }) => theme.border};
  > section { box-shadow:none; }
`
const Note = styled.p`color:${({ theme }) => theme.muted}; margin:0;`

export function RoutinesPage() {
  const [name, setName] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const routines = useAppStore(state => state.routines)
  const addRoutine = useAppStore(state => state.addRoutine)
  const activeId = routines.some(routine => routine.id === selectedId) ? selectedId : null
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    addRoutine(name.trim())
    setName('')
  }
  return (
    <Stack>
      <div><h1>Organizar rutinas</h1><Note>Crea una rutina y agrega ejercicios del catálogo o nuevos.</Note></div>
      <Form onSubmit={submit}>
        <TextField aria-label="Nombre de la nueva rutina" placeholder="Nueva rutina, por ejemplo, Día A" maxLength={MAX_NAME_LENGTH} value={name} onChange={event => setName(event.target.value)} />
        <Button type="submit" variant="primary" disabled={!name.trim() || routines.length >= MAX_ROUTINES}>Crear rutina</Button>
      </Form>
      {!!routines.length && <List aria-label="Rutinas para editar">{routines.map(routine =>
        <Group key={routine.id} $active={activeId === routine.id}>
          <Tile $active={activeId === routine.id} aria-expanded={activeId === routine.id}
            aria-controls={activeId === routine.id ? `routine-editor-${routine.id}` : undefined}
            onClick={() => setSelectedId(activeId === routine.id ? null : routine.id)}>
            {routine.name} · {routine.entries.length} ejercicios
          </Tile>
          {activeId === routine.id && <EditorPanel id={`routine-editor-${routine.id}`}>
            <RoutineEditor id={routine.id} />
          </EditorPanel>}
        </Group>
      )}</List>}
    </Stack>
  )
}
