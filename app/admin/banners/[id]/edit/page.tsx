export const dynamic = "force-dynamic";

import { getBannerById } from "../../../../../services/banner.service";
import { updateBannerAction, deleteBannerAction, BannerFormInput } from "../../../../../actions/banner.actions";
import BannerForm from "../../_components/BannerForm";
import { redirect, notFound } from "next/navigation";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const banner = await getBannerById(id);
  if (!banner) notFound();

  async function handleUpdate(data: BannerFormInput) {
    "use server";
    const result = await updateBannerAction(id, data);
    if (result.success) redirect("/admin/banners");
    return result;
  }

  async function handleDelete() {
    "use server";
    await deleteBannerAction(id);
    redirect("/admin/banners");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Edit Banner</h1>
          <p className="text-sm text-slate-400 mt-0.5 truncate max-w-48">{banner.title}</p>
        </div>
        <form action={handleDelete}>
          <button type="submit"
            className="text-sm text-red-500 hover:text-red-400 border border-red-900/50 hover:border-red-500/50 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all">
            Hapus
          </button>
        </form>
      </div>
      <BannerForm
        initialData={{
          title: banner.title,
          subtitle: banner.subtitle ?? "",
          imageUrl: banner.imageUrl,
          targetUrl: banner.targetUrl ?? "",
          isActive: banner.isActive,
          order: banner.order,
        }}
        onSubmit={handleUpdate}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
