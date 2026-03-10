import { DevisStatus } from "@/types/enums";

const config: Record<DevisStatus, { label: string; className: string }> = {
  ON_HOLD:   { label: "En attente", className: "bg-amber-500/10 text-amber-500"    },
  ACCEPTED:  { label: "Accepté",    className: "bg-emerald-500/10 text-emerald-500" },
  CANCELLED: { label: "Annulé",     className: "bg-red-500/10 text-red-400"         },
};

export default function DevisStatusBadge({ status }: { status?: DevisStatus | null }) {
  if (!status) return <span>—</span>;
  const s = config[status];
  if (!s) return <span>—</span>;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}