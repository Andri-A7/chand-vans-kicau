"use client";

import { useState } from "react";
import { upsertSeoSettingsAction } from "../../../../actions/siteSetting.actions";

type SeoData = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  ogImageUrl?: string | null;
};

type Props = {
  pageSlug: string;
  initialData: SeoData | null;
};

export default function SeoForm({ pageSlug, initialData }: Props) {
  const [form, setForm] = useState({
    metaTitle: initialData?.metaTitle ?? "",
    metaDescription: initialData?.metaDescription ?? "",
    keywords: initialData?.keywords ?? "",
    ogImageUrl: initialData?.ogImageUrl ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await upsertSeoSettingsAction(pageSlug, {
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
      keywords: form.keywords || undefined,
      ogImageUrl: form.ogImageUrl || undefined,
    });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error ?? "Gagal menyimpan");
    }
    setLoading(false);
  }

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className={labelClass}>Meta Title</label>
        <input type="text" value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
          className={inputClass} placeholder="Judul halaman untuk Google..." maxLength={60} />
        <p className="text-[11px] text-slate-600 mt-1">{form.metaTitle.length}/60 karakter</p>
      </div>

      <div>
        <label className={labelClass}>Keywords</label>
        <input type="text" value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
          className={inputClass} placeholder="kata kunci, dipisah koma..." />
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>Meta Description</label>
        <textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
          rows={2} className={`${inputClass} resize-none`} placeholder="Deskripsi halaman untuk Google..." maxLength={160} />
        <p className="text-[11px] text-slate-600 mt-1">{form.metaDescription.length}/160 karakter</p>
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>OG Image URL</label>
        <input type="text" value={form.ogImageUrl} onChange={(e) => setForm((f) => ({ ...f, ogImageUrl: e.target.value }))}
          className={inputClass} placeholder="https://... (gambar preview saat dibagikan)" />
      </div>

      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={loading}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/25">
          {loading ? "Menyimpan..." : "Simpan SEO"}
        </button>
        {success && <span className="text-xs text-emerald-400">✓ Tersimpan</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    </form>
  );
}
