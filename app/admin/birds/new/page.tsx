export const dynamic = "force-dynamic";

import { getAllSpecies } from "../../../../services/species.service";
import { getAvailableRings } from "../../../../services/ring.service";
import { createBirdAction, BirdFormInput } from "../../../../actions/bird.actions";
import BirdForm from "../_components/BirdForm";
import { redirect } from "next/navigation";

export default async function NewBirdPage() {
  const [species, rings] = await Promise.all([
    getAllSpecies(),
    getAvailableRings(),
  ]);

  async function handleCreate(data: BirdFormInput) {
    "use server";
    const result = await createBirdAction(data);
    if (result.success) redirect("/admin/birds");
    return result;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tambah Burung</h1>
        <p className="text-sm text-gray-500 mt-0.5">Isi data burung baru</p>
      </div>
      <BirdForm species={species} rings={rings} onSubmit={handleCreate} submitLabel="Tambah Burung" />
    </div>
  );
}
