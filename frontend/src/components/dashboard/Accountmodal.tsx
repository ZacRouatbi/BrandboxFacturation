"use client";

import { useState } from "react";
import { User, KeyRound, X, Eye, EyeOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useAuth";

interface AccountModalProps {
  dark:    boolean;
  user:    { username: string };
  onClose: () => void;
}

export default function AccountModal({ dark, user, onClose }: AccountModalProps) {
  const queryClient               = useQueryClient();
  const { mutate: logout }        = useLogout();

  const [tab,             setTab]             = useState<"username" | "password">("username");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newValue,        setNewValue]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent,     setShowCurrent]     = useState(false);
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [isPending,       setIsPending]       = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState(false);

  const resetFields = () => {
    setCurrentPassword("");
    setNewValue("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
  };

  const handleTabChange = (t: "username" | "password") => {
    setTab(t);
    resetFields();
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!currentPassword.trim()) {
      setError("Veuillez entrer votre mot de passe actuel.");
      return;
    }
    if (!newValue.trim()) {
      setError(
        tab === "username"
          ? "Le nouveau nom d'utilisateur est requis."
          : "Le nouveau mot de passe est requis."
      );
      return;
    }
    if (tab === "username" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
      setError("Le nom d'utilisateur doit être une adresse e-mail valide.");
      return;
    }
    if (tab === "password" && newValue !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsPending(true);
    try {
      await api("/auth/update-account", {
        method: "PATCH",
        body: JSON.stringify({
          username: user.username,
          currentPassword,
          ...(tab === "username" ? { newUsername: newValue } : { newPassword: newValue }),
        }),
      });

      setSuccess(true);
      setCurrentPassword("");
      setNewValue("");
      setConfirmPassword("");

      if (tab === "username") {
        // Show success briefly then log out — JWT is now invalid since username changed
        setTimeout(() => logout(), 1500);
      } else {
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      }
    } catch (e) {
      setError((e as Error).message ?? "Une erreur est survenue.");
    } finally {
      setIsPending(false);
    }
  };

  const inputClass = `w-full rounded-xl border bg-transparent py-2.5 pl-10 pr-10 text-sm
    focus:outline-none focus:ring-2 focus:ring-[#FBAE17] transition-colors ${
    dark
      ? "border-neutral-700 placeholder-neutral-600 text-white"
      : "border-neutral-300 placeholder-neutral-400 text-black"
  }`;

  const labelClass = `mb-1.5 block text-xs font-medium uppercase tracking-widest ${
    dark ? "text-neutral-500" : "text-neutral-400"
  }`;

  const iconClass = `absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-neutral-500" : "text-neutral-400"}`;

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{ opacity: 0,   scale: 0.95, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`fixed inset-0 m-auto z-[80] h-fit w-full max-w-md
          rounded-2xl border p-6 shadow-2xl ${
          dark
            ? "border-neutral-800 bg-neutral-900"
            : "border-amber-100 bg-white"
        }`}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Paramètres du compte</h3>
            <p className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
              {user.username}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`rounded-full p-1.5 transition hover:scale-105 ${
              dark
                ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`mb-5 flex rounded-xl p-1 ${dark ? "bg-neutral-800" : "bg-neutral-100"}`}>
          {(["username", "password"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-[#FBAE17] text-black shadow-sm"
                  : dark
                  ? "text-neutral-400 hover:text-white"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              {t === "username" ? "Nom d'utilisateur" : "Mot de passe"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">

          {/* Current password */}
          <div>
            <label className={labelClass}>
              Mot de passe actuel <span className="text-[#FBAE17]">*</span>
            </label>
            <div className="relative">
              <KeyRound size={15} className={iconClass} />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setError(""); setSuccess(false); }}
                placeholder="••••••••"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 transition hover:opacity-100"
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* New value */}
          <div>
            <label className={labelClass}>
              {tab === "username" ? "Nouvel e-mail" : "Nouveau mot de passe"}
              <span className="text-[#FBAE17]"> *</span>
            </label>
            <div className="relative">
              <User size={15} className={iconClass} />
              <input
                type={tab === "username" ? "email" : (showNew ? "text" : "password")}
                value={newValue}
                onChange={(e) => { setNewValue(e.target.value); setError(""); setSuccess(false); }}
                placeholder={tab === "username" ? "exemple@email.com" : "••••••••"}
                className={inputClass}
              />
              {tab === "password" && (
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 transition hover:opacity-100"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              )}
            </div>
          </div>

          {/* Confirm password */}
          <AnimatePresence>
            {tab === "password" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className={labelClass}>
                  Confirmer le mot de passe <span className="text-[#FBAE17]">*</span>
                </label>
                <div className="relative">
                  <KeyRound size={15} className={iconClass} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); setSuccess(false); }}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 transition hover:opacity-100"
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2"
              >
                <Check size={14} className="text-green-400" />
                <p className="text-xs text-green-400">
                  {tab === "username"
                    ? "Adresse e-mail mise à jour. Déconnexion en cours…"
                    : "Mot de passe mis à jour avec succès."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleClose}
              disabled={success && tab === "username"}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80 disabled:opacity-40 ${
                dark
                  ? "border-neutral-700 text-neutral-400"
                  : "border-neutral-300 text-neutral-500"
              }`}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || (success && tab === "username")}
              className="flex-1 rounded-xl bg-[#FBAE17] py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            >
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}