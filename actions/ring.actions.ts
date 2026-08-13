"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createRing, updateRing, deleteRing } from "../services/ring.service";

const RingSchema = z.object({
  code: z.string().min(1, "Kode ring wajib diisi"),
  material: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  isAssigned: z.boolean().optional(),
});

export type RingFormInput = {
  code: string;
  material?: string;
  year?: number;
  isAssigned?: boolean;
};

export async function createRingAction(formData: RingFormInput) {
  const parsed = RingSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const ring = await createRing({
      code: parsed.data.code,
      material: parsed.data.material,
      year: parsed.data.year ?? undefined,
      isAssigned: parsed.data.isAssigned,
    });
    revalidatePath("/admin/rings");
    return { success: true, data: ring };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateRingAction(id: string, formData: RingFormInput) {
  const parsed = RingSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const ring = await updateRing(id, {
      code: parsed.data.code,
      material: parsed.data.material,
      year: parsed.data.year ?? undefined,
      isAssigned: parsed.data.isAssigned,
    });
    revalidatePath("/admin/rings");
    return { success: true, data: ring };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteRingAction(id: string) {
  try {
    await deleteRing(id);
    revalidatePath("/admin/rings");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
