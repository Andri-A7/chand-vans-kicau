import { prisma } from "../lib/prisma";

export async function getAllPosts() {
  return prisma.post.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export async function createPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  isPublished?: boolean;
}) {
  return prisma.post.create({ data });
}

export async function updatePost(id: string, data: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  isPublished?: boolean;
}) {
  return prisma.post.update({ where: { id }, data });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
