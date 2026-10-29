import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../store'
import { Button } from '../components/atoms/Button'
import { Surface } from '../components/atoms/Surface'
import { TextField } from '../components/atoms/TextField'
import { MAX_EXERCISES, MAX_NAME_LENGTH } from '../config'

const Stack = styled.div`display:grid; gap:1rem;`
const Form = styled.form`display:flex; gap:.6rem; flex-wrap:wrap; > input { flex:1 1 230px; }`
const Row = styled.div`display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:.7rem; padding:.65rem 0; border-bottom:1px solid ${({ theme }) => theme.border}; &:last-child { border:0; }`
const Actions = styled.div`display:flex; gap:.35rem;`
const Note = styled.p`color:${({ theme }) => theme.muted};`

export function ExercisesPage() {
  const [name, setName] = useState('')
  const exercises = useAppStore(state => state.exercises)
  const addExercise = useAppStore(state => state.addExercise)
  const renameExercise = useAppStore(state => state.renameExercise)
  const removeExercise = useAppStore(state => state.removeExercise)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    addExercise(name.trim())
    setName('')
  }
  return (
    <Stack>
      <div><h1>Ejercicios</h1><Note>Tu catálogo se puede usar en tantas rutinas como quieras.</Note></div>
      <Form onSubmit={submit}>
        <TextField aria-label="Nombre del ejercicio" placeholder="Por ejemplo, remo" maxLength={MAX_NAME_LENGTH} value={name} onChange={event => setName(event.target.value)} />
        <Button type="submit" variant="primary" disabled={!name.trim() || exercises.length >= MAX_EXERCISES}>Agregar</Button>
      </Form>
      <Surface>
        {exercises.length ? exercises.map(exercise => <Row key={exercise.id}>
          <strong>{exercise.name}</strong>
          <Actions>
            <Button size="small" onClick={() => {
              const next = window.prompt('Nuevo nombre del ejercicio', exercise.name)?.trim()
              if (next && next.length <= MAX_NAME_LENGTH) renameExercise(exercise.id, next)
            }}>Editar</Button>
            <Button size="small" variant="danger" onClick={() => {
              if (window.confirm(`¿Eliminar «${exercise.name}» de todas las rutinas y borrar sus marcas?`)) removeExercise(exercise.id)
            }}>Eliminar</Button>
          </Actions>
        </Row>) : <Note>Tu catálogo está vacío. Empieza con un ejercicio.</Note>}
      </Surface>
    </Stack>
  )
}
