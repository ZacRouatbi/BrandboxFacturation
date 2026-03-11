/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DateInput from "@/components/dashboard/Dateinput";
import { useState, useCallback } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import { useCreateDevis } from "@/hooks/useDevis";
import { useClients } from "@/hooks/useTier";
import { DocumentType, Currency } from "@/types/enums";

interface DesignationRow {
  key:         number;
  description: string;
  quantity:    string;
  unitPrice:   string;
  total:       number;
}

interface DevisAddModalProps { onClose: () => void; }

const CURRENCIES: Currency[] = ["TND", "EUR", "USD"];

export default function DevisAddModal({ onClose }: DevisAddModalProps) {
  const { dark } = useTheme();

  const [tierId,      setTierId]      = useState("");
  const [currency,    setCurrency]    = useState<Currency>("TND");
  const [dueDate,     setDueDate]     = useState("");
  const [hasTva,      setHasTva]      = useState(false);
  const [tvaRate,     setTvaRate]     = useState("19");
  const [rows,        setRows]        = useState<DesignationRow[]>([
    { key: 0, description: "", quantity: "1", unitPrice: "", total: 0 },
  ]);
  const [serverError, setServerError] = useState("");

  const { data: clientsData } = useClients(1, 200);
  const clients = clientsData?.data ?? [];
  const { mutate: createDevis, isPending } = useCreateDevis();

  const updateRow = useCallback((key: number, field: keyof DesignationRow, value: string) => {
    setRows((prev) => prev.map((r) => {
      if (r.key !== key) return r;
      const updated = { ...r, [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        updated.total = parseFloat((( parseFloat(updated.quantity) || 0) * (parseFloat(updated.unitPrice) || 0)).toFixed(3));
      }
      return updated;
    }));
  }, []);

  const addRow    = useCallback(() => setRows((p) => [...p, { key: Date.now(), description: "", quantity: "1", unitPrice: "", total: 0 }]), []);
  const removeRow = useCallback((key: number) => setRows((p) => p.filter((r) => r.key !== key)), []);

  const totalHT       = rows.reduce((s, r) => s + r.total, 0);
  const tvaAmt        = hasTva ? totalHT * (parseFloat(tvaRate) / 100) : 0;
  const droitDeTimbre = hasTva && currency === "TND" ? 1 : 0;
  const totalTTC      = totalHT + tvaAmt + droitDeTimbre;

  const handleSubmit = () => {
    setServerError("");
    if (!tierId)                                                              { setServerError("Veuillez sélectionner un client."); return; }
    if (rows.some((r) => !r.description.trim()))                             { setServerError("Toutes les désignations doivent avoir une description."); return; }
    if (rows.some((r) => !r.unitPrice || parseFloat(r.unitPrice) <= 0))     { setServerError("Veuillez saisir un prix unitaire valide pour chaque désignation."); return; }
    if (hasTva && (!tvaRate || parseFloat(tvaRate) <= 0))                   { setServerError("Veuillez saisir un taux de TVA valide."); return; }

    createDevis(
      {
        type: DocumentType.DEVIS, tierId, currency,
        tva: hasTva ? parseFloat(tvaRate) : 0, hasTva,
        dueDate: dueDate || undefined,
        designations: rows.map((r) => ({
          description: r.description,
          quantity:    parseFloat(r.quantity) || 1,
          unitPrice:   parseFloat(r.unitPrice) || 0,
          total:       r.total,
        })),
      } as any,
      { onSuccess: () => onClose(), onError: (err) => setServerError(err.message) }
    );
  };

  const inputClass  = `w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FBAE17] transition-colors ${dark ? "border-neutral-700 placeholder-neutral-600 text-white" : "border-neutral-300 placeholder-neutral-400 text-black"}`;
  const selectClass = `w-full appearance-none rounded-xl border bg-transparent px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#FBAE17] transition-colors ${dark ? "border-neutral-700 text-white" : "border-neutral-300 text-black"}`;
  const labelClass  = `mb-1.5 block text-xs font-medium uppercase tracking-widest ${dark ? "text-neutral-500" : "text-neutral-400"}`;
  const chevron     = `pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-neutral-500" : "text-neutral-400"}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }} onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      />
        <motion.div
  initial={{ opacity: 0, scale: 0.96, y: 12 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.96, y: 12 }}
  transition={{ type: "spring", stiffness: 380, damping: 32 }}
  className={`fixed inset-x-2 bottom-2 top-2 z-[70] mx-auto flex max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[90vh] sm:w-full ${
    dark ? "border-neutral-800 bg-neutral-900" : "border-amber-100 bg-white"
  }`}
>
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-4 py-4 sm:px-6 ${dark ? "border-neutral-800" : "border-amber-100"}`}>
          <div>
            <p className={`text-xs font-medium uppercase tracking-widest ${dark ? "text-neutral-500" : "text-neutral-400"}`}>Nouveau devis</p>
            <h3 className="mt-0.5 text-base font-semibold">Créer un devis</h3>
          </div>
          <button onClick={onClose} className={`rounded-full p-1.5 transition hover:scale-105 ${dark ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-400 hover:bg-neutral-100 hover:text-black"}`}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 sm:px-6 sm:py-6 sm:space-y-6">

          {/* Client + Currency + Échéance — stack on mobile */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Client <span className="text-[#FBAE17]">*</span></label>
              <div className="relative">
                <select value={tierId} onChange={(e) => setTierId(e.target.value)} className={selectClass}>
                  <option value="" disabled className={dark ? "bg-neutral-900" : "bg-white"}>Sélectionner…</option>
                  {clients.map((c) => <option key={c.id} value={c.id} className={dark ? "bg-neutral-900" : "bg-white"}>{c.name}</option>)}
                </select>
                <ChevronDown size={14} className={chevron} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Devise</label>
              <div className="relative">
                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={selectClass}>
                  {CURRENCIES.map((c) => <option key={c} value={c} className={dark ? "bg-neutral-900" : "bg-white"}>{c}</option>)}
                </select>
                <ChevronDown size={14} className={chevron} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Échéance</label>
              <DateInput value={dueDate} onChange={setDueDate} className={`${inputClass} ${dark ? "[color-scheme:dark]" : "[color-scheme:light]"}`} />
            </div>
          </div>

          {/* TVA */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-xs font-medium uppercase tracking-widest ${dark ? "text-neutral-500" : "text-neutral-400"}`}>TVA</span>
            <button type="button" onClick={() => setHasTva((p) => !p)}
              className={`relative h-5 w-9 rounded-full transition-colors ${hasTva ? "bg-[#FBAE17]" : dark ? "bg-neutral-700" : "bg-neutral-300"}`}>
              <span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${hasTva ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
            <span className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>{hasTva ? "Oui" : "Non"}</span>
            <AnimatePresence>
              {hasTva && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-2 overflow-hidden">
                  <input type="number" min="0" max="100" value={tvaRate} onChange={(e) => setTvaRate(e.target.value)}
                    className={`w-20 rounded-xl border bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FBAE17] ${dark ? "border-neutral-700 text-white" : "border-neutral-300 text-black"}`} />
                  <span className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Designations */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className={`${labelClass} mb-0`}>Désignations <span className="text-[#FBAE17]">*</span></label>
              <button onClick={addRow} className="flex items-center gap-1.5 rounded-xl bg-[#FBAE17]/10 px-3 py-1.5 text-xs font-semibold text-[#FBAE17] transition hover:bg-[#FBAE17]/20">
                <Plus size={13} /> Ajouter
              </button>
            </div>

            {/* Desktop column headers */}
            <div className={`mb-1 hidden grid-cols-12 gap-2 px-1 text-xs font-medium uppercase tracking-widest sm:grid ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
              <span className="col-span-5">Description</span>
              <span className="col-span-2 text-right">Qté</span>
              <span className="col-span-2 text-right">Prix HT</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-1" />
            </div>

            <div className="space-y-3 sm:space-y-2">
              <AnimatePresence initial={false}>
                {rows.map((row) => (
                  <motion.div key={row.key} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>

                    {/* Mobile layout */}
                    <div className={`flex flex-col gap-2 rounded-xl border p-3 sm:hidden ${dark ? "border-neutral-800 bg-neutral-800/30" : "border-neutral-100 bg-neutral-50/50"}`}>
                      <input className={inputClass} placeholder="Description" value={row.description} onChange={(e) => updateRow(row.key, "description", e.target.value)} />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className={`mb-1 text-[10px] font-medium uppercase tracking-wider ${dark ? "text-neutral-600" : "text-neutral-400"}`}>Qté</p>
                          <input className={`${inputClass} text-right`} type="number" min="0" placeholder="1" value={row.quantity} onChange={(e) => updateRow(row.key, "quantity", e.target.value)} />
                        </div>
                        <div>
                          <p className={`mb-1 text-[10px] font-medium uppercase tracking-wider ${dark ? "text-neutral-600" : "text-neutral-400"}`}>Prix HT</p>
                          <input className={`${inputClass} text-right`} type="number" min="0" placeholder="0.000" value={row.unitPrice} onChange={(e) => updateRow(row.key, "unitPrice", e.target.value)} />
                        </div>
                        <div>
                          <p className={`mb-1 text-[10px] font-medium uppercase tracking-wider ${dark ? "text-neutral-600" : "text-neutral-400"}`}>Total</p>
                          <div className={`flex h-[38px] items-center justify-end rounded-xl border px-3 text-sm font-medium ${dark ? "border-neutral-700 text-neutral-300" : "border-neutral-200 text-neutral-600"}`}>
                            {row.total.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeRow(row.key)} disabled={rows.length === 1}
                        className={`flex items-center gap-1 self-end text-xs transition disabled:opacity-30 ${dark ? "text-neutral-600 hover:text-red-400" : "text-neutral-400 hover:text-red-500"}`}>
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden grid-cols-12 gap-2 sm:grid">
                      <input className={`${inputClass} col-span-5`} placeholder="Description" value={row.description} onChange={(e) => updateRow(row.key, "description", e.target.value)} />
                      <input className={`${inputClass} col-span-2 text-right`} type="number" min="0" placeholder="1" value={row.quantity} onChange={(e) => updateRow(row.key, "quantity", e.target.value)} />
                      <input className={`${inputClass} col-span-2 text-right`} type="number" min="0" placeholder="0.000" value={row.unitPrice} onChange={(e) => updateRow(row.key, "unitPrice", e.target.value)} />
                      <div className={`col-span-2 flex items-center justify-end rounded-xl border px-3 text-sm font-medium ${dark ? "border-neutral-700 text-neutral-300" : "border-neutral-200 text-neutral-600"}`}>
                        {row.total.toFixed(3)}
                      </div>
                      <button onClick={() => removeRow(row.key)} disabled={rows.length === 1}
                        className={`col-span-1 flex items-center justify-center rounded-xl transition disabled:opacity-30 ${dark ? "text-neutral-600 hover:text-red-400" : "text-neutral-300 hover:text-red-400"}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Totals */}
          <div className={`rounded-xl border p-4 space-y-2 ${dark ? "border-neutral-800 bg-neutral-800/30" : "border-amber-100 bg-amber-50/40"}`}>
            <div className="flex justify-between text-xs">
              <span className={dark ? "text-neutral-500" : "text-neutral-400"}>Total HT</span>
              <span className="font-medium">{totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {currency}</span>
            </div>
            {hasTva && (
              <div className="flex justify-between text-xs">
                <span className={dark ? "text-neutral-500" : "text-neutral-400"}>TVA ({tvaRate}%)</span>
                <span className="font-medium">{tvaAmt.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {currency}</span>
              </div>
            )}
            {droitDeTimbre > 0 && (
              <div className="flex justify-between text-xs">
                <span className={dark ? "text-neutral-500" : "text-neutral-400"}>Droit de timbre</span>
                <span className="font-medium">1.000 TND</span>
              </div>
            )}
            <div className={`flex justify-between border-t pt-2 text-sm font-semibold ${dark ? "border-neutral-700" : "border-amber-100"}`}>
              <span>Total TTC</span>
              <span className="text-[#FBAE17]">{totalTTC.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {currency}</span>
            </div>
          </div>

          <AnimatePresence>
            {serverError && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {serverError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 border-t px-4 py-4 sm:px-6 ${dark ? "border-neutral-800" : "border-amber-100"}`}>
          <button onClick={onClose} className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80 ${dark ? "border-neutral-700 text-neutral-400" : "border-neutral-300 text-neutral-500"}`}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={isPending}
            className="flex-1 rounded-xl bg-[#FBAE17] py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
            {isPending ? "Création…" : "Créer le devis"}
          </button>
        </div>
      </motion.div>
    </>
  );
}