"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { BirdStatus, BirdGender } from "../app/generated/prisma";
import {
  createBird,
  updateBird,
  updateBirdStatus,
  deleteBird,
} from "../services/bird.service";

const BirdSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi").regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan strip"),
  speciesId: z.string().min(1, "Spesies wajib dipilih"),
  ringId: z.string().optional().nullable(),
  price: z.coerce.number().min(0).optional().nullable(),
  gender: z.nativeEnum(BirdGender).default(BirdGender.UNKNOWN),
  birthDate: z.coerce.date().optional().nullable(),
  parentTrah: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  images: z.array(z.string().url()).default([]),
  isFeatured: z.boolean().default(false),
});

const UpdateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(BirdStatus),
});

export async function createBirdAction(formData: unknown) {
  const parsed = BirdSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const bird = await createBird({
      ...parsed.data,
      ringId: parsed.data.ringId ?? undefined,
      price: parsed.data.price ?? undefined,
      birthDate: parsed.data.birthDate ?? undefined,
      parentTrah: parsed.data.parentTrah ?? undefined,
      description: parsed.data.description ?? undefined,
    });
    revalidatePath("/admin/birds");
    revalidatePath("/birds");
    return { success: true, data: bird };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateBirdAction(id: string, formData: unknown) {
  const parsed = BirdSchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const bird = await updateBird(id, {
      ...parsed.data,
      ringId: parsed.data.ringId ?? undefined,
      price: parsed.data.price ?? undefined,
      birthDate: parsed.data.birthDate ?? undefined,
      parentTrah: parsed.data.parentTrah ?? undefined,
      description: parsed.data.description ?? undefined,
    });
    revalidatePath("/admin/birds");
    revalidatePath("/birds");
    revalidatePath(`/birds/${bird.slug}`);
    return { success: true, data: bird };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateBirdStatusAction(formData: unknown) {
  const parsed = UpdateStatusSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const bird = await updateBirdStatus(parsed.data.id, parsed.data.status);
    revalidatePath("/admin/birds");
    revalidatePath("/birds");
    revalidatePath(`/birds/${bird.slug}`);
    return { success: true, data: bird };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteBirdAction(id: string) {
  try {
    await deleteBird(id);
    revalidatePath("/admin/birds");
    revalidatePath("/birds");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
