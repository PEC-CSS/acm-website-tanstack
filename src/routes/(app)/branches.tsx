import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/branches")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/branches"!</div>;
}
