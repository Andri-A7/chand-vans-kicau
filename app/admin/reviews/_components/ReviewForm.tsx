"use client";

import { useState } from "react";
import { createReviewAction } from "../../../../actions/review.actions";
import { ReviewType } from "../../../../app/generated/prisma";
import { Star } from "lucide-react";

type Props = {
  birds: { id: string; title: string }[];
};

export default function ReviewForm({ birds }: Props) {
  const [form, setForm] = useState({
    rating: 5,
    comment: "",
    buyerName: "",
    type: ReviewType.STORE as ReviewType,
    birdId: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createReviewAction({
      rating: form.rating,
      comment: form.comment || undefined,
      buyerName: form.buyerName,
      type: form.type,
      birdId: form.birdId || undefined,
    });

    if (result.success) {
      setSuccess(true);
      setForm({ rating: 5, comment: "", buyerName: "", type: ReviewType.STORE, birdId: "" });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error ?? "Gagal menyimpan");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nama Pembeli</label>
          <input type="text" value={form.buyerName} onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))} required
            className="w-full px-3 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" placeholder="Nama pembeli..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tipe</label>
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ReviewType }))}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all">
            <option value={ReviewType.STORE}>Toko</option>
            <option value={ReviewType.BIRD}>Burung</option>
          </select>
        </div>
      </div>

      {form.type === ReviewType.BIRD && (
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Burung</label>
          <select value={form.birdId} onChange={(e) => setForm((f) => ({ ...f, birdId: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all">
            <option value="">Pilih burung...</option>
            {birds.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Rating</label>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => setForm((f) => ({ ...f, rating: i + 1 }))}>
              <Star className={`w-6 h-6 transition-colors ${i < form.rating ? "text-amber-400 fill-amber-400" : "text-slate-700 hover:text-amber-300"}`} />
            </button>
          ))}
          <span className="text-sm text-slate-400 ml-1">{form.rating}/5</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Komentar</label>
        <textarea value={form.comment} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))} rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none" placeholder="Komentar pembeli... (opsional)" />
      </div>

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">{error}</p>}
      {success && <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl">✓ Ulasan berhasil disimpan</p>}

      <button type="submit" disabled={loading}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/25">
        {loading ? "Menyimpan..." : "Simpan Ulasan"}
      </button>
    </form>
  );
}
