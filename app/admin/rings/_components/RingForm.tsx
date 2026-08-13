"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CircleDot } from "lucide-react";
import { RingFormInput } from "../../../../actions/ring.actions";

type RingFormState = {
  code: string;
  isAssigned: boolean;
};

type Props = {
  initialData?: Partial<RingFormState>;
  onSubmit: (
    data: RingFormInput
  ) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>;
  submitLabel?: string;
};

export default function RingForm({
  initialData,
  onSubmit,
  submitLabel = "Simpan",
}: Props) {
  const [form, setForm] = useState<RingFormState>({
    code: initialData?.code ?? "",
    isAssigned: initialData?.isAssigned ?? false,
  });
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});

    const result = await onSubmit({
      code: form.code,
      isAssigned: form.isAssigned,
    });

    if (!result.success) {
      setError(result.error ?? "Terjadi kesalahan");
      setErrors(result.errors ?? {});
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
          <CircleDot className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Detail Ring</h2>
          <p className="text-xs text-slate-500">
            Lengkapi informasi ring di bawah ini
          </p>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <label
            htmlFor="ring-code"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Nomor Ring
          </label>
          <input
            id="ring-code"
            type="text"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            required
            placeholder="MB-2024-001"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.code && (
            <p className="mt-1.5 text-xs text-red-600">{errors.code[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="ring-status"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="ring-status"
            value={form.isAssigned ? "assigned" : "available"}
            onChange={(e) =>
              setForm((f) => ({ ...f, isAssigned: e.target.value === "assigned" }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="available">Available (Tersedia)</option>
            <option value="assigned">Assigned (Terpakai)</option>
          </select>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <Link
          href="/admin/rings"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {loading ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
