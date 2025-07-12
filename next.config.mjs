// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qltudtwdckevippmjnuh.supabase.co', // Ganti dengan hostname Supabase Anda
        port: '',
        pathname: '/storage/v1/object/public/gambar-tanaman/**',
      },
    ],
  },
};

export default nextConfig;