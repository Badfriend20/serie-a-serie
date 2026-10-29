import type { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

type Props = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger'
  size?: 'regular' | 'small'
}

const Control = styled.button<{ $variant: NonNullable<Props['variant']>; $size: NonNullable<Props['size']> }>`
  display: inline-flex; align-items: center; justify-content: center; gap: .4rem;
  min-height: ${({ $size }) => $size === 'small' ? '36px' : '44px'};
  padding: ${({ $size }) => $size === 'small' ? '.35rem .7rem' : '.65rem 1rem'};
  border-radius: ${({ theme }) => theme.radius.md}; border: 1px solid transparent; font-weight: 700;
  transition: transform .15s ease, background .15s ease;
  &:active:not(:disabled) { transform: scale(.97); }
  &:disabled { opacity: .45; cursor: not-allowed; }
  ${({ $variant, theme }) => $variant === 'primary' && css`
    background: ${theme.accent}; color: ${theme.onAccent};
  `}
  ${({ $variant, theme }) => $variant === 'secondary' && css`
    background: ${theme.elevated}; color: ${theme.text}; border-color: ${theme.border};
  `}
  ${({ $variant, theme }) => $variant === 'quiet' && css`
    background: transparent; color: ${theme.muted};
  `}
  ${({ $variant, theme }) => $variant === 'danger' && css`
    background: transparent; color: ${theme.danger};
    border-color: ${theme.border};
  `}
`

export function Button({ variant = 'secondary', size = 'regular', type = 'button', ...props }: Props) {
  return <Control $variant={variant} $size={size} type={type} {...props} />
}
