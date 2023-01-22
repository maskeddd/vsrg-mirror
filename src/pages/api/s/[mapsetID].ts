import type { NextApiRequest, NextApiResponse } from "next";
import type { Error, MapsetWithMaps } from "@/types";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MapsetWithMaps | Error>
) {
  const mapset_id = parseInt(req.query.mapsetID as string);

  if (!mapset_id)
    return res.status(400).json({ code: 400, message: "invalid ID provided" });

  const mapset = await prisma.mapset.findFirst({
    where: {
      id: mapset_id,
    },
    include: {
      Map: true,
    },
  });
  if (!mapset) {
    res.status(404).json({ code: 404, message: "mapset not found" });
  } else {
    res.status(200).json(mapset);
  }
}
