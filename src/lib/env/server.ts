import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_BASE_URL: z.url(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z
      .string()
      .transform(s => Number.parseInt(s, 10))
      .pipe(z.number()),
    SMTP_EMAIL: z.email(),
    SMTP_PASS: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
