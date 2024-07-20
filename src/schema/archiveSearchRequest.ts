import { z } from "zod";
import umbraConfig from "../config/umbraConfig";
import "zod-openapi/extend";
import { GenericGeomSchema, checkGteIsNoteMoreThanLte, gteNotMoreThanLteIssueBody } from "./helperSchemas";

const ArchiveSearchRequestSchema = z.object({
  token: z.string().optional().openapi({ description: "Used for pagination" }),
  limit: z
    .number()
    .positive()
    .max(umbraConfig.maxArchiveItemsAllowedPerPage)
    .default(umbraConfig.maxArchiveItemsAllowedPerPage),
  filters: z.object({
    timeWindow: z
      .object({
        gte: z.string().datetime(),
        lte: z.string().datetime(),
      })
      .openapi({ description: "In format: YYYY-MM-DDThh:mm:ssZ" }),
    intersects: GenericGeomSchema,
    frequencyBands: z
      .array(z.enum(umbraConfig.validBands as [string, ...string[]]))
      .nonempty()
      .optional(),
    polarizations: z
      .array(z.enum(umbraConfig.validPolarizations as [string, ...string[]]))
      .nonempty()
      .optional(),
    looksAzimuth: z
      .object({
        gte: z.number().min(umbraConfig.validLooksAzimuthRange.min).max(umbraConfig.validLooksAzimuthRange.max),
        lte: z.number().min(umbraConfig.validLooksAzimuthRange.min).max(umbraConfig.validLooksAzimuthRange.max),
      })
      .partial()
      .refine(checkGteIsNoteMoreThanLte, gteNotMoreThanLteIssueBody)
      .optional(),
    resolutionRange: z
      .object({
        gte: z.number().min(umbraConfig.validRangeResolutionRange.min).max(umbraConfig.validRangeResolutionRange.max),
        lte: z.number().min(umbraConfig.validRangeResolutionRange.min).max(umbraConfig.validRangeResolutionRange.max),
      })
      .partial()
      .refine(checkGteIsNoteMoreThanLte, gteNotMoreThanLteIssueBody)
      .optional(),
    incidenceAngle: z
      .object({
        gte: z.number().min(umbraConfig.validIncidenceAngleRange.min).max(umbraConfig.validIncidenceAngleRange.max),
        lte: z.number().min(umbraConfig.validIncidenceAngleRange.min).max(umbraConfig.validIncidenceAngleRange.max),
      })
      .partial()
      .refine(checkGteIsNoteMoreThanLte, gteNotMoreThanLteIssueBody)
      .optional(),
  }),
});

export default ArchiveSearchRequestSchema;
