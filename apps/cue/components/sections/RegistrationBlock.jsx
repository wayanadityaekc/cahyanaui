import { Check, ShieldCheck } from 'lucide-react';
import { REGISTRATION as R } from '@/content/shared/registration';

const SealIcon = ({ className }) => <ShieldCheck className={className} strokeWidth={1.7} aria-hidden="true" />;
const CheckIcon = ({ className }) => <Check className={className} aria-hidden="true" />;

// "Registered business" trust block for the About page. Business registration
// details only (no personal ID numbers); verification points to the official
// portal rather than hosting the certificate.
// Tailwind-native (migrasi Fase 2): dulu keluarga .reg* di style.css -> utilities.
// Varian `.company-page .reg` gak kepake React (blok ini cuma di about-us).
// `company` = varian buat Our Company (borderless, nempel kolom) — dulu
// `.company-page .reg-sec` + `.company-page .reg` di style.css.
export default function RegistrationBlock({ company = false }) {
  const rows = [
    ['Ministry of Law Decree', R.decree],
    ['Business License (NIB)', R.nib],
    ['Registered in', R.location],
  ];
  const sec = company ? 'max-w-none mx-0 px-0 pb-0' : 'max-w-[760px] mx-auto px-[var(--container-x)] pb-[var(--section-gap)]';
  const card = company
    ? 'bg-transparent border-0 [border-top:1px_solid_var(--line)] rounded-none shadow-none pt-[1.6rem] px-0 pb-0'
    : 'bg-white border border-line rounded-lg shadow-md py-[1.4rem] px-6';
  return (
    <section className={sec}>
      <div className={card}>
        <div className="flex items-center gap-[0.8rem] pb-4 border-b border-line">
          <span className="flex-none grid place-items-center w-11 h-11 rounded-[50%] bg-gold text-white">
            <SealIcon className="w-5 h-5" />
          </span>
          <div>
            <div className="text-h2 font-bold text-gold tracking-[-0.01em] leading-[1.2]">{R.name}</div>
            <div className="text-small font-medium tracking-[0.04em] uppercase text-muted mt-[0.15rem]">Registered in Indonesia</div>
          </div>
        </div>
        <dl className="mt-4">
          {rows.map(([k, v]) => (
            <div className="flex justify-between gap-4 py-2 [&:not(:first-child)]:[border-top:1px_dashed_var(--line)]" key={k}>
              <dt className="text-label tracking-[0.06em] uppercase text-muted">{k}</dt>
              <dd className="m-0 text-small font-semibold text-amber text-right [font-variant-numeric:tabular-nums]">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="flex items-center gap-2 mt-4 text-small text-green">
          <CheckIcon className="w-[15px] h-[15px] flex-none text-ok" />
          Verify our registration on the official portal{' '}
          <a href={R.verifyUrl} target="_blank" rel="noopener" className="text-cta font-semibold no-underline">ahu.go.id</a>
        </p>
      </div>
    </section>
  );
}
