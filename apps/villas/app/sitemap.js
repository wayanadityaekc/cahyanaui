import { SITE, indexablePaths } from '@/lib/routes';

export const dynamic = 'force-static';

export default function sitemap() {
  return indexablePaths().map((path) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
  }));
}
