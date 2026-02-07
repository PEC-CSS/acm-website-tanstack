import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/sign-in")({
  head: () => ({
    meta: [{ title: "Sign In | PEC ACM" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-20 h-screen">
      <aside className="col-span-7 p-8 gap-4 bg-slate-100 flex flex-col items-center justify-center text-right">
        <h1 className="w-full font-extrabold  text-5xl">Sign in</h1>
        <p className="w-full font-bold text-xl">
          Enter your email and password
        </p>
      </aside>

      <main className="col-span-13 p-8 bg-slate-50 flex items-center justify-start">
        <form className="flex flex-col gap-4">
          <label className="text-xl flex flex-col gap-2">
            Email Address
            <input
              className="border border-slate-600 w-xl px-2 py-4 rounded-sm text-xl"
              type="text"
              placeholder="Email address"
            />
          </label>

          <label className="text-xl flex flex-col gap-2">
            Password
            <br />
            <input
              className="border border-slate-600 w-xl px-2 py-4 rounded-sm text-xl"
              type="text"
              placeholder="Password"
            />
          </label>

          <div className="flex flex-row-reverse w-full justify-between items-center">
            <button
              type="submit"
              className="bg-slate-500 text-white rounded-sm px-6 py-3 active:scale-96"
            >
              Next
            </button>

            <Link
              to="/"
              type="button"
              className="border border-slate-500 rounded-sm px-6 py-3 active:scale-96"
            >
              Back
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
