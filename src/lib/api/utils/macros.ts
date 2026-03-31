import type { Designation } from "$lib/types";
import type { SessionUser } from "../types";

import { Elysia, status } from "elysia";

import { hasRole } from "$lib/types";
import { decodeJWTPayload } from "$lib/utils";

const unauthorized = (message: string) =>
  status(401, {
    success: false as const,
    error: "Unauthorized",
    message,
    timestamp: new Date().toISOString(),
  });

const forbidden = (message: string) =>
  status(403, {
    success: false as const,
    error: "Forbidden",
    message,
    timestamp: new Date().toISOString(),
  });

export const requireAuth = new Elysia({ name: "require-auth" }).macro({
  requireAuth: (enabled: true | Designation) => ({
    resolve({ headers, cookie: { session, user: userCookie } }) {
      const token = (session.value as string | undefined) ?? headers.authorization?.split(" ")[1];

      if (!token) return unauthorized("You need to be signed in.");

      const claims = decodeJWTPayload(token);

      if (!claims) return unauthorized("Malformed token.");

      if (Date.now() >= claims.exp * 1000) {
        session.remove();
        userCookie.remove();
        return unauthorized("Your session has expired. Please sign in again.");
      }

      const userData = userCookie.value as SessionUser | undefined;

      if (!userData) {
        session.remove();
        return unauthorized("Session data missing. Please sign in again.");
      }

      if (enabled !== true) {
        if (!hasRole(userData.designation, enabled)) {
          return forbidden(
            `This action requires the '${enabled}' role or above. Your current role is '${userData.designation}'.`,
          );
        }
      }

      return {
        token,
        user: userData,
      };
    },
  }),
});
