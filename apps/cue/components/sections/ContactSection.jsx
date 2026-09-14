import { MessageCircle } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Tailwind-native (migrasi Fase 2): .contact* -> utilities. `company` = dirender
// di dalam Our Company (.company-page) -> padding-top 0 + heading bold/gold (dulu
// `.company-page .contact` / `.company-page .contact__heading`). Shared yg dibiarin:
// .contact__group (field wrapper, kepake AuthModal + field base) + .modal__referral-msg.
export default function ContactSection({ company = false }) {
  return (
    <>
      <section className={`${company ? 'pt-0' : 'pt-[6.5rem]'} pb-9 px-6`}>
        <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-12 max-[768px]:gap-8 max-w-[var(--container-mid)] mx-auto">
          <div>
            <h1 className={`mb-3 font-head text-h2 font-medium leading-[1.15] tracking-[-0.01em] ${company ? '!font-bold !text-gold' : ''}`}>Talk to a Local</h1>
            <p className="mb-6 text-ink text-body leading-[1.6]">
              Have a question, a custom request, or a group booking? Reach out on WhatsApp or send us a message - our
              local team usually replies within a few hours.
            </p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="inline-flex items-center gap-2 mb-8 py-[0.85rem] px-6 rounded-sm font-semibold no-underline text-white bg-[#25d366]" target="_blank" rel="noopener">
              <MessageCircle size={20} strokeWidth={1.8} />
              Chat on WhatsApp
            </a>
            <ul className="list-none">
              <li className="mb-5">
                <span className="text-body text-muted">Email</span>
                <strong className="block mt-[0.2rem] text-[1rem] font-medium"><a href="mailto:cahyanabaliexperience@gmail.com" className="text-green no-underline">cahyanabaliexperience@gmail.com</a></strong>
              </li>
              <li className="mb-5">
                <span className="text-body text-muted">Location</span>
                <strong className="block mt-[0.2rem] text-[1rem] font-medium">Ubud, Gianyar, Bali, Indonesia</strong>
              </li>
              <li className="mb-5">
                <span className="text-body text-muted">Hours</span>
                <strong className="block mt-[0.2rem] text-[1rem] font-medium">Every day · 7:00 AM – 9:00 PM (WITA)</strong>
              </li>
            </ul>
          </div>
          <div>
            <ContactForm company={company} />
          </div>
        </div>
      </section>
      <iframe
        className="w-full h-[380px] border-none block"
        src="https://www.google.com/maps?q=Ubud,Bali&output=embed"
        loading="lazy"
        title="Cahyana Ubud Experience location"
      />
    </>
  );
}
