export type ThemeMode = 'system' | 'light' | 'dark'
export type Accent = 'coral' | 'mint' | 'violet'
export type Exercise = { id: string; name: string }
export type RoutineEntry = { id: string; exerciseId: string; sets: number }
export type Routine = { id: string; name: string; entries: RoutineEntry[] }
export type AppData = {
  exercises: Exercise[]
  routines: Routine[]
  completed: Record<string, boolean[]>
  weightsKg: Record<string, number>
  mode: ThemeMode
  accent: Accent
}

export const emptyData: AppData = {
  exercises: [], routines: [], completed: {}, weightsKg: {}, mode: 'system', accent: 'coral'
}

export function getRoutineProgress(routine: Routine, completed: AppData['completed']) {
  const total = routine.entries.reduce((sum, entry) => sum + entry.sets, 0)
  const done = routine.entries.reduce((sum, entry) =>
    sum + (completed[entry.id]?.slice(0, entry.sets).filter(Boolean).length ?? 0), 0)
  return { total, done, percent: total ? Math.round(done / total * 100) : 0, complete: total > 0 && done === total }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const validWeight = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10000

export function migrateWeights(weights: unknown): AppData['weightsKg'] {
  if (!isRecord(weights)) return {}
  const result: AppData['weightsKg'] = {}
  for (const [entryId, value] of Object.entries(weights)) {
    const latest = Array.isArray(value) ? [...value].reverse().find(validWeight) : value
    if (validWeight(latest)) result[entryId] = latest
  }
  return result
}

export function parseBackup(input: unknown): AppData {
  if (!isRecord(input) || input.version !== 1 || !isRecord(input.data)) {
    throw new Error('El archivo no tiene el formato de respaldo compatible.')
  }
  const data = input.data
  if (!Array.isArray(data.exercises) || !Array.isArray(data.routines) || !isRecord(data.completed) ||
      !['system', 'light', 'dark'].includes(String(data.mode)) ||
      !['coral', 'mint', 'violet'].includes(String(data.accent)) ||
      data.exercises.length > 500 || data.routines.length > 100) {
    throw new Error('Los datos del respaldo son inválidos o demasiado grandes.')
  }
  const exercises = data.exercises.map((value: unknown) => {
    if (!isRecord(value) || typeof value.id !== 'string' || !value.id ||
        typeof value.name !== 'string' || !value.name.trim() || value.name.length > 80) {
      throw new Error('Hay ejercicios inválidos en el respaldo.')
    }
    return { id: value.id, name: value.name.trim() }
  })
  const exerciseIds = new Set(exercises.map(value => value.id))
  if (exerciseIds.size !== exercises.length) throw new Error('Hay ejercicios duplicados.')
  const entryIds = new Set<string>()
  const routines = data.routines.map((value: unknown) => {
    if (!isRecord(value) || typeof value.id !== 'string' || !value.id ||
        typeof value.name !== 'string' || !value.name.trim() || value.name.length > 80 ||
        !Array.isArray(value.entries) || value.entries.length > 500) {
      throw new Error('Hay rutinas inválidas en el respaldo.')
    }
    const entries = value.entries.map((item: unknown) => {
      if (!isRecord(item) || typeof item.id !== 'string' || !item.id ||
          typeof item.exerciseId !== 'string' || !exerciseIds.has(item.exerciseId) ||
          !Number.isInteger(item.sets) || (item.sets as number) < 1 || (item.sets as number) > 20 ||
          entryIds.has(item.id)) {
        throw new Error('Hay series o referencias inválidas en el respaldo.')
      }
      entryIds.add(item.id)
      return { id: item.id, exerciseId: item.exerciseId, sets: item.sets as number }
    })
    return { id: value.id, name: value.name.trim(), entries }
  })
  if (new Set(routines.map(value => value.id)).size !== routines.length) throw new Error('Hay rutinas duplicadas.')
  const completed: Record<string, boolean[]> = {}
  const entriesById = new Map(routines.flatMap(routine => routine.entries).map(entry => [entry.id, entry]))
  for (const [key, value] of Object.entries(data.completed)) {
    const entry = entriesById.get(key)
    if (!entry || !Array.isArray(value) || value.length !== entry.sets ||
        !value.every(item => typeof item === 'boolean')) {
      throw new Error('Hay marcas de series inválidas en el respaldo.')
    }
    completed[key] = value as boolean[]
  }
  const weightsKg: AppData['weightsKg'] = {}
  if (data.weightsKg !== undefined && !isRecord(data.weightsKg)) throw new Error('Hay pesos inválidos en el respaldo.')
  for (const [key, value] of Object.entries(data.weightsKg ?? {})) {
    const entry = entriesById.get(key)
    if (!entry || !(validWeight(value) || (Array.isArray(value) && value.length === entry.sets &&
        value.every(item => item === null || validWeight(item))))) {
      throw new Error('Hay pesos inválidos en el respaldo.')
    }
    const latest = Array.isArray(value) ? [...value].reverse().find(validWeight) : value
    if (validWeight(latest)) weightsKg[key] = latest
  }
  return { exercises, routines, completed, weightsKg, mode: data.mode as ThemeMode, accent: data.accent as Accent }
}
