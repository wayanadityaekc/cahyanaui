import Img from '@/components/ui/Img';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { crumbsFor } from '@/lib/crumbs';
import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';
import { INFO_CARD_BODY } from '@/components/ui/infoClasses';

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
const GRID = 'mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 min-[1200px]:gap-8 min-[1200px]:items-stretch';
// The charter and transfer default. Both strings are written out in full because
// Tailwind scans source text - a class built by interpolation is never generated.
const GRID_COLS = 'min-[1200px]:grid-cols-[2.4fr_1fr]';
// HALF AND HALF, for /airport-transfer only (Sep 2026, Wayan: "di desktop bagi 2
// aja, 50% kolom input 50% image nya"). That page's form is a single stack of
// full-width fields, so it has nothing that needs the extra width - and at
// 2.4fr its photo column was only ~330px, a 0.57:1 slot that no landscape photo
// crops into well. Charter and transfer KEEP 2.4fr: the charter plan rows wrap
// their sub line under ~790px of form column, and an even split at 1200 gives
// them ~576px (measured). So this is a real difference between the three pages -
// the only one besides the photo - and it is here, in the shared shell, rather
// than in a second copy of it.
const GRID_COLS_HALF = 'min-[1200px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]';
// 4:3 on a phone, then it simply fills the row on desktop. min-h-0 lets the
// stretched track actually size it instead of the intrinsic image height.
//
// The crop point is a PROP, because it belongs to the photo and the photo is the
// one thing these three pages are allowed to differ on. It earns its keep on
// /airport-transfer: that form is ~600px tall, so the column crops a landscape
// photo to about 0.57:1, and centred it sliced the terminal's sign clean through
// the middle of a word.
const PHOTO =
  'relative overflow-hidden rounded-lg bg-cream aspect-[4/3] ' +
  'min-[1200px]:aspect-auto min-[1200px]:h-full min-[1200px]:min-h-0 ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover';

// ONE CONTAINER for the whole page (Sep 2026, Wayan: "charter details sama form
// di atasanya, sekarang masih beda kontainer, jadiin satu aja dan rapikan margin
// left right"). The details used to be a second, NARROWER card on a cream band:
// --container-mid (1080) against the form row's --container (1200), so the two
// blocks' edges missed each other by 60px at 1280 and 1440 and by 8px at 390 and
// 768 (measured). Now the details continue the same white surface, inside the
// same INNER, so both edges line up by construction at every width.
//
// The loose paragraphs are capped at --container-read instead: the container is
// 1200 wide and a paragraph running its full width is about 190 characters. Same
// compromise the guide articles make - text held to a readable measure but flush
// LEFT, so its left edge still lines up with everything above it. The cap never
// binds inside an InfoBox, whose columns are narrower than 720 already.
//
// The "X Details" heading goes left too. It was centred, which read fine as the
// first line of its own card and reads like a leftover now that everything above
// it is left-aligned. (It had a centred underline as well; every section title on
// the site has since lost that - see ui/sectionTitle.)
const DETAILS =
  `mt-[var(--section-gap)] ${INFO_CARD_BODY} [&_p]:max-w-[var(--container-read)] ` +
  '[&>h2]:!text-left';

export default function FormHero({ title, sub, photo, alt, photoPos = '[&>img]:object-center', half = false, embedded, details, children, page }) {
  // On /programs this renders inside a tab under that page's own H1, so the title
  // steps down to an H2 rather than giving the page a second H1.
  const H = embedded ? 'h2' : 'h1';
  return (
    <section className={embedded ? HEAD : `${HEAD} ${HEAD_TOP}`} data-formhero>
      <div className={INNER}>
        {/* Not on the /programs tabs: that page has its own trail and its own H1. */}
        {!embedded && <Breadcrumb items={crumbsFor(page)} className="mb-2" />}
        <H className={`${SUBHERO_TITLE} m-0 text-left`}>{title}</H>
        <p className={SUB}>{sub}</p>
        <div className={`${GRID} ${half ? GRID_COLS_HALF : GRID_COLS}`}>
          <div className="min-w-0" data-formhero-form>{children}</div>
          <div className={`${PHOTO} ${photoPos}`} data-formhero-photo>
            {/* Above the fold, so it loads eagerly - no lazy. */}
            <Img src={`/assets/images/${photo}`} alt={alt} priority />
          </div>
        </div>
        {details && <div className={DETAILS} data-formhero-details>{details}</div>}
      </div>
    </section>
  );
}
