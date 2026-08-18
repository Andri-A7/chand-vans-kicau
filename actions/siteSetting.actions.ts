"use server";

import { revalidatePath } from "next/cache";
import { updateSiteSettings, upsertSeoSettings } from "../services/siteSetting.service";

export async function updateSiteSettingsAction(data: {
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
  try {
    await updateSiteSettings(data);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function upsertSeoSettingsAction(pageSlug: string, data: {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImageUrl?: string;
}) {
  try {
    await upsertSeoSettings(pageSlug, data);
    revalidatePath("/admin/seo");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
