import { useState } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../../store'

const KG_PER_LB = 0.45359237
const Fields = styled.div`display:flex; flex-wrap:wrap; align-items:center; gap:.4rem;`
const Field = styled.label`display:inline-flex; align-items:center; gap:.3rem; color:${({ theme }) => theme.muted}; font-size:.85rem; font-weight:650;`
const Input = styled.input`width:76px; min-height:40px; padding:.35rem .45rem; background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.text}; border:1px solid ${({ theme }) => theme.border}; border-radius:9px; font-variant-numeric:tabular-nums;`

const display = (value: number | null) => value === null ? '' : String(Math.round(value * 100) / 100)

export function ExerciseWeight({ entryId, exerciseName }: { entryId: string; exerciseName: string }) {
  const weight = useAppStore(state => state.weightsKg[entryId] ?? null)
  const setWeightKg = useAppStore(state => state.setWeightKg)
  const [editing, setEditing] = useState<{ unit: 'kg' | 'lb'; value: string } | null>(null)
  const change = (unit: 'kg' | 'lb', value: string) => {
    setEditing({ unit, value })
    if (value === '') { setWeightKg(entryId, null); return }
    const number = Number(value)
    if (Number.isFinite(number) && number >= 0) setWeightKg(entryId, unit === 'kg' ? number : number * KG_PER_LB)
  }
  return (
    <Fields aria-label={`Peso opcional de ${exerciseName}`}>
      <Field>kg<Input type="number" min="0" max="10000" step="any" inputMode="decimal" placeholder="—" aria-label={`${exerciseName}, kilogramos`}
        value={editing?.unit === 'kg' ? editing.value : display(weight)}
        onChange={event => change('kg', event.target.value)} onBlur={() => setEditing(null)} /></Field>
      <Field>lb<Input type="number" min="0" max="22046.23" step="any" inputMode="decimal" placeholder="—" aria-label={`${exerciseName}, libras`}
        value={editing?.unit === 'lb' ? editing.value : display(weight === null ? null : weight / KG_PER_LB)}
        onChange={event => change('lb', event.target.value)} onBlur={() => setEditing(null)} /></Field>
    </Fields>
  )
}
