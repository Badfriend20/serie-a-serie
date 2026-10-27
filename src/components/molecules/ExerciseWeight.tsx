import { useState } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../../store'

const KG_PER_LB = 0.45359237
const Shell = styled.div`margin-top:.85rem; padding-top:.55rem; border-top:1px solid ${({ theme }) => theme.border};`
const Disclosure = styled.button`
  display:flex; align-items:center; justify-content:space-between; gap:.5rem; width:100%;
  min-height:44px; padding:.1rem 0; border:0; background:transparent; color:${({ theme }) => theme.text}; text-align:left;
`
const Label = styled.span`color:${({ theme }) => theme.muted}; font-size:.85rem; font-weight:650;`
const Summary = styled.span`font-size:.85rem; font-weight:650; font-variant-numeric:tabular-nums; overflow-wrap:anywhere;`
const Arrow = styled.span`flex:none; color:${({ theme }) => theme.muted}; font-size:1.1rem; line-height:1;`
const Fields = styled.div`display:flex; flex-wrap:wrap; align-items:center; gap:.4rem .65rem; padding:.35rem 0 .2rem;`
const Input = styled.input`width:82px; min-height:40px; padding:.35rem .45rem; background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.text}; border:1px solid ${({ theme }) => theme.border}; border-radius:9px; font-variant-numeric:tabular-nums;`
const UnitSwitch = styled.button`
  display:inline-flex; align-items:center; gap:.15rem; min-height:40px; padding:2px;
  border:1px solid ${({ theme }) => theme.border}; border-radius:10px;
  background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.text}; font-size:.8rem; font-weight:750;
`
const UnitHalf = styled.span<{ $selected: boolean }>`
  display:grid; place-items:center; min-width:30px; min-height:32px; padding:.2rem .3rem; border-radius:7px;
  background:${({ theme, $selected }) => $selected ? theme.accent : theme.elevated};
  color:${({ theme, $selected }) => $selected ? theme.onAccent : theme.muted};
  transition:background .15s ease, color .15s ease;
`
const Track = styled.span`position:relative; width:34px; height:20px; border-radius:20px; background:${({ theme }) => theme.border};`
const Knob = styled.span<{ $lb: boolean }>`
  position:absolute; top:3px; left:${({ $lb }) => $lb ? '17px' : '3px'}; width:14px; height:14px;
  border-radius:50%; background:${({ theme }) => theme.accentStrong}; transition:left .15s ease;
`
const Converted = styled.span`color:${({ theme }) => theme.muted}; font-size:.8rem; font-variant-numeric:tabular-nums; white-space:nowrap;`

const display = (value: number | null) => value === null ? '' : String(Math.round(value * 100) / 100)

export function ExerciseWeight({ entryId, exerciseName }: { entryId: string; exerciseName: string }) {
  const weight = useAppStore(state => state.weightsKg[entryId] ?? null)
  const setWeightKg = useAppStore(state => state.setWeightKg)
  const [expanded, setExpanded] = useState(false)
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [editing, setEditing] = useState<string | null>(null)
  const change = (value: string) => {
    setEditing(value)
    if (value === '') { setWeightKg(entryId, null); return }
    const number = Number(value)
    if (Number.isFinite(number) && number >= 0) setWeightKg(entryId, unit === 'kg' ? number : number * KG_PER_LB)
  }
  return (
    <Shell>
      <Disclosure type="button" aria-expanded={expanded} aria-controls={expanded ? `weight-fields-${entryId}` : undefined}
        aria-label={`${expanded ? 'Ocultar' : 'Mostrar'} peso de ${exerciseName}`}
        onClick={() => { setExpanded(!expanded); setEditing(null) }}>
        {(expanded || weight === null) && <Label>Peso (opcional)</Label>}
        {!expanded && weight !== null && <Summary>{display(weight)} kg · {display(weight / KG_PER_LB)} lb</Summary>}
        <Arrow aria-hidden="true">{expanded ? '▴' : '▾'}</Arrow>
      </Disclosure>
      {expanded && <Fields id={`weight-fields-${entryId}`}>
        <Input type="number" min="0" max={unit === 'kg' ? '10000' : '22046.23'} step="any" inputMode="decimal"
          placeholder="—" aria-label={`Peso de ${exerciseName} en ${unit === 'kg' ? 'kilogramos' : 'libras'}`}
          value={editing ?? display(weight === null ? null : unit === 'kg' ? weight : weight / KG_PER_LB)}
          onChange={event => change(event.target.value)} onBlur={() => setEditing(null)} />
        <UnitSwitch type="button" role="switch" aria-checked={unit === 'lb'}
          aria-label={`Unidad de peso de ${exerciseName}: ${unit}`}
          onClick={() => { setUnit(unit === 'kg' ? 'lb' : 'kg'); setEditing(null) }}>
          <UnitHalf $selected={unit === 'kg'}>kg</UnitHalf>
          <Track aria-hidden="true"><Knob $lb={unit === 'lb'} /></Track>
          <UnitHalf $selected={unit === 'lb'}>lb</UnitHalf>
        </UnitSwitch>
        {weight !== null && <Converted>≈ {display(unit === 'kg' ? weight / KG_PER_LB : weight)} {unit === 'kg' ? 'lb' : 'kg'}</Converted>}
      </Fields>}
    </Shell>
  )
}
