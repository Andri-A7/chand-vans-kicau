export const dynamic = "force-dynamic";

import { getFeaturedBirds, getLatestBirds } from "../services/bird.service";
import { getAllSpecies } from "../services/species.service";
import { getActiveBanners } from "../services/banner.service";
import { getStoreReviews, getAverageRating } from "../services/review.service";
import { getSiteSettings } from "../services/siteSetting.service";
import Link from "next/link";
import BirdCard from "./birds/_components/BirdCard";
import BannerSlider from "../components/ui/BannerSlider";
import TestimonialsSection from "../components/TestimonialsSection";
import AnnouncementBar from "../components/ui/AnnouncementBar";
import Footer from "../components/ui/Footer";

export default async function HomePage() {
  const [featured, latest, species, banners, reviews, avgRating, settings] = await Promise.all([
    getFeaturedBirds(),
    getLatestBirds(8),
    getAllSpecies(),
    getActiveBanners(),
    getStoreReviews(),
    getAverageRating(),
    getSiteSettings(),
  ]);

  const waNumber = settings.whatsapp ?? process.env.WHATSAPP_NUMBER ?? "";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Halo, saya ingin bertanya tentang burung di " + settings.storeName + ".")}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Announcement Bar */}
      {settings.isAnnouncementActive && settings.announcementText && (
        <AnnouncementBar text={settings.announcementText} />
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900 dark:text-white tracking-tight">
            Chan Vans <span className="text-emerald-500">Kicau</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/birds" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Katalog</Link>
            <Link href="/blog" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="min-h-[36px] inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/25">
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-5">
            🐦 {settings.tagline ?? "Penangkaran Burung Kicau Premium"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
            Temukan Burung
            <span className="block bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-600 bg-clip-text text-transparent">
              Berkualitas Terbaik
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-7 max-w-xl mx-auto leading-relaxed">
            {settings.description ?? "Murai Batu, Lovebird, Cucak Ijo, dan banyak lagi. Setiap burung dilengkapi ring resmi dan jaminan keaslian."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/birds"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-500/30 transition-all hover:-translate-y-0.5">
              Lihat Katalog →
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-2xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Hubungi Kami
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-3xl mx-auto mt-10 grid grid-cols-3 gap-3">
          {[
            { value: `${species.length}+`, label: "Jenis Burung" },
            { value: avgRating > 0 ? `${avgRating.toFixed(1)} ⭐` : "100%", label: avgRating > 0 ? "Rating" : "Ring Resmi" },
            { value: `${reviews.length}+`, label: "Pembeli Puas" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-4 text-center shadow-lg">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Slider */}
      {banners.length > 0 && (
        <section className="px-4 pb-6 max-w-6xl mx-auto">
          <BannerSlider banners={banners} />
        </section>
      )}

      {/* Featured Birds */}
      {featured.length > 0 && (
        <section className="px-4 py-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">⭐ Pilihan Unggulan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Burung terbaik pilihan kami</p>
            </div>
            <Link href="/birds?featured=true" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">Lihat semua →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featured.map((bird) => <BirdCard key={bird.id} bird={bird} />)}
          </div>
        </section>
      )}

      {/* Latest Birds */}
      {latest.length > 0 && (
        <section className="px-4 py-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">🆕 Terbaru</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Baru ditambahkan</p>
            </div>
            <Link href="/birds" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">Lihat semua →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {latest.map((bird) => <BirdCard key={bird.id} bird={bird} />)}
          </div>
        </section>
      )}

      {/* Species */}
      {species.length > 0 && (
        <section className="px-4 py-8 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">🏷️ Jenis Burung</h2>
          <div className="flex flex-wrap gap-2">
            {species.map((s) => (
              <Link key={s.id} href={`/birds?species=${s.slug}`}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:shadow-md">
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <TestimonialsSection reviews={reviews} avgRating={avgRating} />

      {/* CTA */}
      <section className="px-4 py-8 max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 p-8 sm:p-12 text-center shadow-2xl shadow-emerald-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ada pertanyaan?</h2>
            <p className="text-emerald-100 mb-6 max-w-md mx-auto">Hubungi kami langsung via WhatsApp untuk info ketersediaan dan harga terbaik.</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-emerald-50 transition-all shadow-lg hover:-translate-y-0.5 min-h-[48px]">
              💬 Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
