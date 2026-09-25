'use client';

import { useState } from 'react';
import { PhotoGrid, PhotoMosaic } from '@cahyana/ui';

// The villa's photographs, as the page's opening shape.
//
// Wayan: "hero villa pakai grid kayak CUE, kalo di klik baru muncul yang full
// screen". So the lead flip-through is GONE - no arrows, no one-photo-at-a-time
// - and the page opens on the same sliding mosaic a CUE tour page opens on
// (PhotoMosaic in @cahyana/ui). Tapping any tile opens the full-screen grid,
// on the photo that was tapped.
//
// TWO CONTROLS REMOVED WITH THE FLIP-THROUGH: the heart and the share disc that
// sat over the lead photo. Neither did anything - there is no wishlist and no
// share handler behind them - and over a mosaic they would sit on one arbitrary
// tile. Say the word and either comes back as a real feature.
export default function VillaGallery({ images }) {
  const [at, setAt] = useState(null);

  return (
    <>
      <PhotoMosaic
        images={images}
        onOpen={setAt}
        moreLabel={`Show all ${images.length} photos`}
      />
      <PhotoGrid
        images={images}
        open={at !== null}
        onClose={() => setAt(null)}
        startAt={at ?? 0}
        label="Villa photos"
      />
    </>
  );
}
