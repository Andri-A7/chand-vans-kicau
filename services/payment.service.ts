import { prisma } from "../lib/prisma";
import { PaymentStatus, BirdStatus } from "../app/generated/prisma";

export async function getAllPayments() {
  return prisma.paymentProof.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bird: { select: { id: true, title: true, slug: true, status: true, images: true } },
    },
  });
}

export async function getPaymentById(id: string) {
  return prisma.paymentProof.findUnique({
    where: { id },
    include: { bird: true },
  });
}

export async function createPayment(data: {
  birdId: string;
  buyerName: string;
  buyerWhatsapp: string;
  proofImageUrl: string;
  amountPaid: number;
  paymentType: "DP" | "FULL";
}) {
  return prisma.paymentProof.create({ data });
}

export async function approvePayment(id: string) {
  const payment = await prisma.paymentProof.findUnique({
    where: { id }, include: { bird: true },
  });
  if (!payment) throw new Error("Payment tidak ditemukan");

  const newBirdStatus = payment.paymentType === "FULL"
    ? BirdStatus.SOLD
    : BirdStatus.RESERVED;

  const timestamps = {
    reservedAt: newBirdStatus === BirdStatus.RESERVED ? new Date() : undefined,
    soldAt: newBirdStatus === BirdStatus.SOLD ? new Date() : undefined,
  };

  await Promise.all([
    prisma.paymentProof.update({
      where: { id },
      data: { status: PaymentStatus.APPROVED },
    }),
    prisma.bird.update({
      where: { id: payment.birdId },
      data: { status: newBirdStatus, ...timestamps },
    }),
  ]);

  return { success: true };
}

export async function rejectPayment(id: string) {
  return prisma.paymentProof.update({
    where: { id },
    data: { status: PaymentStatus.REJECTED },
  });
}

export async function getPendingPaymentsCount() {
  return prisma.paymentProof.count({ where: { status: PaymentStatus.PENDING } });
}
