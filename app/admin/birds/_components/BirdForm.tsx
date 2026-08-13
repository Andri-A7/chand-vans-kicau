"use client";

import { useState } from "react";
import { BirdGender, BirdStatus, Species, Ring } from "../../../../app/generated/prisma";
import { BirdFormInput } from "../../../../actions/bird.actions";
import ImageUpload from "./ImageUpload";

type BirdFormState = {
  title: string;
  slug: string;
  speciesId: string;
  ringId: string;
  price: string;
  gender: BirdGender;
  birthDate: string;
  parentTrah: string;
  description: string;
  images: string[];
  isFeatured: boolean;
  status: BirdStatus;
};

type Props = {
  species: Species[];
  rings: Ring[];
  initialData?: Partial<BirdFormState>;
  onSubmit: (data: BirdFormInput) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>;
  submitLabel?: string;
};

export default function BirdForm({ species, rings, initialData, onSubmit, submitLabel = "Simpan" }: Props) {
  const [form, setForm] = useState<BirdFormState>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    speciesId: initialData?.speciesId ?? "",
    ringId: initialData?.ringId ?? "",
    price: initialData?.price ?? "",
    gender: initialData?.gender ?? BirdGender.UNKNOWN,
    birthDate: initialData?.birthDate ?? "",
    parentTrah: initialData?.parentTrah ?? "",
    description: initialData?.description ?? "",
    images: initialData?.images ?? [],
    isFeatured: initialData?.isFeatured ?? false,
    status: initialData?.status ?? BirdStatus.AVAILABLE,
  });

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, title, slug }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});

    const input: BirdFormInput = {
      title: form.title,
      slug: form.slug,
      speciesId: form.speciesId,
      ringId: form.ringId || undefined,
      price: form.price ? Number(form.price) : undefined,
      gender: form.gender,
      birthDate: form.birthDate ? new Date(form.birthDate) : undefined,
      parentTrah: form.parentTrah || undefined,
      description: form.description || undefined,
      isFeatured: form.isFeatured,
      status: form.status,
      images: form.images,
    };

    const result = await onSubmit(input);
    if (!result.success) {
      setError(result.error ?? "Terjadi kesalahan");
      setErrors(result.errors ?? {});
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input type="text" value={form.title} onChange={handleTitleChange} required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title[0]}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono" />
          {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spesies</label>
          <select value={form.speciesId} onChange={(e) => setForm((f) => ({ ...f, speciesId: e.target.value }))} required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">Pilih spesies</option>
            {species.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.speciesId && <p className="text-xs text-red-600 mt-1">{errors.speciesId[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ring</label>
          <select value={form.ringId} onChange={(e) => setForm((f) => ({ ...f, ringId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">Tanpa ring</option>
            {rings.map((r) => <option key={r.id} value={r.id}>{r.code}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
          <input type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as BirdGender }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value={BirdGender.UNKNOWN}>Tidak diketahui</option>
            <option value={BirdGender.MALE}>Jantan</option>
            <option value={BirdGender.FEMALE}>Betina</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
          <input type="date" value={form.birthDate} onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent / Trah</label>
          <input type="text" value={form.parentTrah} onChange={(e) => setForm((f) => ({ ...f, parentTrah: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as BirdStatus }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value={BirdStatus.AVAILABLE}>Available</option>
            <option value={BirdStatus.RESERVED}>Reserved</option>
            <option value={BirdStatus.SOLD}>Sold</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto Burung</label>
          <ImageUpload images={form.images} onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))} />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
            className="rounded border-gray-300" />
          <label htmlFor="isFeatured" className="text-sm text-gray-700">Tampilkan sebagai Featured</label>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
          {loading ? "Menyimpan..." : submitLabel}
        </button>
        <a href="/admin/birds" className="px-5 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
          Batal
        </a>
      </div>
    </form>
  );
}
