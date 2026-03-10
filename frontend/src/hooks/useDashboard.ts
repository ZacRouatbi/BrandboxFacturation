import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  ca:                    number;
  totalClients:          number;
  totalFournisseurs:     number;
  devisEnAttente:        number;
  facturesNonPayees:     number;
  devisAcceptesThisMonth:number;
  caTrend:               number | null;
  devisTrend:            number | null;
  recentActivity: {
    id:            string;
    type:          string;
    totalTTC:      number;
    currency:      string;
    date:          string;
    devisStatus:   string | null;
    factureStatus: string | null;
    tier:          { name: string } | null;
  }[];
}

async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch("/api/document/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn:  fetchStats,
    refetchInterval: 60_000, // refresh every minute
  });
}