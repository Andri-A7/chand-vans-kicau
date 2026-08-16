"use client";

import { useState, useRef } from "react";
import { uploadBirdImage, deleteBirdImage } from "../../../../lib/supabase";
import { compressImageToWebP, formatFileSize } from "../../../../lib/imageCompression";
import { ImagePlus, X, Loader2 } from "lucide-react";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function ImageUpload({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
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
      if (file.size > 10 * 1024 * 1024) {
        setError("Ukuran file maksimal 10MB");
        continue;
      }

      try {
        setProgress(`Mengkompresi ${file.name}...`);
        const originalSize = file.size;
        const compressed = await compressImageToWebP(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.82,
        });

        const savings = Math.round((1 - compressed.size / originalSize) * 100);
        setProgress(`Mengupload... (hemat ${savings}%)`);

        const url = await uploadBirdImage(compressed);
        newUrls.push(url);
      } catch (e) {
        setError(`Upload gagal: ${String(e)}`);
      }
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
    setProgress(null);
  }

  async function handleDelete(url: string) {
    try {
      await deleteBirdImage(url);
    } catch {
      // silent — hapus dari UI meski API gagal
    }
    onChange(images.filter((img) => img !== url));
  }

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={url}
              className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700/80 group">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => handleDelete(url)}
                className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
        className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-slate-600 hover:border-emerald-500 bg-slate-800/40 hover:bg-emerald-500/5 text-slate-400 hover:text-emerald-400 text-sm font-medium transition-all disabled:opacity-50 w-full sm:w-auto">
        {uploading
          ? <><Loader2 className="w-4 h-4 animate-spin" />{progress ?? "Mengupload..."}</>
          : <><ImagePlus className="w-4 h-4" />Tambah Foto</>
        }
      </button>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => handleFiles(e.target.files)} />

      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-xs text-slate-600">Otomatis dikompresi ke WebP. Maks 10MB per foto.</p>
    </div>
  );
}
