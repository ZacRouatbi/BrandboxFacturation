import { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardShell>{children}</DashboardShell>
    </ThemeProvider>
  );
}