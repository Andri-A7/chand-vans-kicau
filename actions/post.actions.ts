"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createPost, updatePost, deletePost } from "../services/post.service";

const PostSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, strip"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Konten wajib diisi"),
  thumbnail: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export type PostFormInput = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  isPublished?: boolean;
};

export async function createPostAction(formData: PostFormInput) {
  const parsed = PostSchema.safeParse(formData);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };
  try {
    const post = await createPost(parsed.data);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    return { success: true, data: post };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updatePostAction(id: string, formData: PostFormInput) {
  const parsed = PostSchema.safeParse(formData);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };
  try {
    const post = await updatePost(id, parsed.data);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, data: post };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deletePostAction(id: string) {
  try {
    await deletePost(id);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
