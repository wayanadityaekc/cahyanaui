'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, PanelLeft } from 'lucide-react';
import {
  RAIL_FRAME,
  RAIL_FRAME_SCROLL,
  RAIL_ASIDE,
  RAIL_ASIDE_COLLAPSED,
  RAIL_STICK,
  RAIL_STICK_COLLAPSED,
  RAIL_LABEL,
  railItem,
  RAIL_SPLIT,
  RAIL_MAIN,
  RAIL_MAIN_SCROLL,
  RAIL_SCROLL_BODY,
  RAIL_MLIST,
  RAIL_MLABEL,
  railMobileItem,
  RAIL_MCHEV,
  RAIL_BACK,
  RAIL_HEADER,
  RAIL_HEADER_PAD,
  RAIL_TRIGGER,
  RAIL_HEADER_SEP,
} from './railClasses.js';

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
  storageKey,
  onCollapsedChange,
  scrollContent = false,
  linkAs: LinkAs = 'a',
  contentAs: Content = 'div',
}) {
  const [ownCollapsed, setOwnCollapsed] = useState(false);
  const collapsed = collapsedProp ?? ownCollapsed;
  useEffect(() => {
    if (!storageKey) return;
    try {
      setOwnCollapsed(window.localStorage.getItem(storageKey) === '1');
    } catch (e) {}
  }, [storageKey]);
  function toggleCollapsed() {
    const next = !collapsed;
    if (collapsedProp === undefined) setOwnCollapsed(next);
    if (storageKey) {
      try {
        window.localStorage.setItem(storageKey, next ? '1' : '0');
      } catch (e) {}
    }
    if (onCollapsedChange) onCollapsedChange(next);
  }
  const railCollapsed = collapsible && collapsed;

  function rows(mobile) {
    return items.map((item) => {
      const selected = active === item.id;
      const cls = mobile ? railMobileItem(selected) : railItem(selected, railCollapsed);
      const inner = (
        <>
          {item.Icon && <item.Icon strokeWidth={1.7} aria-hidden="true" />}
          {(!railCollapsed || mobile) && item.label}
          {mobile && <ChevronRight className={RAIL_MCHEV} strokeWidth={1.7} aria-hidden="true" />}
        </>
      );
      const a11y = !mobile && railCollapsed ? { title: item.label, 'aria-label': item.label } : {};
      return (
        <div key={item.id} className="contents">
          {item.split && <span className={RAIL_SPLIT} aria-hidden="true" />}
          {item.href ? (
            <LinkAs href={item.href} className={cls} aria-current={selected ? 'page' : undefined} {...a11y}>
              {inner}
            </LinkAs>
          ) : (
            <button
              type="button"
              aria-current={selected ? 'true' : undefined}
              onClick={() => onSelect(item.id)}
              className={cls}
              {...a11y}
            >
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
          <nav className="flex flex-col" aria-label={label}>
            {rows(false)}
          </nav>
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

      <Content
        data-rail-content
        className={`${scrollContent ? RAIL_MAIN_SCROLL : mainClass} ${mobileNav || reading ? '' : 'max-[992px]:hidden'}`}
      >
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
