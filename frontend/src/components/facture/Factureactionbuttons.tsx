"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import { useMarkFacturePaid } from "@/hooks/useFacture";
import { Document } from "@/types/document.types";

interface Props {
  row: Document;
}

export default function FactureActionButtons({ row }: Props) {
  const { dark }  = useTheme();
  const router    = useRouter();
  const [paidConfirm, setPaidConfirm] = useState(false);

  const { mutate: markPaid, isPending } = useMarkFacturePaid();

  const handlePaid = () =>
    markPaid(row.id, { onSuccess: () => setPaidConfirm(false) });

  const isNotPaid = row.factureStatus === "NOT_PAID";

  return (
    <>
      <div className="flex items-center justify-end gap-1">

        {/* View — always available */}
        <button
          onClick={() => router.push(`/dashboard/facture/${row.id}`)}
          title="Voir les détails"
          className={`rounded-lg p-1.5 transition-colors ${
            dark
              ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
          }`}
        >
          <Eye size={15} />
        </button>

        {/* Mark paid — only when NOT_PAID */}
        {isNotPaid && (
          <button
            onClick={() => setPaidConfirm(true)}
            disabled={isPending}
            title="Marquer comme payée"
            className={`rounded-lg p-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              dark
                ? "text-neutral-400 hover:bg-neutral-800 hover:text-emerald-400"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-emerald-500"
            }`}
          >
            <CheckCircle size={15} />
          </button>
        )}
      </div>

      {/* Paid confirm dialog */}
      <AnimatePresence>
        {paidConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setPaidConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{ opacity: 0,   scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`fixed inset-0 m-auto z-[60] h-fit w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
                dark ? "border-neutral-800 bg-neutral-900" : "border-amber-100 bg-white"
              }`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
              <h3 className="mb-1 text-sm text-left font-semibold">Confirmer le paiement</h3>
              <p className={`mb-5 text-xs text-left ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                La facture <span className="font-mono font-semibold text-[#FBAE17]">{row.id}</span> sera
                marquée comme <strong>Payée</strong>. Cette action est irréversible.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaidConfirm(false)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80 ${
                    dark ? "border-neutral-700 text-neutral-400" : "border-neutral-300 text-neutral-500"
                  }`}
                >
                  Annuler
                </button>
                <button
                  onClick={handlePaid}
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {isPending ? "Confirmation…" : "Confirmer"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}