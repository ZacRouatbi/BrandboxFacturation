/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import DateInput from "@/components/dashboard/Dateinput";
import { useTheme } from "@/providers/ThemeProvider";
import Topbar from "@/components/dashboard/Topbar";
import DataTable from "@/components/dashboard/DataTable";
import { getFactureColumns } from "@/components/facture/Facturecolumns";
import { useFactures, FactureFilters } from "@/hooks/useFacture";

const PAGE_SIZE = 10;

export default function FacturesPage() {
  const { dark } = useTheme();

  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState<FactureFilters>({});
  const [search,  setSearch]  = useState("");

  const { data, isLoading, isError, isFetching } = useFactures(page, PAGE_SIZE, filters);

  const allFactures = data?.data       ?? [];
  const totalPages  = data?.totalPages ?? 1;
  const total       = data?.total      ?? 0;

  const filtered = useMemo(() => {
    if (!search.trim()) return allFactures;
    const q = search.toLowerCase();
    return allFactures.filter(
      (f) =>
        f.id.toLowerCase().includes(q) ||
        ((f as any).tier?.name ?? "").toLowerCase().includes(q),
    );
  }, [allFactures, search]);

  const columns = useMemo(() => getFactureColumns(), []);

  useEffect(() => {
    if (!isLoading && !isFetching && page > totalPages && totalPages > 0) {
      setTimeout(() => setPage(totalPages), 0);
    }
  }, [isLoading, isFetching, page, totalPages]);

  const dateInputClass = `rounded-xl border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FBAE17] ${
    dark ? "border-neutral-700 bg-neutral-800 text-white [color-scheme:dark]" : "border-neutral-200 bg-white text-black [color-scheme:light]"
  }`;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Factures" />

      <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 space-y-4">

        {/* Date filter */}
        <div className={`rounded-2xl border px-4 py-4 sm:px-5 ${
          dark ? "border-neutral-800 bg-neutral-900/70" : "border-amber-100 bg-white/70 shadow-sm"
        }`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <div>
              <p className={`mb-1.5 text-xs font-medium uppercase tracking-widest ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                Date de facturation
              </p>
              <div className="flex items-center gap-2">
                <DateInput value={filters.dateFrom ?? ""} onChange={(v) => { setFilters((f) => ({ ...f, dateFrom: v || undefined })); setPage(1); }} className={dateInputClass} />
                <span className={`text-xs ${dark ? "text-neutral-600" : "text-neutral-400"}`}>→</span>
                <DateInput value={filters.dateTo ?? ""} onChange={(v) => { setFilters((f) => ({ ...f, dateTo: v || undefined })); setPage(1); }} className={dateInputClass} />
              </div>
            </div>

            {(filters.dateFrom || filters.dateTo) && (
              <button
                onClick={() => { setFilters({}); setPage(1); }}
                className={`self-start rounded-xl border px-3 py-2 text-xs font-medium transition hover:opacity-80 sm:self-end ${
                  dark ? "border-neutral-700 text-neutral-400" : "border-neutral-300 text-neutral-500"
                }`}
              >
                Effacer les filtres
              </button>
            )}
          </div>
        </div>

        <DataTable
          title="Liste des factures"
          subtitle={`${total} facture${total !== 1 ? "s" : ""} enregistrée${total !== 1 ? "s" : ""}`}
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isError={isError}
          searchPlaceholder="Rechercher par référence ou client…"
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}