// Arrow-key handling for a REAL tab set (a tablist whose tabs swap a panel).
// WAI-ARIA tabs pattern, same keys Preline's tabs plugin handles: Left/Right move
// between tabs (Up/Down when the list is vertical), Home/End jump to the ends, and the
// tab you land on is activated straight away ("automatic activation" - fine here, the
// panels are cheap to switch).
//
// Put it on the tablist: <div role="tablist" onKeyDown={tabKeys()}> and give the tabs
// `tabIndex={selected ? 0 : -1}` so Tab enters the set once and arrows move inside it.
export default function tabKeys({ vertical = false } = {}) {
  return (e) => {
    const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
    const at = tabs.indexOf(document.activeElement);
    if (at < 0) return;
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    let to = -1;
    if (e.key === next) to = (at + 1) % tabs.length;
    else if (e.key === prev) to = (at - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = tabs.length - 1;
    if (to < 0) return;
    e.preventDefault();
    tabs[to].focus();
    tabs[to].click();
  };
}
