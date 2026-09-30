'use client';

import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { CHAT_FRAME, CHAT_SCRIM, ChatPanel, useBodyLock, useChat, useDialog, useMobile } from '@cahyana/ui';
import AuthSheet from '@/components/account/AuthSheet';
import { useAccount } from '@/components/providers/AccountProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { answerFor } from '@/lib/chatAnswers';
import { API_BASE, WHATSAPP_LINK } from '@/lib/constants';
import { CHAT_COPY, SUGGESTIONS, wayanIsAround } from '@/content/chat';

// Separate from the tour site's key, so a guest on both sites keeps two conversations apart.
const THREAD_KEY = 'upv_chat_thread_v1';
const EASE_OUT = [0.16, 1, 0.3, 1];
// The frame's own breakpoint (CHAT_FRAME switches shape at 768).
const PHONE = '(max-width: 768px)';
// A drawer from the right on desktop, a sheet from the bottom on phones: the same shapes CUE's panel slides between.
const DRAWER_OFF = { x: '100%', y: 0, opacity: 0 };
const SHEET_OFF = { x: 0, y: '100%', opacity: 0 };
const ON = { x: 0, y: 0, opacity: 1 };

// Tells Wayan's dashboard and emails this chat came from the villa site, not CUE.
function pageLabel() {
  return `ubudprivatevillas.com${window.location.pathname}`;
}

// The live chat panel: library state + shell, this site's answers and copy, and Framer Motion for the open and close.
export default function ChatWindow({ open = false, onClose = () => {} }) {
  const { account, hydrated } = useAccount();
  const { format } = useCurrency();
  const [authOpen, setAuthOpen] = useState(false);
  const reduced = useReducedMotion();
  // useMobile only settles after mount, and the first open mounts this; read the query now so a phone never slides in from the side.
  const phoneAfterMount = useMobile(PHONE);
  const isMobile = typeof window === 'undefined' ? phoneAfterMount : window.matchMedia(PHONE).matches;
  // Handed to the sign-in sheet while it is up, so closing that sheet cannot unlock the page under an open chat.
  useBodyLock(open && !authOpen);
  const dialogRef = useDialog({ shown: open, onClose });

  const answer = useCallback((question) => answerFor(question, { format }), [format]);
  const chat = useChat({
    open,
    apiBase: API_BASE,
    storageKey: THREAD_KEY,
    answerFor: answer,
    copy: CHAT_COPY,
    suggestions: SUGGESTIONS,
    page: pageLabel,
    account,
    isAround: wayanIsAround,
  });

  const off = isMobile ? SHEET_OFF : DRAWER_OFF;
  const duration = reduced ? 0 : 0.3;

  return createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            key="scrim"
            className={CHAT_SCRIM}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration, ease: EASE_OUT }}
            onClick={onClose}
          />
        )}
        {open && (
          <m.div
            key="panel"
            ref={dialogRef}
            className={CHAT_FRAME}
            role="dialog"
            aria-modal="true"
            aria-label={CHAT_COPY.title}
            data-chat-panel
            data-live={chat.live ? '1' : '0'}
            initial={off}
            animate={ON}
            // pointerEvents goes in exit: the leaving element keeps its old props, so it would stay clickable.
            exit={{ ...off, pointerEvents: 'none' }}
            transition={{ duration, ease: EASE_OUT }}
          >
            <ChatPanel
              chat={chat}
              copy={CHAT_COPY}
              onClose={onClose}
              onSignIn={hydrated && !account ? () => setAuthOpen(true) : null}
              altLink={{
                href: WHATSAPP_LINK,
                label: CHAT_COPY.whatsappLabel,
                note: CHAT_COPY.whatsappNote,
                icon: <MessageCircle strokeWidth={1.8} aria-hidden="true" />,
              }}
            />
          </m.div>
        )}
      </AnimatePresence>
      <AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} />
    </LazyMotion>,
    document.body,
  );
}
