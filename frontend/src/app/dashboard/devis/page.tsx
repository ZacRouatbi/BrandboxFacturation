/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DateInput from "@/components/dashboard/Dateinput";

import { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Topbar from "@/components/dashboard/Topbar";
import DataTable from "@/components/dashboard/DataTable";
import DevisAddModal from "@/components/devis/Devisaddmodal";
import { getDevisColumns } from "@/components/devis/Deviscolumns";
import { useDevis, DevisFilters } from "@/hooks/useDevis";
import { useTheme } from "@/providers/ThemeProvider";

const PAGE_SIZE = 10;

export default function DevisPage() {
  const { dark } = useTheme();

  const [page,    setPage]    = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [filters, setFilters] = useState<DevisFilters>({});
  const [search,  setSearch]  = useState("");

  const { data, isLoading, isError, isFetching } = useDevis(page, PAGE_SIZE, filters);

  const allDevis   = data?.data       ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total      = data?.total      ?? 0;

  // Client-side search on current page by id or tier name
  const filtered = useMemo(() => {
    if (!search.trim()) return allDevis;
    const q = search.toLowerCase();
    return allDevis.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        ((d as any).tier?.name ?? "").toLowerCase().includes(q),
    );
  }, [allDevis, search]);

  const columns = useMemo(() => getDevisColumns(), []);

  // Snap back if page exceeds totalPages
  useEffect(() => {
    if (!isLoading && !isFetching && page > totalPages && totalPages > 0) {
      setTimeout(() => setPage(totalPages), 0);
    }
  }, [isLoading, isFetching, page, totalPages]);

  const handleCloseAdd = useCallback(() => {
    setAddOpen(false);
    setPage(Math.ceil((total + 1) / PAGE_SIZE));
  }, [total]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Devis" />

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

        {/* Date filters */}
        <div className={`flex flex-wrap items-end gap-4 rounded-2xl border px-5 py-4 ${
          dark ? "border-neutral-800 bg-neutral-900/70" : "border-amber-100 bg-white/70 shadow-sm"
        }`}>
          <div>
            <p className={`mb-1.5 text-xs font-medium uppercase tracking-widest ${
              dark ? "text-neutral-500" : "text-neutral-400"
            }`}>Date de création</p>
            <div className="flex items-center gap-2">
              <DateInput
                value={filters.dateFrom ?? ""}
                onChange={(v) => { setFilters((f) => ({ ...f, dateFrom: v || undefined })); setPage(1); }}
                className={`rounded-xl border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FBAE17] [color-scheme:${dark ? "dark" : "light"}] ${
                  dark ? "border-neutral-700 bg-neutral-800 text-white" : "border-neutral-200 bg-white text-black"
                }`}
              />
              <span className={`text-xs ${dark ? "text-neutral-600" : "text-neutral-400"}`}>→</span>
              <DateInput
                value={filters.dateTo ?? ""}
                onChange={(v) => { setFilters((f) => ({ ...f, dateTo: v || undefined })); setPage(1); }}
                className={`rounded-xl border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FBAE17] [color-scheme:${dark ? "dark" : "light"}] ${
                  dark ? "border-neutral-700 bg-neutral-800 text-white" : "border-neutral-200 bg-white text-black"
                }`}
              />
            </div>
          </div>

          <div>
            <p className={`mb-1.5 text-xs font-medium uppercase tracking-widest ${
              dark ? "text-neutral-500" : "text-neutral-400"
            }`}>Échéance</p>
            <div className="flex items-center gap-2">
              <DateInput
                value={filters.dueDateFrom ?? ""}
                onChange={(v) => { setFilters((f) => ({ ...f, dueDateFrom: v || undefined })); setPage(1); }}
                className={`rounded-xl border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FBAE17] [color-scheme:${dark ? "dark" : "light"}] ${
                  dark ? "border-neutral-700 bg-neutral-800 text-white" : "border-neutral-200 bg-white text-black"
                }`}
              />
              <span className={`text-xs ${dark ? "text-neutral-600" : "text-neutral-400"}`}>→</span>
              <DateInput
                value={filters.dueDateTo ?? ""}
                onChange={(v) => { setFilters((f) => ({ ...f, dueDateTo: v || undefined })); setPage(1); }}
                className={`rounded-xl border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FBAE17] [color-scheme:${dark ? "dark" : "light"}] ${
                  dark ? "border-neutral-700 bg-neutral-800 text-white" : "border-neutral-200 bg-white text-black"
                }`}
              />
            </div>
          </div>

          {(filters.dateFrom || filters.dateTo || filters.dueDateFrom || filters.dueDateTo) && (
            <button
              onClick={() => { setFilters({}); setPage(1); }}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition hover:opacity-80 ${
                dark ? "border-neutral-700 text-neutral-400" : "border-neutral-300 text-neutral-500"
              }`}
            >
              Effacer les filtres
            </button>
          )}
        </div>

        {/* Table */}
        <DataTable
          title="Liste des devis"
          subtitle={`${total} devis enregistrés`}
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isError={isError}
          addLabel="Nouveau devis"
          onAdd={() => setAddOpen(true)}
          searchPlaceholder="Rechercher par référence ou client…"
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>

      <AnimatePresence>
        {addOpen && <DevisAddModal onClose={handleCloseAdd} />}
      </AnimatePresence>
    </div>
  );
}