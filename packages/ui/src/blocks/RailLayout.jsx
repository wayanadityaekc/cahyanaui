'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, PanelLeft } from 'lucide-react';
import {
  RAIL_FRAME, RAIL_FRAME_SCROLL, RAIL_ASIDE, RAIL_ASIDE_COLLAPSED, RAIL_STICK, RAIL_STICK_COLLAPSED,
  RAIL_LABEL, railItem, RAIL_SPLIT, RAIL_MAIN, RAIL_MAIN_SCROLL, RAIL_SCROLL_BODY,
  RAIL_MLIST, RAIL_MLABEL, railMobileItem, RAIL_MCHEV, RAIL_BACK,
  RAIL_HEADER, RAIL_HEADER_PAD, RAIL_TRIGGER, RAIL_HEADER_SEP,
} from './railClasses.js';

/**
 * Sticky side menu + content column. On phones the menu is the first screen;
 * `reading` true shows the open section with a back row instead.
 *
 *   items     [{ id, label, Icon?, href?, split? }] - href makes a row a link
 *             (rendered with `linkAs`, default <a>), otherwise it calls onSelect.
 *             split draws a line above the row.
 *   help      optional node at the end of the rail (and of the phone list).
 *   mobileNav optional node that REPLACES the phone list and back row, for a
 *             page that must land on its content (an article).
 *   breadcrumb  optional node in the desktop header row.
 *   collapsible  adds a collapse trigger. `collapsed` + `onCollapsedChange`
 *             make it controlled (the site decides where to remember it);
 *             without them it keeps its own state.
 *   scrollContent  caps the frame to one screen and scrolls only the content.
 *   contentAs  the content column's element. 'div' by default, because the
 *             site's layout usually owns the page's one <main>; pass 'main'
 *             when it does not.
 *
 * Paint note: a site's state read from storage must arrive AFTER mount (pass
 * the initial `collapsed`/`reading` as false and set it in an effect), or a
 * static export's first paint differs from its pre-rendered HTML.
 */
export default function RailLayout({
  label,
  items,
  active,
  onSelect = () => {},
  reading = false,
  onBack = () => {},
  help = null,
  children,
  frameClass = RAIL_FRAME,
  mainClass = RAIL_MAIN,
  mobileNav = null,
  breadcrumb = null,
  collapsible = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  scrollContent = false,
  linkAs: LinkAs = 'a',
  contentAs: Content = 'div',
}) {
  const [ownCollapsed, setOwnCollapsed] = useState(false);
  const collapsed = collapsedProp ?? ownCollapsed;
  function toggleCollapsed() {
    const next = !collapsed;
    if (collapsedProp === undefined) setOwnCollapsed(next);
    if (onCollapsedChange) onCollapsedChange(next);
  }
  const railCollapsed = collapsible && collapsed;

  function rows(mobile) {
    return items.map((t) => {
      const selected = active === t.id;
      const cls = mobile ? railMobileItem(selected) : railItem(selected, railCollapsed);
      const inner = (
        <>
          {t.Icon && <t.Icon strokeWidth={1.7} aria-hidden="true" />}
          {(!railCollapsed || mobile) && t.label}
          {mobile && <ChevronRight className={RAIL_MCHEV} strokeWidth={1.7} aria-hidden="true" />}
        </>
      );
      // Collapsed rows keep the label as their accessible name.
      const a11y = !mobile && railCollapsed ? { title: t.label, 'aria-label': t.label } : {};
      return (
        <div key={t.id} className="contents">
          {t.split && <span className={RAIL_SPLIT} aria-hidden="true" />}
          {t.href ? (
            <LinkAs href={t.href} className={cls} aria-current={selected ? 'page' : undefined} {...a11y}>{inner}</LinkAs>
          ) : (
            <button type="button" aria-current={selected ? 'true' : undefined} onClick={() => onSelect(t.id)} className={cls} {...a11y}>
              {inner}
            </button>
          )}
        </div>
      );
    });
  }

  return (
    <div className={scrollContent ? RAIL_FRAME_SCROLL : frameClass}>
      <aside className={railCollapsed ? RAIL_ASIDE_COLLAPSED : RAIL_ASIDE} aria-label={label}>
        <div className={railCollapsed ? RAIL_STICK_COLLAPSED : RAIL_STICK}>
          {!railCollapsed && <p className={RAIL_LABEL}>{label}</p>}
          <nav className="flex flex-col" aria-label={label}>{rows(false)}</nav>
          {!railCollapsed && help}
        </div>
      </aside>

      {!mobileNav && (
        <div className={reading ? 'hidden' : RAIL_MLIST}>
          <p className={RAIL_MLABEL}>{label}</p>
          {rows(true)}
          {help}
        </div>
      )}

      <Content data-rail-content className={`${scrollContent ? RAIL_MAIN_SCROLL : mainClass} ${mobileNav || reading ? '' : 'max-[992px]:hidden'}`}>
        {(collapsible || breadcrumb) && (
          <div className={scrollContent ? `${RAIL_HEADER} ${RAIL_HEADER_PAD}` : RAIL_HEADER}>
            {collapsible && (
              <button
                type="button"
                className={RAIL_TRIGGER}
                onClick={toggleCollapsed}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
              >
                <PanelLeft strokeWidth={1.7} aria-hidden="true" />
              </button>
            )}
            {collapsible && breadcrumb && <span className={RAIL_HEADER_SEP} aria-hidden="true" />}
            {breadcrumb}
          </div>
        )}
        {mobileNav || (
          <button type="button" className={RAIL_BACK} onClick={onBack}>
            <ChevronLeft strokeWidth={1.7} aria-hidden="true" />
            {label}
          </button>
        )}
        {scrollContent ? <div className={RAIL_SCROLL_BODY}>{children}</div> : children}
      </Content>
    </div>
  );
}
