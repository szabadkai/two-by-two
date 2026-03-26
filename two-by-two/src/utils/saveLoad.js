const SAVE_VERSION = 1

const STATE_FIELDS = [
  'screen', 'day', 'week', 'transfer',
  'stats', 'companion', 'investigators',
  'schedule', 'minigameScores',
  'pendingEvent', 'pendingObjection', 'eventLog',
  'baptisms', 'totalConnections',
  'laundryWeeksSkipped', 'catAdopted',
  'warnings', 'debtWeeks', 'weekHadLanguageActivity',
  'sentHome', 'crisisWeeksRemaining',
  'leadership', 'companionHistory',
  'mandatoryActivity', 'lastDayResult', 'weekLog',
]

export function exportSave(state) {
  const saveData = {}
  for (const key of STATE_FIELDS) {
    if (key in state) {
      saveData[key] = state[key]
    }
  }
  return JSON.stringify({
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state: saveData,
  }, null, 2)
}

const LOCAL_STORAGE_KEY = 'two-by-two-save'

export function saveToLocalStorage(state) {
  try {
    const json = exportSave(state)
    localStorage.setItem(LOCAL_STORAGE_KEY, json)
    return true
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
    return false
  }
}

export function loadFromLocalStorage() {
  try {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!json) return null
    return importSave(json)
  } catch (e) {
    console.warn('Failed to load from localStorage:', e)
    return null
  }
}

export function hasLocalSave() {
  return localStorage.getItem(LOCAL_STORAGE_KEY) !== null
}

export function getLocalSaveInfo() {
  try {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!json) return null
    const parsed = JSON.parse(json)
    return { week: parsed.state?.week, savedAt: parsed.savedAt }
  } catch {
    return null
  }
}

export function importSave(jsonString) {
  let parsed
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    throw new Error('Invalid save file: could not parse JSON.')
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid save file: not an object.')
  }

  if (parsed.version !== SAVE_VERSION) {
    throw new Error(
      `Incompatible save version: expected ${SAVE_VERSION}, got ${parsed.version}.`
    )
  }

  if (!parsed.state || typeof parsed.state !== 'object') {
    throw new Error('Invalid save file: missing state data.')
  }

  return parsed.state
}
