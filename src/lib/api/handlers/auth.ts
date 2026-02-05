import { render, toPlainText } from "@react-email/components";
import Elysia from "elysia";
import nodemailer from "nodemailer";
import z from "zod";

import VerifyEmail from "$emails/verify";
import { env } from "$env/server";
import { API_URL } from "$lib/constants/api";
import { BRANCH_NAMES } from "$lib/constants/org";
import { isErrorResponse } from "../types";
import { APIUserSchema, UserSchema } from "../types/schemas";
import {
  createErrorResponse,
  createResponseSchema,
  toSuccessResponse,
} from "../utils/helpers";

const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

const APILoginResponseSchema = z.object({
  jwtToken: z.string(),
  user: APIUserSchema,
});

export const api = new Elysia({ prefix: "/auth" })
  .model({
    error: z.object({
      success: z.literal(false),
      error: z.string(),
      message: z.string(),
      timestamp: z.iso.datetime(),
    }),
  })
  .post(
    "/sign-in",
    async ({ body, set }) => {
      const res = await fetch(API_URL.V1.USER.LOGIN, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      if (isErrorResponse(response)) {
        return createErrorResponse(response, {
          allowedCodes: [401, 404, 500],
        });
      }

      const validatedRes = APILoginResponseSchema.parse(response);

      set.headers.authorization = `Bearer ${validatedRes.jwtToken}`;

      return toSuccessResponse({
        token: validatedRes.jwtToken,
        user: {
          ...validatedRes.user,
          profile: validatedRes.user.dp,
          experience: validatedRes.user.xp,
        },
      });
    },
    {
      body: z.object({
        email: z.email("you need to enter a email to login"),
        password: z.string("you need to enter a password to login"),
      }),
      response: createResponseSchema(LoginResponseSchema, {
        errorCodes: [401, 404, 500],
      }),
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
    async ({ params }) => {
      const token = params.token;

      const url = `${API_URL.V1.USER.VERIFY}?${new URLSearchParams({ token })}`;

      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        const response = await res.json();

        if (isErrorResponse(response)) {
          return createErrorResponse(response, {
            customMessages: {
              400: "The Email verification token is not of the expected type.",
              404: "The provided verification token was not found or has expired",
            },
            allowedCodes: [400, 404],
          });
        }
      }

      // TODO: It's more ideal to redirect the user to confirmation page, instead of showing a bland json response.
      return toSuccessResponse({
        message: "Your Email was sucessfully verified.",
      });
    },
    {
      response: createResponseSchema(
        z.object({
          message: z.literal("Your Email was sucessfully verified."),
        }),
        {
          errorCodes: [400, 404, 500],
        },
      ),
      detail: {
        summary: "Verify user email",
        description: `Verifies a user's email address using a one-time verification token.
    
The token is sent to the user's registered email address during account registration.

**Response Codes:**
- **200**: Email successfully verified
- **400**: Invalid or malformed token
- **404**: Token not found or expired
- **500**: Server error`,
        tags: ["Authentication"],
      },
    },
  )
  .post(
    "/sign-up",
    async ({ body }) => {
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
        return createErrorResponse(response, {
          allowedCodes: [400, 500],
        });
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

      return toSuccessResponse({
        message:
          "Account created! Please check your email to verify your account",
      });
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
      response: createResponseSchema(
        z.object({
          message: z.literal(
            "Account created! Please check your email to verify your account",
          ),
        }),
        { errorCodes: [400, 500] },
      ),
      detail: {
        summary: "Register a new user",
        description: `Creates a new user account and sends an email verification link.
    
Only '@pec.edu.in' email addresses are accepted.  
The user must verify their email before logging in.
    
**Response Codes:**
- **200**: Account created and verification email sent
- **400**: Validation error or duplicate account
- **500**: Server error`,
        tags: ["Authentication"],
      },
    },
  );
