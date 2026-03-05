"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import {
  LayoutDashboard,
  Users,
  Truck,
  FileText,
  Receipt,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard",             label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/clients",     label: "Clients",          icon: Users           },
  { href: "/dashboard/fournisseurs",label: "Fournisseurs",     icon: Truck           },
  { href: "/dashboard/devis",       label: "Devis",            icon: FileText        },
  { href: "/dashboard/facture",     label: "Factures",         icon: Receipt         },
];

export default function Sidebar() {
  const { dark } = useTheme();
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-screen w-64 flex-col border-r transition-colors duration-500 ${
        dark
          ? "border-neutral-800 bg-neutral-900/80 backdrop-blur-xl"
          : "border-amber-100 bg-white/80 backdrop-blur-xl"
      }`}
    >
      {/* Logo */}
      <div className={`flex h-16 items-center border-b px-6 ${dark ? "border-neutral-800" : "border-amber-100"}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dark ? "dark" : "light"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={dark ? "/logo-light.png" : "/logo-dark.png"}
              alt="Brandbox"
              width={120}
              height={38}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
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

      {/* Logout */}
      <div className={`border-t p-3 ${dark ? "border-neutral-800" : "border-amber-100"}`}>
        <button
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
            dark
              ? "text-neutral-400 hover:bg-neutral-800 hover:text-red-400"
              : "text-neutral-500 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}