---
description: "Store keyboard navigation and accessibility requirements for the two-by-two game"
---

# Two-by-Two Keyboard Navigation & Accessibility Directive

## Core Requirement

**All UI elements must support keyboard navigation and full accessibility compliance (WCAG 2.1 AA minimum).** This applies to all new features, components, and modifications.

## Keyboard Navigation Standards

### Global Navigation
- **Tab / Shift+Tab**: Cycle through all interactive elements
- **Arrow Keys**: Navigate within choice groups, button grids, and menu lists
  - Horizontal: Left/Right for horizontal menus or button rows
  - Vertical: Up/Down for vertical choice lists
  - Grid: Up/Down/Left/Right for 2D grids (ActivitySelector)
- **Enter / Space**: Activate focused button or confirm interaction
- **Escape**: Close modals and dialogs; cancel operations where applicable

### GameCanvas Movement (Unchanged)
- **WASD / Arrow Keys**: Player movement (4-directional, 8 tiles)
- **Space / Enter**: Interact with adjacent activity spot or NPC
- **Note**: Movement keys work only when NO modal overlay (`[data-overlay]`) is active

## Accessibility Requirements

All interactive elements must include:
1. **Semantic HTML**: Use proper `<button>`, `<input>`, `<select>` elements (not divs)
2. **ARIA Labels**: Every button/control has `aria-label` or descriptive link text
3. **Roles**: Modals have `role="dialog"`, choice lists have `role="listbox"`, etc.
4. **Focus Management**:
   - Focus trap within modals (Tab cycles only within modal)
   - Focus restoration when modal closes
   - Visible focus indicator (2px ring, high contrast)
5. **Skip Logic**: Tab order skips hidden/disabled elements automatically

## Components Requiring Keyboard Support

| Component | Navigation | Status |
|-----------|-----------|--------|
| TitleScreen buttons | Tab/Arrow + Enter | Via FocusableButtonGroup |
| DailyView.GameCanvas | WASD/Arrows/Space | Native (preserved) |
| InteractionPrompt | Arrow + Enter | Via FocusableButtonGroup |
| EventModal / ObjectionModal | Arrow + Enter + Escape | Via FocusableButtonGroup + focus trap |
| ActivitySelector | Grid arrows + Enter | Via useGridFocusNavigation |
| TransferScreen choices | Arrow + Enter | Via FocusableButtonGroup |
| Minigames: TeachingCards | Left/Right arrows + Space | Card cycling |
| Minigames: ContactDialogue | Up/Down arrows | Response selection |
| Minigames: FillBlanks | Tab between inputs | Input navigation |
| Minigames: TypingDrill | Enter to submit | Already supported |

## Reusable Utilities & Components

**Hooks** (`src/utils/focusManager.js`):
- `useFocusNavigation()` — Tab/arrow cycling through element arrays
- `useFocusableGroup()` — Coordinated focus state for button/choice groups
- `useFocusableGrid()` — 2D grid navigation (Up/Down/Left/Right)
- `trapFocus()` — Confine Tab order within modal or container

**Components** (`src/components/FocusableButtonGroup.jsx`):
- Reusable wrapper for choice buttons with full keyboard support
- Handles arrow key navigation, Enter activation, Escape cancel
- Props: `buttons[]`, `onSelect(index)`, `orientation`, `onCancel`

**Styling** (`src/styles/accessibility.css`):
- Global focus indicator (2px solid ring, high contrast color)
- Compatible with dark mode and game theme
- Applied via `.has-focus` class on focused elements

## When Adding New UI Elements

**Checklist**:
- [ ] Element is a semantic `<button>` or has `role="button"`
- [ ] Element has `tabIndex={0}` or is naturally focusable
- [ ] Element has descriptive `aria-label` or link text
- [ ] If part of a choice group, use `FocusableButtonGroup`
- [ ] If a modal, use focus trap and trap focus via `useFocusableGroup()`
- [ ] Test with keyboard: Tab, arrows, Enter, Escape
- [ ] Run axe DevTools to verify accessibility compliance

## Architecture Notes

- **Modal Overlay Detection**: GameCanvas already checks for `[data-overlay]` attribute to disable movement keys during modal interactions
- **Focus Trap**: EventModal and ObjectionModal implement focus trapping via `useEffect` + keyboard listener
- **Grid Navigation**: ActivitySelector uses dynamic column count to calculate Up/Down/Left/Right movement
- **Minigame Integration**: Minigames capture keyboard events; ensure `[data-overlay]` is active during minigame play to prevent GameCanvas interference

## Testing & Validation

Run **axe DevTools** (browser extension) on each screen to verify:
- No missing ARIA labels
- Proper semantic roles
- No keyboard traps (except intentional modal traps)
- Focus order is logical

Manual keyboard flow test:
1. Load game, use Tab to navigate all Title buttons
2. Start game, use arrows + space in GameCanvas
3. Trigger activity modal, verify arrows select Yes/Not now
4. Test Escape closes modal
5. Run minigame, verify keyboard works (if applicable)

## References

- Plan document: See session memory for full implementation details
- Focusing component: `src/components/FocusableButtonGroup.jsx`
- Focus utilities: `src/utils/focusManager.js`
- Accessibility CSS: `src/styles/accessibility.css`
