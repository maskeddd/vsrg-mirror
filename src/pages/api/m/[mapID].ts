import type { NextApiRequest, NextApiResponse } from "next";
import type { Error } from "@/types";
import { Map, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Map | Error>
) {
  const map_id = parseInt(req.query.mapID as string);

  if (!map_id)
    return res.status(400).json({ code: 400, message: "invalid ID provided" });

  const map = await prisma.map.findFirst({
    where: {
      id: map_id,
    },
  });
  if (!map) {
    res.status(404).json({ code: 404, message: "mapset not found" });
  } else {
    res.status(200).json(map);
  }
}
