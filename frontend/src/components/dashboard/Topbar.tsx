"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { motion } from "framer-motion";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { dark, toggleDark } = useTheme();

  return (
    <header
      className={`flex h-16 shrink-0 items-center border-b px-4 transition-colors duration-500 lg:px-6 ${
        dark
          ? "border-neutral-800 bg-neutral-900/60 backdrop-blur-xl"
          : "border-amber-100 bg-white/60 backdrop-blur-xl"
      }`}
    >
      {/* Left spacer on mobile — balances the theme button so title stays centered */}
      <div className="w-9 shrink-0 lg:hidden" />

      {/* Title */}
      <motion.h2
        key={title}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 text-center text-base font-semibold tracking-tight lg:text-left"
      >
        {title}
      </motion.h2>

      {/* Theme toggle */}
      <button
        onClick={toggleDark}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition hover:scale-105 ${
          dark
            ? "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:text-white"
            : "border-neutral-200 bg-white/50 text-neutral-500 hover:text-black"
        }`}
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}