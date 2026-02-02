"use client";

import React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuroraBackgroundToastProps {
  t: string | number; // toast id
  title: string;
  description?: string;
  onDismiss?: () => void;
}

export function AuroraBackgroundToast({
  t,
  title,
  description,
  onDismiss,
}: AuroraBackgroundToastProps) {
  return (
    <div
      className={cn(
        "relative w-[356px] overflow-hidden rounded-xl bg-slate-950 p-[1px] shadow-2xl transition-all hover:scale-[1.01]"
      )}
    >
      {/* Aurora Gradient Animation */}
      <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] opacity-70 blur-xl">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-20" />
        <div className="absolute inset-0 bg-[conic-gradient(from_90deg,var(--tw-gradient-stops))] from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-60 mix-blend-screen" />
      </div>

      {/* Inner Content Container */}
      <div className="relative h-full w-full rounded-xl bg-slate-950/90 p-4 backdrop-blur-3xl">
        {/* Glow effects */}
        <div className="absolute -left-4 -top-4 h-24 w-24 bg-purple-500/20 blur-2xl" />
        <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-cyan-500/20 blur-2xl" />

        <div className="relative flex gap-3">
          <div className="flex-1">
            <h3 className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-sm font-semibold text-transparent">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            )}
          </div>
          <button
            onClick={() => {
              toast.dismiss(t);
              onDismiss?.();
            }}
            className="group -mr-1 -mt-1 h-6 w-6 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
     {/* Inline style for keyframes if not in global css */}
    </div>
  );
}
