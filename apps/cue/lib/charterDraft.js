import { readLocalJSON, writeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

// What a guest picked in the charter plan list, kept so the choice survives the
// trip from the homepage to the charter page (Wayan, Sep 2026: "make sure apapun
// yang di pilih user di homepage, tetep di inget atau auto fill di page
// charter"). The homepage shows the plans without the form, so the pick has to
// be carried somewhere - localStorage, next to the site's other trip prefs.
//
// Read it in an EFFECT, never during render: this is a static export, and a
// value that only exists in the browser would make the first client render
// disagree with the pre-rendered HTML.
export function readCharterDraft() {
  const d = readLocalJSON(KEY.charter, null);
  return d && typeof d === 'object' ? d : null;
}

export function saveCharterDraft(patch) {
  writeLocal(KEY.charter, { ...(readCharterDraft() || {}), ...patch });
}
