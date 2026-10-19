import { EXPLORE_TOURS } from '@/content/shared/home';

const PICK = ['Ubud Tour', 'Ubud Culture Day'];

function byProgram(program) {
  const card = EXPLORE_TOURS.find((cardItem) => cardItem.program === program);
  if (!card) throw new Error(`guide-more: EXPLORE_TOURS has no program "${program}"`);
  return card;
}

export const SEE_OUR_TOURS = {
  kind: 'tours',
  cls: 'guide-more',
  title: 'Our tours',
  cards: PICK.map(byProgram),
};
