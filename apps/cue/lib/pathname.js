// Maps '/index.html' to '/' so pathname-derived markup matches the prerendered homepage; keep zero imports.
export function normalizePath(pathname) {
  const p = pathname || '/';
  return p === '/index.html' || p === '/index' ? '/' : p;
}
