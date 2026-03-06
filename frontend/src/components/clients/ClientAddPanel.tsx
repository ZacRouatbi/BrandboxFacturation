"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Mail, MapPin, User } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useCreateTier } from "@/hooks/useTier";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface ClientAddPanelProps {
  onClose: () => void;

}

export default function ClientAddPanel({ onClose }: ClientAddPanelProps) {
  const { dark } = useTheme();

  const [name,    setName]    = useState("");
  const [mf,      setMf]      = useState("");
  const [phone,   setPhone]   = useState<string | undefined>(undefined);
  const [address, setAddress] = useState("");

  const { mutate: createTier, isPending } = useCreateTier();
  const [serverError, setServerError] = useState("");

const handleSave = () => {
  setServerError("");
  createTier(
    { name, mf, phone, address, role: "CLIENT" },
    {
      onSuccess: () => setTimeout(onClose, 0),
      onError: (err) => setServerError(err.message),
    }
  );
};

  const phoneValid = phone ? isValidPhoneNumber(phone) : true;

  const inputClass = `w-full rounded-xl border bg-transparent py-2.5 pl-10 pr-4 text-sm
    focus:outline-none focus:ring-2 focus:ring-[#FBAE17] transition-colors ${
    dark
      ? "border-neutral-700 placeholder-neutral-600 text-white"
      : "border-neutral-300 placeholder-neutral-400 text-black"
  }`;

  const labelClass = `mb-1.5 block text-xs font-medium uppercase tracking-widest ${
    dark ? "text-neutral-500" : "text-neutral-400"
  }`;

  const iconClass = (top = false) =>
    `absolute left-3 ${top ? "top-3" : "top-1/2 -translate-y-1/2"} ${
      dark ? "text-neutral-500" : "text-neutral-400"
    }`;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.aside
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col border-l shadow-2xl ${
          dark
            ? "border-neutral-800 bg-neutral-900"
            : "border-amber-100 bg-white"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-6 py-4 ${
          dark ? "border-neutral-800" : "border-amber-100"
        }`}>
          <div>
            <p className={`text-xs font-medium uppercase tracking-widest ${
              dark ? "text-neutral-500" : "text-neutral-400"
            }`}>
              Nouveau client
            </p>
            <h3 className="mt-0.5 text-base font-semibold">Ajouter un client</h3>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full p-1.5 transition hover:scale-105 ${
              dark
                ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">

          {/* Nom */}
          <div>
            <label className={labelClass}>Nom <span className="text-[#FBAE17]">*</span></label>
            <div className="relative">
              <User size={16} className={iconClass()} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du client"
                className={inputClass}
              />
            </div>
          </div>

          {/* M/F */}
          <div>
            <label className={labelClass}>M/F</label>
            <div className="relative">
              <Mail size={16} className={iconClass()} />
              <input
                type="text"
                value={mf}
                onChange={(e) => { setMf(e.target.value); setServerError(""); }}
                placeholder="M/F"
                className={`${inputClass} ${serverError ? "border-red-400 focus:ring-red-400" : ""}`}
              />
            </div>
            {serverError && (
              <p className="mt-1 text-xs text-red-400">{serverError}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className={labelClass}>Téléphone</label>
            <PhoneInput
              international
              defaultCountry="TN"
              value={phone}
              onChange={setPhone}
              className={`phone-input-wrapper ${dark ? "dark" : "light"}`}
            />
            {phone && !phoneValid && (
              <p className="mt-1 text-xs text-red-400">Numéro invalide pour ce pays.</p>
            )}
          </div>

          {/* Adresse */}
          <div>
            <label className={labelClass}>Adresse</label>
            <div className="relative">
              <MapPin size={16} className={iconClass(true)} />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse complète"
                rows={3}
                className={`w-full resize-none rounded-xl border bg-transparent py-2.5 pl-10 pr-4 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#FBAE17] transition-colors ${
                  dark
                    ? "border-neutral-700 placeholder-neutral-600 text-white"
                    : "border-neutral-300 placeholder-neutral-400 text-black"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 border-t px-6 py-4 ${
          dark ? "border-neutral-800" : "border-amber-100"
        }`}>
          <button
            onClick={onClose}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80 ${
              dark
                ? "border-neutral-700 text-neutral-400"
                : "border-neutral-300 text-neutral-500"
            }`}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || isPending || (phone ? !phoneValid : false)}
            className="flex-1 rounded-xl bg-[#FBAE17] py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? "Ajout…" : "Ajouter"}
          </button>
        </div>
      </motion.aside>
    </>
  );
}