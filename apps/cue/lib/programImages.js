import { LISTINGS } from '@/content/shared/listings';

function buildMap() {
  const map = {};
  for (const key of Object.keys(LISTINGS)) {
    const section = LISTINGS[key];
    if (section.lbox && section.lbox.img) {
      const name = (section.lbox.add && section.lbox.add.item) || section.lbox.title;
      if (name && !map[name]) map[name] = section.lbox.img;
    }
    for (const cat of section.cats || []) {
      for (const card of cat.cards || []) {
        const name = card.priceName || (card.add && card.add.item) || card.name;
        if (name && card.img && !map[name]) map[name] = card.img;
      }
    }
  }
  return map;
}

const PROGRAM_IMAGES = buildMap();

export function imageForProgram(name) {
  return (name && PROGRAM_IMAGES[name]) || null;
}
