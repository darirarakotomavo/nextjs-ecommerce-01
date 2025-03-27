import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // Laissez vide si aucun port spécifique n'est utilisé
        pathname: "/**", // Autorise tous les chemins sous ce domaine
      },
    ],
  },
};

export default nextConfig;
