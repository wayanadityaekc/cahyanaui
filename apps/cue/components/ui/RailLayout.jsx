'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, PanelLeft } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { readLocal, writeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';
import {
  RAIL_FRAME,
  RAIL_ASIDE,
  RAIL_ASIDE_COLLAPSED,
  RAIL_STICK,
  RAIL_STICK_COLLAPSED,
  RAIL_LABEL,
  buildRailItemClass,
  RAIL_SPLIT,
  RAIL_MAIN,
  RAIL_MLIST,
  RAIL_MLABEL,
  buildRailMobileItemClass,
  RAIL_MCHEV,
  RAIL_BACK,
  RAIL_HEADER,
  RAIL_TRIGGER,
  RAIL_HEADER_SEP,
  RAIL_HEADER_PAD,
  RAIL_FRAME_SCROLL,
  RAIL_MAIN_SCROLL,
  RAIL_SCROLL_BODY,
} from './railClasses';

export default function RailLayout({
  label,
  items,
  active,
  onSelect,
  reading,
  onBack,
  help = null,
  children,
  frameClass = RAIL_FRAME,
  mainClass = RAIL_MAIN,
  mobileNav = null,
  collapsible = false,
  breadcrumb = null,
  scrollContent = false,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
    if (collapsible) setIsCollapsed(readLocal(KEY.railCollapsed, '') === '1');
  }, [collapsible]);
  function handleCollapsedToggle() {
    const isNextCollapsed = !isCollapsed;
    setIsCollapsed(isNextCollapsed);
    writeLocal(KEY.railCollapsed, isNextCollapsed ? '1' : '0');
  }
  const railCollapsed = collapsible && isCollapsed;
  const effectiveFrameClass = scrollContent ? RAIL_FRAME_SCROLL : frameClass;
  const effectiveMainClass = scrollContent ? RAIL_MAIN_SCROLL : mainClass;

  function renderRows(mobile) {
    return items.map((item) => {
      const isSelected = active === item.id;
      const cls = mobile ? buildRailMobileItemClass(isSelected) : buildRailItemClass(isSelected, railCollapsed);
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
            <a href={item.href} className={`${cls} no-underline`} aria-current={isSelected || undefined} {...a11y}>
              {inner}
            </a>
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
    <div className={effectiveFrameClass}>
      <aside className={railCollapsed ? RAIL_ASIDE_COLLAPSED : RAIL_ASIDE} aria-label={label}>
        <div className={railCollapsed ? RAIL_STICK_COLLAPSED : RAIL_STICK}>
          {!railCollapsed && <p className={RAIL_LABEL}>{label}</p>}
          <nav className="flex flex-col" aria-label={label}>
            {renderRows(false)}
          </nav>
          {!railCollapsed && help}
        </div>
      </aside>

      {!mobileNav && (
        <div className={reading ? 'hidden' : RAIL_MLIST}>
          <p className={RAIL_MLABEL}>{label}</p>
          {renderRows(true)}
          {help}
        </div>
      )}

      <main className={`${effectiveMainClass} ${mobileNav || reading ? '' : 'max-[992px]:hidden'}`}>
        {(collapsible || breadcrumb) && (
          <div className={scrollContent ? `${RAIL_HEADER} ${RAIL_HEADER_PAD}` : RAIL_HEADER}>
            {collapsible && (
              <button
                type="button"
                className={RAIL_TRIGGER}
                onClick={handleCollapsedToggle}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!isCollapsed}
              >
                <PanelLeft strokeWidth={1.7} aria-hidden="true" />
              </button>
            )}
            {collapsible && breadcrumb && <span className={RAIL_HEADER_SEP} aria-hidden="true" />}
            {breadcrumb && <Breadcrumb items={breadcrumb} className="m-0" />}
          </div>
        )}
        {mobileNav || (
          <button type="button" className={RAIL_BACK} onClick={onBack}>
            <ChevronLeft strokeWidth={1.7} aria-hidden="true" />
            {label}
          </button>
        )}
        {scrollContent ? <div className={RAIL_SCROLL_BODY}>{children}</div> : children}
      </main>
    </div>
  );
}
