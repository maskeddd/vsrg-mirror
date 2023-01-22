import { Prisma } from "@prisma/client";

export interface Error {
  code: number;
  message: string;
}

const mapsetWithMaps = Prisma.validator<Prisma.MapsetArgs>()({
  include: { Map: true },
});

export type MapsetWithMaps = Prisma.MapsetGetPayload<typeof mapsetWithMaps>;
