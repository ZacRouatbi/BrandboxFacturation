"use client";

import { ReactNode } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { dark } = useTheme();

  return (
    <div
      className={`relative flex h-screen overflow-hidden transition-colors duration-500 ${
        dark ? "bg-[#090800] text-white" : "bg-[#fffef8] text-black"
      }`}
    >
      {/* Subtle animated background — same orbs, lower opacity in dashboard */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <AnimatedBackground dark={dark} />
      </div>

      {/* Sidebar — fixed left */}
      <Sidebar />

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}