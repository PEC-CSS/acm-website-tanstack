import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { configureLogger } from "$lib/api/utils/plugins";

await configureLogger();

export default createServerEntry({
  fetch(req) {
    return handler.fetch(req);
  },
});
