const nextConfig = {
  // @cahyana/ui ships as JSX source, so Next has to compile it like app code.
  transpilePackages: ['@cahyana/ui'],
  output: 'export',
  images: { unoptimized: true },
  // true exports route/index.html: false leaves an empty route/ folder that Hostinger 403s on a trailing-slash request.
  trailingSlash: true,
  agentRules: false,
};

module.exports = nextConfig;
