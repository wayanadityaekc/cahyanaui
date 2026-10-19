'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, PanelLeft } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import { readLocal, writeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';
import {
  RAIL_FRAME, RAIL_ASIDE, RAIL_ASIDE_COLLAPSED, RAIL_STICK, RAIL_STICK_COLLAPSED,
  RAIL_LABEL, railItem, RAIL_SPLIT,
  RAIL_MAIN, RAIL_MLIST, RAIL_MLABEL, railMobileItem, RAIL_MCHEV, RAIL_BACK,
  RAIL_HEADER, RAIL_TRIGGER, RAIL_HEADER_SEP, RAIL_HEADER_PAD,
  RAIL_FRAME_SCROLL, RAIL_MAIN_SCROLL, RAIL_SCROLL_BODY,
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
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    if (collapsible) setCollapsed(readLocal(KEY.railCollapsed, '') === '1');
  }, [collapsible]);
  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    writeLocal(KEY.railCollapsed, next ? '1' : '0');
  }
  const railCollapsed = collapsible && collapsed;
  const effectiveFrameClass = scrollContent ? RAIL_FRAME_SCROLL : frameClass;
  const effectiveMainClass = scrollContent ? RAIL_MAIN_SCROLL : mainClass;

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
        const a11y = !mobile && railCollapsed ? { title: t.label, 'aria-label': t.label } : {};
        return (
          <div key={t.id} className="contents">
            {t.split && <span className={RAIL_SPLIT} aria-hidden="true" />}
            {t.href ? (
              <a href={t.href} className={`${cls} no-underline`} aria-current={selected || undefined} {...a11y}>
                {inner}
              </a>
            ) : (
              <button
                type="button"
                aria-current={selected ? 'true' : undefined}
                onClick={() => onSelect(t.id)}
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

      <main className={`${effectiveMainClass} ${mobileNav || reading ? '' : 'max-[992px]:hidden'}`}>
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
