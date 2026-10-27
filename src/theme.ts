import { createGlobalStyle } from 'styled-components'
import type { Accent, ThemeMode } from './model'

const accents: Record<Accent, string> = {
  coral: '#f7866b', mint: '#51cdaa', violet: '#a49cff'
}
const strongAccents: Record<Accent, string> = {
  coral: '#a1402d', mint: '#176d51', violet: '#5642b7'
}

const backgrounds: Record<Accent, { light: string; dark: string }> = {
  coral: { light: '#faf4f0', dark: '#181519' },
  mint: { light: '#eff8f4', dark: '#111b19' },
  violet: { light: '#f4f1fb', dark: '#171521' }
}

export const makeTheme = (mode: ThemeMode, accent: Accent, prefersDark: boolean) => {
  const dark = mode === 'dark' || (mode === 'system' && prefersDark)
  return {
    dark,
    accent: accents[accent],
    accentStrong: dark ? accents[accent] : strongAccents[accent],
    background: backgrounds[accent][dark ? 'dark' : 'light'],
    surface: dark ? '#20242e' : '#ffffff',
    elevated: dark ? '#2d3340' : '#f4f3f1',
    text: dark ? '#f7f7fa' : '#20242b',
    muted: dark ? '#b9c1cd' : '#515b67',
    border: dark ? '#465060' : '#d2d7dc',
    success: dark ? '#67e2a3' : '#176f48',
    successSurface: dark ? '#153329' : '#e6f5ec',
    onSuccess: dark ? '#10251b' : '#ffffff',
    onAccent: '#171b22'
  }
}

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { color-scheme: ${({ theme }) => theme.dark ? 'dark' : 'light'}; }
  body { margin: 0; min-width: 320px; background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text}; font: 16px/1.5 system-ui, -apple-system, Segoe UI, sans-serif; }
  #root { min-height: 100dvh; }
  button, input, select { font: inherit; }
  button { cursor: pointer; }
  button:focus-visible, input:focus-visible, select:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accentStrong}; outline-offset: 3px;
  }
  ::selection { background: ${({ theme }) => theme.accent}; color: ${({ theme }) => theme.onAccent}; }
`
