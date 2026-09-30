import { MessageCircle } from 'lucide-react';

// The chat's opener: a plain button (never a link), so it can open the panel in place on every page.
export default function ChatLauncher({
  open = false,
  onClick = () => {},
  className = '',
  label = null,
  ariaLabel = 'Chat with us',
  iconClass = 'w-5 h-5',
}) {
  return (
    <button
      type="button"
      className={`bg-transparent border-none p-0 cursor-pointer ${className}`}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      aria-expanded={open}
      data-chat-launcher
      // Safari does not focus a clicked button, and the dialog hands focus back to whatever was focused when it opened.
      onClick={(e) => { e.currentTarget.focus(); onClick(e); }}
    >
      <MessageCircle className={iconClass} strokeWidth={1.6} aria-hidden="true" />
      {label}
    </button>
  );
}
