import { prisma } from "../lib/prisma";

export async function getAllBanners() {
  return prisma.banner.findMany({ orderBy: { order: "asc" } });
}

export async function getActiveBanners() {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getBannerById(id: string) {
  return prisma.banner.findUnique({ where: { id } });
}

export async function createBanner(data: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  targetUrl?: string;
  isActive?: boolean;
  order?: number;
}) {
  return prisma.banner.create({ data });
}

export async function updateBanner(id: string, data: {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  targetUrl?: string;
  isActive?: boolean;
  order?: number;
}) {
  return prisma.banner.update({ where: { id }, data });
}

export async function deleteBanner(id: string) {
  return prisma.banner.delete({ where: { id } });
}

export async function toggleBannerActive(id: string, isActive: boolean) {
  return prisma.banner.update({ where: { id }, data: { isActive } });
}
