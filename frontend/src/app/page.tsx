"use client";

import { useTheme } from "@/providers/ThemeProvider";
import Topbar from "@/components/dashboard/Topbar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useDashboardStats } from "@/hooks/useDashboard";
import {
  Users, Truck, FileText, Receipt, TrendingUp, Clock,
} from "lucide-react";
import { motion } from "framer-motion";

// ── Status helpers ──────────────────────────────────────────────
function statusLabel(type: string, devisStatus: string | null, factureStatus: string | null) {
  if (type === "FACTURE") {
    return factureStatus === "PAID"
      ? { label: "PAYÉE",     color: "text-emerald-500" }
      : { label: "NON PAYÉE", color: "text-red-400"     };
  }
  if (devisStatus === "ACCEPTED")  return { label: "ACCEPTÉ",    color: "text-emerald-500" };
  if (devisStatus === "CANCELLED") return { label: "ANNULÉ",     color: "text-red-400"     };
  return                                  { label: "EN ATTENTE", color: "text-amber-500"   };
}

// ── Skeleton loader ─────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 ${className}`} />;
}

// ── Trend badge ─────────────────────────────────────────────────
function Trend({ value }: { value: number | null }) {
  if (value === null) return null;
  const positive = value >= 0;
  return (
    <span className={`text-xs font-medium ${positive ? "text-emerald-500" : "text-red-400"}`}>
      {positive ? "▲" : "▼"} {Math.abs(value)}% vs mois dernier
    </span>
  );
}

export default function DashboardPage() {
  const { dark } = useTheme();
  const { data, isLoading } = useDashboardStats();

  const border  = dark ? "border-neutral-800"    : "border-amber-100";
  const subtext = dark ? "text-neutral-400"      : "text-neutral-500";
  const rowHover= dark ? "border-neutral-800/60 hover:bg-neutral-800/40" : "border-amber-50 hover:bg-amber-50/50";
  const headTxt = dark ? "text-neutral-600"      : "text-neutral-400";
  const cellTxt = dark ? "text-neutral-300"      : "text-neutral-600";

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Tableau de bord" />

      <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 sm:mb-6"
        >
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Bonjour 👋</h1>
          <p className={`mt-1 text-xs sm:text-sm ${subtext}`}>
            Voici un aperçu de votre activité aujourd&apos;hui.
          </p>
        </motion.div>

        {/* ── Stat cards row 1 ── */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 sm:h-32" />
            ))
          ) : (
            <>
              <DashboardCard
                index={0} accent
                title="Chiffre d'affaires"
                value={`${(data?.ca ?? 0).toLocaleString("fr-FR", { minimumFractionDigits: 3 })} TND`}
                subtitle="Ce mois-ci"
                icon={TrendingUp}
                trend={data?.caTrend != null ? { value: data.caTrend, label: "vs mois dernier" } : undefined}
              />
              <DashboardCard
                index={1}
                title="Clients"
                value={String(data?.totalClients ?? 0)}
                subtitle="Total actifs"
                icon={Users}
              />
              <DashboardCard
                index={2}
                title="Fournisseurs"
                value={String(data?.totalFournisseurs ?? 0)}
                subtitle="Total actifs"
                icon={Truck}
              />
              <DashboardCard
                index={3}
                title="Devis en attente"
                value={String(data?.devisEnAttente ?? 0)}
                subtitle="À traiter"
                icon={FileText}
              />
            </>
          )}
        </div>

        {/* ── Stat cards row 2 ── */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-28 sm:h-32" />
            ))
          ) : (
            <>
              <DashboardCard
                index={4}
                title="Factures non payées"
                value={String(data?.facturesNonPayees ?? 0)}
                subtitle="Relances requises"
                icon={Receipt}
              />
              <DashboardCard
                index={5}
                title="Devis acceptés"
                value={String(data?.devisAcceptesThisMonth ?? 0)}
                subtitle="Ce mois-ci"
                icon={FileText}
                trend={data?.devisTrend != null ? { value: data.devisTrend, label: "vs mois dernier" } : undefined}
              />
            </>
          )}
        </div>

        {/* ── Recent activity ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className={`rounded-2xl border ${
            dark
              ? "border-neutral-800 bg-neutral-900/70 backdrop-blur-xl"
              : "border-amber-100 bg-white/70 backdrop-blur-xl shadow-sm"
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-4 ${border}`}>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-[#FBAE17]" />
              <span className="text-xs font-semibold sm:text-sm">Activité récente</span>
            </div>
            <span className={`text-xs ${subtext}`}>8 dernières opérations</span>
          </div>

          {/* Table — scrollable on small screens */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className={`text-[10px] uppercase tracking-widest sm:text-xs ${headTxt}`}>
                  <th className="px-4 py-3 text-left font-medium sm:px-5">Référence</th>
                  <th className="px-4 py-3 text-left font-medium sm:px-5">Type</th>
                  <th className="px-4 py-3 text-left font-medium sm:px-5">Client</th>
                  <th className="px-4 py-3 text-right font-medium sm:px-5">Montant</th>
                  <th className="px-4 py-3 text-right font-medium sm:px-5">Statut</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className={`border-t ${border}`}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-4 py-3 sm:px-5">
                            <Skeleton className="h-3 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : (data?.recentActivity ?? []).map((item, i) => {
                      const { label, color } = statusLabel(item.type, item.devisStatus, item.factureStatus);
                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                          className={`border-t transition-colors ${rowHover}`}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-[#FBAE17] sm:px-5">{item.id}</td>
                          <td className={`px-4 py-3 text-xs sm:px-5 sm:text-sm ${cellTxt}`}>
                            {item.type === "FACTURE" ? "Facture" : "Devis"}
                          </td>
                          <td className={`px-4 py-3 text-xs sm:px-5 sm:text-sm ${cellTxt}`}>
                            {item.tier?.name ?? "—"}
                          </td>
                          <td className={`px-4 py-3 text-right text-xs font-medium sm:px-5 sm:text-sm ${dark ? "text-white" : "text-black"}`}>
                            {Number(item.totalTTC).toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {item.currency}
                          </td>
                          <td className={`px-4 py-3 text-right text-[10px] font-semibold sm:px-5 sm:text-xs ${color}`}>
                            {label}
                          </td>
                        </motion.tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
}