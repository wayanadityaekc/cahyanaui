import { STEPS, stepBar, STEP_LABEL } from './confirmClasses.js';

export default function StepProgress({ names = [], step = 1, word = 'Step', of = 'of' }) {
  return (
    <>
      <div className={STEPS} aria-hidden="true">
        {names.map((name, index) => (
          <span className={stepBar(step >= index + 1)} key={name} />
        ))}
      </div>
      <p className={STEP_LABEL}>
        {word} {step} {of} {names.length} &middot; {names[step - 1]}
      </p>
    </>
  );
}
