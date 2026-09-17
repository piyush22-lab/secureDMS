import { Shield } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4a017] text-[#07111f] shadow-[0_0_24px_rgba(212,160,23,0.35)]">
        <Shield className="h-5 w-5" strokeWidth={2.25} />
      </div>
      {!compact && (
        <div>
          <p className="font-[family-name:var(--font-serif)] text-lg leading-none tracking-wide text-white">
            Aegis Records
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Secure case files
          </p>
        </div>
      )}
    </div>
  );
}
