"use client";

import { Star } from "lucide-react";
import { Review } from "../app/generated/prisma";

type Props = {
  reviews: Review[];
  avgRating: number;
};

export default function TestimonialsSection({ reviews, avgRating }: Props) {
  if (reviews.length === 0) return null;

  return (
    <section className="px-4 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">⭐ Ulasan Pembeli</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">dari {reviews.length} ulasan</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.slice(0, 6).map((review) => (
          <div key={review.id}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"}`} />
              ))}
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3 line-clamp-3">
                "{review.comment}"
              </p>
            )}

            {/* Buyer */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {review.buyerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{review.buyerName}</p>
                <p className="text-[11px] text-slate-400">
                  {review.type === "BIRD" ? "Pembeli Burung" : "Pembeli"} ·{" "}
                  {new Date(review.createdAt).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
