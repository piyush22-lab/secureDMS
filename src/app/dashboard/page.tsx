"use client";

import Link from "next/link";
import { FileStack, Folders, ScrollText } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useAppData } from "@/context/AppDataContext";
import { formatTimestamp } from "@/lib/seed-data";

export default function DashboardPage() {
  const { cases, documents, audit } = useAppData();
  const active = cases.filter((item) => item.status === "active" || item.status === "open").length;

  const cards = [
    { label: "Active / open cases", value: String(active), href: "/dashboard/cases" },
    { label: "Secured documents", value: String(documents.length), href: "/dashboard/documents" },
    { label: "Audit events", value: String(audit.length), href: "/dashboard/access" },
    {
      label: "Restricted files",
      value: String(documents.filter((d) => d.classification === "restricted").length),
      href: "/dashboard/documents",
    },
  ];

  return (
    <>
      <TopBar
        title="Command overview"
        subtitle="Live prototype workspace — dummy records, fully navigable."
      />
      <div className="space-y-8 px-5 py-8 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-white/10 bg-[#12263d] p-5 transition hover:border-[#d4a017]/40"
            >
              <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
              <p className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-white">
                {card.value}
              </p>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <SliceCard
            href="/dashboard/documents"
            icon={FileStack}
            title="Document upload & storage"
            body="Dropzone intake plus a case-linked file browser. Own this vertical slice."
          />
          <SliceCard
            href="/dashboard/cases"
            icon={Folders}
            title="Case management & metadata"
            body="Create incidents, browse active cases, and filter files by case ID."
          />
          <SliceCard
            href="/dashboard/access"
            icon={ScrollText}
            title="Access control & audit logs"
            body="Immutable-style event table and Admin vs Investigator role settings."
          />
        </section>

        <section className="rounded-xl border border-white/10 bg-[#12263d]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">Recent audit trail</h2>
          </div>
          <ul className="divide-y divide-white/5">
            {audit.slice(0, 5).map((event) => (
              <li key={event.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                <div>
                  <p className="text-slate-200">{event.details}</p>
                  <p className="text-xs text-slate-500">
                    {event.actor} · {event.resource}
                  </p>
                </div>
                <p className="text-xs text-slate-400">{formatTimestamp(event.timestamp)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function SliceCard({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string;
  icon: typeof FileStack;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-[#12263d] p-5 transition hover:border-[#d4a017]/40"
    >
      <Icon className="h-5 w-5 text-[#d4a017]" />
      <h2 className="mt-4 font-[family-name:var(--font-serif)] text-lg text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
      <p className="mt-4 text-xs uppercase tracking-wider text-[#e8c36a]">Open workspace →</p>
    </Link>
  );
}
