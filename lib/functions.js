// ./lib/functions.js
// define custom function like this feel free take help of Ai chat bots
math.import
({
  parallel: function(...args) 
  {
    if (args.length === 0) 
      return NaN;
    let reciprocalSum = 0;
    for (const val of args) 
      {
      if (val === 0) 
        return 0;
      reciprocalSum += 1 / val;
    }
    return 1 / reciprocalSum;
  }
});
function formatResult(result) 
{
  let resultStr = math.format(result, { precision: window.calculatorConfig.precisionDigits });
  const sciMatch = resultStr.match(/^(-?[\d.]+)e([+-]?\d+)$/i);
  if (window.calculatorConfig.enableScientificNotation && sciMatch) 
  {
    const num = sciMatch[1];
    const exp = parseInt(sciMatch[2], 10);
    if (exp >= window.calculatorConfig.minSciPower || exp <= window.calculatorConfig.minNegSciPower) 
      resultStr = `${num} \\times 10^{${exp}}`;    
  }
  return resultStr;
}
function customTexHandler(node, options) 
{
  if (node.isSymbolNode) 
  {
    const match = node.name.match(/^([a-zA-Z]+)_([a-zA-Z0-9]+)$/);
    if (match) 
    {
      const base = match[1];
      const sub = match[2];
      const latex = `\\${base}_{${sub}}`;
      if (isValidLatex(latex)) return latex;
      // If invalid, fallback to non-slashed version
      return `${base}_{${sub}}`;
    }

    const plain = node.name;
    const latex = `\\${plain}`;
    if (isValidLatex(latex)) 
      return latex;
    // fallback to raw name if not valid
    return plain; 
  }
  if (node.isFunctionNode && node.fn.name === "parallel") 
  {
    const args = node.args.map(arg => arg.toTex(options));
    return `\\left(${args.join(" \\parallel ")}\\right)`; // use LaTeX \parallel
  }
  if (node.isOperatorNode && node.op === '*') {
    const [left, right] = node.args.map(arg => arg.toTex(options));
    return `${left} \\cdot{} ${right}`;
  }

  return undefined; // Let math.js handle non-symbols
}
function insertAtCursor(inputElement, text) {
  const start = inputElement.selectionStart;
  const end = inputElement.selectionEnd;
  const original = inputElement.value;
  inputElement.value = original.slice(0, start) + text + original.slice(end);
  inputElement.selectionStart = inputElement.selectionEnd = start + text.length;
  inputElement.focus();
}
function isValidLatex(latexStr) 
{
  const dummy = document.createElement("div");
  try {
    katex.render(latexStr, dummy, { throwOnError: true });
    return true;
  } catch (err) {
    return false;
  }
}
function splitExpressions(expr) {
  const parts = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];

    if (char === '(' || char === '[' || char === '{') depth++;
    if (char === ')' || char === ']' || char === '}') depth--;

    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}
