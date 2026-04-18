import type { QueryClient } from "@tanstack/react-query";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "$styles/app.css?url";

import { fetchUserFn } from "$lib/server/fns";
import { QueryDevtools } from "../integrations/tanstack-query/devtools";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => {
    const user = await fetchUserFn();
    return { user };
  },
  shellComponent: RootDocument,
  notFoundComponent: () => <div>Not Found</div>,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-200">
        {children}

        <TanStackDevtools
          config={{
            position: "top-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            QueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
