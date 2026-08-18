"use client";

import { useState } from "react";
import { PostFormInput } from "../../../../actions/post.actions";
import { uploadBirdImage } from "../../../../lib/supabase";

type Props = {
  initialData?: Partial<PostFormInput>;
  onSubmit: (data: PostFormInput) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>;
  submitLabel?: string;
};

export default function PostForm({ initialData, onSubmit, submitLabel = "Simpan" }: Props) {
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    thumbnail: initialData?.thumbnail ?? "",
    isPublished: initialData?.isPublished ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, title, slug }));
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadBirdImage(file);
      setForm((f) => ({ ...f, thumbnail: url }));
    } catch {
      setError("Upload thumbnail gagal");
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
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content,
      thumbnail: form.thumbnail || undefined,
      isPublished: form.isPublished,
    });

    if (!result.success) {
      setError(result.error ?? "Terjadi kesalahan");
      setErrors(result.errors ?? {});
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Judul Artikel</label>
        <input type="text" value={form.title} onChange={handleTitleChange} required
          className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          placeholder="Judul artikel..." />
        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title[0]}</p>}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Slug URL</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 shrink-0">/blog/</span>
          <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required
            className="flex-1 px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" />
        </div>
        {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug[0]}</p>}
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Thumbnail</label>
        {form.thumbnail && (
          <div className="mb-2 rounded-xl overflow-hidden h-36 bg-slate-800">
            <img src={form.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={uploading}
          className="w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:text-emerald-400 file:font-semibold hover:file:bg-emerald-500/30 transition-all cursor-pointer" />
        {uploading && <p className="text-xs text-emerald-400 mt-1">Mengupload...</p>}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ringkasan</label>
        <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2}
          className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
          placeholder="Ringkasan singkat artikel (opsional)..." />
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Konten Artikel</label>
        <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={16} required
          className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-800/60 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-y"
          placeholder="Tulis konten artikel di sini..." />
        {errors.content && <p className="text-xs text-red-400 mt-1">{errors.content[0]}</p>}
      </div>

      {/* Publish toggle */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} className="sr-only" />
            <div className={`w-10 h-6 rounded-full transition-colors ${form.isPublished ? "bg-emerald-500" : "bg-slate-700"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-5" : "translate-x-1"}`} />
            </div>
          </div>
          <span className="text-sm text-slate-300 font-medium">
            {form.isPublished ? "Publik — tampil di blog" : "Draft — tersembunyi"}
          </span>
        </label>
      </div>

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading || uploading}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/25">
          {loading ? "Menyimpan..." : submitLabel}
        </button>
        <a href="/admin/posts" className="px-6 py-2.5 rounded-xl text-sm text-slate-400 border border-slate-700 hover:bg-slate-800 transition-all">
          Batal
        </a>
      </div>
    </form>
  );
}
