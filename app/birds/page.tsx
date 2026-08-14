export const dynamic = "force-dynamic";

import { getBirdsFiltered } from "../../services/bird.service";
import { getAllSpecies } from "../../services/species.service";
import Link from "next/link";
import { BirdStatus, BirdGender } from "../../app/generated/prisma";
import BirdCard from "./_components/BirdCard";
import { Search, SlidersHorizontal } from "lucide-react";

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
  const hasFilters = params.search || params.species || params.gender || params.status;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900 dark:text-white tracking-tight">
            Chan Vans <span className="text-emerald-500">Kicau</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/birds" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Katalog</Link>
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
              className="min-h-[36px] inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/25">
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Katalog Burung</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {birds.length} burung ditemukan
          </p>
        </div>

        {/* Search + Filter */}
        <form method="GET" className="mb-6 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Cari burung, spesies, kode ring..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Filter pills - scrollable horizontal */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex items-center gap-1.5 shrink-0 text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Filter:</span>
            </div>

            <select name="species" defaultValue={params.species ?? ""}
              className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer">
              <option value="">Semua Spesies</option>
              {speciesList.map((s) => <option key={s.id} value={s.slug}>{s.name}</option>)}
            </select>

            <select name="status" defaultValue={params.status ?? ""}
              className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer">
              <option value="">Semua Status</option>
              <option value="AVAILABLE">Tersedia</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Terjual</option>
            </select>

            <select name="gender" defaultValue={params.gender ?? ""}
              className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer">
              <option value="">Semua Gender</option>
              <option value="MALE">Jantan</option>
              <option value="FEMALE">Betina</option>
            </select>

            <select name="order" defaultValue={params.order ?? "latest"}
              className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer">
              <option value="latest">Terbaru</option>
              <option value="price_asc">Harga ↑</option>
              <option value="price_desc">Harga ↓</option>
            </select>

            <button type="submit"
              className="shrink-0 min-h-[32px] px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-md shadow-emerald-500/25">
              Cari
            </button>

            {hasFilters && (
              <Link href="/birds"
                className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Reset
              </Link>
            )}
          </div>
        </form>

        {/* Grid */}
        {birds.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Tidak ada burung ditemukan</p>
            <Link href="/birds" className="mt-3 inline-block text-sm text-emerald-600 dark:text-emerald-400 underline">
              Lihat semua burung
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {birds.map((bird) => (
              <BirdCard key={bird.id} bird={bird} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 px-4 py-6 text-center">
        <p className="text-xs text-slate-400">© 2025 Chan Vans Kicau. All rights reserved.</p>
      </footer>
    </div>
  );
}
