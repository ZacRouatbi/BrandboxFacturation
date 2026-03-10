"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, RefreshCw, Pencil, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import { useConvertToFacture, useUpdateDevisStatus } from "@/hooks/useDevis";
import { Document } from "@/types/document.types";
import DevisEditModal from "./Deviseditmodal";

interface DevisActionButtonsProps {
  row: Document;
}

export default function DevisActionButtons({ row }: DevisActionButtonsProps) {
  const { dark } = useTheme();
  const router   = useRouter();

  const [editOpen,        setEditOpen]        = useState(false);
  const [convertConfirm,  setConvertConfirm]  = useState(false);
  const [cancelConfirm,   setCancelConfirm]   = useState(false);

  const { mutate: convert,      isPending: converting } = useConvertToFacture();
  const { mutate: updateStatus, isPending: cancelling } = useUpdateDevisStatus();

  const handleConvert = () =>
    convert(row.id, { onSuccess: () => setConvertConfirm(false) });

  const handleCancel = () =>
    updateStatus(
      { id: row.id, devisStatus: "CANCELLED" },
      { onSuccess: () => setCancelConfirm(false) },
    );

  const isAccepted  = row.devisStatus === "ACCEPTED";
  const isCancelled = row.devisStatus === "CANCELLED";
  const isOnHold    = row.devisStatus === "ON_HOLD";

  return (
    <>
      <div className="flex items-center justify-end gap-1">

        {/* View */}
        <button
          onClick={() => router.push(`/dashboard/devis/${row.id}`)}
          title="Voir les détails"
          className={`rounded-lg p-1.5 transition-colors ${
            dark
              ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
          }`}
        >
          <Eye size={15} />
        </button>

        {/* Edit */}
        <button
          onClick={() => setEditOpen(true)}
          disabled={isCancelled}
          title="Modifier"
          className={`rounded-lg p-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            dark
              ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
          }`}
        >
          <Pencil size={15} />
        </button>

        {/* Cancel — only shown when ON_HOLD */}
        {isOnHold && (
          <button
            onClick={() => setCancelConfirm(true)}
            disabled={cancelling}
            title="Annuler le devis"
            className={`rounded-lg p-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              dark
                ? "text-neutral-400 hover:bg-neutral-800 hover:text-red-400"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-red-500"
            }`}
          >
            <XCircle size={15} />
          </button>
        )}

        {/* Convert — hidden when cancelled */}
        {!isCancelled && (
          <button
            onClick={() => setConvertConfirm(true)}
            disabled={isAccepted || converting}
            title="Convertir en facture"
            className={`rounded-lg p-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              dark
                ? "text-neutral-400 hover:bg-neutral-800 hover:text-amber-400"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-amber-500"
            }`}
          >
            <RefreshCw size={15} />
          </button>
        )}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editOpen && (
          <DevisEditModal devis={row} onClose={() => setEditOpen(false)} />
        )}
      </AnimatePresence>

      {/* Cancel confirm */}
      <AnimatePresence>
        {cancelConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setCancelConfirm(false)}
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
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
                <XCircle size={20} className="text-red-400" />
              </div>
              <h3 className="mb-1 text-sm text-left font-semibold">Annuler le devis</h3>
              <p className={`mb-5 text-xs text-left ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                Le devis <span className="font-mono font-semibold text-[#FBAE17]">{row.id}</span> sera
                marqué comme <strong>Annulé</strong> et ne pourra plus être converti en facture.
                Cette action est irréversible.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCancelConfirm(false)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80 ${
                    dark ? "border-neutral-700 text-neutral-400" : "border-neutral-300 text-neutral-500"
                  }`}
                >
                  Retour
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {cancelling ? "Annulation…" : "Confirmer"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Convert confirm */}
      <AnimatePresence>
        {convertConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setConvertConfirm(false)}
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
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10">
                <RefreshCw size={20} className="text-amber-400" />
              </div>
              <h3 className="mb-1 text-sm text-left font-semibold">Convertir en facture</h3>
              <p className={`mb-5 text-xs text-left ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                Le devis <span className="font-mono font-semibold text-[#FBAE17]">{row.id}</span> sera
                converti en facture et son statut passera à <strong>Accepté</strong>.
                Cette action est irréversible.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConvertConfirm(false)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80 ${
                    dark ? "border-neutral-700 text-neutral-400" : "border-neutral-300 text-neutral-500"
                  }`}
                >
                  Annuler
                </button>
                <button
                  onClick={handleConvert}
                  disabled={converting}
                  className="flex-1 rounded-xl bg-[#FBAE17] py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                >
                  {converting ? "Conversion…" : "Confirmer"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}