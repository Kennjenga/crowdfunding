/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com", // Unsplash
      "images.pexels.com", // Pexels
      "res.cloudinary.com", // Cloudinary
    ],
  },
};

export default nextConfig;
