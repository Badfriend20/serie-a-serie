import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../store'
import { Button } from '../components/atoms/Button'
import { TextField } from '../components/atoms/TextField'
import { RoutineCard } from '../components/organisms/RoutineCard'

const Stack = styled.div`display:grid; gap:1rem;`
const Form = styled.form`display:flex; gap:.6rem; flex-wrap:wrap; > input { flex:1 1 230px; }`
const Note = styled.p`color:${({ theme }) => theme.muted}; margin:0;`

export function RoutinesPage() {
  const [name, setName] = useState('')
  const routines = useAppStore(state => state.routines)
  const addRoutine = useAppStore(state => state.addRoutine)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    addRoutine(name.trim())
    setName('')
  }
  return (
    <Stack>
      <div><h1>Mis rutinas</h1><Note>Un toque marca la serie. Las marcas siguen aquí al cerrar la app.</Note></div>
      <Form onSubmit={submit}>
        <TextField aria-label="Nombre de la nueva rutina" placeholder="Nueva rutina, por ejemplo, Día A" maxLength={80} value={name} onChange={event => setName(event.target.value)} />
        <Button type="submit" variant="primary" disabled={!name.trim() || routines.length >= 100}>Crear rutina</Button>
      </Form>
      {routines.length ? routines.map(routine => <RoutineCard key={routine.id} id={routine.id} />) : <Note>Crea una rutina y agrega ejercicios desde el catálogo.</Note>}
    </Stack>
  )
}
