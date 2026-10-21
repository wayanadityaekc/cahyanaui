'use client';

import { AnimatePresence, LazyMotion, domAnimation, m as motionComponents, useReducedMotion } from 'motion/react';
import Button from '../primitives/Button.jsx';
import { cn } from '../lib/cn.js';

const BANNER_SLIDE_OFFSET_PX = 80;
const BANNER_ANIMATION_DURATION_SECONDS = 0.3;
const ENTRANCE_EASE = [0.16, 1, 0.3, 1];

const PANEL =
  'fixed z-[96] inset-x-0 bottom-0 bg-surface-raised [border-top:1px_solid_var(--line)] rounded-t-xl ' +
  'pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 font-body text-ink';
const INNER =
  'mx-auto max-w-[var(--container)] px-[var(--container-x)] flex flex-col gap-4 ' +
  'min-[993px]:flex-row min-[993px]:items-center min-[993px]:gap-8';
const TEXT = 'min-[993px]:flex-1';
const TITLE = 'm-0 mb-2 text-strong font-semibold text-gold';
const BODY = 'm-0 text-small leading-[var(--lh-body)] text-muted';
const LINK = 'text-gold underline underline-offset-2';
const ACTIONS = 'flex flex-col gap-2 min-[561px]:flex-row min-[993px]:flex-none';

export default function ConsentBanner({
  isOpen = false,
  title = 'Cookies and analytics',
  body = '',
  policyLabel = 'Privacy policy',
  policyHref = '/our-company#privacy',
  acceptLabel = 'Accept all',
  necessaryLabel = 'Only necessary',
  rejectLabel = 'Reject all',
  onChoose = () => {},
  className,
}) {
  const isReducedMotion = useReducedMotion();
  const offset = isReducedMotion ? 0 : BANNER_SLIDE_OFFSET_PX;
  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <motionComponents.div
            role="region"
            aria-label={title}
            className={cn(PANEL, className)}
            data-consent-banner
            initial={{ opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: offset }}
            transition={{ duration: isReducedMotion ? 0 : BANNER_ANIMATION_DURATION_SECONDS, ease: ENTRANCE_EASE }}
          >
            <div className={INNER}>
              <div className={TEXT}>
                <p className={TITLE}>{title}</p>
                <p className={BODY}>
                  {body}{' '}
                  <a className={LINK} href={policyHref}>
                    {policyLabel}
                  </a>
                </p>
              </div>
              <div className={ACTIONS}>
                <Button onClick={() => onChoose('granted')}>{acceptLabel}</Button>
                <Button variant="ghost" onClick={() => onChoose('denied')}>
                  {necessaryLabel}
                </Button>
                <Button variant="ghost" onClick={() => onChoose('denied')}>
                  {rejectLabel}
                </Button>
              </div>
            </div>
          </motionComponents.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
