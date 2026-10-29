import styled from 'styled-components'

const Control = styled.button`
  display:inline-flex; align-items:center; gap:.15rem; min-height:40px; padding:2px;
  border:1px solid ${({ theme }) => theme.border}; border-radius:${({ theme }) => theme.radius.sm};
  background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.text}; font-size:.8rem; font-weight:750;
`
const Half = styled.span<{ $selected: boolean }>`
  display:grid; place-items:center; min-width:30px; min-height:32px; padding:.2rem .3rem; border-radius:7px;
  background:${({ theme, $selected }) => $selected ? theme.accent : theme.elevated};
  color:${({ theme, $selected }) => $selected ? theme.onAccent : theme.muted};
  transition:background .15s ease, color .15s ease;
`
const Track = styled.span`position:relative; width:34px; height:20px; border-radius:20px; background:${({ theme }) => theme.border};`
const Knob = styled.span<{ $right: boolean }>`
  position:absolute; top:3px; left:${({ $right }) => $right ? '17px' : '3px'}; width:14px; height:14px;
  border-radius:50%; background:${({ theme }) => theme.accentStrong}; transition:left .15s ease;
`

export function ToggleSwitch({ left, right, checked, onChange, label }: {
  left: string; right: string; checked: boolean; onChange: (checked: boolean) => void; label: string
}) {
  return <Control type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}>
    <Half $selected={!checked}>{left}</Half>
    <Track aria-hidden="true"><Knob $right={checked} /></Track>
    <Half $selected={checked}>{right}</Half>
  </Control>
}
