import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../store'
import { Button } from '../components/atoms/Button'
import { TextField } from '../components/atoms/TextField'
import { RoutineEditor } from '../components/organisms/RoutineEditor'

const Stack = styled.div`display:grid; gap:1rem; align-content:start;`
const Form = styled.form`display:flex; gap:.6rem; flex-wrap:wrap; > input { flex:1 1 230px; }`
const List = styled.div`display:grid; gap:.5rem;`
const Tile = styled.button<{ $active: boolean }>`width:100%; min-height:54px; padding:.7rem 1rem; text-align:left; border-radius:12px; border:2px solid ${({ theme, $active }) => $active ? theme.accentStrong : theme.border}; color:${({ theme }) => theme.text}; background:${({ theme }) => theme.surface}; font-weight:700; overflow-wrap:anywhere;`
const Note = styled.p`color:${({ theme }) => theme.muted}; margin:0;`

export function RoutinesPage() {
  const [name, setName] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const routines = useAppStore(state => state.routines)
  const addRoutine = useAppStore(state => state.addRoutine)
  const activeId = selectedId === '' ? '' : routines.some(routine => routine.id === selectedId)
    ? selectedId! : routines[0]?.id ?? ''
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    addRoutine(name.trim())
    setSelectedId(useAppStore.getState().routines.at(-1)?.id ?? null)
    setName('')
  }
  return (
    <Stack>
      <div><h1>Organizar rutinas</h1><Note>Crea una rutina y agrega ejercicios del catálogo o nuevos.</Note></div>
      <Form onSubmit={submit}>
        <TextField aria-label="Nombre de la nueva rutina" placeholder="Nueva rutina, por ejemplo, Día A" maxLength={80} value={name} onChange={event => setName(event.target.value)} />
        <Button type="submit" variant="primary" disabled={!name.trim() || routines.length >= 100}>Crear rutina</Button>
      </Form>
      {!!routines.length && <List aria-label="Rutinas para editar">{routines.map(routine =>
        <Tile key={routine.id} $active={activeId === routine.id} aria-expanded={activeId === routine.id} onClick={() => setSelectedId(activeId === routine.id ? '' : routine.id)}>{routine.name} · {routine.entries.length} ejercicios</Tile>
      )}</List>}
      {activeId && <RoutineEditor key={activeId} id={activeId} />}
    </Stack>
  )
}
