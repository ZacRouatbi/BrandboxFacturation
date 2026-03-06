import { Tier } from "@/types/tier.types";
import ClientActionButtons from "./Clientactionbuttons";

// Column definitions for the clients DataTable.
// onEdit is passed in from the page so the action buttons
// can trigger the edit panel state that lives in the page.

export function getClientColumns(onEdit: (row: Tier) => void) {
  return [
    {
      key: "id",
      label: "ID",
      render: (r: Tier) => (
        <span className="font-mono text-xs text-[#FBAE17]">{r.id}</span>
      ),
    },
    {
      key: "name",
      label: "Nom",
      render: (r: Tier) => <span className="font-medium">{r.name}</span>,
    },
    {
      key: "mf",
      label: "M/F",
      render: (r: Tier) => r.mf ?? <span className="opacity-30">—</span>,
    },
    {
      key: "phone",
      label: "Téléphone",
      render: (r: Tier) => r.phone ?? <span className="opacity-30">—</span>,
    },
    {
      key: "address",
      label: "Adresse",
      render: (r: Tier) => r.address ?? <span className="opacity-30">—</span>,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right" as const,
      render: (r: Tier) => (
        <ClientActionButtons row={r} onEdit={onEdit} />
      ),
    },
  ];
}