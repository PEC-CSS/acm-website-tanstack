import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";

import { isErrorResponse } from "./helpers";
import { BaseEventSchema, BRANCHES } from "./schemas";
import { requireAuth } from "./macros";

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
    "/getEvent/:eventId",
    async ({ params, status }) => {
      const eventId = params.eventId;

      const url = `${API_URL.V1.EVENTS.BY_ID.GET(eventId)}`;

      const res = await fetch(url, { method: "GET" });
      
      if (!res.ok) {
        const response = await res.json();

        if (isErrorResponse(response)) {
          switch (response.code) {
            case "Not Found":
              return status(404, {
                error: response.code,
                message: response.message,
                timestamp: new Date().toISOString(),
              });

            case "Unauthorized":
              return status(401, {
                error: response.code,
                message: response.message,
                timestamp: new Date().toISOString(),
              });

            default:
              return status(500, {
                error: "Internal Server Error",
                message: "An unexpected error occurred while handling request",
                timestamp: new Date().toISOString(),
              });
            }
          }
        }

        const response = await res.json();

        const validatedRes = BaseEventSchema.parse(response);
        return validatedRes;
    },
    {
      params: z.object({
        eventId: z.coerce.number(),
      }),
      response: {
        200: BaseEventSchema,
        401: "error",
        404: "error",
        500: "error",
      },
      detail: {
        summary: "Get event detail",
        description: "Gets the details of an event using it's eventId",
      },
    }
  )
  .post(
    "/createEvent", 
    async ({ body, status, token }) => {
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
          ended: body.ended
        }),
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      if (isErrorResponse(response)) {
        switch (response.code) {
          case "Not Found":
            return status(404, {
              error: response.code,
              message: response.message,
              timestamp: new Date().toISOString(),
            });

          case "Unauthorized":
            return status(401, {
              error: response.code,
              message: response.message,
              timestamp: new Date().toISOString(),
            });

          default:
            return status(500, {
              error: "Internal Server Error",
              message:
                "An unexpected error occurred while handling request",
              timestamp: new Date().toISOString(),
            });
          }
        }

      const validatedRes = BaseEventSchema.parse(response);
      return validatedRes;
    },
    {
      requireAuth: true,
      body: z
      .object({
        id: z.number(),
        title: z.string(),
        branch: z.enum(BRANCHES),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string(),
        relatedLink: z.string(),
        venue: z.string(),
        ended: z.boolean(),
      }),
      response: {
        200: BaseEventSchema,
        401: "error",
        404: "error",
        500: "error",
      },
    },
  );
