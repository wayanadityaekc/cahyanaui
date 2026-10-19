import { MessageCircle } from 'lucide-react';

const ICON_STROKE_WIDTH_THIN = 1.6;

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
      <MessageCircle className={iconClass} strokeWidth={ICON_STROKE_WIDTH_THIN} aria-hidden="true" />
      {label}
    </button>
  );
}
