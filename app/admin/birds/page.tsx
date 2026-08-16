export const dynamic = "force-dynamic";

import { getAllBirds } from "../../../services/bird.service";
import { getAllSpecies } from "../../../services/species.service";
import Link from "next/link";

export default async function AdminBirdsPage() {
  const [birds, species] = await Promise.all([getAllBirds(), getAllSpecies()]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Burung</h1>
          <p className="text-sm text-gray-500 mt-0.5">{birds.length} data</p>
        </div>
        <Link href="/admin/birds/new" className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          + Tambah
        </Link>
      </div>

      {birds.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">Belum ada data burung</p>
          <Link href="/admin/birds/new" className="mt-3 inline-block text-sm text-gray-900 underline">
            Tambah burung pertama
          </Link>
        </div>
      ) : (
        <div className="flex bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Burung</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Spesies</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ring</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {birds.map((bird) => (
                <tr key={bird.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{bird.title}</p>
                    <p className="text-xs text-gray-400">{bird.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{bird.species.name}</td>
                  <td className="px-4 py-3 text-gray-600">{bird.ring?.code ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {bird.price ? `Rp ${bird.price.toLocaleString("id-ID")}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      bird.status === "AVAILABLE" ? "bg-green-50 text-green-700" :
                      bird.status === "RESERVED" ? "bg-yellow-50 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {bird.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/birds/${bird.id}/edit`} className="text-gray-500 hover:text-gray-900 transition-colors text-xs underline">
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
