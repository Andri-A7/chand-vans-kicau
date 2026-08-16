"use client";

import { useState, useEffect } from "react";
import { Banner } from "../../app/generated/prisma";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  banners: Banner[];
};

export default function BannerSlider({ banners }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl aspect-[16/6] sm:aspect-[16/5] bg-slate-800 shadow-xl">
      {/* Images */}
      {banners.map((b, i) => (
        <div key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <h3 className="text-white font-bold text-lg sm:text-xl leading-tight">{banner.title}</h3>
        {banner.subtitle && (
          <p className="text-white/70 text-sm mt-0.5">{banner.subtitle}</p>
        )}
        {banner.targetUrl && (
          <a href={banner.targetUrl}
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all">
            Lihat selengkapnya →
          </a>
        )}
      </div>

      {/* Nav arrows — desktop */}
      {banners.length > 1 && (
        <>
          <button onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm items-center justify-center text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm items-center justify-center text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
