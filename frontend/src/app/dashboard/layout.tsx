import { ReactNode } from "react";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/providers/ThemeProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("bbx-theme")?.value;
  const initialDark = themeCookie !== "light";

  return (
    <ThemeProvider initialDark={initialDark}>
      <DashboardShell>{children}</DashboardShell>
    </ThemeProvider>
  );
}