import env from "$env/server";

const BASE_URL = env.BACKEND_BASE_URL;

export const API_URL = {
  V1: {
    USER: {
      GET: `${BASE_URL}/v1/user`,
      UPDATE: `${BASE_URL}/v1/user`,
      REGISTER: `${BASE_URL}/v1/user`,
      BY_ID: (userId: number) => `${BASE_URL}/v1/user/${userId}`,
      LOGIN: `${BASE_URL}/v1/user/login`,
      VERIFY: `${BASE_URL}/v1/user/verify`,
      FORGOT_PASSWORD: {
        SEND_EMAIL: `${BASE_URL}/v1/user/forgot-password`,
        RESET: `${BASE_URL}/v1/user/forgot-password`,
      },
      ASSIGN_ROLE: `${BASE_URL}/v1/user/assign/role`,
      EVENTS: {
        GET: `${BASE_URL}/v1/user/events`,
        BY_EMAIL: (email: string) => `${BASE_URL}/v1/user/${email}/events`,
      },
      SEARCH: `${BASE_URL}/v1/user/search`,
      RANK: `${BASE_URL}/v1/user/rank`,
      TRANSACTION: `${BASE_URL}/v1/user/transaction`,
      LEADERBOARD: {
        GET: `${BASE_URL}/v1/user/leaderboard`,
        BY_BATCH: (batch: number) => `${BASE_URL}/v1/user/leaderboard/${batch}`,
      },
    },
    EVENTS: {
      GET_ALL: `${BASE_URL}/v1/events`,
      CREATE: `${BASE_URL}/v1/events`,
      BY_ID: {
        GET: (eventId: number) => `${BASE_URL}/v1/events/${eventId}`,
        UPDATE: (eventId: number) => `${BASE_URL}/v1/events/${eventId}`,
        DELETE: (eventId: number) => `${BASE_URL}/v1/events/${eventId}`,
      },
      END: {
        BY_EMAIL: (eventId: number) => `${BASE_URL}/v1/events/${eventId}/end`,
        BY_SID: (eventId: number) => `${BASE_URL}/v1/events/${eventId}/end/sid`,
      },
      USER: (eventId: number) => `${BASE_URL}/v1/events/${eventId}/user`,
      SEARCH: {
        PATTERN: `${BASE_URL}/v1/events/search/pattern`,
      },
      ONGOING: `${BASE_URL}/v1/events/ongoing`,
      NEXT: `${BASE_URL}/v1/events/next`,
      BY_BRANCH: (branch: string) => `${BASE_URL}/v1/events/branches/${branch}`,
    },
    SUPPORT: {
      USER: (email: string) => `${BASE_URL}/v1/support/user/${email}`,
      EVENTS: (eventId: number) => `${BASE_URL}/v1/support/events/${eventId}`,
    },
    EMAIL: {
      SEND_BULK: `${BASE_URL}/v1/email`,
    },
  },
  HEALTH: {
    CHECK: `${BASE_URL}/health`,
    HELLO: `${BASE_URL}/hello`,
  },
} as const;

export const cookieBase = (exp: number) =>
  ({
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(exp * 1000),
    secure: process.env.NODE_ENV === "production",
  }) as const;
