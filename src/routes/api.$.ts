import { treaty } from "@elysiajs/eden";
import { openapi } from "@elysiajs/openapi";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { Elysia } from "elysia";
import * as z from "zod";

import { user } from "$lib/api";

const app = new Elysia({
  prefix: "/api",
})
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    }),
  )
  .use(user)
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
