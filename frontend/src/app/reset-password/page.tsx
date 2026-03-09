"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useResetPassword } from "@/hooks/useAuth";

export default function ResetPasswordPage() {
  const searchParams                    = useSearchParams();
  const token                           = searchParams.get("token") ?? "";
  const [dark,     setDark]             = useState(true);
  const [copied,   setCopied]           = useState(false);

  const { mutate: resetPassword, isPending, error, data } = useResetPassword();

  // Auto-trigger reset on mount once token is available
  useEffect(() => {
    if (token) resetPassword({ token });
  }, [token]);

  const handleCopy = () => {
    if (data?.newPassword) {
      navigator.clipboard.writeText(data.newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 transition-colors duration-700 ${
        dark ? "bg-[#090800] text-white" : "bg-[#fffef8] text-black"
      }`}
    >
      <AnimatedBackground dark={dark} />

      {/* Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className={`absolute right-6 top-6 z-20 rounded-full border p-2 backdrop-blur transition hover:scale-110 ${
          dark ? "border-neutral-700 bg-neutral-900/50" : "border-amber-200 bg-white/60"
        }`}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 w-full max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur-2xl ${
          dark
            ? "border-neutral-800/60 bg-neutral-900/65 shadow-black/60"
            : "border-amber-100 bg-white/65 shadow-amber-100/40"
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex h-[50px] items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={dark ? "darkLogo" : "lightLogo"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                src={dark ? "/logo-light.png" : "/logo-dark.png"}
                alt="Brandbox Logo"
                width={160}
                height={50}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {/* Loading state */}
          {isPending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <svg className="h-8 w-8 animate-spin text-[#FBAE17]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className={`text-sm ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                Réinitialisation en cours…
              </p>
            </motion.div>
          )}

          {/* Error state */}
          {!isPending && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-4 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-7 w-7 text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h2 className="mb-1 text-base font-semibold">Lien invalide</h2>
                <p className={`text-sm ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                  {error.message}
                </p>
              </div>
              <Link
                href="/forgot-password"
                className="mt-2 rounded-xl bg-[#FBAE17] px-6 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Demander un nouveau lien
              </Link>
            </motion.div>
          )}

          {/* Success state */}
          {!isPending && !error && data && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-500/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6 text-green-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mb-1 text-base font-semibold">Mot de passe réinitialisé</h2>
                <p className={`text-sm ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                  Voici votre nouveau mot de passe. Copiez-le et connectez-vous.
                </p>
              </div>

              {/* Password display */}
              <div className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                dark ? "border-[#FBAE17] bg-neutral-950" : "border-[#FBAE17] bg-amber-50/50"
              }`}>
                <span className="font-mono text-lg font-bold tracking-widest text-[#FBAE17]">
                  {data.newPassword}
                </span>
                <button
                  onClick={handleCopy}
                  title="Copier"
                  className={`rounded-lg p-1.5 transition-colors ${
                    dark ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-400 hover:bg-neutral-100"
                  }`}
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Warning */}
              <div className={`rounded-xl border px-4 py-3 text-xs ${
                dark
                  ? "border-amber-500/20 bg-amber-500/5 text-amber-400"
                  : "border-amber-300/50 bg-amber-50 text-amber-600"
              }`}>
                ⚠️ Changez ce mot de passe dès votre prochaine connexion.
              </div>

              <Link
                href="/"
                className="flex w-full items-center justify-center rounded-xl bg-[#FBAE17] py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
              >
                Se connecter
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}