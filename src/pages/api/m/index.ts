import type { NextApiResponse, NextApiRequest } from "next";
import type { Error } from "@/types";

export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<Error>
) {
  res.status(404).json({ code: 404, message: "no map ID provided" });
}
