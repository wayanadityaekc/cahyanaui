import { REGISTRATION as R } from '@/content/shared/registration';

function SealIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// "Registered business" trust block for the About page. Business registration
// details only (no personal ID numbers); verification points to the official
// portal rather than hosting the certificate.
export default function RegistrationBlock() {
  const rows = [
    ['Ministry of Law Decree', R.decree],
    ['Business License (NIB)', R.nib],
    ['Activity', R.activity],
    ['Registered in', R.location],
  ];
  return (
    <section className="reg-sec">
      <div className="reg">
        <div className="reg__head">
          <span className="reg__seal"><SealIcon /></span>
          <div>
            <div className="reg__name">{R.name}</div>
            <div className="reg__type">Registered in Indonesia</div>
          </div>
        </div>
        <dl className="reg__rows">
          {rows.map(([k, v]) => (
            <div className="reg__row" key={k}>
              <dt className="reg__k">{k}</dt>
              <dd className="reg__v">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="reg__verify">
          <CheckIcon />
          Verify our registration on the official portal{' '}
          <a href={R.verifyUrl} target="_blank" rel="noopener">ahu.go.id</a>
        </p>
      </div>
    </section>
  );
}
