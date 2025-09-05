"use server";

import db from "@/db";

export async function fetchPrinterCatalog(query?: string) {
  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { brand: { name: { contains: query, mode: "insensitive" } } },
        ],
      }
    : {};

  const models = await db.printerModel.findMany({
    where,
    include: { brand: true },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    take: 50,
  });

  return models.map((m) => ({
    id: m.id,
    name: m.name,
    brand: m.brand.name,
    type: m.type,
    buildVolume: m.buildVolume,
  }));
}
