import Elysia from "elysia";
import * as z from "zod";

import { API_URL } from "$lib/constants/api";

export const api = new Elysia()
  .get(
    "/hello",
    async () => {
      const res = await fetch(API_URL.HEALTH.HELLO);
      return await res.text();
    },
    {
      response: z.string(),
      detail: {
        summary: "Say Hello to the API",
        description:
          "Returns a simple greeting message to verify the API is reachable and responding.",
        tags: ["Misc.", "Health"],
      },
    },
  )
  .get(
    "/health",
    async () => {
      const res = await fetch(API_URL.HEALTH.CHECK);
      return await res.text();
    },
    {
      response: z.string(),
      detail: {
        summary: "Perform health check of the API",
        description:
          "Performs a health check on the API and returns the current operational status. Not much different from `GET /api/hello`. ",
        tags: ["Misc.", "Health"],
      },
    },
  );
