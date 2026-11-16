import type { ReactNode } from "react";
import { ApiError } from "../api/client";

export function PageHeader({ title, icon, iconClass = "bg-blue-100 text-blue-700", children }: {
  title: string;
  icon: string;
  iconClass?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8 px-6 py-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`flex items-center justify-center w-12 h-12 rounded-md shadow-sm shrink-0 ${iconClass}`}>
          <i className={`ph ${icon} text-2xl`}></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight truncate">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
      <i className="ph ph-circle-notch animate-spin text-lg"></i> Cargando…
    </div>
  );
}

export function ErrorMessage({ error }: { error: unknown }) {
  const message = error instanceof ApiError || error instanceof Error ? error.message : "Algo salió mal.";
  return (
    <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-md shadow-sm">
      <i className="ph ph-warning-circle text-lg text-red-500 shrink-0"></i>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 px-6 bg-white border border-dashed border-gray-300 rounded-xl text-center">
      <i className={`ph ${icon} text-3xl text-gray-300`}></i>
      <p className="text-sm text-gray-500">{children}</p>
    </div>
  );
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  const button =
    "cursor-pointer flex items-center gap-1 rounded-md bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-default";
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button className={button} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <i className="ph ph-caret-left"></i> Anterior
      </button>
      <span className="text-sm text-gray-500">
        Página {page} de {totalPages}
      </span>
      <button className={button} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Siguiente <i className="ph ph-caret-right"></i>
      </button>
    </div>
  );
}

export function Field({ label, icon, children }: { label: string; icon: string; children: ReactNode }) {
  return (
    <div className="px-6 py-4 flex items-start gap-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 shrink-0">
        <i className={`ph ${icon} text-sm`}></i>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <div className="text-sm font-semibold text-gray-900 mt-0.5 break-words">{children}</div>
      </div>
    </div>
  );
}
