"use client";

import { useState, useRef } from "react";
import { uploadBirdImage, deleteBirdImage } from "../../../../lib/supabase";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function ImageUpload({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError("Hanya file gambar yang diizinkan");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        continue;
      }
      try {
        const url = await uploadBirdImage(file);
        newUrls.push(url);
      } catch (e) {
        setError(`Upload gagal: ${String(e)}`);
      }
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  }

  async function handleDelete(url: string) {
    try {
      await deleteBirdImage(url);
      onChange(images.filter((img) => img !== url));
    } catch {
      onChange(images.filter((img) => img !== url));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, i) => (
          <div key={url} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
            <img src={url} alt={`Gambar ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(url)}
              className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              Hapus
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-xs">Upload...</span>
          ) : (
            <>
              <span className="text-2xl mb-1">+</span>
              <span className="text-xs">Foto</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <p className="text-xs text-gray-400 mt-1">Maks 5MB per foto. Format: JPG, PNG, WebP.</p>
    </div>
  );
}
