import { prisma } from "../lib/prisma";

export async function getAllRings() {
  return prisma.ring.findMany({
    orderBy: { createdAt: "desc" },
    include: { bird: { select: { id: true, title: true, slug: true } } },
  });
}

export async function getAvailableRings() {
  return prisma.ring.findMany({
    where: { isAssigned: false },
    orderBy: { code: "asc" },
  });
}

export async function getRingById(id: string) {
  return prisma.ring.findUnique({
    where: { id },
    include: { bird: true },
  });
}

export async function getRingByCode(code: string) {
  return prisma.ring.findUnique({
    where: { code },
    include: { bird: true },
  });
}

export async function createRing(data: {
  code: string;
  material?: string;
  year?: number;
}) {
  return prisma.ring.create({ data });
}

export async function updateRing(
  id: string,
  data: { code?: string; material?: string; year?: number }
) {
  return prisma.ring.update({ where: { id }, data });
}

export async function deleteRing(id: string) {
  return prisma.ring.delete({ where: { id } });
}
