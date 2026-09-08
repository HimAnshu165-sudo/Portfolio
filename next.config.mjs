/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Use memory cache during development to avoid Windows PackFileCacheStrategy ENOENT rename locking
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

export default nextConfig;
