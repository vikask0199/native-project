import { NextFunction, Response } from "express";
import { ArchiveSearchCustomRequest, UmbraSearchFilters } from "../interfaces/archive";

/**
 * Transform the archive search request body given by our client to a format that umbra accepts
 * @param req The request body containing all the filters
 * @param _res Response (unused)
 * @param next Next function
 */
export const prepareArchiveRequestMiddleware = (
  req: ArchiveSearchCustomRequest,
  _res: Response,
  next: NextFunction
) => {
  const { filters, limit, token } = req.body;

  const searchBody: UmbraSearchFilters = {
    "filter-lang": "cql2-json",
    filter: {
      op: "and",
      args: [],
    },
    intersects: filters.intersects,
    sortby: [
      {
        field: "properties.end_datetime",
        direction: req.query.oldestFirst ? "asc" : "desc",
      },
    ],
    datetime: `${filters.timeWindow.gte}/${filters.timeWindow.lte}`,
    limit: limit,
    fields: {
      exclude: ["links"],
    },
    ...(token && { token: token }),
  };

  // adding frequency bands in an OR statement if given
  if (filters.frequencyBands) {
    const frequencyBandFilter: { op: string; args: any[] } = {
      op: "or",
      args: [],
    };

    filters.frequencyBands.forEach((band) => {
      frequencyBandFilter.args.push({
        op: "=",
        args: [{ property: "properties.sar:frequency_band" }, band],
      });
    });

    searchBody.filter.args.push(frequencyBandFilter);
  }

  // adding incidence angle range if range is given
  if (filters.incidenceAngle?.gte) {
    searchBody.filter.args.push({
      op: ">=",
      args: [{ property: "properties.view:incidence_angle" }, filters.incidenceAngle.gte],
    });
  }
  if (filters.incidenceAngle?.lte) {
    searchBody.filter.args.push({
      op: "<=",
      args: [{ property: "properties.view:incidence_angle" }, filters.incidenceAngle.lte],
    });
  }

  // adding looks azimuth range if range is given
  if (filters.looksAzimuth?.gte) {
    searchBody.filter.args.push({
      op: ">=",
      args: [{ property: "properties.sar:looks_azimuth" }, filters.looksAzimuth.gte],
    });
  }
  if (filters.looksAzimuth?.lte) {
    searchBody.filter.args.push({
      op: "<=",
      args: [{ property: "properties.sar:looks_azimuth" }, filters.looksAzimuth.lte],
    });
  }

  // adding polarization filters if they exist
  if (filters.polarizations) {
    const polarizationsFilters: { op: string; args: any[] } = {
      op: "or",
      args: [],
    };

    filters.polarizations.forEach((polarizationItem) => {
      polarizationsFilters.args.push({
        op: "in",
        args: [[polarizationItem], { property: "properties.sar:polarizations" }],
      });
    });

    searchBody.filter.args.push(polarizationsFilters);
  }

  // adding resolution range filter if it exists
  if (filters.resolutionRange?.gte) {
    searchBody.filter.args.push({
      op: ">=",
      args: [{ property: "properties.sar:resolution_range" }, filters.resolutionRange.gte],
    });
  }
  if (filters.resolutionRange?.lte) {
    searchBody.filter.args.push({
      op: "<=",
      args: [{ property: "properties.sar:resolution_range" }, filters.resolutionRange.lte],
    });
  }

  if (typeof req.body.token === "string") searchBody.token = req.body.token;

  req.searchBody = searchBody;

  next();
};
