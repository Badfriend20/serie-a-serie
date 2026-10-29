import styled from 'styled-components'
import { DEFAULT_REST_SECONDS } from '../../config'
import { Button } from '../atoms/Button'
import { ToggleSwitch } from '../atoms/ToggleSwitch'

const Controls = styled.div`
  display:flex; flex-wrap:wrap; align-items:center; gap:${({ theme }) => theme.space.sm};
  margin-top:${({ theme }) => theme.space.sm};
`
const Label = styled.span`color:${({ theme }) => theme.muted}; font-size:.85rem; font-weight:650;`
const Count = styled.strong`color:${({ theme }) => theme.success}; font-variant-numeric:tabular-nums;`
const Ready = styled.span`color:${({ theme }) => theme.success}; font-size:.85rem; font-weight:750;`

export function RestTimerControls({ enabled, remaining, onToggle, onSkip }: {
  enabled: boolean; remaining: number | null; onToggle: (enabled: boolean) => void; onSkip: () => void
}) {
  const time = remaining === null ? '' : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`
  return <Controls>
    <Label>⏱ Descanso</Label>
    <ToggleSwitch left="No" right="Sí" checked={enabled} onChange={onToggle} label="Temporizador de descanso" />
    {enabled && remaining === null && <Label>{DEFAULT_REST_SECONDS} s por defecto</Label>}
    {enabled && remaining !== null && <>
      {remaining > 0 ? <Count role="timer" aria-label={`Descanso restante: ${time}`}>{time}</Count>
        : <Ready role="status">¡Descanso terminado!</Ready>}
      <Button variant="quiet" size="small" onClick={onSkip}>Omitir</Button>
    </>}
  </Controls>
}
