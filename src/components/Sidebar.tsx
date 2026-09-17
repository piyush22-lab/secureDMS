"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileStack,
  Folders,
  LayoutDashboard,
  ScrollText,
  Shield,
} from "lucide-react";
import { BrandMark } from "./BrandMark";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileStack },
  { href: "/dashboard/cases", label: "Cases", icon: Folders },
  { href: "/dashboard/access", label: "Access & audit", icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-[#07111f] lg:flex">
      <div className="border-b border-white/10 px-5 py-5">
        <BrandMark />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-[#1a3454] text-white shadow-inner"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d4a017]" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4 text-xs text-slate-500">
        <p className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-[#d4a017]" />
          CJIS-aligned prototype
        </p>
        <p className="mt-1">Session encrypted in-browser only.</p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/10 bg-[#07111f] lg:hidden">
      {links.map((link) => {
        const active =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 py-3 text-[11px] ${
              active ? "text-[#e8c36a]" : "text-slate-400"
            }`}
          >
            <Icon className="h-4 w-4" />
            {link.label.split(" ")[0]}
          </Link>
        );
      })}
    </nav>
  );
}
