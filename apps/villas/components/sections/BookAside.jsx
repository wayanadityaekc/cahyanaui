import Link from 'next/link';
import AirbnbLink from '@/components/ui/AirbnbLink';
import { WHATSAPP_LINK, CUE_LINK } from '@/lib/airbnb';

export default function BookAside({ villa, rating, reviews, facts }) {
  return (
    <aside className="detail-aside">
      <div className="book-box">
        <p className="book-rating">★ <strong>{rating}</strong><span>{reviews} reviews · Guest Favourite</span></p>
        <ul className="book-facts">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <AirbnbLink villa={villa} className="btn btn-gold btn-full">Check dates &amp; price</AirbnbLink>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-outline btn-full">Ask about dates</a>
        <p className="book-note">Rates change by season - the Airbnb calendar shows the live price for your dates.</p>
      </div>

      <div className="book-box soft">
        <p className="footer-title">Add to your stay</p>
        <ul className="aside-links">
          <li><Link href="/services/breakfast">Breakfast <span>›</span></Link></li>
          <li><Link href="/services/spa">Spa &amp; Massage <span>›</span></Link></li>
          <li><Link href="/services/live-dinner">Live Dinner <span>›</span></Link></li>
          <li><a href={CUE_LINK} target="_blank" rel="noopener">Driver &amp; tours <span>›</span></a></li>
        </ul>
      </div>
    </aside>
  );
}
