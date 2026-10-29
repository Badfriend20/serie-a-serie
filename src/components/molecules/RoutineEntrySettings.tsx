import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DEFAULT_REST_SECONDS, MAX_ENTRY_NOTE_LENGTH, MAX_REST_SECONDS, MIN_REST_SECONDS } from '../../config'
import type { RoutineEntry } from '../../model'
import { useAppStore } from '../../store'
import { TextField } from '../atoms/TextField'

const Fields = styled.div`display:flex; flex-wrap:wrap; gap:${({ theme }) => theme.space.sm}; margin-top:${({ theme }) => theme.space.sm};`
const Field = styled.label<{ $compact?: boolean }>`
  display:grid; gap:.2rem; flex:${({ $compact }) => $compact ? '0 1 120px' : '1 1 200px'};
  color:${({ theme }) => theme.muted}; font-size:.8rem; font-weight:650;
`
const Help = styled.span`font-size:.73rem; font-weight:400;`

export function RoutineEntrySettings({ routineId, entry }: { routineId: string; entry: RoutineEntry }) {
  const setEntryNote = useAppStore(state => state.setEntryNote)
  const setEntryRest = useAppStore(state => state.setEntryRest)
  const [restDraft, setRestDraft] = useState(entry.restSeconds === undefined ? '' : String(entry.restSeconds))
  useEffect(() => setRestDraft(entry.restSeconds === undefined ? '' : String(entry.restSeconds)), [entry.restSeconds])
  const commitRest = () => {
    if (!restDraft.trim()) { setEntryRest(routineId, entry.id, null); return }
    const seconds = Number(restDraft)
    if (Number.isInteger(seconds) && seconds >= MIN_REST_SECONDS && seconds <= MAX_REST_SECONDS) {
      setEntryRest(routineId, entry.id, seconds)
    } else setRestDraft(entry.restSeconds === undefined ? '' : String(entry.restSeconds))
  }
  return <Fields>
    <Field>Nota bajo el ejercicio
      <TextField value={entry.note ?? ''} maxLength={MAX_ENTRY_NOTE_LENGTH}
        placeholder="Ej. 8–12 repeticiones · agarre neutro"
        onChange={event => setEntryNote(routineId, entry.id, event.target.value)} />
    </Field>
    <Field $compact>Descanso (s)
      <TextField type="number" min={MIN_REST_SECONDS} max={MAX_REST_SECONDS} step="1"
        inputMode="numeric" value={restDraft} placeholder={String(DEFAULT_REST_SECONDS)}
        onChange={event => setRestDraft(event.target.value)} onBlur={commitRest} />
      <Help>Vacío: {DEFAULT_REST_SECONDS} s</Help>
    </Field>
  </Fields>
}
