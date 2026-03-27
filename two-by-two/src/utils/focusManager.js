import { useEffect, useRef, useState } from "react";

/**
 * Hook for managing focus navigation through a list of elements with Tab and Arrow keys
 * @param {HTMLElement[]} elements - Array of focusable elements
 * @param {string} orientation - 'horizontal' | 'vertical' | 'grid'
 * @param {Object} gridDimensions - { rows, cols } for grid navigation
 * @returns {Object} { focusedIndex, setFocusedIndex, handleKeyDown }
 */
export const useFocusNavigation = (
    elements = [],
    orientation = "vertical",
    gridDimensions = null,
) => {
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const handleKeyDown = (e) => {
        if (!elements || elements.length === 0) return;

        let nextIndex = focusedIndex;
        let handled = false;

        if (orientation === "horizontal") {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                nextIndex = (focusedIndex + 1) % elements.length;
                handled = true;
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                nextIndex =
                    focusedIndex === 0 ? elements.length - 1 : focusedIndex - 1;
                handled = true;
            }
        } else if (orientation === "vertical") {
            if (e.key === "ArrowDown") {
                nextIndex = (focusedIndex + 1) % elements.length;
                handled = true;
            } else if (e.key === "ArrowUp") {
                nextIndex =
                    focusedIndex === 0 ? elements.length - 1 : focusedIndex - 1;
                handled = true;
            }
        } else if (orientation === "grid" && gridDimensions) {
            const { rows, cols } = gridDimensions;
            const currentRow = Math.floor(focusedIndex / cols);
            const currentCol = focusedIndex % cols;

            if (e.key === "ArrowDown") {
                const newRow = (currentRow + 1) % rows;
                nextIndex = newRow * cols + currentCol;
                handled = true;
            } else if (e.key === "ArrowUp") {
                const newRow = currentRow === 0 ? rows - 1 : currentRow - 1;
                nextIndex = newRow * cols + currentCol;
                handled = true;
            } else if (e.key === "ArrowRight") {
                const newCol = (currentCol + 1) % cols;
                nextIndex = currentRow * cols + newCol;
                handled = true;
            } else if (e.key === "ArrowLeft") {
                const newCol = currentCol === 0 ? cols - 1 : currentCol - 1;
                nextIndex = currentRow * cols + newCol;
                handled = true;
            }
        }

        if (handled) {
            e.preventDefault();
            setFocusedIndex(nextIndex);
            // Focus the element in next tick to allow state update
            setTimeout(() => {
                elements[nextIndex]?.focus();
            }, 0);
        }
    };

    return { focusedIndex, setFocusedIndex, handleKeyDown };
};

/**
 * Hook for managing a group of focusable buttons/choices with keyboard navigation
 * @param {number} count - Number of items in the group
 * @param {Function} onSelect - Callback when item is selected (Enter key)
 * @param {Function} onCancel - Callback for Escape key (optional)
 * @returns {Object} { focusedIndex, setFocusedIndex, handleKeyDown, isActive }
 */
export const useFocusableGroup = (
    count = 0,
    onSelect = null,
    onCancel = null,
) => {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const elementRefs = useRef([]);

    // Store refs for all elements
    const registerRef = (index, ref) => {
        if (ref) {
            elementRefs.current[index] = ref;
        }
    };

    const handleKeyDown = (e) => {
        if (!isActive) return;

        const key = e.key.toLowerCase();

        // Arrow Up/Down for vertical navigation (default)
        if (key === "arrowdown") {
            e.preventDefault();
            const nextIndex = (focusedIndex + 1) % count;
            setFocusedIndex(nextIndex);
            setTimeout(() => elementRefs.current[nextIndex]?.focus(), 0);
        } else if (key === "arrowup") {
            e.preventDefault();
            const nextIndex = focusedIndex === 0 ? count - 1 : focusedIndex - 1;
            setFocusedIndex(nextIndex);
            setTimeout(() => elementRefs.current[nextIndex]?.focus(), 0);
        } else if (key === "arrowleft" || key === "arrowright") {
            // Allow horizontal arrows to also cycle (for horizontal layouts)
            e.preventDefault();
            const offset = key === "arrowright" ? 1 : -1;
            const nextIndex = (focusedIndex + offset + count) % count;
            setFocusedIndex(nextIndex);
            setTimeout(() => elementRefs.current[nextIndex]?.focus(), 0);
        } else if (key === "enter" || key === " ") {
            e.preventDefault();
            onSelect?.(focusedIndex);
        } else if (key === "escape") {
            e.preventDefault();
            onCancel?.();
        }
    };

    return {
        focusedIndex,
        setFocusedIndex,
        registerRef,
        handleKeyDown,
        setIsActive,
        isActive,
    };
};

/**
 * Hook for managing focus within a modal or container (focus trap)
 * @param {React.MutableRefObject} containerRef - Ref to the container element
 * @param {boolean} isActive - Whether focus trap should be active
 */
export const useFocusTrap = (containerRef, isActive = true) => {
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        // Save the currently focused element so we can restore it on cleanup
        previousFocusRef.current = document.activeElement;

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener("keydown", handleKeyDown);
        // Auto-focus first element when trap activates
        firstElement.focus();

        return () => {
            container.removeEventListener("keydown", handleKeyDown);
            // Restore focus to the element that was focused before the trap
            if (previousFocusRef.current?.focus) {
                setTimeout(() => previousFocusRef.current?.focus(), 0);
            }
        };
    }, [containerRef, isActive]);
};

/**
 * Helper to get all focusable elements within a container
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
export const getFocusableElements = (container) => {
    if (!container) return [];
    return Array.from(
        container.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
    ).filter((el) => {
        // Filter out hidden elements
        const style = window.getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
    });
};

/**
 * Restore focus to a previously focused element
 * @param {HTMLElement} element
 */
export const restoreFocus = (element) => {
    if (element && typeof element.focus === "function") {
        element.focus();
    }
};

/**
 * Move focus to a specific element
 * @param {HTMLElement} element
 */
export const moveFocus = (element) => {
    if (element && typeof element.focus === "function") {
        setTimeout(() => element.focus(), 0);
    }
};

/**
 * Hook that auto-focuses a ref on mount
 * @param {React.MutableRefObject} ref - Ref to focus
 * @param {boolean} active - Whether to focus (default true)
 */
export const useAutoFocus = (ref, active = true) => {
    useEffect(() => {
        if (active && ref.current) {
            setTimeout(() => ref.current?.focus(), 0);
        }
    }, [ref, active]);
};

/**
 * Hook that listens for number keys 1-9 and calls onSelect(index)
 * @param {number} count - Number of selectable items
 * @param {Function} onSelect - Callback: (index) => void
 * @param {boolean} isActive - Whether to listen
 */
export const useNumberKeySelect = (count, onSelect, isActive = true) => {
    useEffect(() => {
        if (!isActive || !onSelect) return;

        const handler = (e) => {
            // Don't fire when typing in inputs
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            const num = parseInt(e.key, 10);
            if (num >= 1 && num <= count) {
                e.preventDefault();
                onSelect(num - 1);
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [count, onSelect, isActive]);
};
