import OwnerDashboard from '@/components/admin/OwnerDashboard';

// Owner-only. noindex + no internal link anywhere on the site, and it is left out
// of both sitemaps. None of that is the protection - the protection is that every
// figure on it comes from an endpoint behind requireAuth in cahyana-api. This just
// stops the login form turning up in search results.
export const metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OwnerDashboard />;
}
