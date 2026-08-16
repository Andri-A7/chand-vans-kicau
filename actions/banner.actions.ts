"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createBanner, updateBanner, deleteBanner, toggleBannerActive } from "../services/banner.service";

const BannerSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, "Gambar wajib diisi"),
  targetUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

export type BannerFormInput = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  targetUrl?: string;
  isActive?: boolean;
  order?: number;
};

export async function createBannerAction(formData: BannerFormInput) {
  const parsed = BannerSchema.safeParse(formData);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };
  try {
    const banner = await createBanner(parsed.data);
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true, data: banner };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateBannerAction(id: string, formData: BannerFormInput) {
  const parsed = BannerSchema.safeParse(formData);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };
  try {
    const banner = await updateBanner(id, parsed.data);
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true, data: banner };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteBannerAction(id: string) {
  try {
    await deleteBanner(id);
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function toggleBannerAction(id: string, isActive: boolean) {
  try {
    await toggleBannerActive(id, isActive);
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
