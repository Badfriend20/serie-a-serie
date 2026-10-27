import { useRef, useState, type ChangeEvent } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../store'
import { parseBackup, type Accent, type ThemeMode } from '../model'
import { Button } from '../components/atoms/Button'
import { Surface } from '../components/atoms/Surface'

const Stack = styled.div`display:grid; gap:1rem;`
const Group = styled.div`display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.65rem;`
const Note = styled.p`color:${({ theme }) => theme.muted}; margin:.4rem 0;`
const HiddenInput = styled.input`position:absolute; width:1px; height:1px; opacity:0; pointer-events:none;`

export function SettingsPage() {
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const mode = useAppStore(state => state.mode)
  const accent = useAppStore(state => state.accent)
  const setMode = useAppStore(state => state.setMode)
  const setAccent = useAppStore(state => state.setAccent)
  const importData = useAppStore(state => state.importData)
  const download = () => {
    const { exercises, routines, completed, mode, accent } = useAppStore.getState()
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, data: { exercises, routines, completed, mode, accent } }, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'serie-a-serie-respaldo.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 2_000_000) { setMessage('El archivo supera el límite de 2 MB.'); return }
    try {
      const data = parseBackup(JSON.parse(await file.text()))
      if (window.confirm('¿Reemplazar todos los datos actuales con este respaldo?')) {
        importData(data)
        setMessage('Respaldo importado correctamente.')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo leer el respaldo.')
    }
  }
  return (
    <Stack>
      <h1>Personalización</h1>
      <Surface><h2>Apariencia</h2><Note>Tema</Note>
        <Group>{([['system', 'Sistema'], ['light', 'Claro'], ['dark', 'Oscuro']] as [ThemeMode, string][]).map(([value, label]) =>
          <Button key={value} variant={mode === value ? 'primary' : 'secondary'} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</Button>)}</Group>
        <Note>Color</Note>
        <Group>{([['coral', 'Coral'], ['mint', 'Menta'], ['violet', 'Violeta']] as [Accent, string][]).map(([value, label]) =>
          <Button key={value} variant={accent === value ? 'primary' : 'secondary'} aria-pressed={accent === value} onClick={() => setAccent(value)}>{label}</Button>)}</Group>
      </Surface>
      <Surface><h2>Tus datos</h2>
        <Note>Se guardan en este navegador y dispositivo. La liga comparte la aplicación, no tus rutinas. Si borras los datos del navegador, perderás tus marcas salvo que tengas un respaldo.</Note>
        <Group><Button onClick={download}>Exportar respaldo</Button><Button onClick={() => fileRef.current?.click()}>Importar respaldo</Button></Group>
        <HiddenInput ref={fileRef} type="file" accept="application/json,.json" aria-label="Seleccionar respaldo JSON" onChange={upload} />
        {message && <p role="status">{message}</p>}
      </Surface>
    </Stack>
  )
}
