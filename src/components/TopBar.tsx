"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const roleLabel: Record<string, string> = {
  admin: "Admin",
  supervisor: "Supervisor",
  investigator: "Investigator",
  records_clerk: "Records clerk",
};

export function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0c1b2e]/90 px-5 py-4 backdrop-blur lg:px-8">
      <div>
        <h1 className="font-[family-name:var(--font-serif)] text-xl text-white">{title}</h1>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm text-white">{user.name}</p>
            <p className="text-xs text-slate-400">
              {roleLabel[user.role]} · {user.badgeNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:border-[#d4a017]/50 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
