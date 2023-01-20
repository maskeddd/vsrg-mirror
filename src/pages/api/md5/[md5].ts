import type { NextApiRequest, NextApiResponse } from "next";
import type Error from "../../../types/error";
import { maps, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<maps | Error>
) {
  const md5 = req.query.md5 as string;

  if (!md5)
    return res.status(400).json({ code: 400, message: "invalid ID provided" });

  const map = await prisma.maps.findFirst({
    where: {
      md5: md5,
    },
  });
  if (!map) {
    res.status(404).json({ code: 404, message: "mapset not found" });
  } else {
    res.status(200).json(map);
  }
}
