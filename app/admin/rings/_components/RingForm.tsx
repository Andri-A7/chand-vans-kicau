"use client";

import { useState } from "react";
import { RingFormInput } from "../../../../actions/ring.actions";

type RingFormState = {
  code: string;
  material: string;
  year: string;
};

type Props = {
  initialData?: Partial<RingFormState>;
  onSubmit: (data: RingFormInput) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>;
  submitLabel?: string;
};

export default function RingForm({ initialData, onSubmit, submitLabel = "Simpan" }: Props) {
  const [form, setForm] = useState<RingFormState>({
    code: initialData?.code ?? "",
    material: initialData?.material ?? "",
    year: initialData?.year ?? "",
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
      material: form.material || undefined,
      year: form.year ? Number(form.year) : undefined,
    });

    if (!result.success) {
      setError(result.error ?? "Terjadi kesalahan");
      setErrors(result.errors ?? {});
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Ring</label>
        <input type="text" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="MB-2024-001" />
        {errors.code && <p className="text-xs text-red-600 mt-1">{errors.code[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
        <input type="text" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Aluminium, Plastik, dsb" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
        <input type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
          min="1900" max="2100"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="2024" />
        {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year[0]}</p>}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
          {loading ? "Menyimpan..." : submitLabel}
        </button>
        <a href="/admin/rings" className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
          Batal
        </a>
      </div>
    </form>
  );
}
