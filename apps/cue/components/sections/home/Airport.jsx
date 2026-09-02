import Price from '@/components/Price';

export default function Airport() {
  return (
    <section
      className="airport"
      id="airport-pickup"
      style={{ backgroundImage: 'url(/assets/images/transfer-hero.webp)' }}
    >
      <div className="airport__inner">
        <div className="airport__body">
          <span className="airport__k">Airport Pickup</span>
          <h2 className="airport__t">Land in Bali, we&apos;re already there</h2>
          <p className="airport__lead">
            Private car from Ngurah Rai (DPS) to your Ubud stay. Fixed price, meet &amp; greet at arrivals, sorted
            before you even land.
          </p>
          <div className="airport__chips">
            <span>Meet &amp; greet</span>
            <span>Fixed price per car</span>
            <span>Local Ubud driver</span>
          </div>
          <div className="airport__row">
            <span className="airport__price">
              from <Price name="Airport – Ubud" fallback="$20" className="airport__amt" as="b" />
            </span>
            <a className="airport__btn" href="/airport-transfer.html">
              Book a transfer &rsaquo;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
