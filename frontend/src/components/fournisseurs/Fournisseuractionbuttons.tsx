"use client";

import { useState } from "react";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import { Tier } from "@/types/tier.types";
import { useDeleteTier } from "@/hooks/useTier";

interface FournisseurActionButtonsProps {
  row:    Tier;
  onEdit: (row: Tier) => void;
}

function ConfirmDialog({
  name,
  onConfirm,
  onCancel,
  isPending,
}: {
  name:      string;
  onConfirm: () => void;
  onCancel:  () => void;
  isPending: boolean;
}) {
  const { dark } = useTheme();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onCancel}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      />

      {/* Dialog */}
      <motion.div
        key="dialog"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{ opacity: 0,   scale: 0.95, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`fixed left-[calc(30%)] top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2
          rounded-2xl border p-6 shadow-2xl text-left ${
          dark
            ? "border-neutral-800 bg-neutral-900"
            : "border-amber-100 bg-white"
        }`}
      >
        {/* Icon */}
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle size={20} className="text-red-400" />
        </div>

        {/* Text */}
        <h3 className="mb-1 text-sm font-semibold">Supprimer ce Fournisseur ?</h3>
        <p className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
          <span className="font-medium">{name}</span> sera supprimé définitivement.
          Cette action est irréversible.
        </p>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            disabled={isPending}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80 disabled:opacity-50 ${
              dark
                ? "border-neutral-700 text-neutral-400"
                : "border-neutral-300 text-neutral-500"
            }`}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default function FournisseurActionButtons({ row, onEdit }: FournisseurActionButtonsProps) {
  const { dark } = useTheme();
  const { mutate: deleteTier, isPending } = useDeleteTier();
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    deleteTier(row.id, {
      onSuccess: () => setConfirming(false),
      onError:   () => setConfirming(false),
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => onEdit(row)}
          title="Modifier"
          className={`rounded-lg p-1.5 transition-colors duration-150 ${
            dark
              ? "text-neutral-400 hover:bg-neutral-700 hover:text-[#FBAE17]"
              : "text-neutral-400 hover:bg-amber-50 hover:text-[#FBAE17]"
          }`}
        >
          <Pencil size={15} />
        </button>

        <button
          onClick={() => setConfirming(true)}
          title="Supprimer"
          className={`rounded-lg p-1.5 transition-colors duration-150 ${
            dark
              ? "text-neutral-400 hover:bg-red-500/10 hover:text-red-400"
              : "text-neutral-400 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <AnimatePresence>
        {confirming && (
          <ConfirmDialog
            name={row.name}
            onConfirm={handleConfirm}
            onCancel={() => setConfirming(false)}
            isPending={isPending}
          />
        )}
      </AnimatePresence>
    </>
  );
}