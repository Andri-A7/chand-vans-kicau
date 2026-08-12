import { prisma } from "../lib/prisma";

export async function getAllSpecies() {
  return prisma.species.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getSpeciesById(id: string) {
  return prisma.species.findUnique({
    where: { id },
    include: { birds: true },
  });
}

export async function getSpeciesBySlug(slug: string) {
  return prisma.species.findUnique({
    where: { slug },
  });
}

export async function createSpecies(data: { name: string; slug: string }) {
  return prisma.species.create({ data });
}

export async function updateSpecies(
  id: string,
  data: { name?: string; slug?: string }
) {
  return prisma.species.update({ where: { id }, data });
}

export async function deleteSpecies(id: string) {
  return prisma.species.delete({ where: { id } });
}
