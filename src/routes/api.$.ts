import { treaty } from "@elysiajs/eden";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { Elysia } from "elysia";

import * as handlers from "$lib/api";
import * as plugins from "$lib/api/utils/plugins";

const app = new Elysia({ prefix: "/api" })
  .use(plugins.logger())
  .use(plugins.openapi)
  .use(handlers.auth)
  .use(handlers.events)
  .use(handlers.health)
  .use(handlers.user);

const handle = ({ request }: { request: Request }) => app.fetch(request);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      ANY: handle,
    },
  },
});

export const getTreaty = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => treaty<typeof app>("localhost:3000").api);
