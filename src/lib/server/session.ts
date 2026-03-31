import type { SessionUser } from "$lib/api/types";

import { getCookie } from "@tanstack/react-start/server";

import { decodeJWTPayload } from "$lib/utils";

type Session = { authenticated: true; user: SessionUser; token: string } | { authenticated: false };

export function readSession(): Session {
  const token = getCookie("session");
  const userRaw = getCookie("user");

  if (!token || !userRaw) return { authenticated: false };

  const claims = decodeJWTPayload(token);
  if (!claims || Date.now() >= claims.exp * 1000) return { authenticated: false };

  try {
    const user = JSON.parse(userRaw) as SessionUser;
    return { authenticated: true, user, token };
  } catch {
    return { authenticated: false };
  }
}
