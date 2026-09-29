import { SECTION_TITLE } from '@/components/ui/sectionTitle';

// Offline fallback cached by the service worker; noindex, it is not content.
export const metadata = {
  title: 'You are offline | Cahyana Ubud Experience',
  robots: { index: false, follow: false },
};

export default function Offline() {
  return (
    <main className="max-w-[var(--container-read)] mx-auto px-[var(--container-x)] pt-[calc(var(--header-h-max)+var(--container-x))] pb-[var(--space-5)]">
      <h1 className={SECTION_TITLE}>You are offline</h1>
      <p className="text-body leading-[var(--lh-body)] text-green mt-4">
        No connection right now, so this page could not load. Your saved trip is
        stored on this device and is still there.
      </p>
      <p className="text-body leading-[var(--lh-body)] text-green mt-3">
        Try again once you have signal.
      </p>
    </main>
  );
}
