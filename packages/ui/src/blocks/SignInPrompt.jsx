import Button from '../primitives/Button.jsx';

// CUE's logged-out state for My Trips and Settings: a lead, a line, one Sign in button. The site owns the sign-in sheet.
const LEAD = 'font-head font-medium tracking-[-0.01em] text-[1rem] text-green m-0 mb-[0.4rem]';
const SUB = 'text-body text-muted max-w-[44ch] mx-auto mt-0 mb-[1.4rem]';

export default function SignInPrompt({ lead, sub, label = 'Sign in', onSignIn = () => {}, className = '' }) {
  return (
    <div className={`text-center pt-2 px-0 pb-0 ${className}`}>
      <p className={LEAD}>{lead}</p>
      <p className={SUB}>{sub}</p>
      <Button onClick={onSignIn}>{label}</Button>
    </div>
  );
}
