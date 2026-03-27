import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { hasLocalSave, getLocalSaveInfo } from '../utils/saveLoad'
import FocusableButtonGroup from '../components/FocusableButtonGroup'
import { useNumberKeySelect } from '../utils/focusManager'

export default function TitleScreen() {
  const startMTC = useGameStore((s) => s.startMTC)
  const startGame = useGameStore((s) => s.startGame)
  const loadGame = useGameStore((s) => s.loadGame)
  const loadAutoSave = useGameStore((s) => s.loadAutoSave)
  const fileInputRef = useRef(null)
  const [loadError, setLoadError] = useState(null)
  const [saveInfo, setSaveInfo] = useState(null)

  useEffect(() => {
    if (hasLocalSave()) {
      setSaveInfo(getLocalSaveInfo())
    }
  }, [])

  const actions = useMemo(() => {
    const list = [
      { id: 'new', label: 'New Mission', action: startMTC },
    ]
    if (saveInfo) {
      list.push({ id: 'continue', label: `Continue Mission (Week ${saveInfo.week || '?'})`, action: loadAutoSave })
    }
    list.push({ id: 'skip', label: 'Skip Tutorial', action: startGame })
    list.push({ id: 'load', label: 'Load from File', action: () => fileInputRef.current?.click() })
    return list
  }, [saveInfo, startMTC, loadAutoSave, startGame])

  const handleSelect = useCallback((index) => {
    actions[index]?.action()
  }, [actions])

  useNumberKeySelect(actions.length, handleSelect, true)

  const handleLoadFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoadError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        loadGame(ev.target.result)
      } catch (err) {
        setLoadError(err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>TWO BY TWO</h1>
        <p style={styles.subtitle}>A Mormon Missionary Management Sim</p>
        <div style={styles.divider} />
        <p style={styles.flavor}>Budapest, Hungary — 2004</p>
        <p style={styles.tagline}>
          24 months. One name tag. Zero Hungarian vocabulary.
        </p>
        <FocusableButtonGroup
          buttons={actions}
          onSelect={handleSelect}
          orientation="vertical"
          autoFocus
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleLoadFile}
        />
        {loadError && (
          <p style={styles.errorText}>{loadError}</p>
        )}
        <p style={styles.hint}>
          Allocate your time. Manage your companion. Baptize the willing.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '32px',
    color: 'var(--accent-bright)',
    letterSpacing: '4px',
    lineHeight: 1.2,
  },
  subtitle: {
    fontFamily: 'var(--font-pixel)',
    fontSize: '11px',
    color: 'var(--text-dim)',
    letterSpacing: '1px',
  },
  divider: {
    width: '60px',
    height: '2px',
    background: 'var(--border)',
    margin: '8px 0',
  },
  flavor: {
    fontSize: '13px',
    color: 'var(--text)',
    fontWeight: 500,
  },
  tagline: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    maxWidth: '300px',
  },
  hint: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '8px',
    maxWidth: '280px',
  },
  errorText: {
    fontSize: '10px',
    color: 'var(--danger)',
    fontFamily: 'var(--font-pixel)',
    marginTop: '4px',
  },
}
