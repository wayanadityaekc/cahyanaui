// The homepage has TWO spellings and everything that reads usePathname() has to agree
// with what the build PRERENDERED, or the page fails to hydrate.
//
// Static export prerenders the homepage at pathname '/'. A browser sitting on
// '/index.html' reports '/index.html' instead, so any component that derives markup
// from the pathname computes something different from the HTML the server wrote -
// React throws #418, drops the server HTML and re-renders that page on the client.
// Measured before this existed: '/index.html' threw, '/' did not, and the cause was
// the trip bar picking the DETAIL-page promo there (promoFor strips '.html', which
// turns '/index.html' into '/index' - a key no map has) while the server had written
// the homepage's own rotating pair.
//
// Nothing internal links to '/index.html' (checked: zero links in the repo), so this
// only reaches people who type or bookmark it. It is still worth one function: the
// failure is silent, it takes a whole page down to client rendering, and there is no
// gate that would catch the next component to read the pathname.
//
// ZERO imports on purpose - this is pulled into Navbar, which is on every page. Same
// reason lib/crumbs.js stays a literal map (see CLAUDE.md).
export function normalizePath(pathname) {
  const p = pathname || '/';
  return p === '/index.html' || p === '/index' ? '/' : p;
}
