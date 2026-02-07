import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  server: {
    BACKEND_BASE_URL: z.url(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z
      .string()
      .transform(s => Number.parseInt(s, 10))
      .pipe(z.number()),
    SMTP_EMAIL: z.email(),
    SMTP_PASS: z.string(),
    SESSION_SECRET: z.string().min(32),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export default env;
