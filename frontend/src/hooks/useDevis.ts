import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Document, CreateDocumentDto } from "@/types/document.types";
import { DevisStatus } from "@/types/enums";

// ── Types ──────────────────────────────────────────────────────
export interface PaginatedDocuments {
  data:        Document[];
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
}

export interface DevisFilters {
  dateFrom?:    string;
  dateTo?:      string;
  dueDateFrom?: string;
  dueDateTo?:   string;
}

// ── Query keys ─────────────────────────────────────────────────
export const devisKeys = {
  all:       ()                              => ["devis"]                    as const,
  paginated: (page: number, limit: number, filters: DevisFilters) =>
    ["devis", "list", page, limit, filters] as const,
  detail:    (id: string)                   => ["devis", "detail", id]      as const,
};

// ── Fetch helpers ──────────────────────────────────────────────
async function fetchDevis(
  page: number,
  limit: number,
  filters: DevisFilters,
): Promise<PaginatedDocuments> {
  const params = new URLSearchParams({
    type:  "DEVIS",
    page:  String(page),
    limit: String(limit),
    ...(filters.dateFrom    ? { dateFrom:    filters.dateFrom    } : {}),
    ...(filters.dateTo      ? { dateTo:      filters.dateTo      } : {}),
    ...(filters.dueDateFrom ? { dueDateFrom: filters.dueDateFrom } : {}),
    ...(filters.dueDateTo   ? { dueDateTo:   filters.dueDateTo   } : {}),
  });

  const res = await fetch(`/api/document?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Erreur lors du chargement des devis.");
  }
  return res.json();
}

async function fetchDevisById(id: string): Promise<Document> {
  const res = await fetch(`/api/document/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Devis introuvable.");
  }
  return res.json();
}

// ── Hooks ──────────────────────────────────────────────────────
export function useDevis(
  page: number,
  limit: number,
  filters: DevisFilters = {},
) {
  return useQuery({
    queryKey:       devisKeys.paginated(page, limit, filters),
    queryFn:        () => fetchDevis(page, limit, filters),
    placeholderData: (prev) => prev,
  });
}

export function useDevisDetail(id: string) {
  return useQuery({
    queryKey: devisKeys.detail(id),
    queryFn:  () => fetchDevisById(id),
    enabled:  !!id,
  });
}

export function useCreateDevis() {
  const qc = useQueryClient();
  return useMutation<Document, Error, CreateDocumentDto>({
    mutationFn: async (dto) => {
      const res = await fetch("/api/document", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(dto),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur lors de la création.");
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: devisKeys.all() }),
  });
}

export function useUpdateDevisStatus() {
  const qc = useQueryClient();
  return useMutation<Document, Error, { id: string; devisStatus: DevisStatus }>({
    mutationFn: async ({ id, devisStatus }) => {
      const res = await fetch(`/api/document/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ devisStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur lors de la mise à jour.");
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: devisKeys.all() }),
  });
}

export function useConvertToFacture() {
  const qc = useQueryClient();
  return useMutation<{ devisId: string; facture: Document }, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/document/${id}/convert`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur lors de la conversion.");
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: devisKeys.all() }),
  });
}

export function useDeleteDevis() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/document/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur lors de la suppression.");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: devisKeys.all() }),
  });
}