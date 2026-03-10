import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandBox",
  description: "Facturation BrandBox",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("bbx-theme")?.value;
  const initialDark = themeCookie !== "light";

  return (
    <html
      lang="fr"
      className={initialDark ? "dark" : ""}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ThemeProvider initialDark={initialDark}>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}