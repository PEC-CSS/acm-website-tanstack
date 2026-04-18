import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({ component: App });

function App() {
  return (
    <>
      <h1>PEC ACM</h1>
      <Link
        to="/sign-in"
        search={{ redirect: "/dashboard" }}
      >
        Sign In
      </Link>
    </>
  );
}
