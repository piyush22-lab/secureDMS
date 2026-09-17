import type {
  AuditEvent,
  CaseRecord,
  DocumentRecord,
  RolePermission,
  User,
} from "./types";

export const DEMO_PASSWORD = "demo1234";

export const seedUsers: User[] = [
  {
    id: "usr-001",
    name: "Capt. Elena Voss",
    email: "admin@precinct.gov",
    password: DEMO_PASSWORD,
    badgeNumber: "B-1102",
    role: "admin",
    unit: "Records & Systems",
  },
  {
    id: "usr-002",
    name: "Det. Marcus Hale",
    email: "mhale@precinct.gov",
    password: DEMO_PASSWORD,
    badgeNumber: "B-4418",
    role: "investigator",
    unit: "Major Crimes",
  },
  {
    id: "usr-003",
    name: "Sgt. Priya Raman",
    email: "praman@precinct.gov",
    password: DEMO_PASSWORD,
    badgeNumber: "B-2281",
    role: "supervisor",
    unit: "Patrol Division",
  },
  {
    id: "usr-004",
    name: "Clerk Jordan Miles",
    email: "jmiles@precinct.gov",
    password: DEMO_PASSWORD,
    badgeNumber: "B-9014",
    role: "records_clerk",
    unit: "Evidence Control",
  },
];

export const seedCases: CaseRecord[] = [
  {
    id: "CASE-2026-0142",
    title: "Warehouse burglary — 14th & Harbor",
    status: "active",
    classification: "sensitive",
    incidentType: "Burglary",
    assignedOfficer: "Det. Marcus Hale",
    openedAt: "2026-09-02T08:14:00.000Z",
    location: "1400 Harbor Ave",
    summary: "Forced entry after hours. CCTV recovered from adjacent lot.",
  },
  {
    id: "CASE-2026-0138",
    title: "Vehicle theft ring — North precinct",
    status: "open",
    classification: "restricted",
    incidentType: "Grand theft auto",
    assignedOfficer: "Sgt. Priya Raman",
    openedAt: "2026-08-21T16:40:00.000Z",
    location: "North Industrial Park",
    summary: "Pattern of VIN cloning across three jurisdictions.",
  },
  {
    id: "CASE-2026-0121",
    title: "Missing person — Riverwalk",
    status: "pending_review",
    classification: "sensitive",
    incidentType: "Missing person",
    assignedOfficer: "Det. Marcus Hale",
    openedAt: "2026-07-30T11:05:00.000Z",
    location: "Riverwalk Promenade",
    summary: "Adult missing 72+ hours. Last known location near marina.",
  },
  {
    id: "CASE-2026-0094",
    title: "Assault — Civic Center plaza",
    status: "closed",
    classification: "unclassified",
    incidentType: "Assault",
    assignedOfficer: "Sgt. Priya Raman",
    openedAt: "2026-05-12T22:18:00.000Z",
    location: "Civic Center Plaza",
    summary: "Closed after plea. Evidence retained per retention policy.",
  },
  {
    id: "CASE-2026-0155",
    title: "Fraud — municipal vendor invoices",
    status: "active",
    classification: "restricted",
    incidentType: "Fraud",
    assignedOfficer: "Capt. Elena Voss",
    openedAt: "2026-09-10T09:00:00.000Z",
    location: "City Hall annex",
    summary: "Duplicate invoice submissions across FY25–FY26.",
  },
];

export const seedDocuments: DocumentRecord[] = [
  {
    id: "doc-1001",
    name: "Incident_Report_0142.pdf",
    caseId: "CASE-2026-0142",
    mimeType: "application/pdf",
    sizeBytes: 842_112,
    uploadedBy: "Det. Marcus Hale",
    uploadedAt: "2026-09-02T09:22:00.000Z",
    classification: "sensitive",
    checksum: "sha256:7c1a9e4b2f88",
  },
  {
    id: "doc-1002",
    name: "Harbor_Lot_CCTV_clip.mp4",
    caseId: "CASE-2026-0142",
    mimeType: "video/mp4",
    sizeBytes: 48_221_440,
    uploadedBy: "Clerk Jordan Miles",
    uploadedAt: "2026-09-02T14:03:00.000Z",
    classification: "sensitive",
    checksum: "sha256:b91d0aa17e22",
  },
  {
    id: "doc-1003",
    name: "VIN_clone_spreadsheet.xlsx",
    caseId: "CASE-2026-0138",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeBytes: 221_440,
    uploadedBy: "Sgt. Priya Raman",
    uploadedAt: "2026-08-22T10:41:00.000Z",
    classification: "restricted",
    checksum: "sha256:11ae0c44d901",
  },
  {
    id: "doc-1004",
    name: "Witness_statement_Riverwalk.docx",
    caseId: "CASE-2026-0121",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    sizeBytes: 96_320,
    uploadedBy: "Det. Marcus Hale",
    uploadedAt: "2026-07-31T08:12:00.000Z",
    classification: "sensitive",
    checksum: "sha256:e4c77b10af09",
  },
  {
    id: "doc-1005",
    name: "Plea_agreement_0094.pdf",
    caseId: "CASE-2026-0094",
    mimeType: "application/pdf",
    sizeBytes: 512_000,
    uploadedBy: "Capt. Elena Voss",
    uploadedAt: "2026-06-01T15:47:00.000Z",
    classification: "unclassified",
    checksum: "sha256:90ff2c8d4411",
  },
  {
    id: "doc-1006",
    name: "Invoice_batch_FY26.pdf",
    caseId: "CASE-2026-0155",
    mimeType: "application/pdf",
    sizeBytes: 1_204_800,
    uploadedBy: "Capt. Elena Voss",
    uploadedAt: "2026-09-10T11:18:00.000Z",
    classification: "restricted",
    checksum: "sha256:c3d81e55aa70",
  },
];

