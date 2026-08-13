export const dynamic = "force-dynamic";

import { createRingAction, RingFormInput } from "../../../../actions/ring.actions";
import { redirect } from "next/navigation";
import RingForm from "../_components/RingForm";

export default async function NewRingPage() {
  async function handleCreate(data: RingFormInput) {
    "use server";
    const result = await createRingAction(data);
    if (result.success) redirect("/admin/rings");
    return result;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tambah Ring</h1>
        <p className="text-sm text-gray-500 mt-0.5">Isi data ring baru</p>
      </div>
      <RingForm onSubmit={handleCreate} submitLabel="Tambah Ring" />
    </div>
  );
}
