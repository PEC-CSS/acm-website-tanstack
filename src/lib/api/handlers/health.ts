import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";

const ResponseSchema = z
  .object({
    status: z.enum(["ok", "degraded"]).meta({
      title: "Status",
      description: "Overall health status of the service",
    }),
    version: z.string().meta({
      title: "Version",
      description: "Application version",
      examples: ["1.0.0", "2.1.5"],
    }),
    commit: z.string().meta({
      title: "Commit",
      description: "Git commit hash of the current deployment",
      examples: ["abc123def456", "f7e9d8c6b5a4"],
    }),
    timestamp: z.iso.datetime().meta({
      title: "Timestamp",
      description: "ISO 8601 timestamp of the health check",
      examples: ["2026-04-03T10:30:00Z", "2026-04-03T14:45:30.123Z"],
    }),
    uptime: z.string().meta({
      title: "Uptime",
      description: "Service uptime in minutes",
      examples: ["120mins", "1440mins"],
    }),
    environment: z.enum(["production", "development"]).meta({
      title: "Environment",
      description: "Deployment environment",
    }),
    upstream: z
      .object({
        status: z.enum(["ok", "unreachable"]).meta({
          title: "Status",
          description: "Upstream service status",
          examples: ["ok", "unreachable"],
        }),
        latency: z
          .string()
          .nullable()
          .meta({
            title: "Latency",
            description: "Upstream response latency in milliseconds",
            examples: ["45ms", "120ms", null],
          }),
      })
      .meta({
        title: "Upstream",
        description: "Upstream service health details",
      }),
  })
  .meta({
    $id: "HealthResponse",
    title: "Health Response",
    description: "Health check response containing service status and upstream server information",
  });

const base = () => ({
  version: import.meta.env.PKG_VERSION,
  commit: import.meta.env.COMMIT_HASH,
  timestamp: new Date().toISOString(),
  uptime: `${Math.floor(process.uptime() / 60)}mins`,
  environment: import.meta.env.DEV ? ("development" as const) : ("production" as const),
});

export const api = new Elysia({ prefix: "/health" })
  .model({
    Health: ResponseSchema,
  })
  .get(
    "/",
    async ({ status }) => {
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
        return status(503, {
          ...base(),
          status: "degraded",
          upstream: {
            status: "unreachable",
            latency: null,
          },
        } as const);
      }
    },
    {
      response: { 200: "Health", 503: "Health" },
      detail: {
        summary: "Health check",
        description: `Checks the health status of the service and its upstream dependencies.

Returns the current service status, version information, and upstream service connectivity.

**Response Codes:**
- **200**: Service is healthy or degraded but operational
- **503**: Service is unavailable`,
        tags: ["Health"],
      },
    },
  );
