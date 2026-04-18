import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border px-3 py-2 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border px-3 py-2 outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg border px-3 py-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
