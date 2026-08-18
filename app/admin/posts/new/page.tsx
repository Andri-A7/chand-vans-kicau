export const dynamic = "force-dynamic";

import { createPostAction, PostFormInput } from "../../../../actions/post.actions";
import { redirect } from "next/navigation";
import PostForm from "../_components/PostForm";

export default async function NewPostPage() {
  async function handleCreate(data: PostFormInput) {
    "use server";
    const result = await createPostAction(data);
    if (result.success) redirect("/admin/posts");
    return result;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Tulis Artikel Baru</h1>
        <p className="text-sm text-slate-400 mt-0.5">Artikel edukasi burung kicau</p>
      </div>
      <PostForm onSubmit={handleCreate} submitLabel="Simpan Artikel" />
    </div>
  );
}
