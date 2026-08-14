import Link from "next/link";
import { Bird, Species, Ring } from "../../../app/generated/prisma";

type BirdWithRelations = Bird & {
  species: Species;
  ring: Ring | null;
};

type Props = {
  bird: BirdWithRelations;
};

export default function BirdCard({ bird }: Props) {
  const statusConfig = {
    AVAILABLE: { label: "Tersedia", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20" },
    RESERVED: { label: "Reserved", class: "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-amber-500/20" },
    SOLD: { label: "Terjual", class: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  };

  const status = statusConfig[bird.status];

  return (
    <Link href={`/birds/${bird.slug}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden border border-white/10 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-out">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
          {bird.images[0] ? (
            <img
              src={bird.images[0]}
              alt={bird.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">🐦</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Ring badge */}
          {bird.ring && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/90 text-amber-950 backdrop-blur-sm shadow-lg shadow-amber-500/30">
                💍 {bird.ring.code}
              </span>
            </div>
          )}

          {/* Featured badge */}
          {bird.isFeatured && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg">
                ⭐ Unggulan
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">{bird.title}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{bird.species.name}</p>

          <div className="flex items-center justify-between mt-2.5">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {bird.price
                ? `Rp ${bird.price.toLocaleString("id-ID")}`
                : <span className="text-emerald-600 dark:text-emerald-400 text-xs">Hubungi kami</span>
              }
            </p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border shadow-sm ${status.class}`}>
              {status.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
