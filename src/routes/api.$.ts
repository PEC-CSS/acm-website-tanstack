import { createPinoLogger } from "@bogeychan/elysia-logger";
import { treaty } from "@elysiajs/eden";
import { openapi } from "@elysiajs/openapi";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { Elysia } from "elysia";
import * as z from "zod";

import { auth, events, user } from "$lib/api";

const log = createPinoLogger({
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "mm/dd/yyyy HH:MM:ss",
      ignore: "pid,hostname,req,request,responseTime",
      messageFormat: "{req.method} {req.url} - {responseTime}ms",
    },
  },
});

const app = new Elysia({
  prefix: "/api",
})
  .use(
    log.into({
      autoLogging: {
        ignore() {
          return false;
        },
      },
      customProps(ctx) {
        return {
          req: {
            method: ctx.request.method,
            url: new URL(ctx.request.url).pathname,
          },
        };
      },
    }),
  )
  .use(
    openapi({
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
    }),
  )
  .use(auth)
  .use(user)
  .use(events)
  .get("/", "Hello PEC ACM!");

const handle = ({ request }: { request: Request }) => app.fetch(request);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});

export const getTreaty = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => treaty<typeof app>("localhost:3000").api);
