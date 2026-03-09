import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthUser, LoginPayload, LoginResponse } from "@/types/auth.types";

// ── Current user ──────────────────────────────────────────────────────────────
// Calls /api/me — our Next.js proxy which forwards to NestJS GET /auth/me.
// Proxying server-side means the browser never talks to NestJS directly,
// avoiding all CORS issues.
// The proxy also forwards the refreshed Set-Cookie header back so the
// sliding 15min expiry keeps resetting on every call.

export function useMe() {
  return useQuery<AuthUser | null>({
    queryKey:  ["auth", "me"],
    queryFn:   async () => {
      const res = await fetch("/api/me");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Erreur serveur.");
      return res.json() as Promise<AuthUser>;
    },
    retry:     false,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────
// Posts to /api/login — Next.js proxy that forwards to NestJS POST /auth/login
// and relays the Set-Cookie header so the httpOnly cookie lands on :3001.

export function useLogin() {
  const router      = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload: LoginPayload) => {
      const res = await fetch("/api/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Identifiants incorrects.");
      return data as LoginResponse;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.push("/dashboard");
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────
// Posts to /api/logout — clears the cookie on both NestJS and Next.js domains,
// wipes the entire query cache, redirects to login.

export function useLogout() {
  const router      = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetch("/api/logout", { method: "POST" }).then((r) => r.json()),

    onSuccess: () => {
      queryClient.clear();
      router.push("/");
    },
  });
}
// ── Forgot password ─────────────────────────────────────────────────────────────
// Posts to /api/forgot-password — Next.js proxy that forwards to NestJS POST /auth/forgot-password
export function useForgotPassword() {
  return useMutation<{ message: string }, Error, { username: string }>({
    mutationFn: async ({ username }) => {
      const res  = await fetch("/api/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur serveur.");
      return data;
    },
  });
}
export function useResetPassword() {
  return useMutation<{ newPassword: string }, Error, { token: string }>({
    mutationFn: async ({ token }) => {
      const res  = await fetch("/api/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur serveur.");
      return data;
    },
  });
}