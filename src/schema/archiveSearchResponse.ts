import "zod-openapi/extend";
import { z } from "zod";
import { GenericGeomSchema } from "./helperSchemas";

const FeatureSchema = z
  .object({
    id: z.string(),
    bbox: z.number().array().min(4).max(6).openapi({ description: "4 items for 2D bbox and 6 for 3D bbox" }),
    type: z.string().openapi({ example: "Feature" }),
    assets: z.record(
      z.string(),
      z.object({
        href: z.string().url().openapi({ description: "Link to asset" }),
        type: z.string().optional().openapi({ example: "image/png" }),
        roles: z
          .string()
          .array()
          .optional()
          .openapi({ example: ["thumbnail"] }),
        title: z.string().optional().openapi({ example: "Thumbnail for e7269273-e7a1-4b44-a66c-3a792358510c" }),
        description: z
          .string()
          .optional()
          .openapi({ example: "512x512 PNG thumbnail for e7269273-e7a1-4b44-a66c-3a792358510c" }),
      })
    ),
    geometry: GenericGeomSchema,
    collection: z.string().openapi({ example: "umbra-sar" }),
    properties: z.record(z.string(), z.any()),
    stac_version: z.string().optional().openapi({ example: "1.0.0" }),
    stac_extensions: z.string().array().optional(),
  })
  .openapi({ ref: "ArchiveSearchResponseFeature" });

const LinkSchema = z.object({
  rel: z.string().openapi({ example: "next" }),
  type: z.string().optional().openapi({ description: "MIME type of link's target" }),
  method: z
    .string()
    .optional()
    .openapi({ description: "HTTP method to use when contacting href. Assume GET if not given", example: "POST" }),
  href: z
    .string()
    .openapi({ description: "Path only. No protocol or host included", example: "/api/v1/catalog/search" }),
  body: z.record(z.string(), z.any()).optional(),
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    type: z.string().openapi({ example: "FeatureCollection" }),
    context: z.object({ limit: z.number(), returned: z.number() }),
    features: FeatureSchema.array(),
    links: LinkSchema.array(),
  }),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  description: z
    .string()
    .optional()
    .openapi({ description: "Provided when error info in `message` is not enough to convey error message info" }),
});
