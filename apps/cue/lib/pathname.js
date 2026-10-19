export function normalizePath(pathname) {
  const p = pathname || '/';
  return p === '/index.html' || p === '/index' ? '/' : p;
}
