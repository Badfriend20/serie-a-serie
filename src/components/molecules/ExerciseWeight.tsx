import { useState } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../../store'

const KG_PER_LB = 0.45359237
const Fields = styled.div`display:flex; flex:1 1 220px; flex-wrap:wrap; align-items:center; gap:.4rem .55rem;`
const Input = styled.input`width:82px; min-height:40px; padding:.35rem .45rem; background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.text}; border:1px solid ${({ theme }) => theme.border}; border-radius:9px; font-variant-numeric:tabular-nums;`
const Units = styled.div`display:inline-flex; padding:2px; border:1px solid ${({ theme }) => theme.border}; border-radius:10px; background:${({ theme }) => theme.surface};`
const Unit = styled.button<{ $selected: boolean }>`
  min-width:36px; min-height:34px; padding:.25rem .35rem; border:0; border-radius:7px;
  background:${({ theme, $selected }) => $selected ? theme.elevated : 'transparent'};
  color:${({ theme, $selected }) => $selected ? theme.text : theme.muted};
  font-size:.8rem; font-weight:${({ $selected }) => $selected ? 800 : 600};
`
const Converted = styled.span`color:${({ theme }) => theme.muted}; font-size:.8rem; font-variant-numeric:tabular-nums; white-space:nowrap;`

const display = (value: number | null) => value === null ? '' : String(Math.round(value * 100) / 100)

export function ExerciseWeight({ entryId, exerciseName }: { entryId: string; exerciseName: string }) {
  const weight = useAppStore(state => state.weightsKg[entryId] ?? null)
  const setWeightKg = useAppStore(state => state.setWeightKg)
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [editing, setEditing] = useState<string | null>(null)
  const change = (value: string) => {
    setEditing(value)
    if (value === '') { setWeightKg(entryId, null); return }
    const number = Number(value)
    if (Number.isFinite(number) && number >= 0) setWeightKg(entryId, unit === 'kg' ? number : number * KG_PER_LB)
  }
  return (
    <Fields aria-label={`Peso opcional de ${exerciseName}`}>
      <Input type="number" min="0" max={unit === 'kg' ? '10000' : '22046.23'} step="any" inputMode="decimal"
        placeholder="—" aria-label={`Peso de ${exerciseName} en ${unit === 'kg' ? 'kilogramos' : 'libras'}`}
        value={editing ?? display(weight === null ? null : unit === 'kg' ? weight : weight / KG_PER_LB)}
        onChange={event => change(event.target.value)} onBlur={() => setEditing(null)} />
      <Units role="group" aria-label={`Unidad de peso de ${exerciseName}`}>
        {(['kg', 'lb'] as const).map(value =>
          <Unit key={value} type="button" $selected={unit === value} aria-pressed={unit === value}
            onClick={() => { setUnit(value); setEditing(null) }}>{value}</Unit>)}
      </Units>
      {weight !== null && <Converted>≈ {display(unit === 'kg' ? weight / KG_PER_LB : weight)} {unit === 'kg' ? 'lb' : 'kg'}</Converted>}
    </Fields>
  )
}
