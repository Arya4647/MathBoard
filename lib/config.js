window.calculatorConfig = 
{
  precisionDigits: 14,
  enableScientificNotation: true,
  minSciPower: 3,
  minNegSciPower: -2,
  autoClearInput: true,
  historyLimit: 50,
  historyWarningThreshold: 5,
  autoJumpToLatestHistory: true, 
  insertGreekAtCursor: false,
  insertGreekToClipBoard: true,
  keyboardShortcuts: 
  {
    insertDivide1: { key: "NumpadDivide", ctrl: false, shift: false },
    insertDivide2: { key: "Slash", ctrl: false, shift: false },
    clearLast: { key: "Backspace", ctrl: true, shift: false },
    clearAll: { key: "Backspace", ctrl: true, shift: true },
    calc1: { key: "Enter", ctrl: false , shift: false},
    calc2: { key: "NumpadEnter", ctrl: false , shift: false},
    insertSubscript: { key: "Space", ctrl: true , shift: false},  
    insertequalto: { key: "Space", ctrl: true , shift: true},  
    insertPower: { key: "NumpadMultiply", ctrl: true , shift: false},
    focusInput: { key: "Slash", ctrl: true , shift: false},
  }
};
