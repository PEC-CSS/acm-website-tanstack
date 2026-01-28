import { Elysia } from "elysia";

export const requireAuth = new Elysia().macro({
  requireAuth: {
    resolve({ headers, status }) {
      if (!headers.authorization) {
        return status(403, {
          message: "you need to be signed in to perform this operation.",
          error: "Unauthorized",
        });
      }

      const token = headers.authorization.split(" ")[1];

      return {
        token,
      };
    },
  },
});
