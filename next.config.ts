import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next generates AGENTS.md / CLAUDE.md on dev; we keep those out of the repo.
  agentRules: false,
};

export default nextConfig;
