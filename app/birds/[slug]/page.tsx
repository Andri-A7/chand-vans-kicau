import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { getBirdBySlug } = await import("../../../services/bird.service");
  const bird = await getBirdBySlug(slug);
  if (!bird) return { title: "Burung Tidak Ditemukan" };
  return {
    title: bird.title,
    description: bird.description ?? `${bird.title} — ${bird.species.name}.${bird.ring ? " Ring: " + bird.ring.code + "." : ""} Harga: ${bird.price ? "Rp " + bird.price.toLocaleString("id-ID") : "Hubungi kami"}.`,
    openGraph: {
      title: bird.title + " | Chan Vans Kicau",
      description: bird.description ?? bird.title,
      images: bird.images[0] ? [{ url: bird.images[0], width: 800, height: 800, alt: bird.title }] : [],
    },
  };
}

export const dynamic = "force-dynamic";

import { getBirdBySlug } from "../../../services/bird.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Dna, Tag, CircleDollarSign, Bird, Shield } from "lucide-react";
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

  const statusConfig = {
    AVAILABLE: { label: "Tersedia", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800" },
    RESERVED: { label: "Reserved", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800" },
    SOLD: { label: "Terjual", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" },
  };

  const status = statusConfig[bird.status];
  const genderLabel = bird.gender === "MALE" ? "Jantan" : bird.gender === "FEMALE" ? "Betina" : "Tidak diketahui";

  const specs = [
    { icon: Tag, label: "Spesies", value: bird.species.name },
    { icon: Shield, label: "Kode Ring", value: bird.ring?.code ?? "Tanpa Ring" },
    { icon: Bird, label: "Gender", value: genderLabel },
    { icon: Calendar, label: "Tgl Lahir", value: bird.birthDate ? new Date(bird.birthDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—" },
    { icon: Dna, label: "Parent/Trah", value: bird.parentTrah ?? "—" },
    { icon: MapPin, label: "Status", value: status.label },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900 dark:text-white tracking-tight">
            Chan Vans <span className="text-emerald-500">Kicau</span>
          </Link>
          <Link href="/birds" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Katalog
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-5">
          <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/birds" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Katalog</Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300 truncate max-w-32">{bird.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* Gallery */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xl">
              {bird.images[0] ? (
                <img src={bird.images[0]} alt={bird.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🐦</span>
                </div>
              )}
            </div>
            {bird.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {bird.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
                    <img src={img} alt={`${bird.title} ${i + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {/* Title + Status */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">{bird.title}</h1>
                <span className={`shrink-0 mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{bird.species.name}</p>
              {bird.ring && (
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                  💍 Ring: {bird.ring.code}
                </span>
              )}
            </div>

            {/* Price */}
            {bird.price && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border border-emerald-100 dark:border-emerald-900/50">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-0.5 flex items-center gap-1">
                  <CircleDollarSign className="w-3.5 h-3.5" /> Harga
                </p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Rp {bird.price.toLocaleString("id-ID")}
                </p>
              </div>
            )}

            {/* Spec Sheet */}
            <div className="grid grid-cols-2 gap-2.5">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {bird.description && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Deskripsi</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{bird.description}</p>
              </div>
            )}

            {/* Inquiry Form — hidden on mobile (shown in sticky bar) */}
            {bird.status === "AVAILABLE" && (
              <div className="hidden md:block">
                <InquiryForm
                  birdId={bird.id}
                  birdTitle={bird.title}
                  birdSlug={bird.slug}
                  ringCode={bird.ring?.code ?? ""}
                  speciesName={bird.species.name}
                  price={bird.price}
                  waNumber={waNumber}
                />
              </div>
            )}

            {bird.status !== "AVAILABLE" && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Burung ini sedang {status.label.toLowerCase()}
                </p>
                <Link href="/birds" className="mt-2 inline-block text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Lihat burung lain →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA — Mobile only */}
      {bird.status === "AVAILABLE" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{bird.title}</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {bird.price ? `Rp ${bird.price.toLocaleString("id-ID")}` : "Hubungi kami"}
              </p>
            </div>
            <InquiryForm
              birdId={bird.id}
              birdTitle={bird.title}
              birdSlug={bird.slug}
              ringCode={bird.ring?.code ?? ""}
              speciesName={bird.species.name}
              price={bird.price}
              waNumber={waNumber}
              compact
            />
          </div>
        </div>
      )}
    </div>
  );
}
