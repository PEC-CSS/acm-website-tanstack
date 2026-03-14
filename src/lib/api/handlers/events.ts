import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";
import { ACM_BRANCHES } from "$lib/constants/org";
import { isErrorResponse } from "../types";
import { BaseEventSchema } from "../types/schemas";
import { createErrorResponse, createResponseSchema, toSuccessResponse } from "../utils/helpers";
import { requireAuth } from "../utils/macros";

export const api = new Elysia({ prefix: "/events" })
  .use(requireAuth)
  .model({
    error: z.object({
      error: z.string(),
      message: z.string(),
      timestamp: z.iso.datetime(),
    }),
  })
  .get(
    "/:id",
    async ({ params }) => {
      const eventId = params.id;

      const url = `${API_URL.V1.EVENTS.BY_ID.GET(eventId)}`;

      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        const response = await res.json();

        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            allowedCodes: [401, 404, 500],
          });
        }
      }

      const response = await res.json();

      const validatedRes = BaseEventSchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
      response: createResponseSchema(BaseEventSchema, {
        errorCodes: [401, 404, 500],
      }),
      detail: {
        summary: "Get event detail",
        description: "Gets the details of an event using it's eventId",
      },
    },
  )
  .post(
    "/",
    async ({ body, token }) => {
      const res = await fetch(API_URL.V1.EVENTS.CREATE, {
        method: "POST",
        body: JSON.stringify({
          id: body.id,
          title: body.title,
          branch: body.branch,
          startDate: body.startDate,
          endDate: body.endDate,
          description: body.description,
          relatedLink: body.relatedLink,
          venue: body.venue,
          ended: body.ended,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      if (isErrorResponse(response)) {
        return createErrorResponse(response, {
          allowedCodes: [401, 404, 500],
        });
      }

      const validatedRes = BaseEventSchema.parse(response);
      return toSuccessResponse(validatedRes);
    },
    {
      requireAuth: true,
      body: z.object({
        id: z.number(),
        title: z.string(),
        branch: z.enum(ACM_BRANCHES),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string(),
        relatedLink: z.string(),
        venue: z.string(),
        ended: z.boolean(),
      }),
      response: createResponseSchema(BaseEventSchema, {
        errorCodes: [401, 404, 500],
      }),
    },
  );
