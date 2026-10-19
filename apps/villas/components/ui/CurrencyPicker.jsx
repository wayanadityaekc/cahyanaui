'use client';

import { CurrencyPicker as LibraryCurrencyPicker } from '@cahyana/ui';
import { CURRENCIES } from '@/lib/currency';
import { useCurrency } from '@/components/providers/CurrencyProvider';

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
