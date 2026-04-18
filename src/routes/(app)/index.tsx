import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({ component: App });

function App() {
  return <h1>PEC ACM</h1>;
}
