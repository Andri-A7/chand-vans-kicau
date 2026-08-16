export const dynamic = "force-dynamic";

import { getAllReviews } from "../../../services/review.service";
import { deleteReviewAction } from "../../../actions/review.actions";
import { getAllBirds } from "../../../services/bird.service";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import ReviewForm from "./_components/ReviewForm";

export default async function AdminReviewsPage() {
  const [reviews, birds] = await Promise.all([getAllReviews(), getAllBirds()]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Ulasan</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {reviews.length} ulasan · Rata-rata {avgRating} ⭐
          </p>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="mb-6 p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Tambah Ulasan</h2>
        </div>
        <ReviewForm birds={birds.map((b) => ({ id: b.id, title: b.title }))} />
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center">
          <p className="text-slate-500 text-sm">Belum ada ulasan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id}
              className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white text-sm">{review.buyerName}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      review.type === "BIRD"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-violet-500/20 text-violet-400 border-violet-500/30"
                    }`}>
                      {review.type === "BIRD" ? "Burung" : "Toko"}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                    ))}
                  </div>

                  {review.comment && <p className="text-sm text-slate-400 leading-relaxed">{review.comment}</p>}
                  {review.bird && (
                    <p className="text-xs text-slate-600 mt-1.5">
                      Burung: <Link href={`/admin/birds/${review.bird.id}/edit`} className="text-emerald-500 hover:underline">{review.bird.title}</Link>
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-[11px] text-slate-600">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <form action={async () => {
                    "use server";
                    await deleteReviewAction(review.id);
                  }}>
                    <button type="submit"
                      className="text-xs text-red-500 hover:text-red-400 px-2.5 py-1 rounded-lg border border-red-900/50 hover:border-red-500/50 hover:bg-red-500/10 transition-all">
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
