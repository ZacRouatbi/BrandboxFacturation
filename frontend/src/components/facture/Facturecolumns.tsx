/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Document } from "@/types/document.types";
import FactureStatusBadge from "./Facturestatusbadge";
import FactureActionButtons from "./Factureactionbuttons";
import { FactureStatus } from "@/types/enums";

// ── Designations cell (same portal pattern as devis) ───────────
function DesignationsCell({ row }: { row: Document }) {
  const [open, setOpen]     = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref                 = useRef<HTMLDivElement>(null);
  const designations        = (row as any).designations ?? [];
  const count               = designations.length;

  if (count === 0) return <span className="text-neutral-400">—</span>;

  const first = designations[0];
  const rest  = count - 1;

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
    }
    setOpen(true);
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center gap-2 cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="max-w-[140px] truncate text-xs text-neutral-600 dark:text-neutral-300">
        {first.description}
      </span>
      {rest > 0 && (
        <span className="shrink-0 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          +{rest}
        </span>
      )}
      {open && typeof document !== "undefined" && createPortal(
        <div
          style={{ position: "absolute", top: coords.top, left: coords.left, zIndex: 9999 }}
          className="w-64 rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="border-b border-neutral-100 px-3 py-2 dark:border-neutral-800">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
              {count} désignation{count > 1 ? "s" : ""}
            </span>
          </div>
          <ul className="py-1">
            {designations.map((d: any, i: number) => (
              <li key={d.id} className="flex items-start justify-between gap-3 px-3 py-2 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 text-[10px] font-bold text-neutral-300 dark:text-neutral-600">{i + 1}</span>
                  <span className="truncate text-neutral-700 dark:text-neutral-200">{d.description}</span>
                </span>
                <span className="shrink-0 font-medium text-neutral-500 dark:text-neutral-400">
                  {Number(d.total).toLocaleString("fr-FR", { minimumFractionDigits: 3 })}
                </span>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

// ── Columns ────────────────────────────────────────────────────
export function getFactureColumns() {
  return [
    {
      key:    "id",
      label:  "Référence",
      render: (r: Document) => (
        <span className="font-mono text-xs text-[#FBAE17]">{r.id}</span>
      ),
    },
    {
      key:    "tierId",
      label:  "Client",
      render: (r: Document) => (
        <span className="font-medium">{(r as any).tier?.name ?? r.tierId}</span>
      ),
    },
    {
      key:    "designations",
      label:  "Désignations",
      render: (r: Document) => <DesignationsCell row={r} />,
    },
    {
      key:    "date",
      label:  "Date",
      render: (r: Document) => new Date(r.date).toLocaleDateString("fr-FR"),
    },
    {
      key:    "totalTTC",
      label:  "Total TTC",
      align:  "right" as const,
      render: (r: Document) => (
        <span className="font-medium">
          {Number(r.totalTTC).toLocaleString("fr-FR", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })}{" "}
          {r.currency}
        </span>
      ),
    },
    {
      key:    "factureStatus",
      label:  "Statut",
      align:  "right" as const,
      render: (r: Document) => (
        <FactureStatusBadge status={r.factureStatus as FactureStatus | null} />
      ),
    },
    {
      key:    "actions",
      label:  "",
      align:  "right" as const,
      render: (r: Document) => <FactureActionButtons row={r} />,
    },
  ];
}