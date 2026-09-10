import type { NextConfig } from "next";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  images: {
    // Cloudinary already returns a format- and quality-optimised file (f_auto,
    // q_auto), so these are rendered with `unoptimized`. The pattern is still
    // required for the cases that do go through the optimiser, and it is
    // scoped to this account's folder rather than the whole CDN.
    remotePatterns: cloudName
      ? [
          {
            protocol: "https" as const,
            hostname: "res.cloudinary.com",
            pathname: `/${cloudName}/**`,
          },
        ]
      : [],
  },
};

export default nextConfig;
