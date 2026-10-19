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

const ICON_STROKE_WIDTH_REGULAR = 1.7;

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
  const [isOwnCollapsed, setIsOwnCollapsed] = useState(false);
  const collapsed = collapsedProp ?? isOwnCollapsed;
  useEffect(() => {
    if (!storageKey) return;
    try {
      setIsOwnCollapsed(window.localStorage.getItem(storageKey) === '1');
    } catch (e) {}
  }, [storageKey]);
  function handleCollapsedToggle() {
    const isNextCollapsed = !collapsed;
    if (collapsedProp === undefined) setIsOwnCollapsed(isNextCollapsed);
    if (storageKey) {
      try {
        window.localStorage.setItem(storageKey, isNextCollapsed ? '1' : '0');
      } catch (e) {}
    }
    if (onCollapsedChange) onCollapsedChange(isNextCollapsed);
  }
  const railCollapsed = collapsible && collapsed;

  function renderRailRows(mobile) {
    return items.map((item) => {
      const isSelected = active === item.id;
      const cls = mobile ? railMobileItem(isSelected) : railItem(isSelected, railCollapsed);
      const inner = (
        <>
          {item.Icon && <item.Icon strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />}
          {(!railCollapsed || mobile) && item.label}
          {mobile && <ChevronRight className={RAIL_MCHEV} strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />}
        </>
      );
      const a11y = !mobile && railCollapsed ? { title: item.label, 'aria-label': item.label } : {};
      return (
        <div key={item.id} className="contents">
          {item.split && <span className={RAIL_SPLIT} aria-hidden="true" />}
          {item.href ? (
            <LinkAs href={item.href} className={cls} aria-current={isSelected ? 'page' : undefined} {...a11y}>
              {inner}
            </LinkAs>
          ) : (
            <button
              type="button"
              aria-current={isSelected ? 'true' : undefined}
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
            {renderRailRows(false)}
          </nav>
          {!railCollapsed && help}
        </div>
      </aside>

      {!mobileNav && (
        <div className={reading ? 'hidden' : RAIL_MLIST}>
          <p className={RAIL_MLABEL}>{label}</p>
          {renderRailRows(true)}
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
                onClick={handleCollapsedToggle}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
              >
                <PanelLeft strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />
              </button>
            )}
            {collapsible && breadcrumb && <span className={RAIL_HEADER_SEP} aria-hidden="true" />}
            {breadcrumb}
          </div>
        )}
        {mobileNav || (
          <button type="button" className={RAIL_BACK} onClick={onBack}>
            <ChevronLeft strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />
            {label}
          </button>
        )}
        {scrollContent ? <div className={RAIL_SCROLL_BODY}>{children}</div> : children}
      </Content>
    </div>
  );
}
