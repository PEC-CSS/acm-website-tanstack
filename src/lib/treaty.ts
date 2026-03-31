// src/lib/treaty.ts
import type { App } from "~/routes/api.$";

import { treaty } from "@elysiajs/eden";
import { createIsomorphicFn } from "@tanstack/react-start";
import { app } from "~/routes/api.$";

export const getTreaty = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => treaty<App>("localhost:3000").api);
