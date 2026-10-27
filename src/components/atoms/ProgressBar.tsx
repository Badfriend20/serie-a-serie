import styled from 'styled-components'

const Track = styled.progress`
  appearance: none; display: block; width: 100%; height: 9px; border: 0;
  border-radius: 999px; overflow: hidden; background: ${({ theme }) => theme.elevated};
  &::-webkit-progress-bar { background: ${({ theme }) => theme.elevated}; border-radius: 999px; }
  &::-webkit-progress-value { background: ${({ theme }) => theme.success}; border-radius: 999px; }
  &::-moz-progress-bar { background: ${({ theme }) => theme.success}; border-radius: 999px; }
`

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return <Track value={value} max={100} aria-label={label} />
}
