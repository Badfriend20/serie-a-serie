import type { ComponentProps } from 'react'
import styled from 'styled-components'

const Input = styled.input`
  min-width: 0; width: 100%; min-height: 44px; padding: .7rem .85rem;
  border: 1px solid ${({ theme }) => theme.border}; border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.elevated}; color: ${({ theme }) => theme.text};
  &::placeholder { color: ${({ theme }) => theme.muted}; }
`

export function TextField(props: ComponentProps<'input'>) {
  return <Input {...props} />
}
