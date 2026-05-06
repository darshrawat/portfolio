/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // In production, GitHub Pages hosts the site at /portfolio, so we add a basePath
  basePath: process.env.NODE_ENV === 'production' ? '/portfolio' : '',
};

export default nextConfig;
