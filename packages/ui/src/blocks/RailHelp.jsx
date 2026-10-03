import { RAIL_HELP, RAIL_HELP_TEXT, RAIL_HELP_BTN } from './railClasses.js';

/**
 * The help card that ends a rail (and the phone list): a question and one button.
 * Pass as RailLayout's `help`. The button is a link; `Icon` is optional.
 */
export default function RailHelp({ text, label, href, Icon, className = '', ...rest }) {
  return (
    <div className={`${RAIL_HELP} ${className}`}>
      <p className={RAIL_HELP_TEXT}>{text}</p>
      <a className={RAIL_HELP_BTN} href={href} target="_blank" rel="noopener" {...rest}>
        {Icon && <Icon strokeWidth={1.7} aria-hidden="true" />}
        {label}
      </a>
    </div>
  );
}
