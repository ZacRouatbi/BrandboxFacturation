"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const COOKIE_NAME  = "bbx-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

interface ThemeContextType {
  dark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  dark: true,
  toggleDark: () => {},
});

export function ThemeProvider({
  children,
  initialDark = true,
}: {
  children:     ReactNode;
  initialDark?: boolean;
}) {
  const [dark, setDark] = useState(initialDark);

  // Keep <html class="dark"> in sync after client-side toggles
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      document.cookie = `${COOKIE_NAME}=${next ? "dark" : "light"}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);