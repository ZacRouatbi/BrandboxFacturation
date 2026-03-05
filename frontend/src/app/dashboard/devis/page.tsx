"use client";

import Topbar from "@/components/dashboard/Topbar";
import DataTable from "@/components/dashboard/DataTable";
import { Document } from "@/types/document.types";

const mockDevis: Document[] = [
  { id: "DV-2025-001", type: "DEVIS", devisStatus: "ON_HOLD",  date: "2025-03-01", dueDate: "2025-03-15", totalHT: 2000,  totalTTC: 2360,  currency: "TND", tva: 18, tierId: "CL-001", createdAt: "2025-03-01", updatedAt: "2025-03-01" },
  { id: "DV-2025-002", type: "DEVIS", devisStatus: "ACCEPTED", date: "2025-03-05", dueDate: "2025-03-20", totalHT: 4800,  totalTTC: 5664,  currency: "TND", tva: 18, tierId: "CL-002", createdAt: "2025-03-05", updatedAt: "2025-03-05" },
  { id: "DV-2025-003", type: "DEVIS", devisStatus: "CANCELLED",date: "2025-03-08", dueDate: "2025-03-22", totalHT: 1200,  totalTTC: 1416,  currency: "TND", tva: 18, tierId: "CL-003", createdAt: "2025-03-08", updatedAt: "2025-03-08" },
  { id: "DV-2025-004", type: "DEVIS", devisStatus: "ON_HOLD",  date: "2025-03-10", dueDate: "2025-03-25", totalHT: 7500,  totalTTC: 8850,  currency: "TND", tva: 18, tierId: "CL-004", createdAt: "2025-03-10", updatedAt: "2025-03-10" },
  { id: "DV-2025-005", type: "DEVIS", devisStatus: "ACCEPTED", date: "2025-03-15", dueDate: "2025-03-30", totalHT: 3300,  totalTTC: 3894,  currency: "TND", tva: 18, tierId: "CL-005", createdAt: "2025-03-15", updatedAt: "2025-03-15" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  ON_HOLD:   { label: "En attente",  className: "bg-amber-500/10 text-amber-500"   },
  ACCEPTED:  { label: "Accepté",     className: "bg-emerald-500/10 text-emerald-500"},
  CANCELLED: { label: "Annulé",      className: "bg-red-500/10 text-red-400"       },
};

const columns = [
  { key: "id",          label: "Référence",  render: (r: Document) => <span className="font-mono text-xs text-[#FBAE17]">{r.id}</span> },
  { key: "tierId",      label: "Client",     render: (r: Document) => <span className="font-medium">{r.tierId}</span> },
  { key: "date",        label: "Date",       render: (r: Document) => new Date(r.date).toLocaleDateString("fr-FR") },
  { key: "dueDate",     label: "Échéance",   render: (r: Document) => r.dueDate ? new Date(r.dueDate).toLocaleDateString("fr-FR") : "—" },
  { key: "totalTTC",    label: "Total TTC",  align: "right" as const, render: (r: Document) => <span className="font-medium">{r.totalTTC.toLocaleString("fr-FR")} {r.currency}</span> },
  {
    key: "devisStatus", label: "Statut",     align: "right" as const,
    render: (r: Document) => {
      const s = statusConfig[r.devisStatus ?? ""];
      return s ? <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>{s.label}</span> : "—";
    },
  },
];

export default function DevisPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Devis" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <DataTable
          title="Liste des devis"
          subtitle={`${mockDevis.length} devis enregistrés`}
          columns={columns}
          data={mockDevis}
          addLabel="Nouveau devis"
          onAdd={() => {}}
          searchPlaceholder="Rechercher un devis..."
          searchKeys={["id", "tierId"]}
        />
      </main>
    </div>
  );
}