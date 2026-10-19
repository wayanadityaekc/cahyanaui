const nextConfig = {
  transpilePackages: ['@cahyana/ui'],
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  agentRules: false,
};

module.exports = nextConfig;
