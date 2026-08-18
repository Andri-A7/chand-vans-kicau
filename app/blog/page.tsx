export const dynamic = "force-dynamic";

import { getPublishedPosts } from "../../services/post.service";
import Link from "next/link";
import { FileText, Calendar } from "lucide-react";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900 dark:text-white tracking-tight">
            Chan Vans <span className="text-emerald-500">Kicau</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/birds" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Katalog</Link>
            <Link href="/blog" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Blog</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📝 Artikel & Tips</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tips perawatan dan info seputar burung kicau</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 dark:text-slate-500">Belum ada artikel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                {/* Thumbnail */}
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {post.thumbnail
                    ? <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" /></div>
                  }
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 px-4 py-6 text-center mt-8">
        <p className="text-xs text-slate-400">© 2025 Chan Vans Kicau. All rights reserved.</p>
      </footer>
    </div>
  );
}
