"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { motion } from "framer-motion";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  onAdd?: () => void;
  addLabel?: string;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function DataTable<T extends { id: string | number }>({
  title,
  subtitle,
  columns,
  data,
  onAdd,
  addLabel = "Nouveau",
  searchPlaceholder = "Rechercher...",
  searchKeys = [],
  searchValue,
  onSearchChange,
  isLoading = false,
  isError = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: DataTableProps<T>) {
  const { dark } = useTheme();
  const [internalQuery, setInternalQuery] = useState("");

  const isControlled = searchValue !== undefined && onSearchChange !== undefined;
  const query        = isControlled ? searchValue : internalQuery;
  const setQuery     = isControlled ? onSearchChange : setInternalQuery;

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    if (isControlled) return data;
    return data.filter((row) =>
      searchKeys.some((key) =>
        String(row[key]).toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, data, searchKeys, isControlled]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [page, totalPages]);

  const btnBase = "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors";

  // Separate action column from data columns
  const actionCol = columns.find((c) => c.key === "actions");
  const dataCols  = columns.filter((c) => c.key !== "actions");

  const getCellValue = (row: T, col: Column<T>): ReactNode =>
    col.render
      ? col.render(row)
      : String((row as Record<string, unknown>)[String(col.key)] ?? "—");

  const emptyState = (msg: string) => (
    <p className={`py-10 text-center text-sm ${dark ? "text-neutral-600" : "text-neutral-400"}`}>{msg}</p>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border ${
        dark ? "border-neutral-800 bg-neutral-900/70" : "border-amber-100 bg-white/70 shadow-sm"
      }`}
    >
      {/* ── Header ── */}
      <div className={`flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 ${
        dark ? "border-neutral-800" : "border-amber-100"
      }`}>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-neutral-500" : "text-neutral-400"}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={`w-full rounded-xl border py-2 pl-8 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#FBAE17] sm:w-48 ${
                dark ? "border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500" : "border-neutral-200 bg-white text-black placeholder-neutral-400"
              }`}
            />
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FBAE17] px-3 py-2 text-xs font-semibold text-black transition hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">{addLabel}</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile card list (below md) ── */}
      <div className="md:hidden">
        {isLoading && emptyState("Chargement…")}
        {isError   && <p className="py-10 text-center text-sm text-red-400">Erreur lors du chargement.</p>}
        {!isLoading && !isError && filtered.length === 0 && emptyState("Aucun résultat trouvé.")}
        {!isLoading && !isError && filtered.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`border-t px-4 py-3 ${dark ? "border-neutral-800/60" : "border-amber-50"}`}
          >
            {/* Data fields */}
            <div className="flex flex-col gap-1.5">
              {dataCols.map((col) => (
                <div key={String(col.key)} className="flex items-start justify-between gap-4">
                  <span className={`shrink-0 text-xs font-medium uppercase tracking-wider ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                    {col.label}
                  </span>
                  <span className={`text-right text-xs ${dark ? "text-neutral-300" : "text-neutral-700"}`}>
                    {getCellValue(row, col)}
                  </span>
                </div>
              ))}
            </div>
            {/* Action buttons */}
            {actionCol && (
              <div className="mt-3 flex justify-end">
                {actionCol.render ? actionCol.render(row) : null}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-xs uppercase tracking-widest ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
              {columns.map((col) => (
                <th key={String(col.key)} className={`px-5 py-3 font-medium text-${col.align ?? "left"}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={columns.length} className={`px-5 py-10 text-center text-sm ${dark ? "text-neutral-600" : "text-neutral-400"}`}>Chargement…</td></tr>
            ) : isError ? (
              <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-red-400">Erreur lors du chargement.</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={columns.length} className={`px-5 py-10 text-center text-sm ${dark ? "text-neutral-600" : "text-neutral-400"}`}>Aucun résultat trouvé.</td></tr>
            ) : filtered.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`border-t transition-colors ${
                  dark ? "border-neutral-800/60 hover:bg-neutral-800/40" : "border-amber-50 hover:bg-amber-50/50"
                }`}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={`px-5 py-3.5 text-${col.align ?? "left"} ${dark ? "text-neutral-300" : "text-neutral-600"}`}>
                    {getCellValue(row, col)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className={`flex items-center justify-between border-t px-4 py-3 sm:px-5 ${dark ? "border-neutral-800" : "border-amber-50"}`}>
        <span className={`text-xs ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
          {isLoading ? "…" : `Page ${page} / ${totalPages}`}
        </span>

        {totalPages > 1 && onPageChange && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || isLoading}
              className={`${btnBase} ${dark ? "text-neutral-400 hover:bg-neutral-800 disabled:opacity-30" : "text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"}`}
            >
              <ChevronLeft size={14} />
            </button>

            {/* Full pagination on sm+ */}
            <div className="hidden sm:flex items-center gap-1">
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className={`flex h-8 w-6 items-center justify-center text-xs ${dark ? "text-neutral-600" : "text-neutral-400"}`}>…</span>
                ) : (
                  <button key={p} onClick={() => onPageChange(p as number)} disabled={isLoading}
                    className={`${btnBase} ${p === page ? "bg-[#FBAE17] text-black" : dark ? "text-neutral-400 hover:bg-neutral-800" : "text-neutral-500 hover:bg-neutral-100"}`}>
                    {p}
                  </button>
                )
              )}
            </div>

            {/* Current page only on mobile */}
            <span className="sm:hidden flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-[#FBAE17] px-2 text-xs font-medium text-black">
              {page}
            </span>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || isLoading}
              className={`${btnBase} ${dark ? "text-neutral-400 hover:bg-neutral-800 disabled:opacity-30" : "text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"}`}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}