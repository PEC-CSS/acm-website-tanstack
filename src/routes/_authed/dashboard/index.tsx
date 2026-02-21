import { createFileRoute, useRouter } from "@tanstack/react-router";

import { signoutFn } from "$lib/server/fns";

export const Route = createFileRoute("/_authed/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const router = useRouter();

  async function handleSignOut() {
    await signoutFn();
    await router.invalidate();
    await router.navigate({ to: "/" });
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button
        onClick={handleSignOut}
        type="button"
      >
        Sign Out
      </button>
    </div>
  );
}
