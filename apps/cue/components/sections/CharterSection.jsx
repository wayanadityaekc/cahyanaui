import CharterBuilder from '@/components/sections/CharterBuilder';
import Prose from '@/components/prose/Prose';
import { CHARTER } from '@/content/shared/charter';
import FormHero from '@/components/sections/FormHero';

// Charter page body: one FormHero with the builder, the Handara Gate photo and a single details Prose.
export default function CharterSection() {
  return (
    <FormHero
      page="charter"
      title={CHARTER.title}
      sub={CHARTER.sub}
      photo="handara-gate.webp"
      alt="The Handara Gate on the road north, with the Bedugul hills behind it"
      details={<Prose blocks={CHARTER.info} headingVariant="company" />}
    >
      <CharterBuilder />
    </FormHero>
  );
}
