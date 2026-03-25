import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";

const base = () => ({
  version: import.meta.env.PKG_VERSION,
  commit: import.meta.env.COMMIT_HASH,
  timestamp: new Date().toISOString(),
  uptime: `${Math.floor(process.uptime() / 60)}mins`,
  environment: import.meta.env.DEV
    ? ("development" as const)
    : ("production" as const),
});

export const api = new Elysia({ prefix: "/health" }).get(
  "/",
  async () => {
    const start = Date.now();

    try {
      const res = await fetch(API_URL.HEALTH.CHECK);
      const upstreamLatency = Date.now() - start;

      if (!res.ok) throw new Error("upstream returned non-ok status");

      return {
        ...base(),
        status: "ok",
        upstream: {
          status: "ok",
          latency: `${upstreamLatency}ms`,
        },
      } as const;
    } catch {
      return {
        ...base(),
        status: "degraded",
        upstream: {
          status: "unreachable",
          latency: null,
        },
      } as const;
    }
  },
  {
    response: z.object({
      status: z.enum(["ok", "degraded"]),
      version: z.string(),
      commit: z.string(),
      timestamp: z.iso.datetime(),
      uptime: z.string(),
      environment: z.enum(["production", "development"]),
      upstream: z.object({
        status: z.enum(["ok", "unreachable"]),
        latency: z.string().nullable(),
      }),
    }),
  },
);
