/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import Topbar from "@/components/dashboard/Topbar";
import DevisStatusBadge from "@/components/devis/Devisstatusbadge";
import DevisPrint from "@/components/devis/Devisprint";
import { DevisStatus } from "@/types/enums";
import { useDevisDetail } from "@/hooks/useDevis";


export default function FactureDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const { dark } = useTheme();

  const { data: Devis, isLoading, isError } = useDevisDetail(id);

  const cardClass  = `rounded-2xl border p-5 ${
    dark ? "border-neutral-800 bg-neutral-900/70" : "border-amber-100 bg-white/70 shadow-sm"
  }`;
  const labelClass = `text-xs font-medium uppercase tracking-widest ${
    dark ? "text-neutral-500" : "text-neutral-400"
  }`;
  const valueClass = `mt-1 text-sm font-medium ${dark ? "text-white" : "text-black"}`;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title="Détail du devis" />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-8 w-8 animate-spin text-[#FBAE17]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className={`text-sm ${dark ? "text-neutral-500" : "text-neutral-400"}`}>Chargement…</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !Devis) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title="Détail du devis" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-red-400">devis introuvable.</p>
        </main>
      </div>
    );
  }

  const totalHT       = Number(Devis.totalHT);
  const totalTTC      = Number(Devis.totalTTC);
  const tva           = Number(Devis.tva);
  const tvaAmt        = tva > 0 ? totalHT * (tva / 100) : 0;
  const droitDeTimbre = tva > 0 && Devis.currency === "TND" ? 1 : 0;
  const tier          = (Devis as any).tier;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Détail du devis" />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-4xl space-y-5"
        >

          {/* Back + header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard/devis")}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:opacity-80 ${
                dark ? "text-neutral-400 hover:bg-neutral-800" : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              <ArrowLeft size={16} />
              Retour
            </button>

            <div className="flex items-center gap-3">
              <DevisStatusBadge status={Devis.devisStatus as DevisStatus | null} />
              <DevisPrint devis={Devis as any} />
            </div>
          </div>

          {/* Title row */}
          <div className={cardClass}>
            <div>
              <p className={labelClass}>Référence</p>
              <p className="mt-1 font-mono text-xl font-bold text-[#FBAE17]">{Devis.id}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
              <div>
                <p className={labelClass}>Client</p>
                <p className={valueClass}>{tier?.name ?? Devis.tierId}</p>
              </div>
              <div>
                <p className={labelClass}>Devise</p>
                <p className={valueClass}>{Devis.currency}</p>
              </div>
              <div>
                <p className={labelClass}>
                  <Calendar size={12} className="inline mr-1" />
                  Date
                </p>
                <p className={valueClass}>
                  {new Date(Devis.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>

          {/* Designations */}
          <div className={cardClass}>
            <p className={`${labelClass} mb-4`}>Désignations</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-xs uppercase tracking-widest ${
                    dark ? "text-neutral-600" : "text-neutral-400"
                  }`}>
                    <th className="pb-3 text-left font-medium">Description</th>
                    <th className="pb-3 text-right font-medium">Qté</th>
                    <th className="pb-3 text-right font-medium">Prix HT</th>
                    <th className="pb-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(Devis.designations ?? []).map((d) => (
                    <tr
                      key={d.id}
                      className={`border-t ${dark ? "border-neutral-800" : "border-amber-50"}`}
                    >
                      <td className={`py-3 ${dark ? "text-neutral-300" : "text-neutral-600"}`}>
                        {d.description}
                      </td>
                      <td className={`py-3 text-right ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
                        {Number(d.quantity).toLocaleString("fr-FR")}
                      </td>
                      <td className={`py-3 text-right ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
                        {Number(d.unitPrice).toLocaleString("fr-FR", { minimumFractionDigits: 3 })}
                      </td>
                      <td className={`py-3 text-right font-medium ${dark ? "text-white" : "text-black"}`}>
                        {Number(d.total).toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {Devis.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className={cardClass}>
            <p className={`${labelClass} mb-4`}>Récapitulatif</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={dark ? "text-neutral-400" : "text-neutral-500"}>Total HT</span>
                <span className="font-medium">
                  {totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {Devis.currency}
                </span>
              </div>
              {tva > 0 && (
                <div className="flex justify-between text-sm">
                  <span className={dark ? "text-neutral-400" : "text-neutral-500"}>TVA ({tva}%)</span>
                  <span className="font-medium">
                    {tvaAmt.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {Devis.currency}
                  </span>
                </div>
              )}
              {droitDeTimbre > 0 && (
                <div className="flex justify-between text-sm">
                  <span className={dark ? "text-neutral-400" : "text-neutral-500"}>Droit de timbre</span>
                  <span className="font-medium">1.000 TND</span>
                </div>
              )}
              <div className={`flex justify-between border-t pt-3 text-base font-semibold ${
                dark ? "border-neutral-800" : "border-amber-100"
              }`}>
                <span>Total TTC</span>
                <span className="text-[#FBAE17]">
                  {totalTTC.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {Devis.currency}
                </span>
              </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}