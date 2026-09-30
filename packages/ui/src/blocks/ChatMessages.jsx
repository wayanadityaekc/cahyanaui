import {
  CHAT_BUBBLE_BOT, CHAT_BUBBLE_ME, CHAT_BUBBLE_OWNER, CHAT_WHO, CHAT_ROW, CHAT_ROW_NAME, CHAT_ROW_NOTE,
  CHAT_ROW_PRICE, CHAT_LINK, CHAT_CHIPS, CHAT_CHIP,
} from './chatClasses.js';

// One bot reply: the sentence plus any rows, a page link, or suggested questions.
function BotReply({ message, onAsk, onNavigate, linkAs: LinkTag }) {
  const { text, rows = [], link = null, chips = [] } = message;
  return (
    <>
      <p className={CHAT_BUBBLE_BOT}>{text}</p>

      {rows.map((row) => (
        <LinkTag key={row.label} className={CHAT_ROW} data-chatrow href={row.href} onClick={onNavigate}>
          <span className={CHAT_ROW_NAME}>
            {row.label}
            {row.note && <small className={CHAT_ROW_NOTE}>{row.note}</small>}
          </span>
          {row.price && <span className={CHAT_ROW_PRICE}>{row.price}</span>}
        </LinkTag>
      ))}

      {link && <LinkTag className={CHAT_LINK} data-cta href={link.href} onClick={onNavigate}>{link.label}</LinkTag>}

      {chips.length > 0 && (
        <span className={CHAT_CHIPS}>
          {chips.map((chip) => (
            <button key={chip} type="button" className={CHAT_CHIP} data-chip onClick={() => onAsk(chip)}>{chip}</button>
          ))}
        </span>
      )}
    </>
  );
}

// The conversation: guest bubbles right, bot answers left, the owner's replies named.
export default function ChatMessages({ log = [], ownerName = 'Wayan', onAsk = () => {}, onNavigate, linkAs = 'a' }) {
  return log.map((message) => {
    if (message.from === 'me') return <p key={message.id} className={CHAT_BUBBLE_ME}>{message.text}</p>;
    if (message.from === 'owner') {
      return (
        <p key={message.id} className={CHAT_BUBBLE_OWNER} data-owner-reply>
          <small className={CHAT_WHO}>{ownerName}</small>
          {message.text}
        </p>
      );
    }
    return <BotReply key={message.id} message={message} onAsk={onAsk} onNavigate={onNavigate} linkAs={linkAs} />;
  });
}
