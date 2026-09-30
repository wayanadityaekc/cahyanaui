'use client';

import { CurrencyPicker as LibraryCurrencyPicker } from '@cahyana/ui';
import { CURRENCIES } from '@/lib/currency';
import { useCurrency } from '@/components/providers/CurrencyProvider';

// The library's field-shaped picker (CUE's shape), fed by this site's currency context; id must differ per copy.
export default function CurrencyPicker({ id = 'acct-cur', variant = 'default' }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <LibraryCurrencyPicker
      id={id}
      variant={variant}
      value={currency}
      onChange={setCurrency}
      options={CURRENCIES}
    />
  );
}
