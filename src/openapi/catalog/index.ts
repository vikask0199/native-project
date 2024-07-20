import { ZodOpenApiPathsObject } from "zod-openapi";
import "zod-openapi/extend";
import archiveSearchDoc from "./searchArchive";

const document: ZodOpenApiPathsObject = {
  "/catalog/search": archiveSearchDoc,
};

export default document;
