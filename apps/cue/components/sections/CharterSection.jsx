import CharterBuilder from '@/components/sections/CharterBuilder';
import Prose from '@/components/prose/Prose';
import { CHARTER } from '@/content/shared/charter';
import FormHero from '@/components/sections/FormHero';

// The charter page body, extracted so both the /charter route and the All
// Programs "Charter" tab render the real form.
//
// The whole page is ONE <FormHero> now (Sep 2026, Wayan: "charter details sama
// form di atasanya, sekarang masih beda kontainer, jadiin satu aja"): title, sub,
// the builder, the photo, then the details, all in one container at one width.
// Before this the details lived in a second card on a cream band, 120px narrower
// than the form row above it.
//
// ONE details section, not two (Sep 2026, Wayan: "details seperti include exclude
// dan how charter works itu jadiin satu dan konten sama pakai styling text di our
// company"). There used to be a loose "Good to know" list above a separate card
// holding the article - two treatments of the same thing on one page.
// Included/excluded and the article are a single run of text now, and
// CHARTER.notes is gone with it.
//
// headingVariant="company" is Our Company's reading style: paragraphs on
// --lh-body at --fs-body, sub-headings left-aligned with no centred underline.
export default function CharterSection({ embedded }) {
  return (
    <FormHero
      title={CHARTER.title}
      sub={CHARTER.sub}
      photo="road-ubud.webp"
      alt="A road leading out of Ubud, lined with shops and traffic"
      embedded={embedded}
      details={<Prose blocks={CHARTER.info} headingVariant="company" />}
    >
      <CharterBuilder />
    </FormHero>
  );
}
