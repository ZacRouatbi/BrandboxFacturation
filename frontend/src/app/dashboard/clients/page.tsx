"use client";

import Topbar from "@/components/dashboard/Topbar";
import DataTable from "@/components/dashboard/DataTable";
import { Tier } from "@/types/tier.types";

const mockClients: Tier[] = [
  { id: "CL-001", name: "Acme SARL",          email: "contact@acme.tn",        phone: "71 234 567", address: "Tunis",    role: "CLIENT", createdAt: "2025-01-10", updatedAt: "2025-01-10" },
  { id: "CL-002", name: "TechVision SA",       email: "info@techvision.tn",     phone: "71 345 678", address: "Sfax",     role: "CLIENT", createdAt: "2025-02-05", updatedAt: "2025-02-05" },
  { id: "CL-003", name: "LogiPro SARL",        email: "logipro@gmail.com",      phone: "71 456 789", address: "Sousse",   role: "CLIENT", createdAt: "2025-02-18", updatedAt: "2025-02-18" },
  { id: "CL-004", name: "Horizon Group",       email: "horizon@horizon.tn",     phone: "71 567 890", address: "Bizerte",  role: "CLIENT", createdAt: "2025-03-01", updatedAt: "2025-03-01" },
  { id: "CL-005", name: "Bina Construction",   email: "bina@bina.tn",           phone: "71 678 901", address: "Nabeul",   role: "CLIENT", createdAt: "2025-03-12", updatedAt: "2025-03-12" },
  { id: "CL-006", name: "Digital Wave",        email: "dw@digitalwave.tn",      phone: "71 789 012", address: "Tunis",    role: "BOTH",   createdAt: "2025-03-20", updatedAt: "2025-03-20" },
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
          : "bg-[#FBAE17]/10 text-[#FBAE17]"
      }`}>
        {r.role}
      </span>
    ),
  },
];

export default function ClientsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Clients" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <DataTable
          title="Liste des clients"
          subtitle={`${mockClients.length} clients enregistrés`}
          columns={columns}
          data={mockClients}
          addLabel="Nouveau client"
          onAdd={() => {}}
          searchPlaceholder="Rechercher un client..."
          searchKeys={["name", "email"]}
        />
      </main>
    </div>
  );
}