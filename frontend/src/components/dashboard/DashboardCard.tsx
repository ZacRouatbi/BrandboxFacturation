"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  accent?: boolean;
  index?: number;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = false,
  index = 0,
}: DashboardCardProps) {
  const { dark } = useTheme();
  const positive = trend && trend.value >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-colors duration-500 ${
        accent
          ? "border-[#FBAE17]/30 bg-[#FBAE17] text-black shadow-lg shadow-[#FBAE17]/20"
          : dark
          ? "border-neutral-800 bg-neutral-900/70 backdrop-blur-xl"
          : "border-amber-100 bg-white/70 backdrop-blur-xl shadow-sm"
      }`}
    >
      {/* Background glow for accent card */}
      {accent && (
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={`text-xs font-medium uppercase tracking-widest ${
              accent ? "text-black/60" : dark ? "text-neutral-500" : "text-neutral-400"
            }`}
          >
            {title}
          </p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${accent ? "text-black" : ""}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`mt-1 text-xs ${accent ? "text-black/60" : dark ? "text-neutral-500" : "text-neutral-400"}`}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={`mt-2 text-xs font-medium ${
              accent
                ? "text-black/70"
                : positive
                ? "text-emerald-500"
                : "text-red-400"
            }`}>
              {positive ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            accent
              ? "bg-black/10"
              : dark
              ? "bg-neutral-800 text-[#FBAE17]"
              : "bg-amber-50 text-[#FBAE17]"
          }`}
        >
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}