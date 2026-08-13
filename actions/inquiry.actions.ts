"use server";

import { z } from "zod";
import { createInquiry } from "../services/inquiry.service";

const InquirySchema = z.object({
  birdId: z.string().min(1, "Bird ID wajib diisi"),
  customerName: z.string().min(1, "Nama wajib diisi"),
  customerPhone: z
    .string()
    .min(8, "Nomor HP tidak valid")
    .regex(/^[0-9+\-\s]+$/, "Format nomor HP tidak valid"),
  customerAddress: z.string().optional(),
});

export async function createInquiryAction(formData: unknown) {
  const parsed = InquirySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const inquiry = await createInquiry({
      ...parsed.data,
      waMessageSent: false,
    });
    return { success: true, data: inquiry };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
