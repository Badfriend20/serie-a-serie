import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { emptyData, migrateWeights, type Accent, type AppData, type ThemeMode } from './model'

type AppStore = AppData & {
  addExercise: (name: string) => void
  renameExercise: (id: string, name: string) => void
  removeExercise: (id: string) => void
  addRoutine: (name: string) => void
  renameRoutine: (id: string, name: string) => void
  removeRoutine: (id: string) => void
  addEntry: (routineId: string, exerciseId: string) => void
  createExerciseInRoutine: (routineId: string, name: string) => void
  removeEntry: (routineId: string, entryId: string) => void
  moveEntry: (routineId: string, entryId: string, direction: -1 | 1) => void
  setCount: (routineId: string, entryId: string, count: number) => void
  toggleSet: (entryId: string, index: number) => void
  setWeightKg: (entryId: string, weight: number | null) => void
  resetRoutineMarks: (routineId: string) => void
  resetRoutineWeights: (routineId: string) => void
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: Accent) => void
  importData: (data: AppData) => void
}

const id = () => crypto.randomUUID()

export const useAppStore = create<AppStore>()(persist((set) => ({
  ...emptyData,
  addExercise: name => set(state => state.exercises.length >= 500 ? state :
    ({ exercises: [...state.exercises, { id: id(), name: name.trim() }] })),
  renameExercise: (exerciseId, name) => set(state => ({ exercises: state.exercises.map(exercise =>
    exercise.id === exerciseId ? { ...exercise, name: name.trim() } : exercise) })),
  removeExercise: exerciseId => set(state => {
    const routines = state.routines.map(routine => ({ ...routine, entries: routine.entries.filter(entry => entry.exerciseId !== exerciseId) }))
    const retained = new Set(routines.flatMap(routine => routine.entries.map(entry => entry.id)))
    return {
      exercises: state.exercises.filter(exercise => exercise.id !== exerciseId), routines,
      completed: Object.fromEntries(Object.entries(state.completed).filter(([key]) => retained.has(key))),
      weightsKg: Object.fromEntries(Object.entries(state.weightsKg).filter(([key]) => retained.has(key)))
    }
  }),
  addRoutine: name => set(state => state.routines.length >= 100 ? state :
    ({ routines: [...state.routines, { id: id(), name: name.trim(), entries: [] }] })),
  renameRoutine: (routineId, name) => set(state => ({ routines: state.routines.map(routine =>
    routine.id === routineId ? { ...routine, name: name.trim() } : routine) })),
  removeRoutine: routineId => set(state => {
    const removed = state.routines.find(routine => routine.id === routineId)
    const ids = new Set(removed?.entries.map(entry => entry.id) ?? [])
    return { routines: state.routines.filter(routine => routine.id !== routineId),
      completed: Object.fromEntries(Object.entries(state.completed).filter(([key]) => !ids.has(key))),
      weightsKg: Object.fromEntries(Object.entries(state.weightsKg).filter(([key]) => !ids.has(key))) }
  }),
  addEntry: (routineId, exerciseId) => set(state => ({ routines: state.routines.map(routine =>
    routine.id === routineId && routine.entries.length < 500 && state.exercises.some(exercise => exercise.id === exerciseId)
      ? { ...routine, entries: [...routine.entries, { id: id(), exerciseId, sets: 3 }] } : routine) })),
  createExerciseInRoutine: (routineId, name) => set(state => {
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 80 || state.exercises.length >= 500 ||
        !state.routines.some(routine => routine.id === routineId && routine.entries.length < 500)) return state
    const exerciseId = id()
    return { exercises: [...state.exercises, { id: exerciseId, name: trimmed }],
      routines: state.routines.map(routine => routine.id === routineId ? { ...routine,
        entries: [...routine.entries, { id: id(), exerciseId, sets: 3 }] } : routine) }
  }),
  removeEntry: (routineId, entryId) => set(state => {
    const completed = { ...state.completed }
    const weightsKg = { ...state.weightsKg }
    delete completed[entryId]
    delete weightsKg[entryId]
    return { completed, weightsKg, routines: state.routines.map(routine => routine.id === routineId ?
      { ...routine, entries: routine.entries.filter(entry => entry.id !== entryId) } : routine) }
  }),
  moveEntry: (routineId, entryId, direction) => set(state => ({ routines: state.routines.map(routine => {
    if (routine.id !== routineId) return routine
    const entries = [...routine.entries]
    const from = entries.findIndex(entry => entry.id === entryId)
    const to = from + direction
    if (from < 0 || to < 0 || to >= entries.length) return routine
    ;[entries[from], entries[to]] = [entries[to], entries[from]]
    return { ...routine, entries }
  }) })),
  setCount: (routineId, entryId, count) => set(state => ({
    routines: state.routines.map(routine => routine.id === routineId ? { ...routine,
      entries: routine.entries.map(entry => entry.id === entryId ? { ...entry, sets: count } : entry) } : routine),
    completed: { ...state.completed, [entryId]: Array.from({ length: count }, (_, index) => state.completed[entryId]?.[index] ?? false) }
  })),
  toggleSet: (entryId, index) => set(state => {
    const entry = state.routines.flatMap(routine => routine.entries).find(item => item.id === entryId)
    if (!entry || index < 0 || index >= entry.sets) return state
    const marks = Array.from({ length: entry.sets }, (_, n) => state.completed[entryId]?.[n] ?? false)
    marks[index] = !marks[index]
    return { completed: { ...state.completed, [entryId]: marks } }
  }),
  setWeightKg: (entryId, weight) => set(state => {
    const entry = state.routines.flatMap(routine => routine.entries).find(item => item.id === entryId)
    if (!entry || (weight !== null &&
        (!Number.isFinite(weight) || weight < 0 || weight > 10000))) return state
    const weightsKg = { ...state.weightsKg }
    if (weight === null) delete weightsKg[entryId]
    else weightsKg[entryId] = weight
    return { weightsKg }
  }),
  resetRoutineMarks: routineId => set(state => {
    const completed = { ...state.completed }
    state.routines.find(routine => routine.id === routineId)?.entries.forEach(entry => {
      delete completed[entry.id]
    })
    return { completed }
  }),
  resetRoutineWeights: routineId => set(state => {
    const weightsKg = { ...state.weightsKg }
    state.routines.find(routine => routine.id === routineId)?.entries.forEach(entry => {
      delete weightsKg[entry.id]
    })
    return { weightsKg }
  }),
  setMode: mode => set({ mode }),
  setAccent: accent => set({ accent }),
  importData: data => set(data)
}), { name: 'serie-a-serie:v1', version: 2,
  migrate: persisted => {
    const previous = persisted as Partial<AppData>
    return { ...previous, weightsKg: migrateWeights(previous.weightsKg) } as AppStore
  },
  partialize: state => ({ exercises: state.exercises, routines: state.routines, completed: state.completed, weightsKg: state.weightsKg,
    mode: state.mode, accent: state.accent })
}))
