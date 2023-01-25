import type { NextApiResponse, NextApiRequest } from "next";
import type { Error, MapsetWithMaps } from "@/types";
import { Mapset, Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MapsetWithMaps[] | Error>
) {
  const { amount = 20 } = req.query;
  const { offset = 0 } = req.query;
  const { query = "" } = req.query;
  // const modes = req.query.mode as string[];

  // const modeQuery = () => {
  //   let array = [];
  //   modes.forEach((mode) => array.push({ where: "a" }));
  // };

  // let a = await Product.findMany({
  //   skip: parseInt(skipPage) - 1,
  //   take: parseInt(takePage),
  //   where: constructedWhere,
  //   include: {
  //     gallery: true,
  //   },
  // });

  const results = query.length
    ? await prisma.mapset.findMany({
        where: {
          OR: [
            { title: { contains: String(query) } },
            { artist: { contains: String(query) } },
            { creator_username: { contains: String(query) } },
            { tags: { contains: String(query) } },
          ],
        },
        take: Number(amount),
        skip: Number(offset),
        include: {
          Map: true,
        },
      })
    : await prisma.mapset.findMany({
        orderBy: { mapset_ranking_queue_id: "desc" },
        take: Number(amount),
        skip: Number(offset),
        include: {
          Map: true,
        },
      });
  if (results.length) {
    res.status(200).json(results);
  } else {
    res.status(404).json({ code: 404, message: "no mapset ID provided" });
  }
}
