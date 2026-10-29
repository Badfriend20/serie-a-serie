type UiKey = 'page' | 'routine' | 'timer' | 'timerEnabled'

const keyFor = (key: UiKey) => `serie-a-serie:ui:${key}`

export function readUiState(key: UiKey): string | null {
  try {
    return window.localStorage.getItem(keyFor(key))
  } catch {
    return null
  }
}

export function saveUiState(key: UiKey, value: string): void {
  try {
    window.localStorage.setItem(keyFor(key), value)
  } catch {
    // The current view still works if browser storage is unavailable.
  }
}
