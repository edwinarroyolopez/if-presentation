import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PresentationShell } from "@/components/app-shell/PresentationShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InflightOS — Evaluación estratégica",
    template: "%s · InflightOS",
  },
  description: "Presentación pública e interactiva de InflightOS para una evaluación técnica de plataforma ERP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`} data-theme="dark">
      <body>
        <PresentationShell>{children}</PresentationShell>
      </body>
    </html>
  );
}
