import type { SessionUser } from "$lib/api/types";

import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, setCookie } from "@tanstack/react-start/server";

import { cookieBase } from "$lib/constants/api";
import { decodeJWTPayload } from "$lib/utils";
import { getTreaty } from "../../routes/api.$";
import { readSession } from "./session";

export const fetchUserFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionUser | null> => {
    const session = readSession();
    if (!session.authenticated) return null;
    return session.user;
  },
);

export const signinFn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const api = getTreaty();

    const { data: res, error } = await api.auth["sign-in"].post({
      email: data.email,
      password: data.password,
    });

    if (error) return { error: error.value.message };

    const claims = decodeJWTPayload(res.data.token);

    if (!claims) return { error: "Invalid token received from server" };

    setCookie("session", res.data.token, cookieBase(claims.exp));
    setCookie("user", JSON.stringify(res.data.user), cookieBase(claims.exp));

    return { success: true };
  });

export const signoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const api = getTreaty();

  await api.auth["sign-out"].post();
  deleteCookie("session");
  deleteCookie("user");

  return { success: true };
});
