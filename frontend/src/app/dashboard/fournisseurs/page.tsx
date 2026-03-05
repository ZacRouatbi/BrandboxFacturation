"use client";

import Topbar from "@/components/dashboard/Topbar";
import DataTable from "@/components/dashboard/DataTable";
import { Tier } from "@/types/tier.types";

const mockFournisseurs: Tier[] = [
  { id: "FO-001", name: "ImprimPro",        email: "contact@imprimpro.tn",  phone: "71 111 222", address: "Tunis",   role: "FOURNISSEUR", createdAt: "2025-01-05", updatedAt: "2025-01-05" },
  { id: "FO-002", name: "PaperWorld SARL",  email: "pw@paperworld.tn",      phone: "71 222 333", address: "Sfax",    role: "FOURNISSEUR", createdAt: "2025-01-20", updatedAt: "2025-01-20" },
  { id: "FO-003", name: "InkMaster",        email: "ink@inkmaster.tn",      phone: "71 333 444", address: "Sousse",  role: "FOURNISSEUR", createdAt: "2025-02-10", updatedAt: "2025-02-10" },
  { id: "FO-004", name: "Digital Wave",     email: "dw@digitalwave.tn",     phone: "71 789 012", address: "Tunis",   role: "BOTH",        createdAt: "2025-03-20", updatedAt: "2025-03-20" },
];

const columns = [
  { key: "id",      label: "ID",       render: (r: Tier) => <span className="font-mono text-xs text-[#FBAE17]">{r.id}</span> },
  { key: "name",    label: "Nom",      render: (r: Tier) => <span className="font-medium">{r.name}</span> },
  { key: "email",   label: "E-mail"   },
  { key: "phone",   label: "Téléphone"},
  { key: "address", label: "Adresse"  },
  {
    key: "role", label: "Rôle",
    render: (r: Tier) => (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        r.role === "BOTH"
          ? "bg-purple-500/10 text-purple-400"
          : "bg-blue-500/10 text-blue-400"
      }`}>
        {r.role}
      </span>
    ),
  },
];

export default function FournisseursPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Fournisseurs" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <DataTable
          title="Liste des fournisseurs"
          subtitle={`${mockFournisseurs.length} fournisseurs enregistrés`}
          columns={columns}
          data={mockFournisseurs}
          addLabel="Nouveau fournisseur"
          onAdd={() => {}}
          searchPlaceholder="Rechercher un fournisseur..."
          searchKeys={["name", "email"]}
        />
      </main>
    </div>
  );
}