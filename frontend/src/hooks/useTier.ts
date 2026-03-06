import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Tier, CreateTierDto, UpdateTierDto, PaginatedTiers } from "@/types/tier.types";

// ── Query key factory ─────────────────────────────────────────────
export const tierKeys = {
  all:       ()                                        => ["tiers"]                        as const,
  paginated: (role: string, page: number, limit: number) => ["tiers", role, page, limit]  as const,
};

// ── Paginated clients (GET /tier?role=CLIENT&page=X&limit=Y) ──────
export function useClients(page: number, limit: number) {
  return useQuery<PaginatedTiers>({
    queryKey: tierKeys.paginated("CLIENT", page, limit),
    queryFn:  () =>
      api(`/tier?role=CLIENT&page=${page}&limit=${limit}`) as Promise<PaginatedTiers>,
    staleTime:    2 * 60 * 1000,
    placeholderData: (prev) => prev, // keeps previous page data visible while next page loads
  });
}

// ── Paginated fournisseurs (GET /tier?role=FOURNISSEUR&page=X&limit=Y)
export function useFournisseurs(page: number, limit: number) {
  return useQuery<PaginatedTiers>({
    queryKey: tierKeys.paginated("FOURNISSEUR", page, limit),
    queryFn:  () =>
      api(`/tier?role=FOURNISSEUR&page=${page}&limit=${limit}`) as Promise<PaginatedTiers>,
    staleTime:    2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

// ── Create tier (POST /tier) ──────────────────────────────────────
export function useCreateTier() {
  const queryClient = useQueryClient();

  return useMutation<Tier, Error, CreateTierDto>({
    mutationFn: (dto) =>
      api("/tier", {
        method: "POST",
        body:   JSON.stringify(dto),
      }) as Promise<Tier>,

    onSuccess: () => {
      // Invalidate all paginated tier queries so every page refetches
      queryClient.invalidateQueries({ queryKey: tierKeys.all() });
    },
  });
}

// ── Update tier (PATCH /tier/:id) ─────────────────────────────────
export function useUpdateTier() {
  const queryClient = useQueryClient();

  return useMutation<Tier, Error, { id: string; dto: UpdateTierDto }>({
    mutationFn: ({ id, dto }) =>
      api(`/tier/${id}`, {
        method: "PATCH",
        body:   JSON.stringify(dto),
      }) as Promise<Tier>,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tierKeys.all() });
    },
  });
}

// ── Delete tier (DELETE /tier/:id) ────────────────────────────────
export function useDeleteTier() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      api(`/tier/${id}`, { method: "DELETE" }) as Promise<void>,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tierKeys.all() });
    },
  });
}