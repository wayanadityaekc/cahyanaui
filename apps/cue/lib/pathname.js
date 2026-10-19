export function normalizePath(pathname) {
  const path = pathname || '/';
  return path === '/index.html' || path === '/index' ? '/' : path;
}
