import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   env: {
    CW_ACCESS_KEY_ID: process.env.CW_ACCESS_KEY_ID,
    CW_SECRET_ACCESS_KEY: process.env.CW_SECRET_ACCESS_KEY,
    CW_REGION: process.env.CW_REGION,
    CLOUDWATCH_LOG_GROUP: process.env.CLOUDWATCH_LOG_GROUP,
  },
};

export default nextConfig;
