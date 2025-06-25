import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ReminderProvider } from "@/components/ReminderProvider";

// Reminder service will be initialized by the client-side component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PowerGrid Report - Electrical Fault Reporting System",
  description: "Report and manage electrical faults and transformer issues",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReminderProvider />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
