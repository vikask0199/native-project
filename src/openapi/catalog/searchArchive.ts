import { ZodOpenApiPathItemObject } from "zod-openapi";
import "zod-openapi/extend";
import CatalogSearchRequestSchema from "../../schema/archiveSearchRequest";
import { SuccessResponseSchema, ErrorResponseSchema } from "../../schema/archiveSearchResponse";

const document: ZodOpenApiPathItemObject = {
  post: {
    operationId: "catalog_search",
    summary: "Catalog Search",
    description: "Search scenes within Umbra's Catalog API",
    requestBody: { content: { "application/json": { schema: CatalogSearchRequestSchema } } },
    responses: {
      "200": {
        description: "200 OK",
        content: {
          "application/json": { schema: SuccessResponseSchema },
        },
      },
      "400": {
        description: "400 Bad Request",
        content: {
          "application/json": { schema: ErrorResponseSchema },
        },
        summary: "Server detected an error in the request body and couldn't process it",
      },
      "429": {
        description: "429 Too many requests",
        content: {
          "application/json": { schema: ErrorResponseSchema },
        },
      },
      "500": {
        description: "500 Internal Server Error",
        content: {
          "application/json": { schema: ErrorResponseSchema },
        },
      },
    },
    tags: ["catalog"],
  },
};

export default document;
