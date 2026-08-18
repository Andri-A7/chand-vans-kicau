"use client";

import { useState } from "react";
import { updateSiteSettingsAction } from "../../../../actions/siteSetting.actions";
import { SiteSetting } from "../../../../app/generated/prisma";

type Props = { initialData: SiteSetting };

export default function SettingsForm({ initialData }: Props) {
  const [form, setForm] = useState({
    storeName: initialData.storeName ?? "",
    tagline: initialData.tagline ?? "",
    description: initialData.description ?? "",
    whatsapp: initialData.whatsapp ?? "",
    instagramUrl: initialData.instagramUrl ?? "",
    facebookUrl: initialData.facebookUrl ?? "",
    youtubeUrl: initialData.youtubeUrl ?? "",
    address: initialData.address ?? "",
    googleMapsUrl: initialData.googleMapsUrl ?? "",
    announcementText: initialData.announcementText ?? "",
    isAnnouncementActive: initialData.isAnnouncementActive ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await updateSiteSettingsAction(form);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error ?? "Gagal menyimpan");
    }
    setLoading(false);
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Identitas */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-4">
        <h2 className="text-sm font-bold text-slate-300">🏪 Identitas Toko</h2>
        <div>
          <label className={labelClass}>Nama Toko</label>
          <input type="text" value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input type="text" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} className={inputClass} placeholder="Slogan singkat toko..." />
        </div>
        <div>
          <label className={labelClass}>Deskripsi</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3}
            className={`${inputClass} resize-none`} placeholder="Deskripsi penangkaran..." />
        </div>
      </div>

      {/* Kontak */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-4">
        <h2 className="text-sm font-bold text-slate-300">📱 Kontak & Sosial Media</h2>
        <div>
          <label className={labelClass}>Nomor WhatsApp</label>
          <input type="text" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} className={inputClass} placeholder="628123456789" />
        </div>
        <div>
          <label className={labelClass}>Instagram URL</label>
          <input type="text" value={form.instagramUrl} onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))} className={inputClass} placeholder="https://instagram.com/..." />
        </div>
        <div>
          <label className={labelClass}>Facebook URL</label>
          <input type="text" value={form.facebookUrl} onChange={(e) => setForm((f) => ({ ...f, facebookUrl: e.target.value }))} className={inputClass} placeholder="https://facebook.com/..." />
        </div>
        <div>
          <label className={labelClass}>YouTube URL</label>
          <input type="text" value={form.youtubeUrl} onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))} className={inputClass} placeholder="https://youtube.com/..." />
        </div>
      </div>

      {/* Lokasi */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-4">
        <h2 className="text-sm font-bold text-slate-300">📍 Lokasi</h2>
        <div>
          <label className={labelClass}>Alamat</label>
          <textarea value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} rows={2}
            className={`${inputClass} resize-none`} placeholder="Alamat lengkap penangkaran..." />
        </div>
        <div>
          <label className={labelClass}>Google Maps URL</label>
          <input type="text" value={form.googleMapsUrl} onChange={(e) => setForm((f) => ({ ...f, googleMapsUrl: e.target.value }))} className={inputClass} placeholder="https://maps.google.com/..." />
        </div>
      </div>

      {/* Announcement */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-4">
        <h2 className="text-sm font-bold text-slate-300">📢 Pengumuman</h2>
        <div>
          <label className={labelClass}>Teks Pengumuman</label>
          <input type="text" value={form.announcementText} onChange={(e) => setForm((f) => ({ ...f, announcementText: e.target.value }))} className={inputClass} placeholder="Teks pengumuman running..." />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" checked={form.isAnnouncementActive} onChange={(e) => setForm((f) => ({ ...f, isAnnouncementActive: e.target.checked }))} className="sr-only" />
            <div className={`w-10 h-6 rounded-full transition-colors ${form.isAnnouncementActive ? "bg-emerald-500" : "bg-slate-700"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isAnnouncementActive ? "translate-x-5" : "translate-x-1"}`} />
            </div>
          </div>
          <span className="text-sm text-slate-300 font-medium">Tampilkan pengumuman</span>
        </label>
      </div>

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">{error}</p>}
      {success && <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl">✓ Pengaturan berhasil disimpan</p>}

      <button type="submit" disabled={loading}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/25">
        {loading ? "Menyimpan..." : "Simpan Pengaturan"}
      </button>
    </form>
  );
}
