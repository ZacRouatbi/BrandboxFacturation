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
      className={`flex h-16 items-center justify-between border-b px-6 transition-colors duration-500 ${
        dark
          ? "border-neutral-800 bg-neutral-900/60 backdrop-blur-xl"
          : "border-amber-100 bg-white/60 backdrop-blur-xl"
      }`}
    >
      <motion.h2
        key={title}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-base font-semibold tracking-tight"
      >
        {title}
      </motion.h2>

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
    </header>
  );
}