import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <h1>PEC ACM</h1>
      <Link to="/sign-in">Sign In</Link>
    </>
  );
}
