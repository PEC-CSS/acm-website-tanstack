type JWTPayload = {
  sub: string;
  exp: number;
  iat: number;
};

export function decodeJWTPayload(token: string): JWTPayload | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
