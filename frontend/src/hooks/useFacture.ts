    import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Document } from "@/types/document.types";

// ── Types ──────────────────────────────────────────────────────
export interface PaginatedDocuments {
  data:        Document[];
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
}

export interface FactureFilters {
  dateFrom?: string;
  dateTo?:   string;
}

// ── Query keys ─────────────────────────────────────────────────
export const factureKeys = {
  all:       ()                                                    => ["factures"]                         as const,
  paginated: (page: number, limit: number, filters: FactureFilters) =>
    ["factures", "list", page, limit, filters]                     as const,
  detail:    (id: string)                                          => ["factures", "detail", id]           as const,
};

// ── Fetch helpers ──────────────────────────────────────────────
async function fetchFactures(
  page: number,
  limit: number,
  filters: FactureFilters,
): Promise<PaginatedDocuments> {
  const params = new URLSearchParams({
    type:  "FACTURE",
    page:  String(page),
    limit: String(limit),
    ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
    ...(filters.dateTo   ? { dateTo:   filters.dateTo   } : {}),
  });

  const res = await fetch(`/api/document?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Erreur lors du chargement des factures.");
  }
  return res.json();
}

async function fetchFactureById(id: string): Promise<Document> {
  const res = await fetch(`/api/document/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Facture introuvable.");
  }
  return res.json();
}

// ── Hooks ──────────────────────────────────────────────────────
export function useFactures(
  page: number,
  limit: number,
  filters: FactureFilters = {},
) {
  return useQuery({
    queryKey:        factureKeys.paginated(page, limit, filters),
    queryFn:         () => fetchFactures(page, limit, filters),
    placeholderData: (prev) => prev,
  });
}

export function useFactureDetail(id: string) {
  return useQuery({
    queryKey: factureKeys.detail(id),
    queryFn:  () => fetchFactureById(id),
    enabled:  !!id,
  });
}

export function useMarkFacturePaid() {
  const qc = useQueryClient();
  return useMutation<Document, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/document/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ factureStatus: "PAID" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur lors de la mise à jour.");
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: factureKeys.all() }),
  });
}