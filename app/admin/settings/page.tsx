export const dynamic = "force-dynamic";

import { getSiteSettings } from "../../../services/siteSetting.service";
import SettingsForm from "./_components/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Pengaturan Toko</h1>
        <p className="text-sm text-slate-400 mt-0.5">Profil, kontak, sosmed, dan lokasi toko</p>
      </div>
      <SettingsForm initialData={settings} />
    </div>
  );
}
