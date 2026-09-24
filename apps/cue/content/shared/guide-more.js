// Data-layer buat blok "guide-more" di bawah tiap artikel guide (dulu HTML hardcoded
// + diduplikat di tiap guide). Di-render <GuideMore>.
import { EXPLORE_TOURS } from '@/content/shared/home';

// "See our tours" - IDENTIK di semua 15 guide (dulu di-hardcode 15x). Satu sumber.
//
// KARTUNYA DIAMBIL UTUH DARI HOMEPAGE (Sep 2026, Wayan: "Our tours card masih card
// lama, pakai card homepage dan samakan ukuranya"). Dulu file ini nulis salinannya
// sendiri - nama pendek, foto lain, dan `priceFallback` sendiri - dan salinan itu
// UDAH BASI: $45 / $55 di sini lawan $40 / $49 di homepage, jadi 15 halaman guide
// nyetak harga lebih mahal dari yang kita tagih sampai katalog API nyampe.
// `check-prices` gak nyisir file ini, jadi gak ada yang bakal ngadu. Ngambil entry
// homepage-nya langsung bikin salinan keduanya gak ada lagi.
const PICK = ['Ubud Tour', 'Ubud Culture Day'];

const byProgram = (program) => {
  const card = EXPLORE_TOURS.find((c) => c.program === program);
  // Sengaja MELEDAK, bukan diem-diem ngasih daftar pendek: kalau nama programnya
  // berubah di home.js, blok "Our tours" bakal kehilangan kartu tanpa satu pun
  // pesan - persis jenis drift yang bikin harga di atas basi berbulan-bulan.
  if (!card) throw new Error(`guide-more: EXPLORE_TOURS has no program "${program}"`);
  return card;
};

export const SEE_OUR_TOURS = {
  kind: 'tours',
  cls: 'guide-more',
  title: 'Our tours',
  cards: PICK.map(byProgram),
};
