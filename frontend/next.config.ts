import type { NextConfig } from "next";
import withTM from "next-transpile-modules";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // TypeScript vet at config er av typen 'webpack.Configuration'
    // Du kan eventuelt definere config som (config: any) hvis du vil være fleksibel
    config.resolve.alias = {
      ...config.resolve.alias,
      "mapbox-gl": "maplibre-gl",
    };
    return config;
  },
};

export default withTM(["react-map-gl"])(nextConfig);
