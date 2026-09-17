export type Role = "admin" | "supervisor" | "investigator" | "records_clerk";

export type Classification = "unclassified" | "sensitive" | "restricted";

export type CaseStatus = "open" | "active" | "pending_review" | "closed";

export type AuditAction =
  | "view"
  | "upload"
  | "update"
  | "create"
  | "download"
  | "permission_change"
  | "login";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  badgeNumber: string;
  role: Role;
  unit: string;
};

export type SessionUser = Omit<User, "password">;

export type CaseRecord = {
  id: string;
  title: string;
  status: CaseStatus;
  classification: Classification;
  incidentType: string;
  assignedOfficer: string;
  openedAt: string;
  location: string;
  summary: string;
};

export type DocumentRecord = {
  id: string;
  name: string;
  caseId: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  classification: Classification;
  checksum: string;
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  role: Role;
  action: AuditAction;
  resource: string;
  details: string;
  ip: string;
};

export type RolePermission = {
  role: Role;
  label: string;
  description: string;
  permissions: {
    viewCases: boolean;
    uploadDocuments: boolean;
    editMetadata: boolean;
    manageUsers: boolean;
    exportAudit: boolean;
  };
};
