const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // trailingSlash:false exports every route as both "route.html" AND a
  // same-named "route/" folder holding only Next's RSC prefetch payloads
  // (no index.html) - a bare trailing-slash request (e.g. /villas/
  // cahyana-house/) then hits that empty folder, and Hostinger 403s since
  // directory listing is off. true exports "route/index.html" instead,
  // which a plain static host serves correctly either way.
  trailingSlash: true,
  agentRules: false,
};

module.exports = nextConfig;
