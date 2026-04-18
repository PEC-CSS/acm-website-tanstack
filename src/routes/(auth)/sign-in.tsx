import { useForm } from "@tanstack/react-form";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { signinFn } from "$lib/fns/auth";

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

  const [_serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const result = await signinFn(value.email, value.password);

      if (result.error) {
        setServerError(result.error);
        return;
      }

      await router.invalidate();
      await router.navigate({ to: redirectTo });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form
          className="flex flex-col gap-4"
          onSubmit={async e => {
            e.preventDefault();
            await form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {field => (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={field.name}
                  className="text-sm"
                >
                  Email
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 outline-none"
                  id={field.name}
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
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-sm"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border px-3 py-2 outline-none"
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={state => ({
              isSubmitting: state.isSubmitting,
              canSubmit: state.canSubmit,
            })}
          >
            {({ isSubmitting, canSubmit }) => (
              <button
                type="submit"
                className="mt-2 rounded-lg border px-3 py-2 bg-slate-500 text-white active:scale-96"
                disabled={!canSubmit || isSubmitting}
              >
                Sign In
              </button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  );
}
