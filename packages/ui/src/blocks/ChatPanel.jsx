'use client';

import { useEffect, useRef } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import Input from '../primitives/Input.jsx';
import { PANEL_CLOSE } from '../primitives/controlClasses.js';
import ChatMessages from './ChatMessages.jsx';
import {
  CHAT_HEAD, CHAT_HEAD_AVATAR, CHAT_HEAD_STACK, CHAT_HEAD_TITLE, CHAT_HEAD_SUB, CHAT_BODY, CHAT_FOOT, CHAT_SEND,
  CHAT_ALT_ROW, CHAT_ALT_LINK, CHAT_DOTS, CHAT_DOT, CHAT_TYPING_ROW, CHAT_TYPING_WHO, chatDotLive, CHAT_MAIL_FORM,
  CHAT_NOTE, CHAT_TEXT_BTN, CHAT_CTA, CHAT_CONNECTED, CHAT_SIGNIN_BAR, CHAT_SIGNIN_TEXT, CHAT_SIGNIN_BTN,
} from './chatClasses.js';

const FALLBACK = 'Sorry, we could not load this information. Please try again.';

// Inside of CUE's chat panel (head, conversation, input, a way out); the site owns the frame, its motion and the state.
export default function ChatPanel({
  chat = null,
  copy = {},
  onClose = () => {},
  onSignIn = null,
  altLink = null,
  linkAs = 'a',
}) {
  const bodyRef = useRef(null);
  const log = chat ? chat.log : [];
  const thinking = chat ? chat.thinking : false;

  // New message, or the dots appearing: keep the newest line in view.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [log, thinking]);

  if (!chat) return <p className={`${CHAT_NOTE} p-4`}>{FALLBACK}</p>;

  const {
    draft, onDraft, ask, sending, thread, ownerHere, ownerTyping,
    mail, mailDraft, setMailDraft, mailErr, saveEmail, skipMail,
  } = chat;

  return (
    <>
      <div className={CHAT_HEAD}>
        <span className={CHAT_HEAD_AVATAR} aria-hidden="true"><MessageCircle strokeWidth={1.6} /></span>
        <span className={CHAT_HEAD_STACK}>
          <span className={CHAT_HEAD_TITLE}>{copy.title}</span>
          <span className={CHAT_HEAD_SUB}>{copy.sub}</span>
        </span>
        <button type="button" className={PANEL_CLOSE} onClick={onClose} aria-label="Close chat">×</button>
      </div>

      <div className={CHAT_BODY} ref={bodyRef}>
        {/* Optional sign-in offer; chatting works without it, and the site hides it once signed in. */}
        {onSignIn && (
          <p className={CHAT_SIGNIN_BAR}>
            <span className={CHAT_SIGNIN_TEXT}>{copy.signedOut}</span>
            <button type="button" className={CHAT_SIGNIN_BTN} data-signin onClick={onSignIn}>{copy.signIn}</button>
          </p>
        )}

        <ChatMessages log={log} ownerName={copy.ownerName} onAsk={ask} onNavigate={onClose} linkAs={linkAs} />

        {mail === 'ask' && (
          <form className={CHAT_MAIL_FORM} onSubmit={saveEmail} data-mail-ask>
            <p className={CHAT_NOTE}>{copy.emailAsk}</p>
            <Input
              type="email"
              value={mailDraft}
              onChange={(e) => setMailDraft(e.target.value)}
              placeholder={copy.emailField}
              aria-label={copy.emailField}
              maxLength={200}
            />
            {mailErr && <p className={CHAT_NOTE} role="alert">{mailErr}</p>}
            <span className="flex items-center gap-[0.6rem]">
              <button type="submit" className={CHAT_CTA} data-mailsend disabled={!mailDraft.trim()}>{copy.emailSend}</button>
              <button type="button" className={CHAT_TEXT_BTN} onClick={skipMail}>{copy.emailSkip}</button>
            </span>
          </form>
        )}

        {thinking && (
          <span className={CHAT_DOTS} aria-label="Typing">
            <i className={CHAT_DOT} /><i className={CHAT_DOT} /><i className={CHAT_DOT} />
          </span>
        )}

        {ownerTyping && (
          <span className={CHAT_TYPING_ROW} data-typing aria-live="polite">
            <small className={CHAT_TYPING_WHO}>{copy.typing}</small>
            <i className={chatDotLive(0)} /><i className={chatDotLive(1)} /><i className={chatDotLive(2)} />
          </span>
        )}
      </div>

      {thread && (
        <p className={CHAT_CONNECTED} data-connected>
          <MessageCircle strokeWidth={2} aria-hidden="true" />
          {ownerHere ? copy.ownerHere : copy.connectedStrip}
        </p>
      )}

      <form className={CHAT_FOOT} onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
        <Input
          className="flex-1 min-w-0"
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          placeholder={thread ? copy.placeholderLive : copy.placeholder}
          aria-label="Your question"
          maxLength={300}
        />
        <button type="submit" className={CHAT_SEND} disabled={!draft.trim() || thinking || sending} aria-label="Send">
          <Send strokeWidth={1.8} aria-hidden="true" />
        </button>
      </form>

      {altLink && (
        <p className={`${CHAT_ALT_ROW} m-0`}>
          <span>{altLink.note}</span>
          <a className={CHAT_ALT_LINK} href={altLink.href} target="_blank" rel="noopener" data-chat-alt>
            {altLink.icon}
            {altLink.label}
          </a>
        </p>
      )}
    </>
  );
}
