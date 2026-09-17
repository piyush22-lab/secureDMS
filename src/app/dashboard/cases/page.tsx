"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { formatTimestamp } from "@/lib/seed-data";
import type { CaseStatus, Classification } from "@/lib/types";

const statusStyles: Record<CaseStatus, string> = {
  open: "bg-sky-500/15 text-sky-200",
  active: "bg-amber-500/15 text-amber-200",
  pending_review: "bg-violet-500/15 text-violet-200",
  closed: "bg-slate-500/20 text-slate-300",
};

export default function CasesPage() {
  const { cases, documents, addCase } = useAppData();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CaseStatus | "all">("all");
  const [openForm, setOpenForm] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const hay = `${item.id} ${item.title} ${item.incidentType} ${item.assignedOfficer}`.toLowerCase();
      return matchesStatus && (q ? hay.includes(q) : true);
    });
  }, [cases, query, status]);

  function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const form = new FormData(event.currentTarget);
    addCase(
      {
        title: String(form.get("title")),
        status: String(form.get("status")) as CaseStatus,
        classification: String(form.get("classification")) as Classification,
        incidentType: String(form.get("incidentType")),
        assignedOfficer: user.name,
        location: String(form.get("location")),
        summary: String(form.get("summary")),
      },
      user,
    );
    setOpenForm(false);
    event.currentTarget.reset();
  }

  return (
    <>
      <TopBar
        title="Case management & metadata"
        subtitle="Create incidents, list active cases, and filter files by case ID."
      />
      <div className="space-y-6 px-5 py-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex-1 min-w-56">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by case ID, title, officer…"
              className="w-full rounded-lg border border-white/10 bg-[#12263d] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[#d4a017]"
            />
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CaseStatus | "all")}
            className="rounded-lg border border-white/10 bg-[#12263d] px-3 py-2 text-sm text-white outline-none focus:border-[#d4a017]"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="active">Active</option>
            <option value="pending_review">Pending review</option>
            <option value="closed">Closed</option>
          </select>
          <button
            type="button"
            onClick={() => setOpenForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d4a017] px-4 py-2 text-sm font-semibold text-[#07111f]"
          >
            <Plus className="h-4 w-4" />
            New case
          </button>
        </div>

        {openForm && (
          <form
            onSubmit={onCreate}
            className="grid gap-3 rounded-xl border border-white/10 bg-[#12263d] p-5 md:grid-cols-2"
          >
            <Field name="title" label="Incident title" placeholder="Armed robbery — 3rd & Pine" required />
            <Field name="incidentType" label="Incident type" placeholder="Robbery" required />
            <Field name="location" label="Location" placeholder="Precinct 4" required />
            <label className="text-sm">
              <span className="mb-1 block text-slate-300">Status</span>
              <select
                name="status"
                defaultValue="open"
                className="w-full rounded-lg border border-white/10 bg-[#0c1b2e] px-3 py-2 text-white"
              >
                <option value="open">Open</option>
                <option value="active">Active</option>
                <option value="pending_review">Pending review</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-slate-300">Classification</span>
              <select
                name="classification"
                defaultValue="sensitive"
                className="w-full rounded-lg border border-white/10 bg-[#0c1b2e] px-3 py-2 text-white"
              >
                <option value="unclassified">Unclassified</option>
                <option value="sensitive">Sensitive</option>
                <option value="restricted">Restricted</option>
              </select>
            </label>
            <label className="text-sm md:col-span-2">
              <span className="mb-1 block text-slate-300">Summary</span>
              <textarea
                name="summary"
                required
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-[#0c1b2e] px-3 py-2 text-white outline-none focus:border-[#d4a017]"
              />
            </label>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-[#d4a017] px-4 py-2 text-sm font-semibold text-[#07111f]">
                Create case record
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {filtered.map((item) => {
            const linked = documents.filter((doc) => doc.caseId === item.id);
            return (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-[#12263d] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-[#e8c36a]">{item.id}</p>
                    <h2 className="mt-1 font-[family-name:var(--font-serif)] text-xl text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm text-slate-400">{item.summary}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs capitalize ${statusStyles[item.status]}`}>
                    {item.status.replace("_", " ")}
                  </span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <Meta label="Type" value={item.incidentType} />
                  <Meta label="Assigned" value={item.assignedOfficer} />
                  <Meta label="Opened" value={formatTimestamp(item.openedAt)} />
                  <Meta label="Location" value={item.location} />
                </dl>
                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Linked files ({linked.length})
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {linked.length === 0 && (
                      <li className="text-sm text-slate-500">No documents indexed to this case ID yet.</li>
                    )}
                    {linked.map((doc) => (
                      <li
                        key={doc.id}
                        className="rounded-md bg-[#0c1b2e] px-2.5 py-1 font-mono text-xs text-slate-300"
                      >
                        {doc.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-slate-300">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-[#0c1b2e] px-3 py-2 text-white outline-none focus:border-[#d4a017]"
      />
    </label>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-200">{value}</dd>
    </div>
  );
}
