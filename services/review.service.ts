import { prisma } from "../lib/prisma";
import { ReviewType } from "../app/generated/prisma";

export async function getAllReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { bird: { select: { id: true, title: true, slug: true } } },
  });
}

export async function getStoreReviews() {
  return prisma.review.findMany({
    where: { type: ReviewType.STORE },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReviewsByBirdId(birdId: string) {
  return prisma.review.findMany({
    where: { birdId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createReview(data: {
  rating: number;
  comment?: string;
  buyerName: string;
  type: ReviewType;
  birdId?: string;
}) {
  return prisma.review.create({ data });
}

export async function deleteReview(id: string) {
  return prisma.review.delete({ where: { id } });
}

export async function getAverageRating(): Promise<number> {
  const result = await prisma.review.aggregate({
    _avg: { rating: true },
  });
  return result._avg.rating ?? 0;
}
