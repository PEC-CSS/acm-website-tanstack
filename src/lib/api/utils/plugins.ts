import { openapi as createOpenAPI } from "@elysiajs/openapi";
import { elysiaLogger } from "@logtape/elysia";
import { configure, getConsoleSink } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";
import * as z from "zod";

let loggerConfigured = false;

export const configureLogger = async () => {
  if (loggerConfigured) return;
  await configure({
    reset: import.meta.env.DEV,
    sinks: {
      console: getConsoleSink({
        formatter: prettyFormatter,
      }),
    },
    loggers: [
      {
        category: ["logtape", "meta"],
        sinks: ["console"],
        lowestLevel: "warning",
      },
      { category: "elysia", sinks: ["console"], lowestLevel: "info" },
    ],
  });

  loggerConfigured = true;
};

export const logger = () => elysiaLogger();

export const openapi = createOpenAPI({
  path: "/docs",
  documentation: {
    info: {
      title: "PEC ACM Community Management & Events Platform API",
      description: `A REST API for managing community members, events, and user engagement for ACM at Punjab Engineering College.
## Authentication
Most endpoints require JWT authentication. Obtain a token via the \`POST /v1/user/login\` endpoint and include it in the \`Authorization\` header as a Bearer token.

## Response Format
All responses follow a consistent JSON structure with appropriate HTTP status codes and error messages.`,
      version: "1.0.0",
      license: {
        name: "MIT",
        url: "https://github.com/PEC-CSS/acm-website-backend/blob/main/LICENSE",
      },
      contact: {
        name: "PEC ACM Webmaster",
        email: "bruh@example.com",
      },
    },
  },
  mapJsonSchema: {
    zod: z.toJSONSchema,
  },
});
