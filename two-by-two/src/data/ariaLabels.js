/**
 * ARIA labels and accessibility constants for the Two-by-Two game
 */

export const ariaLabels = {
    // Screens
    titleScreen: {
        heading: "Mission Control - Two-by-Two Game",
        newMissionButton: "Start a new mission",
        continueButton: "Continue your current mission",
        skipTutorialButton: "Skip tutorial and start game",
        loadFileButton: "Load a saved game from file",
    },

    mtcScreen: {
        heading: "Mission Training Course - Tutorial",
        skipButton: "Skip message (press Space or Enter)",
        nextButton: "Continue to next step",
    },

    dailyView: {
        heading: "Daily Mission Activity",
        canvas: "Game world - navigate with arrow keys or WASD",
        gameStatus: "Current game status and statistics",
        statBar: "Statistics and stat changes",
        companionCard: "Companion information and mood",
        investigatorCard: "Active investigators - click to set visit target",
        investigatorCardButton: "Investigator {name} - rapport {rapport}/10",
        activitySelector:
            "Activity grid - select an activity for the available time slot",
        activityButton: "Activity: {name} - {description}",
        endDayButton: "End the day and advance to next",
    },

    pdayView: {
        heading: "P-Day - Personal Day",
        canvas: "Game world - navigate with arrow keys or WASD",
    },

    weeklySummary: {
        heading: "Weekly Summary - Week {week}",
        endWeekButton: "End the week and advance to next",
        statChange: "{stat} changed by {delta}",
        eventLog: "Events that occurred this week",
    },

    transferScreen: {
        heading: "Transfer - Companion Exchange",
        continueButton: "Continue to next phase",
        completeButton: "Complete transfer and start new cycle",
        interviewChoice: "Interview option {number}",
    },

    endgame: {
        heading: "Mission Complete - Endgame Summary",
        sentHomeHeading: "Mission Ended - Sent Home",
        returnTitleButton: "Return to Title Screen",
    },

    // Modals
    interactionPrompt: {
        heading: "Confirm Activity",
        description: "Activity: {name} at {time}",
        yesButton: "Yes, do this activity",
        notNowButton: "Not now, choose something else",
    },

    eventModal: {
        heading: "Event",
        choiceButton: "Choice {number}: {text}",
        continueButton: "Continue",
    },

    objectionModal: {
        heading: "Investigator Objection",
        responseButton: "Respond with: {text}",
        continueButton: "Continue",
    },

    // Minigames
    minigameContainer: "Minigame - {name}",
    typingDrill: {
        heading: "Typing Drill - Learn Hungarian",
        input: "Type the Hungarian translation for: {question}",
        submitButton: "Submit answer (or press Enter)",
    },

    teachingCards: {
        heading: "Teaching Cards - Scripture Cards",
        description:
            "Select the correct scripture reference. Use arrow keys to navigate.",
        cardButton: "Scripture option {number}",
    },

    contactDialogue: {
        heading: "Street Contact - Dialogue",
        description: "Choose how to respond to the contact",
        responseButton: "Response: {text}",
    },

    memoryGame: {
        heading: "Memory Game - Match Pairs",
        description:
            "Click matching pairs. Use mouse or click on tiles with keyboard.",
        tile: "Tile {position}",
    },

    fillBlanks: {
        heading: "Fill in the Blanks - English Practice",
        description: "Fill in the missing words. Tab to move between blanks.",
        input: "Blank {number} of {total}",
    },

    serviceProject: {
        heading: "Service Project - Task Sequence",
        description: "Drag tasks in the correct order to complete the project",
    },

    speedRead: {
        heading: "Speed Read - Quick Comprehension",
        description: "Read quickly and answer the question",
        answerButton: "Answer: {text}",
    },

    // Buttons and Controls (generic)
    button: "Button",
    closeButton: "Close",
    confirmButton: "Confirm",
    cancelButton: "Cancel",
    navigatePrevious: "Previous",
    navigateNext: "Next",
    selectOption: "Select",
    activateButton: "Activate",

    // Common actions
    focusHelper:
        "Press Tab to navigate, Arrow keys to select, Enter to activate",
    escapeInstruction: "Press Escape to close this dialog",
    keyboardHelp:
        "Keyboard navigation available - use Tab, Arrow keys, and Enter",
};

/**
 * Semantic role assignments for common components
 */
export const roles = {
    button: "button",
    dialog: "dialog",
    alertdialog: "alertdialog",
    listbox: "listbox",
    option: "option",
    menu: "menu",
    menuitem: "menuitem",
    tab: "tab",
    tablist: "tablist",
    tabpanel: "tabpanel",
    group: "group",
    status: "status",
    alert: "alert",
};

/**
 * Helper to generate aria-label with translation support
 * @param {string} key - Key path in ariaLabels object (e.g., 'titleScreen.newMissionButton')
 * @param {Object} variables - Variables to interpolate in the label
 * @returns {string} - The aria-label text
 */
export const getAriaLabel = (key, variables = {}) => {
    const keys = key.split(".");
    let value = ariaLabels;

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            console.warn(`ARIA label not found: ${key}`);
            return key;
        }
    }

    // Simple interpolation for variables
    let result = String(value);
    for (const [varKey, varValue] of Object.entries(variables)) {
        result = result.replace(`{${varKey}}`, varValue);
    }

    return result;
};
