"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  nextCaseId,
  seedAudit,
  seedCases,
  seedDocuments,
  seedRoleSettings,
  shortChecksum,
} from "@/lib/seed-data";
import type {
  AuditAction,
  AuditEvent,
  CaseRecord,
  Classification,
  DocumentRecord,
  Role,
  RolePermission,
  SessionUser,
} from "@/lib/types";

const DATA_KEY = "le-dms-store";

type Store = {
  cases: CaseRecord[];
  documents: DocumentRecord[];
  audit: AuditEvent[];
  roles: RolePermission[];
};

const defaultStore: Store = {
  cases: seedCases,
  documents: seedDocuments,
  audit: seedAudit,
  roles: seedRoleSettings,
};

type AppDataContextValue = Store & {
  ready: boolean;
  addCase: (
    input: Omit<CaseRecord, "id" | "openedAt">,
    actor: SessionUser,
  ) => CaseRecord;
  addDocuments: (files: File[], caseId: string, actor: SessionUser) => void;
  logEvent: (
    actor: SessionUser,
    action: AuditAction,
    resource: string,
    details: string,
  ) => void;
  updateRolePermission: (
    role: Role,
    key: keyof RolePermission["permissions"],
    value: boolean,
    actor: SessionUser,
  ) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function loadStore(): Store {
  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) {
    localStorage.setItem(DATA_KEY, JSON.stringify(defaultStore));
    return defaultStore;
  }
  try {
    return { ...defaultStore, ...(JSON.parse(raw) as Store) };
  } catch {
    return defaultStore;
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(defaultStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setReady(true);
  }, []);

  const logEvent = useCallback(
    (actor: SessionUser, action: AuditAction, resource: string, details: string) => {
      const event: AuditEvent = {
        id: `aud-${crypto.randomUUID().slice(0, 8)}`,
        timestamp: new Date().toISOString(),
        actor: actor.name,
        role: actor.role,
        action,
        resource,
        details,
        ip: "10.12.4.22",
      };
      setStore((prev) => {
        const next = { ...prev, audit: [event, ...prev.audit] };
        localStorage.setItem(DATA_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const addCase = useCallback(
    (input: Omit<CaseRecord, "id" | "openedAt">, actor: SessionUser) => {
      let created!: CaseRecord;
      setStore((prev) => {
        created = {
          ...input,
          id: nextCaseId(prev.cases),
          openedAt: new Date().toISOString(),
        };
        const event: AuditEvent = {
          id: `aud-${crypto.randomUUID().slice(0, 8)}`,
          timestamp: created.openedAt,
          actor: actor.name,
          role: actor.role,
          action: "create",
          resource: created.id,
          details: `Opened case “${created.title}”`,
          ip: "10.12.4.22",
        };
        const next = {
          ...prev,
          cases: [created, ...prev.cases],
          audit: [event, ...prev.audit],
        };
        localStorage.setItem(DATA_KEY, JSON.stringify(next));
        return next;
      });
      return created;
    },
    [],
  );

  const addDocuments = useCallback(
    (files: File[], caseId: string, actor: SessionUser) => {
      const uploadedAt = new Date().toISOString();
      const docs: DocumentRecord[] = files.map((file) => ({
        id: `doc-${crypto.randomUUID().slice(0, 8)}`,
        name: file.name,
        caseId,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        uploadedBy: actor.name,
        uploadedAt,
        classification: "sensitive" as Classification,
        checksum: shortChecksum(),
      }));
      const events: AuditEvent[] = docs.map((doc) => ({
        id: `aud-${crypto.randomUUID().slice(0, 8)}`,
        timestamp: uploadedAt,
        actor: actor.name,
        role: actor.role,
        action: "upload",
        resource: `${caseId} / ${doc.name}`,
        details: "Secure intake via encrypted dropzone (prototype)",
        ip: "10.12.4.22",
      }));
      setStore((prev) => {
        const next = {
          ...prev,
          documents: [...docs, ...prev.documents],
          audit: [...events, ...prev.audit],
        };
        localStorage.setItem(DATA_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const updateRolePermission = useCallback(
    (
      role: Role,
      key: keyof RolePermission["permissions"],
      value: boolean,
      actor: SessionUser,
    ) => {
      setStore((prev) => {
        const next = {
          ...prev,
          roles: prev.roles.map((item) =>
            item.role === role
              ? { ...item, permissions: { ...item.permissions, [key]: value } }
              : item,
          ),
          audit: [
            {
              id: `aud-${crypto.randomUUID().slice(0, 8)}`,
              timestamp: new Date().toISOString(),
              actor: actor.name,
              role: actor.role,
              action: "permission_change" as const,
              resource: `Role: ${role}`,
              details: `${key} set to ${value ? "enabled" : "disabled"}`,
              ip: "10.12.1.8",
            },
            ...prev.audit,
          ],
        };
        localStorage.setItem(DATA_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      ...store,
      ready,
      addCase,
      addDocuments,
      logEvent,
      updateRolePermission,
    }),
    [store, ready, addCase, addDocuments, logEvent, updateRolePermission],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
