import { createFileRoute } from "@tanstack/react-router";
import { Elysia } from "elysia";

import * as handlers from "$lib/api";
import * as plugins from "$lib/api/utils/plugins";

export const app = new Elysia({ prefix: "/api" })
  .use(plugins.logger())
  .use(plugins.openapi)
  .use(handlers.auth)
  .use(handlers.events)
  .use(handlers.health)
  .use(handlers.user);

export type App = typeof app;

const handle = ({ request }: { request: Request }) => app.fetch(request);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      ANY: handle,
    },
  },
});
