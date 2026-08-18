"use server";

import { revalidatePath } from "next/cache";
import { approvePayment, rejectPayment, createPayment } from "../services/payment.service";
import { z } from "zod";

const PaymentSchema = z.object({
  birdId: z.string().min(1),
  buyerName: z.string().min(1, "Nama wajib diisi"),
  buyerWhatsapp: z.string().min(8, "Nomor WA tidak valid"),
  proofImageUrl: z.string().min(1, "Bukti transfer wajib diupload"),
  amountPaid: z.coerce.number().min(1, "Jumlah bayar wajib diisi"),
  paymentType: z.enum(["DP", "FULL"]).default("DP"),
});

export type PaymentFormInput = {
  birdId: string;
  buyerName: string;
  buyerWhatsapp: string;
  proofImageUrl: string;
  amountPaid: number;
  paymentType: "DP" | "FULL";
};

export async function createPaymentAction(formData: PaymentFormInput) {
  const parsed = PaymentSchema.safeParse(formData);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };
  try {
    const payment = await createPayment(parsed.data);
    revalidatePath("/admin/payments");
    return { success: true, data: payment };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function approvePaymentAction(id: string) {
  try {
    await approvePayment(id);
    revalidatePath("/admin/payments");
    revalidatePath("/admin/birds");
    revalidatePath("/birds");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function rejectPaymentAction(id: string) {
  try {
    await rejectPayment(id);
    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
