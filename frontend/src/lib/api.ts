const BASE = process.env.NEXT_PUBLIC_NEST_JS ?? "http://localhost:3000";

// Single configured fetch wrapper used by every hook.
// credentials: "include" ensures the httpOnly cookie is sent
// automatically on every request — this is what triggers the
// JwtAuthGuard in NestJS and what causes the guard to re-sign
// a fresh cookie (sliding 15min expiry on activity).

export const api = async (
  endpoint: string,
  options?: RequestInit
): Promise<unknown> => {
  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message ?? "Une erreur est survenue.");
  }
  if (res.status === 401) {
  // Session expired — kick them back to login
  window.location.href = "/";
  throw new Error("Session expirée. Veuillez vous reconnecter.");
}

  if (res.status === 204) return null;

  return res.json();
};