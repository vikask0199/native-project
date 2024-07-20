import { NextFunction, Response } from "express";
import { ArchiveSearchCustomRequest } from "../interfaces/archive";
import { isGeometryValid } from "../utils/paramCheckers";
import ArchiveSearchRequestSchema from "../schema/archiveSearchRequest";

/**
 * Middleware to validate the parameters provided by our client to us, for archive searching
 * @param req The request containing all the filters
 * @param res Response
 * @param next Next function
 * @returns
 */
export const archiveSearchParamsValidator = (req: ArchiveSearchCustomRequest, res: Response, next: NextFunction) => {
  const parsingResults = ArchiveSearchRequestSchema.safeParse(req.body);
  if (!parsingResults.success) {
    return res.status(400).json({
      success: false,
      message: "Errors in Request Body",
      description: parsingResults.error.errors,
    });
  } else req.body = parsingResults.data;

  const { filters } = req.body;

  const issuesWithGeom = isGeometryValid(filters.intersects);

  if (issuesWithGeom.length > 0)
    return res.status(400).json({
      success: false,
      message: "geometry provided in `filters.intersectsGeometry` is invalid",
      description: issuesWithGeom,
    });

  return next();
};