function justcal(Text,pin = false) 
{
  if (Text.trim() === "")
  return {
    inputText: Text,
    resultValue: 69420,
    latex: "undefined",
    Pinned: false
  };
  let explanationNote = "";
  let rawExpr = Text;

  // Extract optional display explanation
  const displayMatch = Text.match(/^(.*)\s+display:\s*(.+)$/i);
  if (displayMatch) {
    rawExpr = displayMatch[1].trim();
    explanationNote = displayMatch[2].trim();
  }

  const exprList = splitExpressions(rawExpr);
  let lastResult = undefined;
  const latexParts = [];

  for (let exprText of exprList) 
  {
    const assignmentMatch = exprText.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);

    let result, latexExpr, latexResult;

    if (assignmentMatch) 
    {
      const varName = assignmentMatch[1];
      const rhsExpr = assignmentMatch[2];

      if (Object.prototype.hasOwnProperty.call(window.variables.values, varName)) 
        throw new Error(`'${varName}' is a constant and cannot be reassigned.`);

      const value = math.evaluate(rhsExpr, scope);
      scope[varName] = value;
      result = value;

      // Check if RHS is a simple number (e.g., "2" or "3.14")
      const isSimpleNumber = /^[0-9.]+(?:e[+-]?[0-9]+)?$/.test(rhsExpr.trim());

      // Generate LaTeX
      latexExpr = `${varName} = ${isSimpleNumber ? formatResult(value) : `${math.parse(rhsExpr).toTex({ handler: customTexHandler })} = ${formatResult(value)}`}`;
    } 
    else 
    {
      const node = math.parse(exprText);
      result = node.evaluate(scope);
      latexExpr = node.toTex({ handler: customTexHandler }) + ' = ' + formatResult(result);
    }

    lastResult = result;
    latexParts.push(latexExpr);
  }

  let lastLatex = latexParts.join(", ");

  if (explanationNote) {
    lastLatex += `\\quad\\text{[${explanationNote}]}`;
  }

  return {
    inputText: Text,
    resultValue: lastResult,
    latex: lastLatex,
    Pinned: pin
  };
}
function setupDropdownToggle(toggleButton, dropdown, labelBaseText) {
  toggleButton.addEventListener("click", () => {
    const isHidden = dropdown.style.display === "none" || dropdown.style.display === "";

    // Hide all other dropdowns
    allDropdowns.forEach(({ toggleId: otherToggle, dropdownId: otherDropdown, displayText }) => {
      if (otherDropdown !== dropdown) {
        otherDropdown.style.display = "none";
        otherToggle.textContent = `${displayText} ▼`;
      }
    });

    if (isHidden) {
      dropdown.style.display = "block";
      dropdown.style.visibility = "hidden";
      dropdown.style.position = "fixed";

      requestAnimationFrame(() => {
        const buttonRect = toggleButton.getBoundingClientRect();

        dropdown.style.left = `${buttonRect.left}px`;
        dropdown.style.width = `${buttonRect.width}px`;
        dropdown.style.top = "0px";
        dropdown.style.bottom = `${window.innerHeight - buttonRect.top}px`;
        dropdown.style.maxHeight = `${buttonRect.top}px`;

        dropdown.style.visibility = "visible";
      });

      toggleButton.textContent = `${labelBaseText} ▲`;
    } else {
      dropdown.style.display = "none";
      toggleButton.textContent = `${labelBaseText} ▼`;
    }
  });
}
function clearLastfun(inputHistoryIndex) 
{
  console.log(`${inputHistoryIndex}`);
  if (history.length === 0) 
  {
    updateStatus("Nothing to clear");
    return;
  }

  // If no index is given, default to last
  if (inputHistoryIndex >= history.length || inputHistoryIndex === null) 
    inputHistoryIndex = history.length - 1;

  // Check if index is in range
  if (inputHistoryIndex < 0 || inputHistoryIndex >= history.length) 
  {
    updateStatus("Please select a valid expression");
    console.log(`${inputHistoryIndex} ${history.length}`);
    return;
  }

  const item = history[inputHistoryIndex];

  // Check if pinned
  if (item.Pinned) 
  {
    updateStatus("Remove the pin before clearing this expression");
    return;
  }

  // Remove assigned variable if present
  const exprList = splitExpressions(item.inputText);
  for (const exprText of exprList) 
  {
    const assignmentMatch = exprText.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (assignmentMatch) 
    {
      const varName = assignmentMatch[1];
      if (scope.hasOwnProperty(varName)) 
        delete scope[varName];
    }
  }

  // Remove from history
  history.splice(inputHistoryIndex, 1);

  // Adjust index after deletion
  if (history.length === 0) 
    inputHistoryIndex = 0;
  else if (inputHistoryIndex >= history.length) 
    inputHistoryIndex = history.length - 1;

  renderHistory();
  updateStatus("Entry cleared");
}
function renderHistory() 
{
  historyDiv.innerHTML = "";
  history.forEach(item => 
  {
    const div = document.createElement("div");
    katex.render(item.latex, div, { throwOnError: false, displayMode: true });
    historyDiv.appendChild(div);
  });
  historyDiv.scrollTop = historyDiv.scrollHeight;
}
function updateStatus(message = "") 
{
  statusLabel.textContent = message;
}
function calculate(insertIndex = null) 
{
  updateStatus("");
  try 
  {
    const newEntry = justcal(input.value);

    // Insert at given index or push
    if (insertIndex !== null && insertIndex >= 0 && insertIndex <= history.length) 
      history.splice(insertIndex, 0, newEntry);
    else 
      history.push(newEntry);

      // Limit history
    if (history.length > window.calculatorConfig.historyLimit) 
      history.shift();

    renderHistory();
    const entriesLeft = window.calculatorConfig.historyLimit - history.length;
    if (entriesLeft <= window.calculatorConfig.historyWarningThreshold) 
      updateStatus(`⚠️ Warning: Only ${entriesLeft} history entries left before limit.`);
    if (window.calculatorConfig.autoClearInput) 
      input.value = "";
    if (window.calculatorConfig.autoJumpToLatestHistory) 
      shortcuts.jumpToLatest();
    else 
      shortcuts.resetHistoryIndex();
    input.focus();
  } 
  catch (err) {updateStatus(`Error: ${err.message}`);}
}
function recalcfun(inputHistoryIndex)
{
 
  if (inputHistoryIndex !== null && history[inputHistoryIndex]) 
  {
    const newScope = { ...window.variables.values };
    for (let i = 0; i < inputHistoryIndex; i++) 
    {
      const exprText = history[i].inputText;
      const assignmentMatch = exprText.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
      if (assignmentMatch) 
      {
        const varName = assignmentMatch[1];
        const expr = assignmentMatch[2];
        try 
        {
          const value = math.evaluate(expr, newScope);
          newScope[varName] = value;
        } 
        catch (err) 
        {
          updateStatus(`Error in history #${i + 1}: ${err.message}`);
          return;
        }
      }
    }
    for (let i = inputHistoryIndex; i < history.length; i++) 
    {
      try 
      {
        history[i] = justcal((i === inputHistoryIndex) ? input.value : history[i].inputText);
      } 
      catch (err) 
      {
        updateStatus(`Error in history #${i + 1}: ${err.message}`);
        return;
      }
    }
    Object.assign(scope, newScope);
    renderHistory();
    updateStatus("Recalculation complete.");
  } 
  else 
  {
    updateStatus("No history entry selected.");
  }
  console.log(`${inputHistoryIndex} ${history.length}`);
}
function insertTextToInput(text) 
{
  if (insertAtCursorCheckbox.checked && insertGreekToClipBoard.checked ) 
  {
    insertAtCursor(input, `${text}`);
    navigator.clipboard.writeText(text).catch(err => {updateStatus(`Clipboard error: ${err.message}`);});
    updateStatus(`Inserted ${text} and copied ${text}`);
  } 
  else if(insertAtCursorCheckbox.checked && !insertGreekToClipBoard.checked )
  {
    insertAtCursor(input, `${text}`);
    updateStatus(`Inserted ${text}`);
  }
  else if(!insertAtCursorCheckbox.checked && insertGreekToClipBoard.checked )
  {
    navigator.clipboard.writeText(text).catch(err => {updateStatus(`Clipboard error: ${err.message}`);});
    updateStatus(`copied ${text}`);
  }
  else
    updateStatus(`Please select a action`);  
}
function pinfun()
{
  const inputHistoryIndex = shortcuts.getinputHistoryIndex();
  let entry = history[inputHistoryIndex];
  if(inputHistoryIndex !== null)
  {  
    entry.Pinned = !entry.Pinned;
    if (entry.Pinned) 
    {
      if (!entry.latex.startsWith("\\text{📌}~")) 
        entry.latex = `\\text{📌}~${entry.latex}`;
    } 
    else 
      entry.latex = entry.latex.replace(/^\\text\{📌\}~\s*/, "");

    updateStatus(`Pinned changed to ${history[inputHistoryIndex].Pinned}`);
    renderHistory();
  }
  else
    updateStatus("PLease select a expression by arrow key");
}
function clearfun()
{
  for(let i = history.length - 1; i >= 0; i--)
  {
    clearLastfun(i);
  }  
  updateStatus("");
}
function exportHistoryToJSON(history) {
  const dataStr = JSON.stringify(history, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "calculator_history.json";
  a.click();
  
  URL.revokeObjectURL(url);
}
function importHistoryFromJSON(file)
 {
  const reader = new FileReader();
  reader.onload = function (event) 
  {
    try 
    {
      const imported = JSON.parse(event.target.result);
      if (!Array.isArray(imported)) 
        throw new Error("Invalid JSON format");

      imported.forEach(entry => 
      {
        if (typeof entry.inputText === "string" && typeof entry.Pinned === "boolean") 
          history.push(justcal(entry.inputText, entry.Pinned));
        else 
          console.warn("Skipped invalid entry:", entry)
      });
      updateStatus("History imported.");
      renderHistory(); // ⬅️ Also add this to show it immediately
    } 
    catch (err) 
    {
      console.error("Import failed:", err);
      updateStatus("Import failed: Invalid file format.");
    }
  };
  reader.onerror = function () 
  {
    updateStatus("Error reading file.");
  };
  reader.readAsText(file);
}


