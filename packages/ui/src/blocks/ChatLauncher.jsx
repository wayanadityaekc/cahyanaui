import { MessageCircle } from 'lucide-react';

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
      onClick={(event) => {
        event.currentTarget.focus();
        onClick(event);
      }}
    >
      <MessageCircle className={iconClass} strokeWidth={1.6} aria-hidden="true" />
      {label}
    </button>
  );
}
