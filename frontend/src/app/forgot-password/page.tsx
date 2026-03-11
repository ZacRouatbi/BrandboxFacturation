"use client";

import { useState, FormEvent } from "react";
import { User, Sun, Moon, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useForgotPassword } from "@/hooks/useAuth";

const FacebookIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>);
const InstagramIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.226 7.149 2.163 8.415 2.105 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>);
const BehanceIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.726zm-7.686-3h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" /></svg>);
const LinkedInIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>);

const socialLinks = [
  { icon: <FacebookIcon />,  href: "https://www.facebook.com/profile.php?id=61572638457632", label: "Facebook"  },
  { icon: <InstagramIcon />, href: "https://www.instagram.com/brandbox_agency/",              label: "Instagram" },
  { icon: <BehanceIcon />,   href: "https://www.behance.net/brandboxtunisia",                 label: "Behance"   },
  { icon: <LinkedInIcon />,  href: "https://www.linkedin.com/company/brandbox-creative-agency/", label: "LinkedIn" },
];

function SuccessDialog({ dark, onOk }: { dark: boolean; onOk: () => void }) {
  return (
    <>
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <motion.div
        key="dialog"
        initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`fixed inset-x-4 inset-y-0 m-auto z-50 h-fit w-full max-w-sm rounded-2xl border p-6 shadow-2xl text-left ${
          dark ? "border-neutral-800 bg-neutral-900" : "border-amber-100 bg-white"
        }`}
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-green-500/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="mb-1 text-sm font-semibold">E-mail envoyé</h3>
        <p className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}>Si ce compte existe, un nouveau mot de passe vous a été transmis.</p>
        <button onClick={onOk} className="mt-5 w-full rounded-xl bg-[#FBAE17] py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]">OK</button>
      </motion.div>
    </>
  );
}

export default function ForgotPasswordPage() {
  const router                                       = useRouter();
  const [dark,       setDark]                        = useState(true);
  const [username,   setUsername]                    = useState("");
  const [showDialog, setShowDialog]                  = useState(false);
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    forgotPassword({ username }, { onSuccess: () => setShowDialog(true) });
  };

  return (
    <main className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 transition-colors duration-700 ${
      dark ? "bg-[#090800] text-white" : "bg-[#fffef8] text-black"
    }`}>
      <AnimatedBackground dark={dark} />

      {/* Theme Toggle */}
      <button onClick={() => setDark(!dark)}
        className={`absolute right-4 top-4 z-20 rounded-full border p-2 backdrop-blur transition hover:scale-110 sm:right-6 sm:top-6 ${
          dark ? "border-neutral-700 bg-neutral-900/50" : "border-amber-200 bg-white/60"
        }`}>
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className={`relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl sm:p-8 ${
          dark ? "border-neutral-800/60 bg-neutral-900/65 shadow-black/60" : "border-amber-100 bg-white/65 shadow-amber-100/40"
        }`}
      >
        {/* Logo */}
        <div className="mb-6 flex h-[50px] items-center justify-center sm:mb-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={dark ? "darkLogo" : "lightLogo"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Image src={dark ? "/logo-light.png" : "/logo-dark.png"} alt="Brandbox Logo" width={160} height={50} priority />
            </motion.div>
          </AnimatePresence>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">Mot de passe oublié</h1>
        <p className={`mb-6 text-center text-sm sm:mb-8 ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
          Entrez votre adresse e-mail pour recevoir un nouveau mot de passe.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-400">
                {error.message}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" size={20} />
            <input type="email" placeholder="Adresse e-mail" value={username} onChange={(e) => setUsername(e.target.value)}
              required disabled={isPending} autoComplete="email"
              className={`w-full rounded-xl border bg-transparent py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FBAE17] disabled:opacity-50 ${dark ? "border-neutral-700" : "border-neutral-300"}`}
            />
          </div>

          <button type="submit" disabled={isPending || !username.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FBAE17] py-3 font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? (
              <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Envoi…</>
            ) : "Envoyer"}
          </button>

          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-[#FBAE17] hover:underline">
              <ArrowLeft size={15} /> Retour à la connexion
            </Link>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
          {socialLinks.map(({ icon, href, label }) => (
            <a key={label} href={href} aria-label={label}
              className={`rounded-full border p-2 transition-all duration-200 hover:scale-110 hover:border-[#FBAE17] hover:text-[#FBAE17] sm:p-2.5 ${
                dark ? "border-neutral-700 text-neutral-400" : "border-neutral-300 text-neutral-500"
              }`}>
              {icon}
            </a>
          ))}
        </div>

        <p className="mt-6 text-center text-sm opacity-50">Brandbox © {new Date().getFullYear()}</p>
      </motion.div>

      <AnimatePresence>
        {showDialog && <SuccessDialog dark={dark} onOk={() => router.push("/")} />}
      </AnimatePresence>
    </main>
  );
}