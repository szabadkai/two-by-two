import { useEffect } from 'react'

/**
 * Global keyboard shortcuts hook.
 * Registers shortcut keys that fire actions on the current screen.
 *
 * @param {Object} actions - Map of key → handler. Keys: lowercase letters, 'Enter', 'Escape'
 * @param {boolean} enabled - Whether shortcuts are active (default true)
 *
 * Example: useGameShortcuts({ e: handleEndDay, s: handleSave }, allSlotsFilled)
 */
export function useGameShortcuts(actions, enabled = true) {
  useEffect(() => {
    if (!enabled || !actions) return

    const handler = (e) => {
      // Skip if typing in an input
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      // Skip if an overlay is active (modals, prompts)
      if (document.querySelector('[data-overlay]')) return

      // Match key to action
      const key = e.key === 'Enter' ? 'Enter' : e.key === 'Escape' ? 'Escape' : e.key.toLowerCase()
      const action = actions[key]

      if (action) {
        e.preventDefault()
        action()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [actions, enabled])
}
