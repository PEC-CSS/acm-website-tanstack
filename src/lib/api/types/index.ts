import type { UserSchema } from "./schemas";
import type * as z from "zod";

export interface APIErrorResponse {
  code: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  timestamp: string;
}

export type SessionUser = z.infer<typeof UserSchema>;

export function isErrorResponse(res: unknown): res is APIErrorResponse {
  return (
    res !== null &&
    typeof res === "object" &&
    "code" in res &&
    typeof res.code === "string" &&
    res.code.trim() !== "" &&
    "message" in res &&
    typeof res.message === "string" &&
    res.message.trim() !== ""
  );
}

export const ERROR_STATUS_CODES = [400, 401, 403, 404, 409, 500] as const;
export type ErrorStatusCode = (typeof ERROR_STATUS_CODES)[number];
