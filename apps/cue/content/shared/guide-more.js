// Data for the GuideMore blocks under each guide article.
import { EXPLORE_TOURS } from '@/content/shared/home';

// 'Our tours' cards taken whole from the homepage EXPLORE_TOURS, so there is no second price copy to go stale.
const PICK = ['Ubud Tour', 'Ubud Culture Day'];

function byProgram(program) {
  const card = EXPLORE_TOURS.find((c) => c.program === program);
  // Throw on a missing program so a renamed card breaks the build instead of silently vanishing.
  if (!card) throw new Error(`guide-more: EXPLORE_TOURS has no program "${program}"`);
  return card;
}

export const SEE_OUR_TOURS = {
  kind: 'tours',
  cls: 'guide-more',
  title: 'Our tours',
  cards: PICK.map(byProgram),
};
