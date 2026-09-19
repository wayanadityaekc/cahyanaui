import CharterBuilder from '@/components/sections/CharterBuilder';
import { INFO_SECTION_DETAIL, INFO_CARD, INFO_CARD_BODY } from '@/components/ui/infoClasses';
import Prose from '@/components/prose/Prose';
import { CHARTER } from '@/content/shared/charter';
import FormHero from '@/components/sections/FormHero';

// The charter page body (hero + builder form + one details section), extracted so
// both the /charter route and the All Programs "Charter" tab render the real form.
//
// ONE details section, not two (Sep 2026, Wayan: "details seperti include exclude
// dan how charter works itu jadiin satu dan konten sama pakai styling text di our
// company"). There used to be a loose "Good to know" list sitting on the page
// background above a separate white card holding the article - two treatments of
// the same thing on one page. Included/excluded and the article are now a single
// run of text inside the card, and CHARTER.notes is gone with it.
//
// BODY_TEXT and headingVariant="company" are Our Company's reading style, copied
// here rather than reinvented: paragraphs on --lh-body at --fs-body, and section
// headings left-aligned with no centred underline.
// (BODY_TEXT moved to infoClasses as INFO_CARD_BODY - transfer and airport read
// from the same string now, Sep 2026.)

export default function CharterSection({ embedded }) {
  return (
    <>
      <FormHero
        title={CHARTER.title}
        sub={CHARTER.sub}
        photo="road-ubud.webp"
        alt="A road leading out of Ubud, lined with shops and traffic"
        embedded={embedded}
      >
        <CharterBuilder />
      </FormHero>
      <section className={INFO_SECTION_DETAIL}>
        <div className={`${INFO_CARD} ${INFO_CARD_BODY}`}>
          <Prose blocks={CHARTER.info} headingVariant="company" />
        </div>
      </section>
    </>
  );
}
