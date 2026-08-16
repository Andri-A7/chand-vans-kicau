"use client";

import { useState } from "react";
import { BannerFormInput } from "../../../../actions/banner.actions";
import { uploadBirdImage } from "../../../../lib/supabase";

type Props = {
  initialData?: Partial<BannerFormInput & { imagePreview?: string }>;
  onSubmit: (data: BannerFormInput) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>;
  submitLabel?: string;
};

export default function BannerForm({ initialData, onSubmit, submitLabel = "Simpan" }: Props) {
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    subtitle: initialData?.subtitle ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    targetUrl: initialData?.targetUrl ?? "",
    isActive: initialData?.isActive ?? true,
    order: initialData?.order?.toString() ?? "0",
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadBirdImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch {
      setError("Upload gambar gagal");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});

    const result = await onSubmit({
      title: form.title,
      subtitle: form.subtitle || undefined,
      imageUrl: form.imageUrl,
      targetUrl: form.targetUrl || undefined,
      isActive: form.isActive,
      order: Number(form.order),
    });

    if (!result.success) {
      setError(result.error ?? "Terjadi kesalahan");
      setErrors(result.errors ?? {});
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Judul</label>
        <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required
          className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title[0]}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Subtitle</label>
        <input type="text" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" placeholder="Opsional" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Gambar Banner</label>
        {form.imageUrl && (
          <div className="mb-2 rounded-xl overflow-hidden h-32 bg-slate-800">
            <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
          className="w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:text-emerald-400 file:font-semibold hover:file:bg-emerald-500/30 transition-all cursor-pointer" />
        {uploading && <p className="text-xs text-emerald-400 mt-1">Mengupload...</p>}
        {errors.imageUrl && <p className="text-xs text-red-400 mt-1">{errors.imageUrl[0]}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target URL</label>
        <input type="text" value={form.targetUrl} onChange={(e) => setForm((f) => ({ ...f, targetUrl: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" placeholder="https://... (opsional)" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Urutan</label>
          <input type="number" min="0" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
        </div>
        <div className="flex flex-col justify-end pb-0.5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="sr-only" />
              <div className={`w-10 h-6 rounded-full transition-colors ${form.isActive ? "bg-emerald-500" : "bg-slate-700"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-1"}`} />
              </div>
            </div>
            <span className="text-sm text-slate-300 font-medium">Aktif</span>
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading || uploading}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/25">
          {loading ? "Menyimpan..." : submitLabel}
        </button>
        <a href="/admin/banners" className="px-6 py-2.5 rounded-xl text-sm text-slate-400 border border-slate-700 hover:bg-slate-800 transition-all">
          Batal
        </a>
      </div>
    </form>
  );
}
