import { ChevronRight } from 'lucide-react';

// Sidebar for a destination page. A destination is an information page, not a
// product - one place can sit on several tours, so instead of guessing which
// one to sell it lists every live tour that actually stops there (derived in
// lib/tourIndex from each tour's own items) and lets the guest pick.
//
// Plain text links, not cards (Wayan): a card here would repeat the tour's
// listing card at a different size, and the sidebar only needs to be a way
// through to the tour page.
//
// Same shell as BookSidebar, including the booksidebar / bookcard__cta markers
// and the id="booking" the hero CTA anchors to, so the styling is unchanged.
export default function VisitOnSidebar({ tours }) {
  return (
    <div className="booksidebar relative border border-line rounded-lg overflow-hidden">
      <section className="relative z-10 p-0 m-0 bg-transparent min-h-0" id="booking">
        <div className="max-w-none m-0 py-6 px-[1.4rem] rounded-none bg-white border-none text-left">
          <div className="mb-[1.1rem]">
            <p className="mb-2 text-label font-medium tracking-[0.14em] uppercase text-amber">Where to book</p>
            <h2 className="m-0 font-head text-h2 font-bold tracking-[-0.01em] text-gold">Visit this place on</h2>
            <p className="mt-[0.3rem] text-small text-muted">
              {tours.length === 1
                ? 'This stop is part of one of our private days.'
                : `This stop is part of ${tours.length} of our private days. Same car, same driver.`}
            </p>
          </div>

          <ul className="grid m-0 mb-[1.1rem] p-0 list-none">
            {tours.map((t) => (
              <li key={t.href} className="py-[0.7rem] [border-bottom:1px_solid_var(--line)] last:[border-bottom:none]">
                <a
                  href={t.href}
                  className="group flex items-start gap-2 no-underline transition-[color,scale] duration-[var(--dur)] ease-[ease]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-strong font-semibold text-gold group-hover:text-cta group-hover:underline">
                      {t.name}
                    </span>
                    {t.meta && <span className="block mt-[0.15rem] text-small text-muted">{t.meta}</span>}
                  </span>
                  <span
                    className="flex-none inline-flex w-[var(--icon-sm)] h-[var(--icon-sm)] mt-[0.1rem] text-muted group-hover:text-cta [&>svg]:w-full [&>svg]:h-full"
                    aria-hidden="true"
                  >
                    <ChevronRight strokeWidth={1.7} />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            className="bookcard__cta flex flex-none w-full max-w-none items-center justify-center h-[2.9rem] px-[0.85rem] border-none rounded-pill font-body text-[1rem] font-semibold text-center no-underline text-white bg-cta cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] hover:bg-cta-d"
            href={tours[0].href}
          >
            See the {tours.length === 1 ? 'tour' : 'tours'}
          </a>

          <p className="mt-4 text-center text-small text-muted">Entrance ticket is covered on the Exclusive option.</p>
        </div>
      </section>
    </div>
  );
}
