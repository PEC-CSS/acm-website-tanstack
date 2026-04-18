import { getTreaty } from "$lib/treaty";

export const signinFn = async (email: string, password: string) => {
  const api = getTreaty();
  const result = await api.auth["sign-in"].post(
    { email, password },
    { fetch: { credentials: "include" } },
  );

  if (result.error) return { error: result.error.value.message };

  return { success: true };
};

export const signoutFn = async () => {
  const api = getTreaty();
  await api.auth["sign-out"].post({}, { fetch: { credentials: "include" } });

  return { success: true };
};
