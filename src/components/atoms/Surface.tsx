import type { ComponentProps } from 'react'
import styled from 'styled-components'

const Card = styled.section`
  padding: ${({ theme }) => theme.space.lg}; border-radius: ${({ theme }) => theme.radius.lg}; background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`

export function Surface(props: ComponentProps<'section'>) {
  return <Card {...props} />
}
