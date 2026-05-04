/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Placeholder images used during development before real product photos
      { protocol: 'https', hostname: 'placehold.co' },
      // Add your CDN / image host here when real photos are uploaded
    ],
  },
};

export default nextConfig;
