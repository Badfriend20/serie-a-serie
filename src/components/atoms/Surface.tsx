import type { ComponentProps } from 'react'
import styled from 'styled-components'

const Card = styled.section`
  padding: 1.25rem; border-radius: 20px; background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 8px 32px rgba(0,0,0,.035);
`

export function Surface(props: ComponentProps<'section'>) {
  return <Card {...props} />
}
