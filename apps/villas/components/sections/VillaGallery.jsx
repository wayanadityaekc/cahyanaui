'use client';

import { useState } from 'react';
import { PhotoGrid, PhotoMosaic } from '@cahyana/ui';

// Opens on CUE's photo mosaic, tap a tile for the full-screen grid; the dead heart/share buttons were removed.
export default function VillaGallery({ images }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <PhotoMosaic
        images={images}
        onOpen={setOpenIndex}
        moreLabel={`Show all ${images.length} photos`}
      />
      <PhotoGrid
        images={images}
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        startAt={openIndex ?? 0}
        label="Villa photos"
      />
    </>
  );
}
