// Mirror of the API's single-destination prices (cahyana-api, prices.place),
// written as the same `$NN` string every listing card already carries in
// content/shared/listings.js.
//
// Why it exists: <Price> renders nothing until the live catalog answers, so
// without a build-time number a destination's card and its sticky book bar sit
// empty until then - while tours and experiences, which have always carried a
// card price, fill instantly. Wayan, Sep 2026: the book bar on a destination
// has to behave like the one on a tour.
//
// The live catalog still wins the moment it lands; this is only what shows
// first. Being a mirror it can drift: regenerate whenever prices.place changes
// in cahyana-api. IDR stays the source of truth there, not here.
export const PLACE_PRICE = {
  "Balangan Beach": "$57",
  "Banyumala Twin Waterfall": "$57",
  "Besakih - The Mother Temple": "$46",
  "Bingin Beach": "$57",
  "Buyan & Tamblingan Twin Lakes": "$57",
  "Coffee Plantation & Tasting": "$23",
  "Garuda Wisnu Kencana (GWK)": "$57",
  "Git Git Waterfall": "$57",
  "Goa Gajah - The Elephant Cave": "$23",
  "Green Bowl Beach": "$57",
  "Gunung Kawi Temple": "$23",
  "Handara Gate": "$46",
  "Jatiluwih Rice Terraces": "$46",
  "Lempuyang Temple - Gates of Heaven": "$46",
  "Munduk Waterfalls": "$57",
  "Pandawa Beach": "$57",
  "Penglipuran Village": "$46",
  "Pura Batuan Temple": "$23",
  "Sacred Monkey Forest Sanctuary": "$23",
  "Sangeh Monkey Forest": "$35",
  "Sekumpul Waterfall": "$57",
  "Taman Ayun Royal Temple": "$35",
  "Taman Ujung Water Palace": "$46",
  "Tanah Lot Sunset Temple": "$35",
  "Tegal Wangi Beach": "$57",
  "Tegalalang Rice Terrace": "$23",
  "Tegenungan Waterfall": "$23",
  "Tirta Empul Holy Water Temple": "$23",
  "Tirta Gangga Water Garden": "$46",
  "Ubud Arts & Crafts": "$23",
  "Ubud Royal Palace & Art Market": "$23",
  "Ubud Traditional Market": "$23",
  "Ulun Danu Beratan Lake Temple": "$46",
  "Uluwatu Cliff Temple": "$35",
};
