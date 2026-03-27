import React, { useRef, useEffect } from 'react'
import { useFocusableGroup } from '../utils/focusManager'

/**
 * FocusableButtonGroup - Reusable component for keyboard-navigable button/choice groups
 *
 * Features:
 * - Arrow key navigation (Up/Down or Left/Right based on orientation)
 * - Enter key to select
 * - Escape key to cancel
 * - Full focus management and ARIA support
 * - Auto-focus first button on mount
 *
 * @component
 * @param {Array} buttons - Array of button objects: { id, label, ariaLabel? }
 * @param {Function} onSelect - Callback when button is selected: (index) => void
 * @param {Function} onCancel - Callback when Escape is pressed: () => void (optional)
 * @param {string} orientation - 'vertical' (default) or 'horizontal'
 * @param {string} className - Additional CSS classes
 * @param {string} containerRole - ARIA role for container (default: 'group')
 * @param {string} buttonRole - ARIA role for buttons (default: 'option')
 * @param {boolean} disabled - Disable all interactions
 * @returns {React.ReactNode}
 *
 * @example
 * <FocusableButtonGroup
 *   buttons={[{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }]}
 *   onSelect={(index) => handleChoice(index)}
 *   onCancel={() => closeModal()}
 *   orientation="horizontal"
 * />
 */
const FocusableButtonGroup = React.forwardRef(
  (
    {
      buttons = [],
      onSelect = () => {},
      onCancel = () => {},
      orientation = 'vertical',
      className = '',
      containerRole = 'group',
      buttonRole = 'option',
      disabled = false,
      autoFocus = true,
    },
    ref
  ) => {
    const containerRef = useRef(ref || null)
    const buttonRefs = useRef([])

    const { focusedIndex, setFocusedIndex, handleKeyDown } = useFocusableGroup(
      buttons.length,
      (index) => {
        if (!disabled) {
          onSelect(index)
        }
      },
      () => {
        if (!disabled) {
          onCancel()
        }
      }
    )

    // Auto-focus first button on mount
    useEffect(() => {
      if (autoFocus && buttonRefs.current[0]) {
        buttonRefs.current[0].focus()
        setFocusedIndex(0)
      }
    }, [autoFocus, setFocusedIndex])

    // Attach keyboard listener
    useEffect(() => {
      const handleKeyUp = (e) => {
        const key = e.key.toLowerCase()
        if (!['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter', ' ', 'escape'].includes(key)) {
          return
        }

        handleKeyDown(e)
      }

      if (containerRef.current) {
        containerRef.current.addEventListener('keydown', handleKeyUp)
        return () => {
          containerRef.current?.removeEventListener('keydown', handleKeyUp)
        }
      }
    }, [handleKeyDown])

    if (!buttons || buttons.length === 0) {
      return null
    }

    const containerClasses = `focusable-button-group focusable-button-group--${orientation} ${className}`.trim()

    return (
      <div
        ref={containerRef}
        className={containerClasses}
        role={containerRole}
        aria-disabled={disabled}
        data-testid="focusable-button-group"
      >
        {buttons.map((button, index) => (
          <button
            key={button.id || index}
            ref={(el) => {
              buttonRefs.current[index] = el
            }}
            className={`focusable-button-group__button ${focusedIndex === index ? 'focusable-button-group__button--focused' : ''} ${button.className || ''}`}
            onClick={() => {
              if (!disabled) {
                onSelect(index)
              }
            }}
            onFocus={() => setFocusedIndex(index)}
            aria-label={button.ariaLabel || button.label}
            role={buttonRole}
            aria-selected={focusedIndex === index}
            disabled={disabled}
            data-testid={`button-${index}`}
            type="button"
          >
            {button.label}
          </button>
        ))}
      </div>
    )
  }
)

FocusableButtonGroup.displayName = 'FocusableButtonGroup'

export default FocusableButtonGroup
