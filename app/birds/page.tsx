export const dynamic = "force-dynamic";

import { getBirdsFiltered } from "../../services/bird.service";
import { getAllSpecies } from "../../services/species.service";
import Link from "next/link";
import { BirdStatus, BirdGender } from "../../app/generated/prisma";

type SearchParams = {
  search?: string;
  species?: string;
  gender?: string;
  status?: string;
  featured?: string;
  order?: string;
};

export default async function BirdsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const speciesList = await getAllSpecies();
  const selectedSpecies = speciesList.find((s) => s.slug === params.species);

  const birds = await getBirdsFiltered({
    search: params.search,
    speciesId: selectedSpecies?.id,
    gender: params.gender as BirdGender | undefined,
    status: params.status as BirdStatus | undefined,
    isFeatured: params.featured === "true" ? true : undefined,
    orderBy: (params.order as "latest" | "price_asc" | "price_desc") ?? "latest",
  });

  const waNumber = process.env.WHATSAPP_NUMBER ?? "";

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
        <Link href="/" className="font-semibold text-gray-900">Chan Vans Kicau</Link>
        <div className="flex items-center gap-6">
          <Link href="/birds" className="text-sm text-gray-900 font-medium">Katalog</Link>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            WhatsApp
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Katalog Burung</h1>
          <p className="text-gray-500 text-sm mt-1">{birds.length} burung ditemukan</p>
        </div>

        {/* Filter Bar */}
        <form method="GET" className="flex flex-wrap gap-3 mb-8">
          <input
            type="text"
            name="search"
            defaultValue={params.search}
            placeholder="Cari burung, spesies, ring..."
            className="flex-1 min-w-48 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <select name="species" defaultValue={params.species ?? ""}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">Semua Spesies</option>
            {speciesList.map((s) => (
              <option key={s.id} value={s.slug}>{s.name}</option>
            ))}
          </select>
          <select name="gender" defaultValue={params.gender ?? ""}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">Semua Gender</option>
            <option value="MALE">Jantan</option>
            <option value="FEMALE">Betina</option>
            <option value="UNKNOWN">Tidak diketahui</option>
          </select>
          <select name="status" defaultValue={params.status ?? ""}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">Semua Status</option>
            <option value="AVAILABLE">Tersedia</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Terjual</option>
          </select>
          <select name="order" defaultValue={params.order ?? "latest"}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="latest">Terbaru</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
          </select>
          <button type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
            Cari
          </button>
          {(params.search || params.species || params.gender || params.status) && (
            <Link href="/birds" className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              Reset
            </Link>
          )}
        </form>

        {/* Grid */}
        {birds.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">Tidak ada burung ditemukan</p>
            <Link href="/birds" className="text-sm text-gray-900 underline">Lihat semua burung</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {birds.map((bird) => (
              <Link key={bird.id} href={`/birds/${bird.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {bird.images[0] ? (
                    <img src={bird.images[0]} alt={bird.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <span className="text-5xl">🐦</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm truncate">{bird.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{bird.species.name}</p>
                  {bird.ring && (
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{bird.ring.code}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {bird.price ? `Rp ${bird.price.toLocaleString("id-ID")}` : "—"}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      bird.status === "AVAILABLE" ? "bg-green-50 text-green-700" :
                      bird.status === "RESERVED" ? "bg-yellow-50 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {bird.status === "AVAILABLE" ? "Tersedia" :
                       bird.status === "RESERVED" ? "Reserved" : "Terjual"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center mt-12">
        <p className="text-sm text-gray-400">© 2025 Chan Vans Kicau. All rights reserved.</p>
      </footer>
    </div>
  );
}
