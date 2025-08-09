import { withContentlayer } from "next-contentlayer2";

const nextConfig = {
  experimental: { mdxRs: true }
};

export default withContentlayer(nextConfig);