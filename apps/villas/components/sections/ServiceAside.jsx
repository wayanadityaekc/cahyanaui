import Link from 'next/link';
import { WHATSAPP_LINK } from '@/lib/airbnb';

export default function ServiceAside({ title, facts, ctaLabel, otherServices }) {
  return (
    <aside className="detail-aside">
      <div className="book-box">
        <p className="footer-title">{title}</p>
        <ul className="book-facts">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <Link href="/villas" className="btn btn-gold btn-full">Pick your villa</Link>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-outline btn-full">{ctaLabel}</a>
      </div>

      <div className="book-box soft">
        <p className="footer-title">Also at your villa</p>
        <ul className="aside-links">
          {otherServices.map((s) => (
            <li key={s.href}><Link href={s.href}>{s.label} <span>›</span></Link></li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
