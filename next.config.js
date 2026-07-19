/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // These packages are ESM-only and client-only.
      // Alias them to false so the server bundle never tries to require() them.
      config.resolve.alias = {
        ...config.resolve.alias,
        '@particle-network/universal-account-sdk': false,
        'rpc-websockets': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