export const seedAudit: AuditEvent[] = [
  {
    id: "aud-9001",
    timestamp: "2026-09-17T18:04:12.000Z",
    actor: "Det. Marcus Hale",
    role: "investigator",
    action: "view",
    resource: "CASE-2026-0142 / Incident_Report_0142.pdf",
    details: "Opened case file in secure viewer",
    ip: "10.12.4.22",
  },
  {
    id: "aud-9002",
    timestamp: "2026-09-17T16:41:03.000Z",
    actor: "Capt. Elena Voss",
    role: "admin",
    action: "permission_change",
    resource: "Role: investigator",
    details: "Enabled uploadDocuments for investigator role",
    ip: "10.12.1.8",
  },
  {
    id: "aud-9003",
    timestamp: "2026-09-16T21:12:44.000Z",
    actor: "Clerk Jordan Miles",
    role: "records_clerk",
    action: "upload",
    resource: "CASE-2026-0142 / Harbor_Lot_CCTV_clip.mp4",
    details: "Evidence intake — chain of custody tag EVD-8821",
    ip: "10.12.8.41",
  },
  {
    id: "aud-9004",
    timestamp: "2026-09-16T09:03:19.000Z",
    actor: "Sgt. Priya Raman",
    role: "supervisor",
    action: "update",
    resource: "CASE-2026-0138",
    details: "Updated assigned unit metadata",
    ip: "10.12.3.15",
  },
  {
    id: "aud-9005",
    timestamp: "2026-09-15T13:27:01.000Z",
    actor: "Det. Marcus Hale",
    role: "investigator",
    action: "download",
    resource: "CASE-2026-0121 / Witness_statement_Riverwalk.docx",
    details: "Authorized export for court packet",
    ip: "10.12.4.22",
  },
  {
    id: "aud-9006",
    timestamp: "2026-09-15T08:00:44.000Z",
    actor: "Capt. Elena Voss",
    role: "admin",
    action: "create",
    resource: "CASE-2026-0155",
    details: "Opened fraud investigation record",
    ip: "10.12.1.8",
  },
];

export const seedRoleSettings: RolePermission[] = [
  {
    role: "admin",
    label: "Admin",
    description: "Full system control, including user roles and audit export.",
    permissions: {
      viewCases: true,
      uploadDocuments: true,
      editMetadata: true,
      manageUsers: true,
      exportAudit: true,
    },
  },
  {
    role: "supervisor",
    label: "Supervisor",
    description: "Case oversight, metadata edits, and audit review.",
    permissions: {
      viewCases: true,
      uploadDocuments: true,
      editMetadata: true,
      manageUsers: false,
      exportAudit: true,
    },
  },
  {
    role: "investigator",
    label: "Investigator",
    description: "Assigned-case access, uploads, and limited metadata edits.",
    permissions: {
      viewCases: true,
      uploadDocuments: true,
      editMetadata: true,
      manageUsers: false,
      exportAudit: false,
    },
  },
  {
    role: "records_clerk",
    label: "Records clerk",
    description: "Evidence intake and cataloguing without case reassignment.",
    permissions: {
      viewCases: true,
      uploadDocuments: true,
      editMetadata: false,
      manageUsers: false,
      exportAudit: false,
    },
  },
];

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTimestamp(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function shortChecksum() {
  return `sha256:${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
}

export function nextCaseId(existing: CaseRecord[]) {
  const year = new Date().getFullYear();
  const nums = existing
    .map((item) => Number(item.id.split("-").at(-1)))
    .filter((n) => Number.isFinite(n));
  const next = (Math.max(0, ...nums) + 1).toString().padStart(4, "0");
  return `CASE-${year}-${next}`;
}
