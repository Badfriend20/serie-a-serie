import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { useAppStore } from './store'
import { makeTheme, GlobalStyle } from './theme'
import { AppShell } from './components/layout/AppShell'

function App() {
  const mode = useAppStore(state => state.mode)
  const accent = useAppStore(state => state.accent)
  const [prefersDark, setPrefersDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setPrefersDark(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return <ThemeProvider theme={makeTheme(mode, accent, prefersDark)}><GlobalStyle /><AppShell /></ThemeProvider>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
