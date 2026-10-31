import { useRef, useState, type ChangeEvent } from 'react'
import styled from 'styled-components'
import { useAppStore } from '../store'
import { createBackup, parseBackup, prepareImport, type Accent, type ParsedBackup, type ThemeMode } from '../model'
import { Button } from '../components/atoms/Button'
import { Surface } from '../components/atoms/Surface'
import { MAX_BACKUP_BYTES } from '../config'
import { readTimerEnabled, readWeightUnit, saveUiState } from '../uiState'

const Stack = styled.div`display:grid; gap:1rem;`
const Group = styled.div`display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.65rem;`
const Note = styled.p`color:${({ theme }) => theme.muted}; margin:.4rem 0;`
const HiddenInput = styled.input`position:absolute; width:1px; height:1px; opacity:0; pointer-events:none;`
const Warning = styled.p`color:${({ theme }) => theme.danger}; font-weight:650;`
const Choice = styled.label`display:flex; align-items:center; gap:${({ theme }) => theme.space.sm}; margin-top:${({ theme }) => theme.space.md}; cursor:pointer; input { width:20px; height:20px; accent-color:${({ theme }) => theme.accentStrong}; }`
const modeNames: Record<ThemeMode, string> = { system: 'Sistema', light: 'Claro', dark: 'Oscuro' }
const accentNames: Record<Accent, string> = { coral: 'Coral', mint: 'Menta', violet: 'Violeta' }

export function SettingsPage() {
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState<{ name: string; backup: ParsedBackup } | null>(null)
  const [keepCurrent, setKeepCurrent] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const mode = useAppStore(state => state.mode)
  const accent = useAppStore(state => state.accent)
  const setMode = useAppStore(state => state.setMode)
  const setAccent = useAppStore(state => state.setAccent)
  const importData = useAppStore(state => state.importData)
  const download = () => {
    const { exercises, routines, completed, weightsKg, mode, accent } = useAppStore.getState()
    const backup = createBackup({ exercises, routines, completed, weightsKg, mode, accent },
      { timerEnabled: readTimerEnabled(), weightUnit: readWeightUnit() })
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'serie-a-serie-respaldo.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 30_000)
  }
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setPending(null)
    if (file.size > MAX_BACKUP_BYTES) { setMessage('El archivo supera el límite de 2 MB.'); return }
    try {
      const backup = parseBackup(JSON.parse(await file.text()))
      const current = useAppStore.getState()
      const incomingIds = new Set(backup.data.routines.flatMap(routine => routine.entries.map(entry => entry.id)))
      const missingWeights = Object.keys(current.weightsKg).some(id => incomingIds.has(id) && backup.data.weightsKg[id] === undefined)
      setKeepCurrent(missingWeights || backup.version === 1 && (current.mode !== backup.data.mode || current.accent !== backup.data.accent))
      setPending({ name: file.name, backup })
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo leer el respaldo.')
    }
  }
  const restore = () => {
    if (!pending) return
    const { data, settings } = pending.backup
    const current = useAppStore.getState()
    const next = prepareImport(data, current, keepCurrent)
    const choice = keepCurrent ? 'Se conservarán los pesos de ejercicios coincidentes y la apariencia actual.' : 'Se usarán los pesos y la apariencia del archivo.'
    if (!window.confirm(`¿Importar ${pending.name}? Se reemplazarán las rutinas y marcas actuales. ${choice}`)) return
    importData(next)
    const timerEnabled = keepCurrent || !settings ? readTimerEnabled() : settings.timerEnabled
    if (!keepCurrent && settings) {
      saveUiState('timerEnabled', String(settings.timerEnabled))
      saveUiState('weightUnit', settings.weightUnit)
    }
    saveUiState('timer', JSON.stringify({ routineId: '', enabled: timerEnabled, endsAt: null }))
    setPending(null)
    setMessage('Respaldo importado correctamente.')
  }
  const currentWeights = useAppStore(state => Object.keys(state.weightsKg).length)
  const backupWeights = pending ? Object.keys(pending.backup.data.weightsKg).length : 0
  const includedIds = pending ? new Set(pending.backup.data.routines.flatMap(routine => routine.entries.map(entry => entry.id))) : new Set<string>()
  const lostWeights = pending ? Object.keys(useAppStore.getState().weightsKg).filter(id => !includedIds.has(id)).length : 0
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
      {pending && <Surface aria-label="Revisar respaldo antes de importar">
        <h2>Revisar antes de importar</h2>
        <Note>{pending.name}</Note>
        <p>Rutinas: {pending.backup.data.routines.length}. Pesos en archivo: {backupWeights}; en este dispositivo: {currentWeights}.</p>
        <p>Apariencia en archivo: {modeNames[pending.backup.data.mode]} · {accentNames[pending.backup.data.accent]}.</p>
        <p>{pending.backup.settings ? `Temporizador: ${pending.backup.settings.timerEnabled ? 'activado' : 'desactivado'}. Unidad: ${pending.backup.settings.weightUnit}.` : 'Respaldo antiguo: no incluye temporizador ni unidad preferida; se conservarán los valores actuales.'}</p>
        {backupWeights === 0 && pending.backup.data.routines.some(routine => routine.entries.length) && <Warning>Este archivo no contiene pesos registrados. No puede recuperar pesos que no fueron guardados en él.</Warning>}
        {lostWeights > 0 && <Warning role="alert">Hay {lostWeights} pesos de ejercicios que no existen en este respaldo; no podrán conservarse al reemplazar las rutinas.</Warning>}
        {currentWeights > backupWeights && <Warning>El archivo contiene menos pesos que los guardados actualmente.</Warning>}
        <Choice><input type="checkbox" checked={keepCurrent} onChange={event => setKeepCurrent(event.target.checked)} />Conservar pesos actuales y apariencia de este dispositivo</Choice>
        <Note>Solo se pueden conservar pesos de ejercicios que también estén en las rutinas del archivo.</Note>
        <Group><Button variant="primary" onClick={restore}>Confirmar importación</Button><Button onClick={() => setPending(null)}>Cancelar</Button></Group>
      </Surface>}
    </Stack>
  )
}
