import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";
import { isErrorResponse } from "../types";
import {
  createErrorResponse,
  createResponseSchema,
  toSuccessResponse,
} from "../utils/helpers";
import { requireAuth } from "../utils/macros";

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
    async ({ body, token }) => {
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
          return createErrorResponse(response, {
            allowedCodes: [400, 401, 404, 500],
          });
        }
      }

      const response = await res.text();
      return toSuccessResponse(response);
    },
    {
      requireAuth: true,

      body: z.object({
        email: z.email("Please provide a valid email"),
        newRole: z.string().min(1, "Role is required"),
      }),
      response: createResponseSchema(z.string(), {
        errorCodes: [400, 401, 404, 500],
      }),
      detail: {
        summary: "Assign role to a user",
        description: "Updates the role of a user based on their email address.",
      },
    },
  );
