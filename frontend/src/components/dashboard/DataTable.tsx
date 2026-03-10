"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { motion } from "framer-motion";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
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
  page?:       number;
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

  // Controlled mode: parent drives search value + pre-filters data.
  // Uncontrolled mode: internal state + searchKeys filtering.
  const isControlled = searchValue !== undefined && onSearchChange !== undefined;
  const query        = isControlled ? searchValue : internalQuery;
  const setQuery     = isControlled ? onSearchChange : setInternalQuery;

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    if (isControlled) return data; // parent already pre-filtered
    return data.filter((row) =>
      searchKeys.some((key) =>
        String(row[key]).toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, data, searchKeys, isControlled]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [page, totalPages]);

  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={columns.length} className={`px-5 py-10 text-center text-sm ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
            Chargement…
          </td>
        </tr>
      );
    }
    if (isError) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-red-400">
            Erreur lors du chargement.
          </td>
        </tr>
      );
    }
    if (filtered.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className={`px-5 py-10 text-center text-sm ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
            Aucun résultat trouvé.
          </td>
        </tr>
      );
    }
    return filtered.map((row, i) => (
      <motion.tr
        key={row.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.03 }}
        className={`border-t transition-colors ${
          dark
            ? "border-neutral-800/60 hover:bg-neutral-800/40"
            : "border-amber-50 hover:bg-amber-50/50"
        }`}
      >
        {columns.map((col) => (
          <td
            key={String(col.key)}
            className={`px-5 py-3.5 text-${col.align ?? "left"} ${
              dark ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            {col.render
              ? col.render(row)
              : String((row as Record<string, unknown>)[String(col.key)] ?? "—")}
          </td>
        ))}
      </motion.tr>
    ));
  };

  const btnBase = `flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border ${
        dark
          ? "border-neutral-800 bg-neutral-900/70"
          : "border-amber-100 bg-white/70 shadow-sm"
      }`}
    >
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 ${
        dark ? "border-neutral-800" : "border-amber-100"
      }`}>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && (
            <p className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-neutral-500" : "text-neutral-400"}`}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={`rounded-xl border py-2 pl-8 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#FBAE17] ${
                dark
                  ? "border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500"
                  : "border-neutral-200 bg-white text-black placeholder-neutral-400"
              }`}
            />
          </div>

          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 rounded-xl bg-[#FBAE17] px-3 py-2 text-xs font-semibold text-black transition hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={14} />
              {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-xs uppercase tracking-widest ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-5 py-3 font-medium text-${col.align ?? "left"}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </div>

      {/* Footer — pagination */}
      <div className={`flex items-center justify-between border-t px-5 py-3 ${
        dark ? "border-neutral-800" : "border-amber-50"
      }`}>
        <span className={`text-xs ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
          {isLoading ? "…" : `Page ${page} sur ${totalPages}`}
        </span>

        {totalPages > 1 && onPageChange && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || isLoading}
              className={`${btnBase} ${
                dark
                  ? "text-neutral-400 hover:bg-neutral-800 disabled:opacity-30"
                  : "text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
              }`}
            >
              <ChevronLeft size={14} />
            </button>

            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className={`flex h-8 w-6 items-center justify-center text-xs ${
                    dark ? "text-neutral-600" : "text-neutral-400"
                  }`}
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p as number)}
                  disabled={isLoading}
                  className={`${btnBase} ${
                    p === page
                      ? "bg-[#FBAE17] text-black"
                      : dark
                      ? "text-neutral-400 hover:bg-neutral-800"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || isLoading}
              className={`${btnBase} ${
                dark
                  ? "text-neutral-400 hover:bg-neutral-800 disabled:opacity-30"
                  : "text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
              }`}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}