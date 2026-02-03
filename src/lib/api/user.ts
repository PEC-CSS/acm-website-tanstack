import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";
import { isErrorResponse } from "./helpers";
import { requireAuth } from "./macros";

export const api = new Elysia({ prefix: "/user" })
  .use(requireAuth)
  .model({
    error: z.object({
      error: z.string(),
      message: z.string(),
      timestamp: z.iso.datetime(),
    }),
  })
  .post(
    "/role",
    async ({ body, status, token }) => {
      const res = await fetch(API_URL.V1.USER.ASSIGN_ROLE, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

      const response = await res.text();
      return response;
    },
    {
      requireAuth: true,

      body: z.object({
        email: z.email("Please provide a valid email"),
        newRole: z.string().min(1, "Role is required"),
      }),

      response: {
        200: z.string(),
        400: "error",
        401: "error",
        404: "error",
        500: "error",
      },

      detail: {
        summary: "Assign role to a user",
        description: "Updates the role of a user based on their email address.",
      },
    },
  );
