"use client";

import React from "react";
import { toast } from "sonner";
import { AuroraBackgroundToast } from "@/components/AuroraBackgroundToast";

export default function TestToastPage() {
  const showToast = () => {
    toast.custom((t) => (
      <AuroraBackgroundToast
        t={t}
        title="Aurora System Online"
        description="All systems are strictly nominal. The neon glow indicates optimal functionality."
      />
    ));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4">
      <div className="text-center">
        <h1 className="mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
          Neon Aurora Toast
        </h1>
        <p className="mb-8 text-slate-400">
          Click the button below to trigger the custom toast notification.
        </p>
        <button
          onClick={showToast}
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-cyan-500/40 active:scale-95"
        >
          Trigger Aurora Toast
        </button>
      </div>
    </div>
  );
}
