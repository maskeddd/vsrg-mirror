import type { NextApiRequest, NextApiResponse } from "next";
import type { Error } from "@/types";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const domain = process.env.CLOUDFRONT_URL || "None";
const privateKey = Buffer.from(
  process.env.PRIVATE_KEY_ENCODED || "None",
  "base64"
).toString("utf8");
const keyPairId = process.env.KEY_PAIR_ID || "None";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | Error>
) {
  const mapset_id = parseInt(req.query.mapsetID as string);

  if (!mapset_id)
    return res.status(400).json({ code: 400, message: "invalid ID provided" });

  const url = `${domain}/${mapset_id}.qp`;
  const date = new Date();
  date.setHours(date.getHours() + 1);
  const dateLessThan = date.toString();

  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
  });

  res.redirect(signedUrl);
}
