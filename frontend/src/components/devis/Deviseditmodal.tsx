"use client";

import DateInput from "@/components/dashboard/Dateinput";

import { useState, useCallback, useEffect } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import { useQueryClient } from "@tanstack/react-query";
import { devisKeys } from "@/hooks/useDevis";
import {
  useCreateDesignation,
  useUpdateDesignation,
  useDeleteDesignation,
} from "@/hooks/useDesignation";
import { Document } from "@/types/document.types";
import { Designation } from "@/types/designation.types";

interface EditRow {
  key:         string;   // designation id (existing) or temp key (new)
  isNew:       boolean;
  description: string;
  quantity:    string;
  unitPrice:   string;
  total:       number;
  deleted:     boolean;
}

interface DevisEditModalProps {
  devis:   Document;
  onClose: () => void;
}

export default function DevisEditModal({ devis, onClose }: DevisEditModalProps) {
  const { dark } = useTheme();
  const qc = useQueryClient();

  // ── Form state ─────────────────────────────────────────────
  const [dueDate,  setDueDate]  = useState(
    devis.dueDate ? new Date(devis.dueDate).toISOString().split("T")[0] : ""
  );
  const [hasTva,   setHasTva]   = useState(Number(devis.tva) > 0);
  const [tvaRate,  setTvaRate]  = useState(
    Number(devis.tva) > 0 ? String(Number(devis.tva)) : "19"
  );
  const [rows,     setRows]     = useState<EditRow[]>(() =>
    (devis.designations ?? []).map((d) => ({
      key:         d.id,
      isNew:       false,
      description: d.description,
      quantity:    String(Number(d.quantity)),
      unitPrice:   String(Number(d.unitPrice)),
      total:       Number(d.quantity) * Number(d.unitPrice),
      deleted:     false,
    }))
  );
  const [serverError, setServerError] = useState("");
  const [isPending,   setIsPending]   = useState(false);

  const { mutate: createDesig }  = useCreateDesignation(devis.id);
  const { mutate: updateDesig }  = useUpdateDesignation(devis.id);
  const { mutate: deleteDesig }  = useDeleteDesignation(devis.id);

  // ── Row helpers ────────────────────────────────────────────
  const updateRow = useCallback((key: string, field: keyof EditRow, value: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.key !== key) return r;
        const updated = { ...r, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          const qty   = parseFloat(updated.quantity)  || 0;
          const price = parseFloat(updated.unitPrice) || 0;
          updated.total = parseFloat((qty * price).toFixed(3));
        }
        return updated;
      })
    );
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      {
        key:         `new-${Date.now()}`,
        isNew:       true,
        description: "",
        quantity:    "1",
        unitPrice:   "",
        total:       0,
        deleted:     false,
      },
    ]);
  }, []);

  const markDeleted = useCallback((key: string) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, deleted: true } : r))
    );
  }, []);

  // ── Totals preview ─────────────────────────────────────────
  const activeRows    = rows.filter((r) => !r.deleted);
  const totalHT       = activeRows.reduce((s, r) => s + r.total, 0);
  const tvaAmt        = hasTva ? totalHT * (parseFloat(tvaRate) / 100) : 0;
  const droitDeTimbre = hasTva && devis.currency === "TND" ? 1 : 0;
  const totalTTC      = totalHT + tvaAmt + droitDeTimbre;

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    setServerError("");

    if (activeRows.length === 0) {
      setServerError("Le devis doit avoir au moins une désignation.");
      return;
    }
    if (activeRows.some((r) => !r.description.trim())) {
      setServerError("Toutes les désignations doivent avoir une description.");
      return;
    }
    if (activeRows.some((r) => !r.unitPrice || parseFloat(r.unitPrice) <= 0)) {
      setServerError("Veuillez saisir un prix unitaire valide pour chaque désignation.");
      return;
    }
    if (hasTva && (!tvaRate || parseFloat(tvaRate) <= 0)) {
      setServerError("Veuillez saisir un taux de TVA valide.");
      return;
    }

    setIsPending(true);

    try {
      // 1. Update document meta (dueDate + tva)
      const docRes = await fetch(`/api/document/${devis.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dueDate: dueDate || null,
          tva:     hasTva ? parseFloat(tvaRate) : 0,
        }),
      });
      if (!docRes.ok) {
        const err = await docRes.json().catch(() => ({}));
        throw new Error(err?.message ?? "Erreur lors de la mise à jour du devis.");
      }

      // 2. Delete marked rows
      for (const r of rows.filter((r) => r.deleted && !r.isNew)) {
        await new Promise<void>((resolve, reject) =>
          deleteDesig(r.key, { onSuccess: () => resolve(), onError: (e) => reject(e) })
        );
      }

      // 3. Create new rows
      for (const r of rows.filter((r) => r.isNew && !r.deleted)) {
        await new Promise<void>((resolve, reject) =>
          createDesig(
            {
              description: r.description,
              quantity:    parseFloat(r.quantity) || 1,
              unitPrice:   parseFloat(r.unitPrice) || 0,
            },
            { onSuccess: () => resolve(), onError: (e) => reject(e) }
          )
        );
      }

      // 4. Update existing rows that changed
      const originalRows = (devis.designations ?? []) as Designation[];
      for (const r of rows.filter((r) => !r.isNew && !r.deleted)) {
        const orig = originalRows.find((o) => o.id === r.key);
        if (!orig) continue;
        const changed =
          r.description !== orig.description ||
          parseFloat(r.quantity)  !== Number(orig.quantity) ||
          parseFloat(r.unitPrice) !== Number(orig.unitPrice);
        if (!changed) continue;

        await new Promise<void>((resolve, reject) =>
          updateDesig(
            {
              id:          r.key,
              description: r.description,
              quantity:    parseFloat(r.quantity),
              unitPrice:   parseFloat(r.unitPrice),
            },
            { onSuccess: () => resolve(), onError: (e) => reject(e) }
          )
        );
      }

      qc.invalidateQueries({ queryKey: devisKeys.all() });
      qc.invalidateQueries({ queryKey: devisKeys.detail(devis.id) });
      onClose();
    } catch (e) {
      setServerError((e as Error).message ?? "Une erreur est survenue.");
    } finally {
      setIsPending(false);
    }
  };

  // ── Styles ─────────────────────────────────────────────────
  const inputClass = `w-full rounded-xl border bg-transparent px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-[#FBAE17] transition-colors ${
    dark
      ? "border-neutral-700 placeholder-neutral-600 text-white"
      : "border-neutral-300 placeholder-neutral-400 text-black"
  }`;

  const labelClass = `mb-1.5 block text-xs font-medium uppercase tracking-widest ${
    dark ? "text-neutral-500" : "text-neutral-400"
  }`;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0,   scale: 0.96, y: 12  }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={`fixed inset-0 m-auto z-[70] flex h-fit max-h-[90vh] w-full max-w-2xl flex-col
          overflow-hidden rounded-2xl border shadow-2xl ${
          dark ? "border-neutral-800 bg-neutral-900" : "border-amber-100 bg-white"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-6 py-4 ${
          dark ? "border-neutral-800" : "border-amber-100"
        }`}>
          <div>
            <p className={`text-xs font-medium uppercase tracking-widest ${
              dark ? "text-neutral-500" : "text-neutral-400"
            }`}>Modifier le devis</p>
            <h3 className="mt-0.5 font-mono text-base font-bold text-[#FBAE17]">{devis.id}</h3>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full p-1.5 transition hover:scale-105 ${
              dark
                ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* Due date + TVA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Échéance</label>
              <DateInput
                value={dueDate}
                onChange={setDueDate}
                className={`${inputClass} [color-scheme:${dark ? "dark" : "light"}]`}
              />
            </div>

            <div>
              <p className={`mb-1.5 text-xs font-medium uppercase tracking-widest ${dark ? "text-neutral-500" : "text-neutral-400"}`}>TVA</p>
              <div className="flex items-center gap-3">
              <span className={labelClass + " mb-0"}>TVA</span>
              <button
                type="button"
                onClick={() => setHasTva((p) => !p)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  hasTva ? "bg-[#FBAE17]" : dark ? "bg-neutral-700" : "bg-neutral-300"
                }`}
              >
                <span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                  hasTva ? "translate-x-4" : "translate-x-0.5"
                }`} />
              </button>
              <span className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                {hasTva ? "Oui" : "Non"}
              </span>
                <AnimatePresence>
                  {hasTva && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center gap-2 overflow-hidden"
                    >
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={tvaRate}
                        onChange={(e) => setTvaRate(e.target.value)}
                        className={`w-16 rounded-xl border bg-transparent px-2 py-1 text-sm
                          focus:outline-none focus:ring-2 focus:ring-[#FBAE17] ${
                          dark ? "border-neutral-700 text-white" : "border-neutral-300 text-black"
                        }`}
                      />
                      <span className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>%</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Designations */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className={labelClass + " mb-0"}>
                Désignations <span className="text-[#FBAE17]">*</span>
              </label>
              <button
                onClick={addRow}
                className="flex items-center gap-1.5 rounded-xl bg-[#FBAE17]/10 px-3 py-1.5 text-xs font-semibold text-[#FBAE17] transition hover:bg-[#FBAE17]/20"
              >
                <Plus size={13} />
                Ajouter
              </button>
            </div>

            {/* Column headers */}
            <div className={`mb-1 grid grid-cols-12 gap-2 px-1 text-xs font-medium uppercase tracking-widest ${
              dark ? "text-neutral-600" : "text-neutral-400"
            }`}>
              <span className="col-span-5">Description</span>
              <span className="col-span-2 text-right">Qté</span>
              <span className="col-span-2 text-right">Prix HT</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-1" />
            </div>

            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {rows.filter((r) => !r.deleted).map((row) => (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-12 gap-2"
                  >
                    <input
                      className={`${inputClass} col-span-5`}
                      placeholder="Description"
                      value={row.description}
                      onChange={(e) => updateRow(row.key, "description", e.target.value)}
                    />
                    <input
                      className={`${inputClass} col-span-2 text-right`}
                      type="number"
                      min="0"
                      placeholder="1"
                      value={row.quantity}
                      onChange={(e) => updateRow(row.key, "quantity", e.target.value)}
                    />
                    <input
                      className={`${inputClass} col-span-2 text-right`}
                      type="number"
                      min="0"
                      placeholder="0.000"
                      value={row.unitPrice}
                      onChange={(e) => updateRow(row.key, "unitPrice", e.target.value)}
                    />
                    <div className={`col-span-2 flex items-center justify-end rounded-xl border px-3 text-sm font-medium ${
                      dark ? "border-neutral-700 text-neutral-300" : "border-neutral-200 text-neutral-600"
                    }`}>
                      {row.total.toFixed(3)}
                    </div>
                    <button
                      onClick={() => markDeleted(row.key)}
                      disabled={activeRows.length === 1}
                      title="Supprimer"
                      className={`col-span-1 flex items-center justify-center rounded-xl transition disabled:opacity-30 ${
                        dark ? "text-neutral-600 hover:text-red-400" : "text-neutral-300 hover:text-red-400"
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Totals summary */}
          <div className={`rounded-xl border p-4 space-y-2 ${
            dark ? "border-neutral-800 bg-neutral-800/30" : "border-amber-100 bg-amber-50/40"
          }`}>
            <div className="flex justify-between text-xs">
              <span className={dark ? "text-neutral-500" : "text-neutral-400"}>Total HT</span>
              <span className="font-medium">
                {totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {devis.currency}
              </span>
            </div>
            {hasTva && (
              <div className="flex justify-between text-xs">
                <span className={dark ? "text-neutral-500" : "text-neutral-400"}>TVA ({tvaRate}%)</span>
                <span className="font-medium">
                  {tvaAmt.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {devis.currency}
                </span>
              </div>
            )}
            {droitDeTimbre > 0 && (
              <div className="flex justify-between text-xs">
                <span className={dark ? "text-neutral-500" : "text-neutral-400"}>Droit de timbre</span>
                <span className="font-medium">1.000 TND</span>
              </div>
            )}
            <div className={`flex justify-between border-t pt-2 text-sm font-semibold ${
              dark ? "border-neutral-700" : "border-amber-100"
            }`}>
              <span>Total TTC</span>
              <span className="text-[#FBAE17]">
                {totalTTC.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {devis.currency}
              </span>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {serverError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
              >
                {serverError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 border-t px-6 py-4 ${
          dark ? "border-neutral-800" : "border-amber-100"
        }`}>
          <button
            onClick={onClose}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80 ${
              dark ? "border-neutral-700 text-neutral-400" : "border-neutral-300 text-neutral-500"
            }`}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FBAE17] py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            <Save size={14} />
            {isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </motion.div>
    </>
  );
}