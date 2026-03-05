"use client";

import { Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useMe } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { dark, toggleDark } = useTheme();
  const { data: user }       = useMe();

  // Derive initials from username — falls back to "BB" while loading
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "BB";

  return (
    <header
      className={`flex h-16 items-center justify-between border-b px-6 transition-colors duration-500 ${
        dark
          ? "border-neutral-800 bg-neutral-900/60 backdrop-blur-xl"
          : "border-amber-100 bg-white/60 backdrop-blur-xl"
      }`}
    >
      {/* Page title — re-animates on every navigation */}
      <motion.h2
        key={title}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-base font-semibold tracking-tight"
      >
        {title}
      </motion.h2>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className={`relative rounded-full border p-2 transition hover:scale-105 ${
            dark
              ? "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:text-white"
              : "border-neutral-200 bg-white/50 text-neutral-500 hover:text-black"
          }`}
        >
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#FBAE17]" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleDark}
          className={`rounded-full border p-2 transition hover:scale-105 ${
            dark
              ? "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:text-white"
              : "border-neutral-200 bg-white/50 text-neutral-500 hover:text-black"
          }`}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User avatar — shows real initials from useMe() */}
        <div
          title={user?.username}
          className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
            dark
              ? "border-neutral-700 bg-neutral-800 text-[#FBAE17]"
              : "border-amber-200 bg-amber-50 text-[#FBAE17]"
          }`}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}