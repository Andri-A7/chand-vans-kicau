import { prisma } from "../lib/prisma";

export async function getAllInquiries() {
  return prisma.inquiryLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bird: { select: { id: true, title: true, slug: true, status: true } },
    },
  });
}

export async function getInquiriesByBirdId(birdId: string) {
  return prisma.inquiryLog.findMany({
    where: { birdId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInquiry(data: {
  birdId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  waMessageSent?: boolean;
}) {
  return prisma.inquiryLog.create({ data });
}

export async function markWaSent(id: string) {
  return prisma.inquiryLog.update({
    where: { id },
    data: { waMessageSent: true },
  });
}
