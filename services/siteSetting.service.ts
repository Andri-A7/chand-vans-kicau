import { prisma } from "../lib/prisma";

export async function getSiteSettings() {
  return prisma.siteSetting.upsert({
    where: { id: "global_setting" },
    create: { id: "global_setting", storeName: "Chan Vans Kicau" },
    update: {},
  });
}

export async function updateSiteSettings(data: {
  storeName?: string;
  tagline?: string;
  description?: string;
  whatsapp?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  address?: string;
  googleMapsUrl?: string;
  announcementText?: string;
  isAnnouncementActive?: boolean;
}) {
  return prisma.siteSetting.upsert({
    where: { id: "global_setting" },
    create: { id: "global_setting", storeName: "Chan Vans Kicau", ...data },
    update: data,
  });
}

export async function getSeoSettings(pageSlug: string) {
  return prisma.seoSetting.findUnique({ where: { pageSlug } });
}

export async function upsertSeoSettings(pageSlug: string, data: {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImageUrl?: string;
}) {
  return prisma.seoSetting.upsert({
    where: { pageSlug },
    create: { pageSlug, ...data },
    update: data,
  });
}
