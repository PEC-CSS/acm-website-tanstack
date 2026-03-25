// src/lib/treaty.ts
import type { App } from "src/routes/api.$";

import { treaty } from "@elysiajs/eden";
import { createIsomorphicFn } from "@tanstack/react-start";

import { app } from "~/routes/api.$";

export const getTreaty = createIsomorphicFn()
  .server(() => reaty(app).api)
  .client(() => treaty<App>("localhost:3000").api);
