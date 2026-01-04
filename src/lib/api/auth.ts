import { render, toPlainText } from "@react-email/components";
import Elysia from "elysia";
import nodemailer from "nodemailer";
import z from "zod";

import VerifyEmail from "$emails/verify";
import { env } from "$env/server";
import { API_URL } from "$lib/constants/api";
import { BRANCH_NAMES } from "$lib/constants/details";

import { isErrorResponse } from "./helpers";
import { APIUserSchema, UserSchema } from "./schemas";

const LoginResponseSchema = z.object({
  jwtToken: z.string(),
  user: UserSchema,
});

const APILoginResponseSchema = z.object({
  jwtToken: z.string(),
  user: APIUserSchema,
});

export const api = new Elysia({ prefix: "/auth" })
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

      const validatedRes = APILoginResponseSchema.parse(response);

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
        200: LoginResponseSchema,
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
  )
  .get(
    "/verify-email/:token",
    async ({ params, status }) => {
      const token = params.token;

      const url = `${API_URL.V1.USER.VERIFY}?${new URLSearchParams({ token })}`;

      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        const response = await res.json();

        if (isErrorResponse(response)) {
          console.log(response);
          switch (response.code) {
            case "Not Found":
              return status(404, {
                error: "Not Found",
                message:
                  "The provided verification token was not found or has expired",
                timestamp: new Date().toISOString(),
              });
            case "Bad Request":
              return status(400, {
                error: "Bad Request",
                message:
                  "The Email verification token is not of the expected type.",
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

      // TODO: It's more ideal to redirect the user to confirmation page, instead of showing a bland json response.
      return { message: "Your Email was sucessfully verified." };
    },
    {
      response: {
        200: z.object({
          message: z.literal("Your Email was sucessfully verified."),
        }),
        400: "error",
        404: "error",
        500: "error",
      },
    },
  )
  .post(
    "/register",
    async ({ body, status }) => {
      const res = await fetch(API_URL.V1.USER.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          name: body.name,
          sid: body.sid,
          branch: body.branch,
          email: body.email,
          password: body.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      if (isErrorResponse(response)) {
        switch (response.code) {
          case "Bad Request":
            return status(400, {
              error: "Bad Request",
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

      const emailToken = response.emailToken;

      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: {
          user: env.SMTP_EMAIL,
          pass: env.SMTP_PASS,
        },
      });

      const html = await render(
        VerifyEmail({ name: body.name, token: emailToken }),
      );
      const text = toPlainText(html);

      await transporter.sendMail({
        from: `PEC ACM <${env.SMTP_EMAIL}>`,
        to: body.email,
        subject: "New Account Verification",
        text,
        html,
      });

      return {
        message:
          "Account created! Please check your email to verify your account",
      };
    },
    {
      body: z
        .object({
          name: z
            .string()
            .trim()
            .min(1, "Name is required")
            .max(100, "Name too long"),
          email: z.email().endsWith("@pec.edu.in", {
            error: "We only accept '@pec.edu.in' emails.",
          }),
          branch: z.enum(BRANCH_NAMES),
          sid: z.int().min(10000000).max(99999999),
          password: z
            .string()
            .regex(
              /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).)/gm,
              "The password needs atleast 1 lowercase character, 1 uppercase character, 1 number and 1 special character",
            )
            .min(8)
            .max(20, "You sure you can remember that?"),
          confirmPassword: z.string().min(1, "Please confirm your password"),
        })
        .refine(data => data.password === data.confirmPassword, {
          error: "Password and confirm password are not same.",
          path: ["confirmPassword"],
        }),
      response: {
        200: z.object({
          message: z.literal(
            "Account created! Please check your email to verify your account",
          ),
        }),
        400: "error",
        500: "error",
      },
    },
  );
