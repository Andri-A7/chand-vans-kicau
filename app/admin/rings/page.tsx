export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllRings } from "../../../services/ring.service";
import RingsTable, { type RingRow } from "./_components/RingsTable";

export default async function AdminRingsPage() {
  const rings = await getAllRings();

  const rows: RingRow[] = rings.map((ring) => ({
    id: ring.id,
    code: ring.code,
    isAssigned: ring.isAssigned,
    createdAt: ring.createdAt.toISOString(),
    birdTitle: ring.bird?.title ?? null,
  }));

  const available = rows.filter((r) => !r.isAssigned).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Manajemen Ring
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {rings.length} ring terdaftar &middot; {available} tersedia
          </p>
        </div>
        <Link
          href="/admin/rings/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah Ring Baru
        </Link>
      </div>

      <RingsTable rings={rows} />
    </div>
  );
}
