import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false 
    };
    
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: /node_modules\/react-map-gl/,
      use: ['babel-loader']
    });

    return config;
  },
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
};

export default nextConfig;