export default function Villas() {
  return (
    <section className="vpromo" id="villas">
      <div className="vpromo__bg" aria-hidden="true">
        <div style={{ backgroundImage: 'url(/assets/images/cahyana-house.webp)' }} />
        <div style={{ backgroundImage: 'url(/assets/images/cahyana-tibuah.webp)' }} />
      </div>
      <div className="vpromo__inner">
        <span className="vpromo__kick">Stay with us in Ubud</span>
        <h2 className="vpromo__title">Ubud Private Villas</h2>
        <p className="vpromo__desc">
          Two private pool villas - Cahyana House and Cahyana Tibuah - hosted by the same family behind your tours. Ask
          about tour + stay perks.
        </p>
        <a className="vpromo__cta" href="https://ubudprivatevillas.com" target="_blank" rel="noopener">
          Visit ubudprivatevillas.com
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </a>
      </div>
    </section>
  );
}
