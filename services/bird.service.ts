import { prisma } from "../lib/prisma";
import { BirdStatus, BirdGender } from "../app/generated/prisma";

export async function getAllBirds() {
  return prisma.bird.findMany({
    orderBy: { createdAt: "desc" },
    include: { species: true, ring: true },
  });
}

export async function getFeaturedBirds() {
  return prisma.bird.findMany({
    where: { isFeatured: true, status: BirdStatus.AVAILABLE },
    orderBy: { createdAt: "desc" },
    include: { species: true, ring: true },
  });
}

export async function getLatestBirds(limit = 8) {
  return prisma.bird.findMany({
    where: { status: BirdStatus.AVAILABLE },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { species: true, ring: true },
  });
}

export async function getBirdBySlug(slug: string) {
  return prisma.bird.findUnique({
    where: { slug },
    include: { species: true, ring: true },
  });
}

export async function getBirdById(id: string) {
  return prisma.bird.findUnique({
    where: { id },
    include: { species: true, ring: true },
  });
}

export async function getBirdsFiltered(params: {
  speciesId?: string;
  gender?: BirdGender;
  status?: BirdStatus;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  orderBy?: "latest" | "price_asc" | "price_desc";
}) {
  const {
    speciesId, gender, status, isFeatured,
    minPrice, maxPrice, search, orderBy = "latest",
  } = params;

  return prisma.bird.findMany({
    where: {
      ...(speciesId && { speciesId }),
      ...(gender && { gender }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { species: { name: { contains: search, mode: "insensitive" } } },
          { ring: { code: { contains: search, mode: "insensitive" } } },
        ],
      }),
    },
    orderBy:
      orderBy === "price_asc"
        ? { price: "asc" }
        : orderBy === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" },
    include: { species: true, ring: true },
  });
}

export async function createBird(data: {
  title: string;
  slug: string;
  speciesId: string;
  ringId?: string;
  price?: number;
  gender?: BirdGender;
  birthDate?: Date;
  parentTrah?: string;
  description?: string;
  images?: string[];
  isFeatured?: boolean;
}) {
  const bird = await prisma.bird.create({ data });
  if (data.ringId) {
    await prisma.ring.update({
      where: { id: data.ringId },
      data: { isAssigned: true },
    });
  }
  return bird;
}

export async function updateBird(
  id: string,
  data: {
    title?: string;
    slug?: string;
    speciesId?: string;
    ringId?: string | null;
    price?: number;
    gender?: BirdGender;
    birthDate?: Date;
    parentTrah?: string;
    description?: string;
    images?: string[];
    status?: BirdStatus;
    isFeatured?: boolean;
  }
) {
  const existing = await prisma.bird.findUnique({ where: { id } });
  if (!existing) throw new Error("Bird not found");

  if (data.ringId !== undefined && data.ringId !== existing.ringId) {
    if (existing.ringId) {
      await prisma.ring.update({
        where: { id: existing.ringId },
        data: { isAssigned: false },
      });
    }
    if (data.ringId) {
      await prisma.ring.update({
        where: { id: data.ringId },
        data: { isAssigned: true },
      });
    }
  }

  return prisma.bird.update({ where: { id }, data });
}

export async function updateBirdStatus(id: string, status: BirdStatus) {
  return prisma.bird.update({ where: { id }, data: { status } });
}

export async function deleteBird(id: string) {
  const bird = await prisma.bird.findUnique({ where: { id } });
  if (bird?.ringId) {
    await prisma.ring.update({
      where: { id: bird.ringId },
      data: { isAssigned: false },
    });
  }
  return prisma.bird.delete({ where: { id } });
}
