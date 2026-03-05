"use client";

import { useTheme } from "@/providers/ThemeProvider";
import Topbar from "@/components/dashboard/Topbar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  Users,
  Truck,
  FileText,
  Receipt,
  TrendingUp,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

// ── Mock recent activity ──────────────────────────────────────────
const recentActivity = [
  { id: "FA-2025-001", type: "Facture",  client: "Acme SARL",       amount: "1 450,000 TND", status: "PAYÉE",       statusColor: "text-emerald-500" },
  { id: "DV-2025-012", type: "Devis",    client: "TechVision SA",   amount: "3 200,000 TND", status: "EN ATTENTE",  statusColor: "text-amber-500"   },
  { id: "FA-2025-009", type: "Facture",  client: "LogiPro SARL",    amount: "780,500 TND",   status: "NON PAYÉE",   statusColor: "text-red-400"     },
  { id: "DV-2025-011", type: "Devis",    client: "Horizon Group",   amount: "5 900,000 TND", status: "ACCEPTÉ",     statusColor: "text-emerald-500" },
  { id: "FA-2025-008", type: "Facture",  client: "Bina Construction",amount: "2 100,000 TND", status: "PAYÉE",      statusColor: "text-emerald-500" },
];

export default function DashboardPage() {
  const { dark } = useTheme();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Tableau de bord" />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold tracking-tight">Bonjour 👋</h1>
          <p className={`mt-1 text-sm ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
            Voici un aperçu de votre activité aujourd&apos;hui.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <DashboardCard
            index={0}
            accent
            title="Chiffre d'affaires"
            value="24 850 TND"
            subtitle="Ce mois-ci"
            icon={TrendingUp}
            trend={{ value: 12, label: "vs mois dernier" }}
          />
          <DashboardCard
            index={1}
            title="Clients"
            value="38"
            subtitle="Total actifs"
            icon={Users}
            trend={{ value: 4, label: "ce mois" }}
          />
          <DashboardCard
            index={2}
            title="Fournisseurs"
            value="14"
            subtitle="Total actifs"
            icon={Truck}
          />
          <DashboardCard
            index={3}
            title="Devis en attente"
            value="7"
            subtitle="À traiter"
            icon={FileText}
            trend={{ value: -2, label: "vs semaine dernière" }}
          />
        </div>

        {/* Second row */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <DashboardCard
            index={4}
            title="Factures non payées"
            value="3"
            subtitle="Relances requises"
            icon={Receipt}
            trend={{ value: -1, label: "vs mois dernier" }}
          />
          <DashboardCard
            index={5}
            title="Devis acceptés"
            value="12"
            subtitle="Ce mois-ci"
            icon={FileText}
            trend={{ value: 8, label: "vs mois dernier" }}
          />
        </div>

        {/* Recent activity table */}
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
          {/* Table header */}
          <div className={`flex items-center justify-between border-b px-5 py-4 ${dark ? "border-neutral-800" : "border-amber-100"}`}>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#FBAE17]" />
              <span className="text-sm font-semibold">Activité récente</span>
            </div>
            <span className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
              5 dernières opérations
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase tracking-widest ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
                  <th className="px-5 py-3 text-left font-medium">Référence</th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-left font-medium">Client / Fournisseur</th>
                  <th className="px-5 py-3 text-right font-medium">Montant</th>
                  <th className="px-5 py-3 text-right font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className={`border-t transition-colors ${
                      dark
                        ? "border-neutral-800/60 hover:bg-neutral-800/40"
                        : "border-amber-50 hover:bg-amber-50/50"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-[#FBAE17]">{item.id}</td>
                    <td className={`px-5 py-3.5 ${dark ? "text-neutral-300" : "text-neutral-600"}`}>{item.type}</td>
                    <td className={`px-5 py-3.5 ${dark ? "text-neutral-300" : "text-neutral-600"}`}>{item.client}</td>
                    <td className={`px-5 py-3.5 text-right font-medium ${dark ? "text-white" : "text-black"}`}>{item.amount}</td>
                    <td className={`px-5 py-3.5 text-right text-xs font-semibold ${item.statusColor}`}>{item.status}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}