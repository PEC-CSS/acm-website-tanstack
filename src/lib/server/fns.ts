import type { SessionUser } from "$lib/api/types";

import { createServerFn } from "@tanstack/react-start";

import { readSession } from "./session";

export const fetchUserFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionUser | null> => {
    const session = readSession();
    if (!session.authenticated) return null;
    return session.user;
  },
);
