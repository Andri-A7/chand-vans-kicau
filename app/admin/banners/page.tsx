export const dynamic = "force-dynamic";

import { getAllBanners } from "../../../services/banner.service";
import { toggleBannerAction, deleteBannerAction } from "../../../actions/banner.actions";
import Link from "next/link";
import { Plus, Eye, EyeOff, ExternalLink } from "lucide-react";

export default async function AdminBannersPage() {
  const banners = await getAllBanners();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Banner</h1>
          <p className="text-sm text-slate-400 mt-0.5">{banners.length} banner</p>
        </div>
        <Link href="/admin/banners/new"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all">
          <Plus className="w-4 h-4" /> Tambah
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center">
          <p className="text-slate-500 text-sm">Belum ada banner</p>
          <Link href="/admin/banners/new" className="mt-3 inline-block text-sm text-emerald-400 underline">
            Tambah banner pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
              {/* Preview */}
              <div className="w-20 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white text-sm truncate">{banner.title}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    banner.isActive
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-slate-700/50 text-slate-500 border-slate-700/50"
                  }`}>
                    {banner.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                {banner.subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{banner.subtitle}</p>}
                <p className="text-[11px] text-slate-600 mt-0.5">Urutan: {banner.order}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {banner.targetUrl && (
                  <a href={banner.targetUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <form action={async () => {
                  "use server";
                  await toggleBannerAction(banner.id, !banner.isActive);
                }}>
                  <button type="submit"
                    className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                    {banner.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </form>
                <Link href={`/admin/banners/${banner.id}/edit`}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-all">
                  Edit
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteBannerAction(banner.id);
                }}>
                  <button type="submit"
                    className="text-xs text-red-500 hover:text-red-400 px-3 py-1.5 rounded-lg border border-red-900/50 hover:border-red-500/50 hover:bg-red-500/10 transition-all">
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
