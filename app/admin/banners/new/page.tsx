export const dynamic = "force-dynamic";

import { createBannerAction, BannerFormInput } from "../../../../actions/banner.actions";
import { redirect } from "next/navigation";
import BannerForm from "../_components/BannerForm";

export default async function NewBannerPage() {
  async function handleCreate(data: BannerFormInput) {
    "use server";
    const result = await createBannerAction(data);
    if (result.success) redirect("/admin/banners");
    return result;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Tambah Banner</h1>
        <p className="text-sm text-slate-400 mt-0.5">Tambah banner promo baru</p>
      </div>
      <BannerForm onSubmit={handleCreate} submitLabel="Tambah Banner" />
    </div>
  );
}
