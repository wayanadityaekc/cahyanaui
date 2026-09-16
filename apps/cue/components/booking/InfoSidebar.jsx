// Sidebar for an attraction whose parent tour is parked (lib/hiddenItems).
// Wayan wants these pages to keep their styling, so this is the same shell as
// BookSidebar - same card, same `booksidebar` / `bookcard__cta` markers
// check-detail looks for, same id="booking" the hero CTA anchors to - with the
// price, date, guests and Book Now swapped for the page's own facts and a way
// to ask about the place. No price: the product behind it is not for sale.
export default function InfoSidebar({ facts = [] }) {
  return (
    <div className="booksidebar relative border border-line rounded-lg overflow-hidden">
      <section className="relative z-10 p-0 m-0 bg-transparent min-h-0" id="booking">
        <div className="max-w-none m-0 py-6 px-[1.4rem] rounded-none bg-white border-none text-left">
          <div className="mb-[1.1rem]">
            <p className="mb-2 text-label font-medium tracking-[0.14em] uppercase text-amber">Good to know</p>
            <h2 className="m-0 font-head text-h2 font-bold tracking-[-0.01em] text-gold">Plan a visit</h2>
            <p className="mt-[0.3rem] text-small text-muted">We do not run a program to this spot right now.</p>
          </div>

          {facts.length > 0 && (
            <dl className="grid m-0 mb-[1.2rem]">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-4 py-[0.55rem] [border-bottom:1px_solid_var(--line)] last:[border-bottom:none]"
                >
                  <dt className="text-small text-muted">{f.label}</dt>
                  <dd className="m-0 text-strong font-semibold text-green text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <a
            className="bookcard__cta flex flex-none w-full max-w-none items-center justify-center h-[2.9rem] px-[0.85rem] border-none rounded-pill font-body text-[1rem] font-semibold text-center no-underline text-white bg-cta cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] hover:bg-cta-d"
            href="/our-company.html#contact"
          >
            Ask about this place
          </a>

          <p className="mt-4 text-center text-small text-muted">
            Tell us your dates and we can build it into a private day.
          </p>
        </div>
      </section>
    </div>
  );
}
