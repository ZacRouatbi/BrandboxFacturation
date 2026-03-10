"use client";

import { FactureStatus } from "@/types/enums";

interface Props {
  status: FactureStatus | null | undefined;
}

const config: Record<FactureStatus, { label: string; className: string }> = {
  NOT_PAID: {
    label:     "Non payée",
    className: "bg-amber-500/10 text-amber-500",
  },
  PAID: {
    label:     "Payée",
    className: "bg-emerald-500/10 text-emerald-500",
  },
};

export default function FactureStatusBadge({ status }: Props) {
  if (!status) return null;
  const { label, className } = config[status] ?? config.NOT_PAID;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}