"use client";

import { Sidebar } from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground font-sans antialiased">
      <Sidebar />
      <div className="flex-1 pl-64 transition-all duration-300 ease-in-out">
        <main className="h-full p-8 pt-6">
            {children}
        </main>
      </div>
    </div>
  );
}
