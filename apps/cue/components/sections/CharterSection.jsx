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
// --lh-body at --fs-body, sub-headings left-aligned.
//
// PHOTO: handara-gate, not road-ubud (Sep 2026, Wayan). road-ubud is a traffic jam
// - motorbikes, a no-parking sign - which was survivable while it sat darkened
// behind white hero text and is not once it is a bright panel beside the form, on
// a page selling "sit back, someone else drives". Handara Gate is one of the route
// ideas this page already lists ("Full day north: Handara Gate"), so it is not a
// photo of somewhere we do not go, and its centred composition survives the tall
// narrow crop.
export default function CharterSection({ embedded }) {
  return (
    <FormHero
      page="charter"
      title={CHARTER.title}
      sub={CHARTER.sub}
      photo="handara-gate.webp"
      alt="The Handara Gate on the road north, with the Bedugul hills behind it"
      embedded={embedded}
      details={<Prose blocks={CHARTER.info} headingVariant="company" />}
    >
      <CharterBuilder />
    </FormHero>
  );
}
