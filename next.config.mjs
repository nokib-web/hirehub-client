/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'hirehub-server-ydm5.onrender.com' }
    ]
  }
};

export default nextConfig;

