import { useCallback, useEffect, useState } from 'react'

/**
 * On-screen touch controls for mobile devices.
 * Dispatches synthetic KeyboardEvent on window so GameCanvas handles them.
 * Only visible on touch devices via CSS media query.
 */
export default function TouchControls() {
  const [activeDir, setActiveDir] = useState(null)

  const dispatchKey = useCallback((key, type) => {
    window.dispatchEvent(new KeyboardEvent(type, {
      key,
      code: key,
      bubbles: true,
      cancelable: true,
    }))
  }, [])

  const handleDirStart = useCallback((dir) => {
    setActiveDir(dir)
    const keyMap = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
    dispatchKey(keyMap[dir], 'keydown')
  }, [dispatchKey])

  const handleDirEnd = useCallback(() => {
    if (activeDir) {
      const keyMap = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
      dispatchKey(keyMap[activeDir], 'keyup')
      setActiveDir(null)
    }
  }, [activeDir, dispatchKey])

  const handleAction = useCallback(() => {
    dispatchKey(' ', 'keydown')
    setTimeout(() => dispatchKey(' ', 'keyup'), 100)
  }, [dispatchKey])

  // Prevent scrolling on touch
  useEffect(() => {
    const prevent = (e) => {
      if (e.target.closest('.touch-controls')) {
        e.preventDefault()
      }
    }
    document.addEventListener('touchmove', prevent, { passive: false })
    return () => document.removeEventListener('touchmove', prevent)
  }, [])

  return (
    <div className="touch-controls" style={styles.container}>
      {/* D-Pad */}
      <div style={styles.dpad}>
        <div style={styles.dpadRow}>
          <div style={styles.dpadSpacer} />
          <button
            style={{
              ...styles.dpadBtn,
              ...(activeDir === 'up' ? styles.dpadBtnActive : {}),
            }}
            onTouchStart={(e) => { e.preventDefault(); handleDirStart('up') }}
            onTouchEnd={handleDirEnd}
            onMouseDown={() => handleDirStart('up')}
            onMouseUp={handleDirEnd}
            onMouseLeave={handleDirEnd}
            aria-label="Move up"
          >
            ▲
          </button>
          <div style={styles.dpadSpacer} />
        </div>
        <div style={styles.dpadRow}>
          <button
            style={{
              ...styles.dpadBtn,
              ...(activeDir === 'left' ? styles.dpadBtnActive : {}),
            }}
            onTouchStart={(e) => { e.preventDefault(); handleDirStart('left') }}
            onTouchEnd={handleDirEnd}
            onMouseDown={() => handleDirStart('left')}
            onMouseUp={handleDirEnd}
            onMouseLeave={handleDirEnd}
            aria-label="Move left"
          >
            ◀
          </button>
          <div style={styles.dpadCenter} />
          <button
            style={{
              ...styles.dpadBtn,
              ...(activeDir === 'right' ? styles.dpadBtnActive : {}),
            }}
            onTouchStart={(e) => { e.preventDefault(); handleDirStart('right') }}
            onTouchEnd={handleDirEnd}
            onMouseDown={() => handleDirStart('right')}
            onMouseUp={handleDirEnd}
            onMouseLeave={handleDirEnd}
            aria-label="Move right"
          >
            ▶
          </button>
        </div>
        <div style={styles.dpadRow}>
          <div style={styles.dpadSpacer} />
          <button
            style={{
              ...styles.dpadBtn,
              ...(activeDir === 'down' ? styles.dpadBtnActive : {}),
            }}
            onTouchStart={(e) => { e.preventDefault(); handleDirStart('down') }}
            onTouchEnd={handleDirEnd}
            onMouseDown={() => handleDirStart('down')}
            onMouseUp={handleDirEnd}
            onMouseLeave={handleDirEnd}
            aria-label="Move down"
          >
            ▼
          </button>
          <div style={styles.dpadSpacer} />
        </div>
      </div>

      {/* Action Button */}
      <button
        style={styles.actionBtn}
        onTouchStart={(e) => { e.preventDefault(); handleAction() }}
        onMouseDown={handleAction}
        aria-label="Interact"
      >
        <span style={styles.actionLabel}>A</span>
      </button>
    </div>
  )
}

const styles = {
  container: {
    /* display controlled by .touch-controls CSS class (hidden on desktop, flex on touch) */
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
  },
  dpad: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  dpadRow: {
    display: 'flex',
    gap: '2px',
    justifyContent: 'center',
  },
  dpadBtn: {
    width: '52px',
    height: '52px',
    background: 'var(--panel-light)',
    border: '2px solid var(--border)',
    borderRadius: '4px',
    color: 'var(--text-dim)',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  dpadBtnActive: {
    background: 'var(--accent)',
    color: 'var(--bg)',
    borderColor: 'var(--accent-bright)',
  },
  dpadSpacer: {
    width: '52px',
    height: '52px',
  },
  dpadCenter: {
    width: '52px',
    height: '52px',
    background: 'var(--panel)',
    border: '2px solid var(--border)',
    borderRadius: '4px',
  },
  actionBtn: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'var(--accent)',
    border: '3px solid var(--accent-bright)',
    color: 'var(--bg)',
    fontSize: '24px',
    fontFamily: 'var(--font-pixel)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  actionLabel: {
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
}
