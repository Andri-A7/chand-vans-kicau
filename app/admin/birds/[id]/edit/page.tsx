import { getBirdById } from "../../../../../services/bird.service";
import { getAllSpecies } from "../../../../../services/species.service";
import { getAvailableRings, getRingById } from "../../../../../services/ring.service";
import { updateBirdAction, deleteBirdAction, BirdFormInput } from "../../../../../actions/bird.actions";
import BirdForm from "../../_components/BirdForm";
import { redirect, notFound } from "next/navigation";

export default async function EditBirdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [bird, species, availableRings] = await Promise.all([
    getBirdById(id),
    getAllSpecies(),
    getAvailableRings(),
  ]);

  if (!bird) notFound();

  const currentRing = bird.ringId ? await getRingById(bird.ringId) : null;
  const rings = currentRing
    ? [currentRing, ...availableRings.filter((r) => r.id !== currentRing.id)]
    : availableRings;

  async function handleUpdate(data: BirdFormInput) {
    "use server";
    const result = await updateBirdAction(id, data);
    if (result.success) redirect("/admin/birds");
    return result;
  }

  async function handleDelete() {
    "use server";
    await deleteBirdAction(id);
    redirect("/admin/birds");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Burung</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bird.title}</p>
        </div>
        <form action={handleDelete}>
          <button type="submit" className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            Hapus
          </button>
        </form>
      </div>
      <BirdForm
        species={species}
        rings={rings}
        initialData={{
          title: bird.title,
          slug: bird.slug,
          speciesId: bird.speciesId,
          ringId: bird.ringId ?? "",
          price: bird.price?.toString() ?? "",
          gender: bird.gender,
          birthDate: bird.birthDate ? bird.birthDate.toISOString().split("T")[0] : "",
          parentTrah: bird.parentTrah ?? "",
          description: bird.description ?? "",
          isFeatured: bird.isFeatured,
          status: bird.status,
        }}
        onSubmit={handleUpdate}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
