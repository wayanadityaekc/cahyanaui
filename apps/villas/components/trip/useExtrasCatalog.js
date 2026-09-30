'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { TRANSFER_KEY } from '@/lib/extras';

// The CUE price list for extras, in the guest's currency and group size; null until the API answers, so no price is ever guessed.
export default function useExtrasCatalog(currency = 'USD', guests = 2) {
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const response = await fetch(`${API_BASE}/pricing/catalog?currency=${encodeURIComponent(currency)}&guests=${guests}`);
        if (!response.ok) return;
        const data = await response.json();
        if (!alive || !data || !Array.isArray(data.items)) return;
        const items = {};
        data.items.forEach((item) => { items[item.name] = item; });
        const transfer = (data.transfers || []).find((row) => row.route === TRANSFER_KEY) || null;
        setCatalog({ currency: data.currency, items, transfer, deposit: data.deposit || null });
      } catch (e) {
        // API down: prices stay "-" and nothing can be sent with a made-up number.
      }
    }
    setCatalog(null);
    load();
    return () => { alive = false; };
  }, [currency, guests]);

  return catalog;
}
