/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude ESM-only client SDKs from the server bundle.
  // This prevents ERR_REQUIRE_ESM when Next.js SSR tries to require() them.
  serverExternalPackages: [
    '@particle-network/universal-account-sdk',
    'rpc-websockets',
  ],
}

module.exports = nextConfig
