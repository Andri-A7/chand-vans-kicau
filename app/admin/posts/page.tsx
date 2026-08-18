export const dynamic = "force-dynamic";

import { getAllPosts } from "../../../services/post.service";
import { deletePostAction } from "../../../actions/post.actions";
import Link from "next/link";
import { Plus, Eye, EyeOff, FileText } from "lucide-react";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();
  const published = posts.filter((p) => p.isPublished).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Blog Artikel</h1>
          <p className="text-sm text-slate-400 mt-0.5">{posts.length} artikel · {published} dipublikasi</p>
        </div>
        <Link href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all">
          <Plus className="w-4 h-4" /> Tulis Artikel
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center">
          <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Belum ada artikel</p>
          <Link href="/admin/posts/new" className="mt-3 inline-block text-sm text-emerald-400 underline">
            Tulis artikel pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                {post.thumbnail
                  ? <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><FileText className="w-6 h-6 text-slate-600" /></div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="font-semibold text-white text-sm truncate">{post.title}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    post.isPublished
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-slate-700/50 text-slate-500 border-slate-700/50"
                  }`}>
                    {post.isPublished ? <><Eye className="w-2.5 h-2.5" /> Publik</> : <><EyeOff className="w-2.5 h-2.5" /> Draft</>}
                  </span>
                </div>
                {post.excerpt && <p className="text-xs text-slate-500 truncate">{post.excerpt}</p>}
                <p className="text-[11px] text-slate-600 mt-0.5 font-mono">/{post.slug}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {post.isPublished && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-all">
                    Preview
                  </a>
                )}
                <Link href={`/admin/posts/${post.id}/edit`}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-all">
                  Edit
                </Link>
                <form action={async () => {
                  "use server";
                  await deletePostAction(post.id);
                }}>
                  <button type="submit"
                    className="text-xs text-red-500 hover:text-red-400 px-3 py-1.5 rounded-lg border border-red-900/50 hover:bg-red-500/10 transition-all">
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
