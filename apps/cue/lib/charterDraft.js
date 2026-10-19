import { readLocalJSON, writeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

export function readCharterDraft() {
  const d = readLocalJSON(KEY.charter, null);
  return d && typeof d === 'object' ? d : null;
}

export function saveCharterDraft(patch) {
  writeLocal(KEY.charter, { ...(readCharterDraft() || {}), ...patch });
}
