"use client";

import Topbar from "@/components/dashboard/Topbar";
import DataTable from "@/components/dashboard/DataTable";
import { Document } from "@/types/document.types";

const mockFactures: Document[] = [
  { id: "FA-2025-001", type: "FACTURE", factureStatus: "PAID",     date: "2025-02-10", dueDate: "2025-03-10", totalHT: 1228.813, totalTTC: 1450, currency: "TND", tva: 18, tierId: "CL-001", createdAt: "2025-02-10", updatedAt: "2025-02-10" },
  { id: "FA-2025-002", type: "FACTURE", factureStatus: "NOT_PAID", date: "2025-02-18", dueDate: "2025-03-18", totalHT: 661.017,  totalTTC: 780.5,currency: "TND", tva: 18, tierId: "CL-003", createdAt: "2025-02-18", updatedAt: "2025-02-18" },
  { id: "FA-2025-003", type: "FACTURE", factureStatus: "PAID",     date: "2025-03-01", dueDate: "2025-04-01", totalHT: 1779.661, totalTTC: 2100, currency: "TND", tva: 18, tierId: "CL-005", createdAt: "2025-03-01", updatedAt: "2025-03-01" },
  { id: "FA-2025-004", type: "FACTURE", factureStatus: "NOT_PAID", date: "2025-03-05", dueDate: "2025-04-05", totalHT: 2711.864, totalTTC: 3200, currency: "TND", tva: 18, tierId: "CL-002", createdAt: "2025-03-05", updatedAt: "2025-03-05" },
  { id: "FA-2025-005", type: "FACTURE", factureStatus: "PAID",     date: "2025-03-10", dueDate: "2025-04-10", totalHT: 4915.254, totalTTC: 5800, currency: "TND", tva: 18, tierId: "CL-004", createdAt: "2025-03-10", updatedAt: "2025-03-10" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID:     { label: "Payée",     className: "bg-emerald-500/10 text-emerald-500" },
  NOT_PAID: { label: "Non payée", className: "bg-red-500/10 text-red-400"         },
};

const columns = [
  { key: "id",            label: "Référence", render: (r: Document) => <span className="font-mono text-xs text-[#FBAE17]">{r.id}</span> },
  { key: "tierId",        label: "Client",    render: (r: Document) => <span className="font-medium">{r.tierId}</span> },
  { key: "date",          label: "Date",      render: (r: Document) => new Date(r.date).toLocaleDateString("fr-FR") },
  { key: "dueDate",       label: "Échéance",  render: (r: Document) => r.dueDate ? new Date(r.dueDate).toLocaleDateString("fr-FR") : "—" },
  { key: "totalHT",       label: "Total HT",  align: "right" as const, render: (r: Document) => `${r.totalHT.toLocaleString("fr-FR")} ${r.currency}` },
  { key: "totalTTC",      label: "Total TTC", align: "right" as const, render: (r: Document) => <span className="font-medium">{r.totalTTC.toLocaleString("fr-FR")} {r.currency}</span> },
  {
    key: "factureStatus", label: "Statut",    align: "right" as const,
    render: (r: Document) => {
      const s = statusConfig[r.factureStatus ?? ""];
      return s ? <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>{s.label}</span> : "—";
    },
  },
];

export default function FacturePage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Factures" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <DataTable
          title="Liste des factures"
          subtitle={`${mockFactures.length} factures enregistrées`}
          columns={columns}
          data={mockFactures}
          addLabel="Nouvelle facture"
          onAdd={() => {}}
          searchPlaceholder="Rechercher une facture..."
          searchKeys={["id", "tierId"]}
        />
      </main>
    </div>
  );
}