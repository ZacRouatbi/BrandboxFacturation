"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { useState, ReactNode } from "react";

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
}: DataTableProps<T>) {
  const { dark } = useTheme();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? data.filter((row) =>
        searchKeys.some((key) =>
          String(row[key]).toLowerCase().includes(query.toLowerCase())
        )
      )
    : data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border ${
        dark
          ? "border-neutral-800 bg-neutral-900/70 backdrop-blur-xl"
          : "border-amber-100 bg-white/70 backdrop-blur-xl shadow-sm"
      }`}
    >
      {/* Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 ${
          dark ? "border-neutral-800" : "border-amber-100"
        }`}
      >
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && (
            <p className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
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

          {/* Add button */}
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
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`px-5 py-10 text-center text-sm ${dark ? "text-neutral-600" : "text-neutral-400"}`}
                >
                  Aucun résultat trouvé.
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div
        className={`border-t px-5 py-3 text-xs ${
          dark ? "border-neutral-800 text-neutral-600" : "border-amber-50 text-neutral-400"
        }`}
      >
        {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
      </div>
    </motion.div>
  );
}