"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import { useLogout, useMe } from "@/hooks/useAuth";
import {
  LayoutDashboard, Users, Truck, FileText, Receipt,
  LogOut, ChevronRight, Loader2, Settings, Menu, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AccountModal from "@/components/dashboard/Accountmodal";

const navItems = [
  { href: "/dashboard",              label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/clients",      label: "Clients",          icon: Users           },
  { href: "/dashboard/fournisseurs", label: "Fournisseurs",     icon: Truck           },
  { href: "/dashboard/devis",        label: "Devis",            icon: FileText        },
  { href: "/dashboard/facture",      label: "Factures",         icon: Receipt         },
];

export default function Sidebar() {
  const { dark }                      = useTheme();
  const pathname                      = usePathname();
  const { data: user }                = useMe();
  const { mutate: logout, isPending } = useLogout();
  const [menuOpen,   setMenuOpen]     = useState(false);
  const [modalOpen,  setModalOpen]    = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  // Close on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarInner = (
    <>
      {/* Logo */}
      <div className={`flex h-16 shrink-0 items-center border-b px-6 ${dark ? "border-neutral-800" : "border-amber-100"}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dark ? "dark" : "light"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Image src={dark ? "/logo-light.png" : "/logo-dark.png"} alt="Brandbox" width={120} height={38} priority />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-[#FBAE17] text-black shadow-lg shadow-[#FBAE17]/20"
                    : dark
                    ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    : "text-neutral-500 hover:bg-amber-50 hover:text-black"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="opacity-60" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className={`shrink-0 border-t p-3 ${dark ? "border-neutral-800" : "border-amber-100"}`}>
        {user && (
          <div className="relative mb-2">
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`absolute bottom-full left-0 right-0 z-50 mb-2 rounded-xl border shadow-xl ${
                      dark ? "border-neutral-700 bg-neutral-900" : "border-amber-100 bg-white"
                    }`}
                  >
                    <button
                      onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                        dark ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-500 hover:bg-amber-50 hover:text-black"
                      }`}
                    >
                      <Settings size={14} />
                      Paramètres du compte
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <button
              onClick={() => setMenuOpen(p => !p)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                menuOpen
                  ? dark ? "bg-neutral-800" : "bg-amber-100/70"
                  : dark ? "bg-neutral-800/50 hover:bg-neutral-800" : "bg-amber-50/50 hover:bg-amber-100/50"
              }`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                dark ? "bg-neutral-700 text-[#FBAE17]" : "bg-amber-100 text-[#FBAE17]"
              }`}>
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <span className={`flex-1 truncate text-left text-xs font-medium ${dark ? "text-neutral-300" : "text-neutral-600"}`}>
                {user.username}
              </span>
              <motion.div animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight size={12} className={`-rotate-90 ${dark ? "text-neutral-500" : "text-neutral-400"}`} />
              </motion.div>
            </button>
          </div>
        )}

        <button
          onClick={() => logout()}
          disabled={isPending}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 disabled:opacity-50 ${
            dark ? "text-neutral-400 hover:bg-neutral-800 hover:text-red-400" : "text-neutral-500 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
          <span>{isPending ? "Déconnexion…" : "Déconnexion"}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop (lg+) — always visible ── */}
      <aside className={`hidden lg:flex h-screen w-64 flex-col border-r transition-colors duration-500 ${
        dark ? "border-neutral-800 bg-neutral-900/80 backdrop-blur-xl" : "border-amber-100 bg-white/80 backdrop-blur-xl"
      }`}>
        {sidebarInner}
      </aside>

      {/* ── Mobile toggle button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`lg:hidden fixed top-3.5 left-3 z-40 flex h-9 w-9 items-center justify-center rounded-xl border shadow-md transition-colors ${
          dark ? "border-neutral-700 bg-neutral-900 text-white" : "border-amber-100 bg-white text-black"
        }`}
      >
        <Menu size={18} />
      </button>

      {/* ── Mobile sidebar + backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className={`lg:hidden fixed inset-y-0 left-0 z-[60] flex w-72 flex-col border-r shadow-2xl ${
                dark ? "border-neutral-800 bg-neutral-900" : "border-amber-100 bg-white"
              }`}
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  dark ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                <X size={16} />
              </button>
              {sidebarInner}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Account modal */}
      <AnimatePresence>
        {modalOpen && user && (
          <AccountModal dark={dark} user={user} onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}