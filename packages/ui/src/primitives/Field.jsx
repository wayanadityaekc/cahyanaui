import { cn } from '../lib/cn.js';
import { EYEBROW } from './Eyebrow.jsx';

/**
 * Label + control + (optional) error, stacked.
 *
 * The wrapper every form field on both sites shares, so a label sits at the
 * same size and distance above a <Select>, a <DateField> and a plain <Input>
 * without each form re-deciding it.
 *
 * `htmlFor` is a real prop rather than something guessed: these controls are
 * custom buttons with a hidden native element underneath, and the label has to
 * point at the id the control was given or clicking it does nothing.
 */
export default function Field({ label, htmlFor, error, hint, className, children }) {
  return (
    <div className={cn('min-w-0', className)}>
      {label && (
        <label className={cn(EYEBROW, 'block mb-1')} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 font-body text-label text-muted">{hint}</p>}
      {/* role="alert" so a screen reader is told the moment validation fails,
          rather than only on the next focus move. */}
      {error && <p role="alert" className="mt-1 font-body text-label text-err">{error}</p>}
    </div>
  );
}
