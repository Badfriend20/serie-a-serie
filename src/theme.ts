import { createGlobalStyle } from 'styled-components'
import type { Accent, ThemeMode } from './model'

const accents: Record<Accent, string> = {
  coral: '#f7866b', mint: '#51cdaa', violet: '#a49cff'
}

export const makeTheme = (mode: ThemeMode, accent: Accent, prefersDark: boolean) => {
  const dark = mode === 'dark' || (mode === 'system' && prefersDark)
  return {
    dark,
    accent: accents[accent],
    background: dark ? '#10131b' : '#f4f2ed',
    surface: dark ? '#1b202b' : '#ffffff',
    elevated: dark ? '#282e3a' : '#f4f2ed',
    text: dark ? '#f7f5f1' : '#20242b',
    muted: dark ? '#aab2c1' : '#5c6572',
    border: dark ? '#38404e' : '#dde0df',
    onAccent: '#171b22'
  }
}

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { color-scheme: ${({ theme }) => theme.dark ? 'dark' : 'light'}; }
  body { margin: 0; min-width: 320px; background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text}; font: 16px/1.5 system-ui, -apple-system, Segoe UI, sans-serif; }
  button, input, select { font: inherit; }
  button { cursor: pointer; }
  button:focus-visible, input:focus-visible, select:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent}; outline-offset: 3px;
  }
  ::selection { background: ${({ theme }) => theme.accent}; color: ${({ theme }) => theme.onAccent}; }
`
