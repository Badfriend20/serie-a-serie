type UiKey = 'page' | 'routine' | 'timer' | 'timerEnabled' | 'weightUnit'

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

export function readTimerEnabled(): boolean {
  const saved = readUiState('timerEnabled')
  if (saved === 'true' || saved === 'false') return saved === 'true'
  try {
    return JSON.parse(readUiState('timer') ?? 'null')?.enabled === true
  } catch {
    return false
  }
}

export function readWeightUnit(): 'kg' | 'lb' {
  return readUiState('weightUnit') === 'lb' ? 'lb' : 'kg'
}
