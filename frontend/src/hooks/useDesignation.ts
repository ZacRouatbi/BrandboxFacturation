import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Designation } from "@/types/designation.types";
import { devisKeys } from "./useDevis";

// ── Hooks ──────────────────────────────────────────────────────

/** Add a single designation to an existing document */
export function useCreateDesignation(documentId: string) {
  const qc = useQueryClient();
  return useMutation<
    Designation,
    Error,
    { description: string; quantity: number; unitPrice: number }
  >({
    mutationFn: async (dto) => {
      const res = await fetch("/api/designation", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...dto, documentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur lors de l'ajout de la désignation.");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: devisKeys.all() });
      qc.invalidateQueries({ queryKey: devisKeys.detail(documentId) });
    },
  });
}

/** Update an existing designation */
export function useUpdateDesignation(documentId: string) {
  const qc = useQueryClient();
  return useMutation<
    Designation,
    Error,
    { id: string; description?: string; quantity?: number; unitPrice?: number }
  >({
    mutationFn: async ({ id, ...dto }) => {
      const res = await fetch(`/api/designation/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(dto),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur lors de la mise à jour.");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: devisKeys.all() });
      qc.invalidateQueries({ queryKey: devisKeys.detail(documentId) });
    },
  });
}

/** Delete a designation */
export function useDeleteDesignation(documentId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/designation/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Erreur lors de la suppression.");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: devisKeys.all() });
      qc.invalidateQueries({ queryKey: devisKeys.detail(documentId) });
    },
  });
}