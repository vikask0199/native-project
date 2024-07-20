import { z } from "zod";
import "zod-openapi/extend";

export const GenericGeomSchema = z.object({
  type: z.enum(["Point", "Polygon", "LineString", "MultiPoint", "MultiPolygon"]),
  coordinates: z.any().array(),
});

export const gteNotMoreThanLteIssueBody = {
  message: "'lte' must be greater than or equal to 'gte'",
  params: { errorCode: "ERR_LTE_LESS_THAN_GTE" },
};

export function checkGteIsNoteMoreThanLte(ob?: { gte?: number; lte?: number }) {
  if (!ob) return true;

  const gte = ob.gte;
  const lte = ob.lte;

  return lte === undefined || gte === undefined || lte >= gte;
}
