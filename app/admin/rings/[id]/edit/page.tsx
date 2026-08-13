export const dynamic = "force-dynamic";

import { getRingById } from "../../../../../services/ring.service";
import { updateRingAction, deleteRingAction, RingFormInput } from "../../../../../actions/ring.actions";
import RingForm from "../../_components/RingForm";
import { redirect, notFound } from "next/navigation";

export default async function EditRingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ring = await getRingById(id);
  if (!ring) notFound();

  async function handleUpdate(data: RingFormInput) {
    "use server";
    const result = await updateRingAction(id, data);
    if (result.success) redirect("/admin/rings");
    return result;
  }

  async function handleDelete() {
    "use server";
    await deleteRingAction(id);
    redirect("/admin/rings");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Ring</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-mono">{ring.code}</p>
        </div>
        {!ring.isAssigned && (
          <form action={handleDelete}>
            <button type="submit" className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              Hapus
            </button>
          </form>
        )}
        {ring.isAssigned && (
          <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
            Assigned ke {ring.bird?.title ?? "burung"}
          </span>
        )}
      </div>
      <RingForm
        initialData={{
          code: ring.code,
          isAssigned: ring.isAssigned,
        }}
        onSubmit={handleUpdate}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
