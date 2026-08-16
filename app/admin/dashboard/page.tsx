export const dynamic = "force-dynamic";

import { prisma } from "../../../lib/prisma";
import { BirdStatus } from "../../../app/generated/prisma";
import Link from "next/link";
import { Bird, CircleDot, Star, Image, TrendingUp, Clock } from "lucide-react";

export default async function DashboardPage() {
  const [
    totalBirds,
    availableBirds,
    reservedBirds,
    soldBirds,
    totalRings,
    assignedRings,
    totalReviews,
    avgRating,
    activeBanners,
    recentBirds,
  ] = await Promise.all([
    prisma.bird.count(),
    prisma.bird.count({ where: { status: BirdStatus.AVAILABLE } }),
    prisma.bird.count({ where: { status: BirdStatus.RESERVED } }),
    prisma.bird.count({ where: { status: BirdStatus.SOLD } }),
    prisma.ring.count(),
    prisma.ring.count({ where: { isAssigned: true } }),
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.banner.count({ where: { isActive: true } }),
    prisma.bird.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { species: true },
    }),
  ]);

  const stats = [
    {
      label: "Total Burung",
      value: totalBirds,
      sub: `${availableBirds} tersedia · ${reservedBirds} reserved · ${soldBirds} terjual`,
      icon: Bird,
      color: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/20",
      href: "/admin/birds",
    },
    {
      label: "Ring",
      value: `${assignedRings}/${totalRings}`,
      sub: `${totalRings - assignedRings} ring tersisa`,
      icon: CircleDot,
      color: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/20",
      href: "/admin/rings",
    },
    {
      label: "Ulasan",
      value: totalReviews,
      sub: `Rating rata-rata: ${(avgRating._avg.rating ?? 0).toFixed(1)} ⭐`,
      icon: Star,
      color: "from-violet-500 to-purple-500",
      glow: "shadow-violet-500/20",
      href: "/admin/reviews",
    },
    {
      label: "Banner Aktif",
      value: activeBanners,
      sub: "Banner promo tampil",
      icon: Image,
      color: "from-cyan-500 to-blue-500",
      glow: "shadow-cyan-500/20",
      href: "/admin/banners",
    },
  ];

  const statusConfig = {
    AVAILABLE: { label: "Tersedia", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    RESERVED: { label: "Reserved", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    SOLD: { label: "Terjual", class: "bg-slate-600/40 text-slate-400 border-slate-600/30" },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Selamat datang kembali 👋</p>
        </div>
        <Link href="/admin/birds/new"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all">
          + Tambah Burung
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, sub, icon: Icon, color, glow, href }) => (
          <Link key={label} href={href}
            className={`group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 shadow-xl ${glow} hover:-translate-y-0.5 transition-all`}>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{sub}</p>
            <div className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800/80">
          <Clock className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-200">Aktivitas Terbaru</h2>
        </div>

        {recentBirds.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Belum ada aktivitas</div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {recentBirds.map((bird) => {
              const s = statusConfig[bird.status];
              return (
                <Link key={bird.id} href={`/admin/birds/${bird.id}/edit`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {bird.images[0]
                      ? <img src={bird.images[0]} alt={bird.title} className="w-full h-full object-cover" />
                      : <span className="text-lg">🐦</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{bird.title}</p>
                    <p className="text-xs text-slate-500">{bird.species.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.class}`}>
                      {s.label}
                    </span>
                    <p className="text-[11px] text-slate-600">
                      {new Date(bird.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="px-5 py-3 border-t border-slate-800/80">
          <Link href="/admin/birds" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Lihat semua burung →
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[
          { label: "Manaj. Banner", href: "/admin/banners", emoji: "🖼️" },
          { label: "Ulasan", href: "/admin/reviews", emoji: "⭐" },
          { label: "Inquiry", href: "/admin/inquiries", emoji: "💬" },
          { label: "Ring", href: "/admin/rings", emoji: "💍" },
        ].map(({ label, href, emoji }) => (
          <Link key={href} href={href}
            className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 hover:text-white text-sm font-medium transition-all">
            <span className="text-lg">{emoji}</span>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
