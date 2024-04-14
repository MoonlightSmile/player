/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*',
        },
      ],
    },
    webpack(config, options) {
        config.module.rules.push({
          test: /\.(wav|mp3)$/,
          type: "asset/resource",
          generator: {
            filename: "static/chunks/[path][name].[hash][ext]",
          },
        });
    
        return config;
      },
      
};

export default nextConfig;
