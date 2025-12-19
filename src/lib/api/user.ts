import Elysia from "elysia";
import z from "zod";

import { API_URL } from "$lib/constants/api";
import { isErrorResponse } from "./helpers";
import { APIUserSchema, UserSchema } from "./schemas";

const ResponseSchema = z.object({
  jwtToken: z.string(),
  user: UserSchema,
});

const APIResponseSchema = z.object({
  jwtToken: z.string(),
  user: APIUserSchema,
});

export const api = new Elysia({ prefix: "/user" })
  .model({
    error: z.object({
      error: z.string(),
      message: z.string(),
      timestamp: z.iso.datetime(),
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
      detail: {
        summary: "User login with email and password",
        description: `Authenticates a user with their email and password credentials. 
        
On successful authentication, returns a JWT token for subsequent authenticated requests along with the user's profile information including their designation, batch, experience points, and verification status.

**Response Codes:**
- **200**: Authentication successful - returns JWT token and user profile
- **401**: Invalid credentials - email or password is incorrect
- **404**: User not found - no account exists with the provided email
- **500**: Server error - an unexpected error occurred during authentication`,
        tags: ["Authentication"],
      },
    },
  );
