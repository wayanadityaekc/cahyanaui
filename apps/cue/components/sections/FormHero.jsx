import Img from '@/components/ui/Img';
import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';

// The head of the three form pages - charter, transfer, airport (Wayan, Sep 2026:
// "di atas judul abis itu formnya abis itu baru foto, kalo di desktop jadiin
// kolom, misal kiri form kanan foto").
//
// It replaces the dark photo band the three shared before, where the title, the
// sub line and the whole form sat ON TOP of a darkened photo. Now the photo is a
// panel of its own beside the form, and the words sit on white where they are
// simply easier to read.
//
// ONE COMPONENT, not three copies of a class string. The order - title, sub,
// form, photo - is the thing that has to match across the three pages, and an
// order cannot be enforced by sharing strings alone. This is the same reason
// DetailHero exists for the tour, attraction and guide pages.
//
// The two columns start at 1200px, NOT 993px, and that width is load-bearing:
// the charter builder runs its OWN two columns (plans | fields, 1fr + 340px)
// from 993px. Nest one inside the other at 993 and the plan column lands at
// ~244px, where a plan name and its price cannot share a line. At 1200 the form
// column is ~713px, so the plans get ~349px and the row still reads. Below 1200
// everything stacks in DOM order, which is the phone order Wayan asked for.
//
// `embedded` is for /programs, where these sections render inside a tab that
// already has its own heading and padding: the top clearance under the fixed
// header would be a dead gap there.
const HEAD = 'bg-white pb-[var(--section-gap)] px-[var(--container-x)]';
const HEAD_TOP = 'pt-[calc(var(--header-h-max,92px)+var(--space-3))] min-[769px]:pt-[calc(var(--header-h-max,98px)+var(--space-3))]';
const INNER = 'max-w-[var(--container)] mx-auto';
const SUB = 'mt-3 mb-0 font-body text-body leading-[var(--lh-body)] text-green max-w-[var(--container-read)]';
// 2.4fr : 1fr, measured rather than picked. The charter plan rows carry a sub
// line ("10 hours · around 120 km · per car up to 5") that wraps once the form
// column drops under ~790px: at 1.75fr it broke on two of the three rows at
// 1200px and left a lone "5" hanging. 2.4fr keeps all three on one line at 1200,
// 1280 and 1440. items-stretch so the photo matches the form height (measured:
// both 416px at 1280).
// minmax(0,1fr), not the default auto track: a grid track's floor is its
// MIN-CONTENT, so a form whose narrowest layout is wider than the phone pushes
// the track past the viewport and body's overflow-x:clip silently cuts the right
// edge off. The airport form did exactly that at 320px (316px of form in a 288px
// column). minmax(0,...) lets the track shrink and the form wrap instead.
const GRID = 'mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 min-[1200px]:grid-cols-[2.4fr_1fr] min-[1200px]:gap-8 min-[1200px]:items-stretch';
// 4:3 on a phone, then it simply fills the row on desktop. min-h-0 lets the
// stretched track actually size it instead of the intrinsic image height.
const PHOTO =
  'relative overflow-hidden rounded-lg bg-cream aspect-[4/3] ' +
  'min-[1200px]:aspect-auto min-[1200px]:h-full min-[1200px]:min-h-0 ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center';

export default function FormHero({ title, sub, photo, alt, embedded, children }) {
  // On /programs this renders inside a tab under that page's own H1, so the title
  // steps down to an H2 rather than giving the page a second H1.
  const H = embedded ? 'h2' : 'h1';
  return (
    <section className={embedded ? HEAD : `${HEAD} ${HEAD_TOP}`} data-formhero>
      <div className={INNER}>
        <H className={`${SUBHERO_TITLE} m-0 text-left`}>{title}</H>
        <p className={SUB}>{sub}</p>
        <div className={GRID}>
          <div className="min-w-0" data-formhero-form>{children}</div>
          <div className={PHOTO} data-formhero-photo>
            {/* Above the fold, so it loads eagerly - no lazy. */}
            <Img src={`/assets/images/${photo}`} alt={alt} priority />
          </div>
        </div>
      </div>
    </section>
  );
}
