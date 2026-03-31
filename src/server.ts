import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { configureLogger } from "$lib/api/utils/plugins";

await configureLogger();

// oxlint-disable-next-line import/no-default-export -- server entry needs to be a default export
export default createServerEntry({
  fetch(req) {
    return handler.fetch(req);
  },
});
