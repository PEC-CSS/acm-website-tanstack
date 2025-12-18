import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";
import { isErrorResponse } from "./helpers";
import { UserSchema } from "./schemas";

const ResponseSchema = z.object({
  jwtToken: z.string(),
  user: UserSchema,
});

const APIResponseSchema = z.object({
  jwtToken: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    batch: z.number(),
    dp: z.string().nullable(),
    sid: z.number(),
    verified: z.boolean(),
    designation: z.enum([
      "Member",
      "ImplementationBody",
      "ExecutiveBody",
      "Core",
      "Admin",
    ]),
    xp: z.number(),
  }),
});

export const api = new Elysia({ prefix: "/user" })
  .model({
    error: z.object({
      error: z.string(),
      message: z.string(),
    }),
  })
  .post(
    "/login",
    async ({ body, status }) => {
      const res = await fetch(API_URL.V1.USER.LOGIN, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();
      console.log(response);

      if (isErrorResponse(response)) {
        switch (response.code) {
          case "Not Found":
            return status(404, {
              error: response.code,
              message: response.message,
            });
          case "Unauthorized":
            return status(401, {
              error: response.code,
              message: response.message,
            });
          default:
            return status(500, {
              error: "Internal Server Error",
              message: "An unexpected error occurred while handling request",
            });
        }
      }

      const validatedRes = APIResponseSchema.parse(response);

      return {
        jwtToken: validatedRes.jwtToken,
        user: {
          ...validatedRes.user,
          profile: validatedRes.user.dp,
          experience: validatedRes.user.xp,
        },
      };
    },
    {
      body: z.object({
        email: z.email("you need to enter a email to login"),
        password: z.string("you need to enter a password to login"),
      }),
      response: {
        200: ResponseSchema,
        401: "error",
        404: "error",
        500: "error",
      },
    },
  );
