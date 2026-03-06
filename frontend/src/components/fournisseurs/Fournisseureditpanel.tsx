"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Mail, MapPin, User } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { Tier } from "@/types/tier.types";
import { useUpdateTier } from "@/hooks/useTier";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface FournisseurEditPanelProps {
  Fournisseur:  Tier;
  onClose: () => void;
}

export default function FournisseurEditPanel({ Fournisseur, onClose }: FournisseurEditPanelProps) {
  const { dark } = useTheme();

  const [mf,      setMf]      = useState(Fournisseur.mf      ?? "");
  const [phone,   setPhone]   = useState<string | undefined>(Fournisseur.phone ?? undefined);
  const [address, setAddress] = useState(Fournisseur.address ?? "");

  const { mutate: updateTier, isPending } = useUpdateTier();

  const phoneValid = phone ? isValidPhoneNumber(phone) : true;

  const handleSave = () => {
    updateTier(
      { id: Fournisseur.id, dto: { mf, phone, address } },
      { onSuccess: onClose }
    );
  };

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
              Modifier le Fournisseur
            </p>
            <h3 className="mt-0.5 text-base font-semibold">{Fournisseur.name}</h3>
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

          {/* Nom — read only */}
          <div>
            <label className={labelClass}>Nom</label>
            <div className="relative">
              <User size={16} className={iconClass()} />
              <input
                type="text"
                value={Fournisseur.name}
                disabled
                className={`w-full cursor-not-allowed rounded-xl border py-2.5 pl-10 pr-4 text-sm opacity-50 ${
                  dark
                    ? "border-neutral-700 bg-neutral-800 text-neutral-400"
                    : "border-neutral-200 bg-neutral-50 text-neutral-500"
                }`}
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
                onChange={(e) => setMf(e.target.value)}
                placeholder="M/F"
                className={inputClass}
              />
            </div>
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
            disabled={isPending || (phone ? !phoneValid : false)}
            className="flex-1 rounded-xl bg-[#FBAE17] py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
          >
            {isPending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </motion.aside>
    </>
  );
}