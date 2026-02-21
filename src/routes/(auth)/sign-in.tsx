import { useForm } from "@tanstack/react-form";
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";

import { signinFn } from "$lib/server/fns";

export const Route = createFileRoute("/(auth)/sign-in")({
  head: () => ({
    meta: [{ title: "Sign In | PEC ACM" }],
  }),
  validateSearch: search => ({
    redirect: (search.redirect as string) || "/dashboard",
  }),
  beforeLoad: ({ context, search }) => {
    if (context.user) {
      throw redirect({ to: search.redirect });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { redirect: redirectTo } = Route.useSearch();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const result = await signinFn({ data: value });

      if (result.error) {
        setServerError(result.error);
        return;
      }

      await router.invalidate();
      await router.navigate({ to: redirectTo });
    },
  });

  return (
    <div className="grid grid-cols-20 h-screen">
      <aside className="col-span-7 p-8 gap-4 bg-slate-100 flex flex-col items-center justify-center text-right">
        <h1 className="w-full font-extrabold  text-5xl">Sign in</h1>
        <p className="w-full font-bold text-xl">
          Enter your email and password
        </p>
      </aside>

      <main className="col-span-13 p-8 bg-slate-50 flex items-center justify-start">
        <form
          className="flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {field => (
              <div>
                <label
                  htmlFor={field.name}
                  className="text-xl flex flex-col gap-2"
                >
                  Email Address
                </label>
                <input
                  id={field.name}
                  className="border border-slate-600 w-xl px-2 py-4 rounded-sm text-xl"
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {field => (
              <div>
                <label
                  htmlFor={field.name}
                  className="text-xl flex flex-col gap-2"
                >
                  Password
                </label>
                <input
                  id={field.name}
                  className="border border-slate-600 w-xl px-2 py-4 rounded-sm text-xl"
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>
            )}
          </form.Field>

          {serverError && (
            <p className="bg-red-300 rounded-sm px-3 py-2">{serverError}</p>
          )}

          <div className="flex flex-row-reverse w-full justify-between items-center">
            <form.Subscribe
              selector={state => ({
                isSubmitting: state.isSubmitting,
                canSubmit: state.canSubmit,
              })}
            >
              {({ isSubmitting, canSubmit }) => (
                <button
                  type="submit"
                  className="bg-slate-500 text-white rounded-sm px-6 py-3 active:scale-96"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              )}
            </form.Subscribe>

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
