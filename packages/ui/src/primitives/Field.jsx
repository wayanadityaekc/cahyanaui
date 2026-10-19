import { cn } from '../lib/cn.js';
import { FIELD_LABEL } from './controlClasses.js';

export default function Field({ label, htmlFor, error, hint, className, children }) {
  return (
    <div className={cn('min-w-0', className)}>
      {label && (
        <label className={FIELD_LABEL} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 font-body text-label text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 font-body text-label text-err">
          {error}
        </p>
      )}
    </div>
  );
}
