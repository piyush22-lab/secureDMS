"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { formatTimestamp } from "@/lib/seed-data";
import type { AuditAction, RolePermission } from "@/lib/types";

const actionLabels: Record<AuditAction, string> = {
  view: "View",
  upload: "Upload",
  update: "Update",
  create: "Create",
  download: "Download",
  permission_change: "Permission",
  login: "Login",
};

const permissionKeys: { key: keyof RolePermission["permissions"]; label: string }[] = [
  { key: "viewCases", label: "View cases" },
  { key: "uploadDocuments", label: "Upload documents" },
  { key: "editMetadata", label: "Edit metadata" },
  { key: "manageUsers", label: "Manage users" },
  { key: "exportAudit", label: "Export audit" },
];

export default function AccessPage() {
  const { audit, roles, updateRolePermission } = useAppData();
  const { user } = useAuth();
  const [action, setAction] = useState<AuditAction | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return audit.filter((item) => {
      const matchesAction = action === "all" || item.action === action;
      const hay = `${item.actor} ${item.resource} ${item.details}`.toLowerCase();
      return matchesAction && (q ? hay.includes(q) : true);
    });
  }, [audit, action, query]);

  const canToggle = user?.role === "admin";

  return (
    <>
      <TopBar
        title="Access control & audit logs"
        subtitle="Simulated immutable log plus sample role settings (Admin vs Investigator)."
      />
      <div className="space-y-6 px-5 py-8 lg:px-8">
        <section className="rounded-xl border border-white/10 bg-[#12263d] p-5">
          <h2 className="font-[family-name:var(--font-serif)] text-lg text-white">
            Role matrix
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Prototype permissions. Toggles are available to Admin accounts and write an audit event.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-3 py-2">Role</th>
                  {permissionKeys.map((item) => (
                    <th key={item.key} className="px-3 py-2">
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {roles.map((role) => (
                  <tr key={role.role} className="text-slate-200">
                    <td className="px-3 py-3">
                      <p className="font-medium text-white">{role.label}</p>
                      <p className="max-w-xs text-xs text-slate-500">{role.description}</p>
                    </td>
                    {permissionKeys.map((item) => (
                      <td key={item.key} className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={role.permissions[item.key]}
                          disabled={!canToggle}
                          onChange={(e) => {
                            if (!user) return;
                            updateRolePermission(role.role, item.key, e.target.checked, user);
                          }}
                          className="h-4 w-4 accent-[#d4a017]"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!canToggle && (
            <p className="mt-3 text-xs text-slate-500">
              Signed in as {user?.role}. Switch to admin@precinct.gov to edit the matrix.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-[#12263d]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Immutable audit log</h2>
              <p className="text-xs text-slate-500">
                Append-only in this prototype — events cannot be deleted from the UI.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter actor or resource…"
                className="rounded-lg border border-white/10 bg-[#0c1b2e] px-3 py-2 text-sm text-white outline-none focus:border-[#d4a017]"
              />
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as AuditAction | "all")}
                className="rounded-lg border border-white/10 bg-[#0c1b2e] px-3 py-2 text-sm text-white"
              >
                <option value="all">All actions</option>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Actor</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Resource</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-5 py-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                      {formatTimestamp(item.timestamp)}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-white">{item.actor}</p>
                      <p className="text-xs capitalize text-slate-500">{item.role.replace("_", " ")}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                        {actionLabels[item.action]}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-300">{item.resource}</td>
                    <td className="px-5 py-3 text-slate-300">{item.details}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{item.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
