export const dynamic = "force-dynamic";

import { getPostBySlug } from "../../../services/post.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: post.title,
    description: post.excerpt ?? post.title,
    openGraph: {
      title: post.title + " | Chan Vans Kicau",
      description: post.excerpt ?? post.title,
      images: post.thumbnail ? [{ url: post.thumbnail, width: 1200, height: 630, alt: post.title }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.isPublished) notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900 dark:text-white tracking-tight">
            Chan Vans <span className="text-emerald-500">Kicau</span>
          </Link>
          <Link href="/blog" className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-4 py-10">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-8 shadow-xl">
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-4">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6 border-l-4 border-emerald-500 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert prose-sm sm:prose-base max-w-none
          prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
          prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
          prose-a:text-emerald-600 dark:prose-a:text-emerald-400
          prose-strong:text-slate-900 dark:prose-strong:text-white
          whitespace-pre-line">
          {post.content}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
          </Link>
        </div>
      </article>

      <footer className="border-t border-slate-200 dark:border-slate-800 px-4 py-6 text-center mt-8">
        <p className="text-xs text-slate-400">© 2025 Chan Vans Kicau. All rights reserved.</p>
      </footer>
    </div>
  );
}
