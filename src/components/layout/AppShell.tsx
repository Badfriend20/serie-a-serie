import { useRef, useState } from 'react'
import styled from 'styled-components'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '../atoms/Button'
import { RoutinesPage } from '../../pages/RoutinesPage'
import { TrainingPage } from '../../pages/TrainingPage'
import { ExercisesPage } from '../../pages/ExercisesPage'
import { SettingsPage } from '../../pages/SettingsPage'
import { readUiState, saveUiState } from '../../uiState'

type Page = 'training' | 'routines' | 'exercises' | 'settings'
const Frame = styled.div`max-width:760px; padding:1.1rem 1rem 5rem; margin:auto;`
const Header = styled.header`padding:1.25rem .3rem; display:flex; align-items:center; gap:.75rem;`
const Logo = styled.div`width:42px; height:42px; display:grid; place-items:center; background:${({ theme }) => theme.accent}; color:${({ theme }) => theme.onAccent}; border-radius:13px; font-weight:900;`
const Brand = styled.div`font-size:1.15rem; font-weight:800; letter-spacing:-.035em;`
const Nav = styled.nav`display:flex; gap:.35rem; padding:.3rem; margin: .7rem 0 1.6rem; border-radius:14px; background:${({ theme }) => theme.surface}; border:1px solid ${({ theme }) => theme.border};`
const Tab = styled.button<{ $active: boolean }>`flex:1; padding:.7rem .35rem; border:0; border-radius:10px; font-weight:700; background:${({ theme, $active }) => $active ? theme.elevated : 'transparent'}; color:${({ theme, $active }) => $active ? theme.text : theme.muted};`
const Toast = styled.div`position:fixed; z-index:3; bottom:1rem; left:50%; transform:translateX(-50%); width:min(95%,500px); padding:1rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; background:${({ theme }) => theme.surface}; color:${({ theme }) => theme.text}; border:1px solid ${({ theme }) => theme.border}; border-radius:15px; box-shadow:${({ theme }) => theme.raisedShadow};`

export function AppShell() {
  const [page, setPage] = useState<Page>(() => {
    const saved = readUiState('page')
    return saved === 'routines' || saved === 'exercises' || saved === 'settings' ? saved : 'training'
  })
  const updateRequested = useRef(false)
  const [updateReady, setUpdateReady] = useState(false)
  const { needRefresh: [needRefresh, setNeedRefresh], offlineReady: [offlineReady, setOfflineReady], updateServiceWorker } = useRegisterSW({
    onNeedReload: () => {
      if (updateRequested.current) window.location.reload()
      else setUpdateReady(true)
    }
  })
  const hasUpdate = needRefresh || updateReady
  return (
    <Frame>
      <Header><Logo aria-hidden="true">✓</Logo><Brand>Serie a serie</Brand></Header>
      <Nav aria-label="Secciones">
        {([['training', 'Entrenar'], ['routines', 'Rutinas'], ['exercises', 'Ejercicios'], ['settings', 'Ajustes']] as [Page, string][]).map(([value, label]) =>
          <Tab key={value} $active={page === value} aria-current={page === value ? 'page' : undefined} onClick={() => {
            saveUiState('page', value)
            setPage(value)
          }}>{label}</Tab>)}
      </Nav>
      <main>{page === 'training' ? <TrainingPage /> : page === 'routines' ? <RoutinesPage /> : page === 'exercises' ? <ExercisesPage /> : <SettingsPage />}</main>
      {(hasUpdate || offlineReady) && <Toast role="status">
        <span>{hasUpdate ? 'Hay una versión nueva disponible.' : 'Lista para usar sin conexión.'}</span>
        <Button size="small" variant="primary" onClick={() => {
          if (updateReady) window.location.reload()
          else if (needRefresh) {
            updateRequested.current = true
            void updateServiceWorker(true)
          } else setOfflineReady(false)
        }}>{hasUpdate ? 'Actualizar' : 'Entendido'}</Button>
        {hasUpdate && <Button size="small" variant="quiet" aria-label="Cerrar aviso" onClick={() => {
          setNeedRefresh(false)
          setUpdateReady(false)
        }}>×</Button>}
      </Toast>}
    </Frame>
  )
}
