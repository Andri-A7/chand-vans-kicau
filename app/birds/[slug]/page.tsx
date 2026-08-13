export const dynamic = "force-dynamic";

import { getBirdBySlug } from "../../../services/bird.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import InquiryForm from "./_components/InquiryForm";

export default async function BirdDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bird = await getBirdBySlug(slug);
  if (!bird) notFound();

  const waNumber = process.env.WHATSAPP_NUMBER ?? "";

  const statusLabel = bird.status === "AVAILABLE" ? "Tersedia" :
    bird.status === "RESERVED" ? "Reserved" : "Terjual";
  const statusColor = bird.status === "AVAILABLE" ? "bg-green-50 text-green-700" :
    bird.status === "RESERVED" ? "bg-yellow-50 text-yellow-700" :
    "bg-gray-100 text-gray-500";

  const genderLabel = bird.gender === "MALE" ? "Jantan" :
    bird.gender === "FEMALE" ? "Betina" : "Tidak diketahui";

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
        <Link href="/" className="font-semibold text-gray-900">Chan Vans Kicau</Link>
        <div className="flex items-center gap-6">
          <Link href="/birds" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Katalog</Link>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            WhatsApp
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/birds" className="hover:text-gray-600 transition-colors">Katalog</Link>
          <span>/</span>
          <span className="text-gray-900">{bird.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
              {bird.images[0] ? (
                <img src={bird.images[0]} alt={bird.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">🐦</span>
              )}
            </div>
            {bird.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {bird.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
                    <img src={img} alt={`${bird.title} ${i + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{bird.title}</h1>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            <p className="text-gray-500 text-sm mb-4">{bird.species.name}</p>

            {bird.price && (
              <p className="text-3xl font-bold text-gray-900 mb-6">
                Rp {bird.price.toLocaleString("id-ID")}
              </p>
            )}

            {/* Detail */}
            <div className="space-y-3 mb-6">
              {bird.ring && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kode Ring</span>
                  <span className="font-mono font-medium text-gray-900">{bird.ring.code}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gender</span>
                <span className="text-gray-900">{genderLabel}</span>
              </div>
              {bird.birthDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal Lahir</span>
                  <span className="text-gray-900">
                    {new Date(bird.birthDate).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </span>
                </div>
              )}
              {bird.parentTrah && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Parent / Trah</span>
                  <span className="text-gray-900 text-right max-w-48">{bird.parentTrah}</span>
                </div>
              )}
            </div>

            {bird.description && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Deskripsi</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bird.description}</p>
              </div>
            )}

            {/* CTA */}
            {bird.status === "AVAILABLE" && (
              <InquiryForm
                birdId={bird.id}
                birdTitle={bird.title}
                birdSlug={bird.slug}
                ringCode={bird.ring?.code ?? ""}
                speciesName={bird.species.name}
                price={bird.price}
                waNumber={waNumber}
              />
            )}

            {bird.status !== "AVAILABLE" && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">
                  Burung ini sedang {statusLabel.toLowerCase()}
                </p>
                <Link href="/birds" className="mt-2 inline-block text-sm text-gray-900 underline">
                  Lihat burung lain
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center mt-12">
        <p className="text-sm text-gray-400">© 2025 Chan Vans Kicau. All rights reserved.</p>
      </footer>
    </div>
  );
}
