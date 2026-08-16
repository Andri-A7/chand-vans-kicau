"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ReviewType } from "../app/generated/prisma";
import { createReview, deleteReview } from "../services/review.service";

const ReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional(),
  buyerName: z.string().min(1, "Nama pembeli wajib diisi"),
  type: z.nativeEnum(ReviewType).default(ReviewType.STORE),
  birdId: z.string().optional(),
});

export type ReviewFormInput = {
  rating: number;
  comment?: string;
  buyerName: string;
  type: ReviewType;
  birdId?: string;
};

export async function createReviewAction(formData: ReviewFormInput) {
  const parsed = ReviewSchema.safeParse(formData);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };
  try {
    const review = await createReview(parsed.data);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteReviewAction(id: string) {
  try {
    await deleteReview(id);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
