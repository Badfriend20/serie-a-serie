import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../../store'
import { Button } from '../atoms/Button'
import { Surface } from '../atoms/Surface'
import { TextField } from '../atoms/TextField'

const Stack = styled.div`display:grid; gap:1rem;`
const Row = styled.div`display:flex; align-items:center; justify-content:space-between; gap:.7rem; flex-wrap:wrap; padding:.7rem 0; border-bottom:1px solid ${({ theme }) => theme.border}; &:last-child { border:0; }`
const Actions = styled.div`display:flex; align-items:center; gap:.4rem; flex-wrap:wrap;`
const Form = styled.form`display:flex; flex-wrap:wrap; align-items:end; gap:.5rem; > div { flex:1 1 190px; }`
const Select = styled.select`width:100%; min-height:44px; padding:.5rem; background:${({ theme }) => theme.elevated}; color:${({ theme }) => theme.text}; border:1px solid ${({ theme }) => theme.border}; border-radius:10px;`
const Label = styled.label`display:block; font-weight:650; margin-bottom:.35rem;`
const Note = styled.p`color:${({ theme }) => theme.muted}; margin:.3rem 0;`

export function RoutineEditor({ id }: { id: string }) {
  const [selected, setSelected] = useState('')
  const [name, setName] = useState('')
  const routine = useAppStore(state => state.routines.find(item => item.id === id))
  const exercises = useAppStore(state => state.exercises)
  const { addEntry, createExerciseInRoutine, removeEntry, moveEntry, setCount, renameRoutine, removeRoutine } = useAppStore.getState()
  const create = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    createExerciseInRoutine(id, name)
    setName('')
  }
  return (
    <Surface aria-label={`Editar ${routine?.name ?? 'rutina'}`}>
      <Stack>
        <div><h2>{routine?.name}</h2><Note>Organiza los ejercicios y la cantidad de series.</Note></div>
        <div>{routine?.entries.map((entry, index) => <Row key={entry.id}>
          <strong>{index + 1}. {exercises.find(exercise => exercise.id === entry.exerciseId)?.name ?? 'Ejercicio eliminado'}</strong>
          <Actions>
            <Button size="small" aria-label={`Quitar una serie del ejercicio ${index + 1}`} disabled={entry.sets <= 1} onClick={() => setCount(id, entry.id, entry.sets - 1)}>−</Button>
            <span aria-label={`${entry.sets} series`}>{entry.sets} series</span>
            <Button size="small" aria-label={`Agregar una serie al ejercicio ${index + 1}`} disabled={entry.sets >= 20} onClick={() => setCount(id, entry.id, entry.sets + 1)}>+</Button>
            <Button size="small" aria-label={`Subir ejercicio ${index + 1}`} disabled={index === 0} onClick={() => moveEntry(id, entry.id, -1)}>↑</Button>
            <Button size="small" aria-label={`Bajar ejercicio ${index + 1}`} disabled={index === routine.entries.length - 1} onClick={() => moveEntry(id, entry.id, 1)}>↓</Button>
            <Button size="small" variant="danger" onClick={() => {
              if (window.confirm('¿Quitar el ejercicio y sus registros de esta rutina?')) removeEntry(id, entry.id)
            }}>Quitar</Button>
          </Actions>
        </Row>)}</div>
        {!routine?.entries.length && <Note>Esta rutina aún no tiene ejercicios.</Note>}
        <Form onSubmit={event => { event.preventDefault(); if (selected) { addEntry(id, selected); setSelected('') } }}>
          <div><Label htmlFor={`choose-${id}`}>Del catálogo</Label><Select id={`choose-${id}`} value={selected} onChange={event => setSelected(event.target.value)}>
            <option value="">Elegir ejercicio…</option>
            {exercises.map(exercise => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}
          </Select></div>
          <Button variant="primary" type="submit" disabled={!selected || (routine?.entries.length ?? 0) >= 500}>Agregar</Button>
        </Form>
        <Form onSubmit={create}>
          <div><Label htmlFor={`new-${id}`}>O crea un ejercicio aquí</Label><TextField id={`new-${id}`} placeholder="Nombre del ejercicio" maxLength={80} value={name} onChange={event => setName(event.target.value)} /></div>
          <Button variant="primary" type="submit" disabled={!name.trim() || exercises.length >= 500 || (routine?.entries.length ?? 0) >= 500}>Crear y agregar</Button>
        </Form>
        <Actions>
          <Button onClick={() => {
            const next = window.prompt('Nuevo nombre de la rutina', routine?.name)?.trim()
            if (next && next.length <= 80) renameRoutine(id, next)
          }}>Renombrar rutina</Button>
          <Button variant="danger" onClick={() => {
            if (window.confirm(`¿Eliminar «${routine?.name}» y todos sus registros?`)) removeRoutine(id)
          }}>Eliminar rutina</Button>
        </Actions>
      </Stack>
    </Surface>
  )
}
