export const dynamic = "force-dynamic";

import { getFeaturedBirds, getLatestBirds } from "../services/bird.service";
import { getAllSpecies } from "../services/species.service";
import Link from "next/link";


export default async function HomePage() {
  const [featured, latest, species] = await Promise.all([
    getFeaturedBirds(),
    getLatestBirds(8),
    getAllSpecies(),
  ]);

  const waNumber = process.env.WHATSAPP_NUMBER ?? "";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Halo, saya ingin bertanya tentang burung di Chan Vans Kicau.")}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
        <Link href="/" className="font-semibold text-gray-900">Chan Vans Kicau</Link>
        <div className="flex items-center gap-6">
          <Link href="/birds" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Katalog</Link>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            WhatsApp
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Marketplace Burung<br />
          <span className="text-gray-400">Terpercaya</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Temukan burung berkualitas dengan ring resmi. Murai Batu, Lovebird, Cucak Ijo, dan banyak lagi.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/birds"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Lihat Katalog
          </Link>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Hubungi Kami
          </a>
        </div>
      </section>

      {/* Featured Birds */}
      {featured.length > 0 && (
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Pilihan Unggulan</h2>
            <Link href="/birds?featured=true" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((bird) => (
              <Link key={bird.id} href={`/birds/${bird.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  {bird.images[0] ? (
                    <img src={bird.images[0]} alt={bird.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🐦</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm truncate">{bird.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{bird.species.name}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {bird.price ? `Rp ${bird.price.toLocaleString("id-ID")}` : "Hubungi kami"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Birds */}
      {latest.length > 0 && (
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Terbaru</h2>
            <Link href="/birds" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {latest.map((bird) => (
              <Link key={bird.id} href={`/birds/${bird.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  {bird.images[0] ? (
                    <img src={bird.images[0]} alt={bird.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🐦</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm truncate">{bird.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{bird.species.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {bird.price ? `Rp ${bird.price.toLocaleString("id-ID")}` : "Hubungi kami"}
                    </p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      bird.status === "AVAILABLE" ? "bg-green-50 text-green-700" :
                      bird.status === "RESERVED" ? "bg-yellow-50 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {bird.status === "AVAILABLE" ? "Tersedia" : bird.status === "RESERVED" ? "Reserved" : "Terjual"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Species */}
      {species.length > 0 && (
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Jenis Burung</h2>
          <div className="flex flex-wrap gap-2">
            {species.map((s) => (
              <Link key={s.id} href={`/birds?species=${s.slug}`}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-full transition-colors">
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ada pertanyaan?</h2>
        <p className="text-gray-500 mb-6">Hubungi kami langsung via WhatsApp untuk info ketersediaan dan harga terbaik.</p>
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-medium transition-colors">
          Chat WhatsApp
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center">
        <p className="text-sm text-gray-400">© 2025 Chan Vans Kicau. All rights reserved.</p>
      </footer>
    </div>
  );
}
