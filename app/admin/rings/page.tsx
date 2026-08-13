export const dynamic = "force-dynamic";

import { getAllRings } from "../../../services/ring.service";
import Link from "next/link";

export default async function AdminRingsPage() {
  const rings = await getAllRings();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Ring</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rings.length} data</p>
        </div>
        <Link href="/admin/rings/new" className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          + Tambah
        </Link>
      </div>

      {rings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">Belum ada data ring</p>
          <Link href="/admin/rings/new" className="mt-3 inline-block text-sm text-gray-900 underline">
            Tambah ring pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Burung</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rings.map((ring) => (
                <tr key={ring.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{ring.code}</td>
                  <td className="px-4 py-3 text-gray-600">{ring.material ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{ring.year ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ring.isAssigned ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"}`}>
                      {ring.isAssigned ? "Assigned" : "Available"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {ring.bird ? (
                      <Link href={`/admin/birds/${ring.bird.id}/edit`} className="hover:underline text-gray-900">
                        {ring.bird.title}
                      </Link>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/rings/${ring.id}/edit`} className="text-gray-500 hover:text-gray-900 transition-colors text-xs underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
