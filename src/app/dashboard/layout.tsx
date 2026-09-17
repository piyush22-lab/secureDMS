"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { MobileNav, Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Checking credentials…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1b2e]">
      <Sidebar />
      <div className="lg:pl-64">
        <div className="pb-20 lg:pb-0">{children}</div>
      </div>
      <MobileNav />
    </div>
  );
}
