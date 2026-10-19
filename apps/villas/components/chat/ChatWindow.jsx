'use client';

import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LazyMotion, domAnimation, m as motionElement, useReducedMotion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { CHAT_FRAME, CHAT_SCRIM, ChatPanel, useBodyLock, useChat, useDialog, useMobile } from '@cahyana/ui';
import AuthSheet from '@/components/account/AuthSheet';
import { useAccount } from '@/components/providers/AccountProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { answerFor } from '@/lib/chatAnswers';
import { API_BASE, WHATSAPP_LINK } from '@/lib/constants';
import { CHAT_COPY, SUGGESTIONS, isWayanAround } from '@/content/chat';

const CHAT_PANEL_DURATION_SECONDS = 0.3;
const ICON_STROKE_WIDTH_BOLD = 1.8;

const THREAD_KEY = 'upv_chat_thread_v1';
const EASE_OUT = [0.16, 1, 0.3, 1];
const PHONE = '(max-width: 768px)';
const DRAWER_OFF = { x: '100%', y: 0, opacity: 0 };
const SHEET_OFF = { x: 0, y: '100%', opacity: 0 };
const ON = { x: 0, y: 0, opacity: 1 };

function buildPageLabel() {
  return `ubudprivatevillas.com${window.location.pathname}`;
}

export default function ChatWindow({ open = false, onClose = () => {} }) {
  const { account, hydrated } = useAccount();
  const { format } = useCurrency();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const reduced = useReducedMotion();
  const phoneAfterMount = useMobile(PHONE);
  const isMobile = typeof window === 'undefined' ? phoneAfterMount : window.matchMedia(PHONE).matches;
  useBodyLock(open && !isAuthOpen);
  const dialogRef = useDialog({ shown: open, onClose });

  const answer = useCallback((question) => answerFor(question, { format }), [format]);
  const chat = useChat({
    open,
    apiBase: API_BASE,
    storageKey: THREAD_KEY,
    answerFor: answer,
    copy: CHAT_COPY,
    suggestions: SUGGESTIONS,
    page: buildPageLabel,
    account,
    isAround: isWayanAround,
  });

  const off = isMobile ? SHEET_OFF : DRAWER_OFF;
  const duration = reduced ? 0 : CHAT_PANEL_DURATION_SECONDS;

  return createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <motionElement.div
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
          <motionElement.div
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
            exit={{ ...off, pointerEvents: 'none' }}
            transition={{ duration, ease: EASE_OUT }}
          >
            <ChatPanel
              chat={chat}
              copy={CHAT_COPY}
              onClose={onClose}
              onSignIn={hydrated && !account ? () => setIsAuthOpen(true) : null}
              altLink={{
                href: WHATSAPP_LINK,
                label: CHAT_COPY.whatsappLabel,
                note: CHAT_COPY.whatsappNote,
                icon: <MessageCircle strokeWidth={ICON_STROKE_WIDTH_BOLD} aria-hidden="true" />,
              }}
            />
          </motionElement.div>
        )}
      </AnimatePresence>
      <AuthSheet open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </LazyMotion>,
    document.body,
  );
}
