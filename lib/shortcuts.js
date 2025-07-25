function setupShortcuts(input, history, options = {}) {
  const {
    updateStatus = () => {},
    renderHistory = () => {},
    config = {}
  } = options;

  let inputHistoryIndex = null;
  let unsavedInput = "";
  let historyDisplayMode = "input";

  // Greek character insertion (Alt + key)
  input.addEventListener("keydown", (e) => {
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      const greekChar = greekMap[e.key.toUpperCase()];
      if (greekChar && document.activeElement === input) {
        e.preventDefault();
        insertAtCursor(input, greekChar);
      }
    }
  });

  // Main keyboard shortcut logic
  input.addEventListener("keydown", (e) => {
    const shortcuts = config.keyboardShortcuts || {};
    const active = document.activeElement;
    // Unified processor
    const processShortcut = (shortcut, callback, mustBeFocused = false) => {
      if (
        shortcut &&
        e.code === shortcut.key &&
        e.ctrlKey === shortcut.ctrl &&
        e.shiftKey === shortcut.shift
      ) {
        if (!mustBeFocused ||  active === input) {
          e.preventDefault();
          callback();
        }
      }
    };

    // === Text-inserting shortcuts (only if input is focused) ===
    processShortcut(shortcuts.insertSubscript, () => 
    {
      insertAtCursor(input, "_");
      updateStatus("Inserted '_' for Subscript");
      console.log(`${active}=${input}`);
    }, true);

    processShortcut(shortcuts.insertequalto, () => {
      insertAtCursor(input, "=");
      updateStatus("Inserted '='");
    }, true);

    processShortcut(shortcuts.insertPower, () => {
      insertAtCursor(input, "^");
    }, true);

    const insertDivide = () => {
      const pos = input.selectionStart;
      const val = input.value;
      if (val.slice(pos, pos + 2) !== '()') {
        input.value = val.slice(0, pos) + "/()" + val.slice(pos);
        input.selectionStart = input.selectionEnd = pos + 2;
      } else {
        input.value = val.slice(0, pos) + "/" + val.slice(pos);
        input.selectionStart = input.selectionEnd = pos + 1;
      }
    };
    processShortcut(shortcuts.insertDivide1, insertDivide, true);
    processShortcut(shortcuts.insertDivide2, insertDivide, true);

    // === Global functional shortcuts ===
    processShortcut(shortcuts.clearLast, () => {
      clearLastfun(inputHistoryIndex);
    });

    processShortcut(shortcuts.calc1, () => {
      calculate(null);
    });

    processShortcut(shortcuts.calc2, () => {
      calculate(null);
    });

    processShortcut(shortcuts.clearAll, () => {
      clearfun();
    });

    processShortcut(shortcuts.focusInput, () => {
      input.focus();
      updateStatus("Focused input box");
    });

    // Mode Switching (Ctrl + Arrow)
    if (e.ctrlKey && e.key === "ArrowLeft") {
      if (inputHistoryIndex !== null) {
        e.preventDefault();
        historyDisplayMode = "input";
        input.value = history[inputHistoryIndex].inputText;
      }
    }

    if (e.ctrlKey && e.key === "ArrowRight") {
      if (inputHistoryIndex !== null) {
        e.preventDefault();
        historyDisplayMode = "result";
        input.value = history[inputHistoryIndex].resultValue.toString();
      }
    }

    // History Navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        if (inputHistoryIndex === null) {
          unsavedInput = input.value;
          inputHistoryIndex = history.length - 1;
        } else if (inputHistoryIndex > 0) {
          inputHistoryIndex--;
        }
        input.value = historyDisplayMode === "result"
          ? history[inputHistoryIndex].resultValue.toString()
          : history[inputHistoryIndex].inputText;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length > 0 && inputHistoryIndex !== null) {
        if (inputHistoryIndex < history.length - 1) {
          inputHistoryIndex++;
          input.value = historyDisplayMode === "result"
            ? history[inputHistoryIndex].resultValue.toString()
            : history[inputHistoryIndex].inputText;
        } else {
          inputHistoryIndex = null;
          input.value = unsavedInput;
        }
      }
    }
  });

  return {
    resetHistoryIndex() {
      inputHistoryIndex = null;
    },
    jumpToLatest() {
      if (history.length > 0) {
        inputHistoryIndex = history.length;
        historyDisplayMode = "input";
      }
    },
    getinputHistoryIndex() {
      return inputHistoryIndex;
    },
    setinputHistoryIndex(index) {
      inputHistoryIndex = index;
    }
  };
}
