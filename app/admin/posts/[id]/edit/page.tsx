export const dynamic = "force-dynamic";

import { getPostById } from "../../../../../services/post.service";
import { updatePostAction, deletePostAction, PostFormInput } from "../../../../../actions/post.actions";
import PostForm from "../../_components/PostForm";
import { redirect, notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  async function handleUpdate(data: PostFormInput) {
    "use server";
    const result = await updatePostAction(id, data);
    if (result.success) redirect("/admin/posts");
    return result;
  }

  async function handleDelete() {
    "use server";
    await deletePostAction(id);
    redirect("/admin/posts");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Edit Artikel</h1>
          <p className="text-sm text-slate-400 mt-0.5 truncate max-w-64">{post.title}</p>
        </div>
        <form action={handleDelete}>
          <button type="submit"
            className="text-sm text-red-500 hover:text-red-400 border border-red-900/50 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all">
            Hapus
          </button>
        </form>
      </div>
      <PostForm
        initialData={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          thumbnail: post.thumbnail ?? "",
          isPublished: post.isPublished,
        }}
        onSubmit={handleUpdate}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
