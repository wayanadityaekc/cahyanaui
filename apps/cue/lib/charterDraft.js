import { readLocalJSON, writeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

export function readCharterDraft() {
  const draft = readLocalJSON(KEY.charter, null);
  return draft && typeof draft === 'object' ? draft : null;
}

export function saveCharterDraft(patch) {
  writeLocal(KEY.charter, { ...(readCharterDraft() || {}), ...patch });
}
