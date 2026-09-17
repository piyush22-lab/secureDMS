"use client";

import { useMemo, useRef, useState, type DragEvent } from "react";
import { Search, Upload, X } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { formatBytes, formatTimestamp, seedDocuments } from "@/lib/seed-data";
import type { Classification, DocumentRecord } from "@/lib/types";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function mockSha256() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `sha256:${hex}`;
}

function toBrowserItem(file: File, caseId: string, uploadedBy: string): DocumentRecord {
  return {
    id: `doc-${crypto.randomUUID()}`,
    name: file.name,
    caseId,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
    classification: "sensitive",
    checksum: mockSha256(),
  };
}

export default function DocumentsPage() {
  const { cases } = useAppData();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<DocumentRecord[]>(seedDocuments);
  const [query, setQuery] = useState("");
  const [caseId, setCaseId] = useState(cases[0]?.id ?? "CASE-2026-0142");
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selected, setSelected] = useState<DocumentRecord | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter((doc) => {
      const hay = `${doc.name} ${doc.caseId} ${doc.uploadedBy}`.toLowerCase();
      return q ? hay.includes(q) : true;
    });
  }, [files, query]);

  async function ingest(list: FileList | File[] | null) {
  
 } function ingest(list: FileList | File[] | null) {
    if (!list) return;
    const incoming = Array.from(list);
    if (!incoming.length) return;

    const officer = user?.name ?? "Unknown officer";
    const nextItems = incoming.map((file) => toBrowserItem(file, caseId, officer));
    setFiles((prev) => [...nextItems, ...prev]);

    // Loop through and upload each file to Supabase Storage
  for (const file of incoming) {
    const filePath = uploads/${Date.now()}-${file.name};
    
    const { error: uploadError } = await supabase.storage
      .from('documents') // Make sure you have a bucket named 'documents' in Supabase
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError.message);
      setNotice(Failed to upload ${file.name});
      return;
    }
  }
    setNotice(
      nextItems.length === 1
        ? `${nextItems[0].name} added to the file browser.`
        : `${nextItems.length} files added to the file browser.`,
    );
  }

  function onDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setDragging(false);
    ingest(event.dataTransfer.files);
  }

  return (
    <>
      <TopBar
        title="Document upload & storage"
        subtitle="Encrypted dropzone and case-linked file browser (prototype)."
      />
      <div className="space-y-6 px-5 py-8 lg:px-8">
        <section
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("button, select, label, input")) return;
            fileInputRef.current?.click();
          }}
          className={`cursor-pointer rounded-xl border border-dashed p-8 text-center transition ${
            dragging
              ? "border-[#d4a017] bg-[#d4a017]/10"
              : "border-white/15 bg-[#12263d]"
          }`}
        >
          <Upload className="mx-auto h-8 w-8 text-[#d4a017]" />
          <h2 className="mt-3 font-[family-name:var(--font-serif)] text-xl text-white">
            Secure intake dropzone
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Drop files here or use Choose files. Filename, size, today’s date, and a mock SHA-256
            checksum are captured in this page’s state.
          </p>
          <div
            className="mx-auto mt-5 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end"
            onClick={(event) => event.stopPropagation()}
          >
            <label className="flex-1 text-left text-sm">
              <span className="mb-1 block text-slate-400">Target case</span>
              <select
                value={caseId}
                onChange={(event) => setCaseId(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0c1b2e] px-3 py-2 text-white outline-none focus:border-[#d4a017]"
              >
                {cases.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} — {item.title}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-lg bg-[#d4a017] px-4 py-2.5 text-sm font-semibold text-[#07111f] hover:bg-[#e8c36a]"
            >
              Choose files
            </button>
            <input
              ref={fileInputRef}
              id="case-file-input"
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => {
                ingest(event.target.files);
                event.target.value = "";
              }}
            />
          </div>
          {notice && <p className="mt-4 text-sm text-[#e8c36a]">{notice}</p>}
        </section>

        <section className="rounded-xl border border-white/10 bg-[#12263d]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">File browser</h2>
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, case ID, officer…"
                className="w-72 max-w-full rounded-lg border border-white/10 bg-[#0c1b2e] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[#d4a017]"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Document</th>
                  <th className="px-5 py-3">Case ID</th>
                  <th className="px-5 py-3">Classification</th>
                  <th className="px-5 py-3">Size</th>
                  <th className="px-5 py-3">Uploaded</th>
                  <th className="px-5 py-3">Checksum</th>
                  <th className="px-5 py-3"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((doc,index) => (
                  <tr key={doc.id} className="text-slate-200">
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.uploadedBy}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">{doc.caseId}</td>
                    <td className="px-5 py-3">
                    <ClassificationBadge value={doc.classification} />
{index === 0 && (
  <span className="ml-2 inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold text-white tracking-wide uppercase">
    Sensitive
  </span>
)}
                    </td>
                    <td className="px-5 py-3 text-slate-400">{formatBytes(doc.sizeBytes)}</td>
                    <td className="px-5 py-3 text-slate-400">{formatTimestamp(doc.uploadedAt)}</td>
                    <td className="max-w-[12rem] truncate px-5 py-3 font-mono text-xs text-slate-500">
                      {doc.checksum}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(doc)}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-[#d4a017]/60 hover:text-white"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                      No documents match this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selected && (
        <FileDetailsModal document={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function ClassificationBadge({ value }: { value: Classification | string }) {
  const isSensitive = String(value).toLowerCase() === "sensitive";
  if (isSensitive) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-red-300 ring-1 ring-red-500/40">
        Sensitive
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize text-slate-200">
      {value}
    </span>
  );
}

function FileDetailsModal({
  document,
  onClose,
}: {
  document: DocumentRecord;
  onClose: () => void;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "File name", value: document.name },
    { label: "Case ID", value: document.caseId },
    { label: "Classification", value: document.classification },
    { label: "MIME type", value: document.mimeType },
    { label: "Size", value: `${formatBytes(document.sizeBytes)} (${document.sizeBytes} bytes)` },
    { label: "Uploaded by", value: document.uploadedBy },
    { label: "Upload date", value: formatTimestamp(document.uploadedAt) },
    { label: "Checksum", value: document.checksum },
    { label: "Record ID", value: document.id },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="file-details-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0c1b2e] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#e8c36a]">Evidence record</p>
            <h2 id="file-details-title" className="mt-1 font-[family-name:var(--font-serif)] text-xl text-white">
              {document.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">
          <ClassificationBadge value={document.classification} />
        </div>
        <dl className="mt-5 space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[8rem_1fr] gap-3 text-sm">
              <dt className="text-slate-500">{row.label}</dt>
              <dd className="break-all text-slate-200">{row.value}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-[#d4a017] px-4 py-2.5 text-sm font-semibold text-[#07111f]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
