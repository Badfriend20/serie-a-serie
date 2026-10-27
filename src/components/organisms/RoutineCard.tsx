import { useState } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../../store'
import { Button } from '../atoms/Button'
import { Surface } from '../atoms/Surface'
import { SetTracker } from '../molecules/SetTracker'

const Header = styled.div`display:flex; justify-content:space-between; align-items:start; gap:1rem; h2 { margin:0; font-size:1.2rem; }`
const Muted = styled.p`color:${({ theme }) => theme.muted}; margin:.25rem 0 0; font-size:.88rem;`
const Actions = styled.div`display:flex; flex-wrap:wrap; gap:.45rem; margin-top:1.1rem;`
const Items = styled.div`display:grid; gap:1rem; margin-top:1.2rem;`
const Item = styled.div`padding:1rem; background:${({ theme }) => theme.elevated}; border-radius:15px;`
const EditRow = styled.div`display:flex; flex-wrap:wrap; align-items:center; gap:.45rem; margin-top:.75rem;`
const Select = styled.select`width:100%; min-height:44px; padding:.5rem; background:${({ theme }) => theme.elevated}; color:${({ theme }) => theme.text}; border:1px solid ${({ theme }) => theme.border}; border-radius:10px; margin-top:1rem;`
const Count = styled.span`font-weight:700; min-width:2ch; text-align:center;`

export function RoutineCard({ id }: { id: string }) {
  const [editing, setEditing] = useState(false)
  const [selected, setSelected] = useState('')
  const routines = useAppStore(state => state.routines)
  const routine = routines.find(item => item.id === id)
  const exercises = useAppStore(state => state.exercises)
  const completed = useAppStore(state => state.completed)
  const { addEntry, removeEntry, moveEntry, setCount, resetRoutine, renameRoutine, removeRoutine } = useAppStore.getState()
  const total = routine?.entries.reduce((sum, entry) => sum + entry.sets, 0) ?? 0
  const done = routine?.entries.reduce((sum, entry) => sum + (completed[entry.id]?.filter(Boolean).length ?? 0), 0) ?? 0
  const handleRename = () => {
    const name = window.prompt('Nuevo nombre de la rutina', routine?.name)?.trim()
    if (name && name.length <= 80) renameRoutine(id, name)
  }
  return (
    <Surface>
      <Header>
        <div><h2>{routine?.name}</h2><Muted>{done} de {total} series completas</Muted></div>
        <Button size="small" variant="quiet" aria-expanded={editing} onClick={() => setEditing(!editing)}>
          {editing ? 'Listo' : 'Editar'}
        </Button>
      </Header>
      {routine?.entries.length ? <Items>{routine.entries.map((entry, index) => (
        <Item key={entry.id}>
          <SetTracker entry={entry} />
          {editing && <EditRow>
            <Button size="small" aria-label="Quitar una serie" disabled={entry.sets <= 1} onClick={() => setCount(id, entry.id, entry.sets - 1)}>−</Button>
            <Count>{entry.sets}</Count>
            <Button size="small" aria-label="Agregar una serie" disabled={entry.sets >= 20} onClick={() => setCount(id, entry.id, entry.sets + 1)}>+</Button>
            <Button size="small" aria-label="Mover ejercicio arriba" disabled={index === 0} onClick={() => moveEntry(id, entry.id, -1)}>↑</Button>
            <Button size="small" aria-label="Mover ejercicio abajo" disabled={index === routine.entries.length - 1} onClick={() => moveEntry(id, entry.id, 1)}>↓</Button>
            <Button size="small" variant="danger" onClick={() => removeEntry(id, entry.id)}>Quitar</Button>
          </EditRow>}
        </Item>
      ))}</Items> : <Muted>Sin ejercicios. Agrégalos desde Editar.</Muted>}
      {editing && <>
        <Select aria-label="Elegir ejercicio" value={selected} onChange={event => setSelected(event.target.value)}>
          <option value="">Elegir ejercicio…</option>
          {exercises.map(exercise => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}
        </Select>
        <Actions>
          <Button variant="primary" size="small" disabled={!selected || (routine?.entries.length ?? 0) >= 500} onClick={() => { addEntry(id, selected); setSelected('') }}>Agregar ejercicio</Button>
          <Button size="small" onClick={handleRename}>Renombrar</Button>
          <Button size="small" variant="danger" onClick={() => {
            if (window.confirm(`¿Eliminar «${routine?.name}» y sus marcas?`)) removeRoutine(id)
          }}>Eliminar rutina</Button>
        </Actions>
      </>}
      {!editing && done > 0 && <Actions><Button size="small" variant="quiet" onClick={() => {
        if (window.confirm('¿Reiniciar las marcas de esta rutina?')) resetRoutine(id)
      }}>Reiniciar marcas</Button></Actions>}
    </Surface>
  )
}
