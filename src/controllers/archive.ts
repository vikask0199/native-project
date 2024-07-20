import { Response } from "express";
import util from "util";
import { ArchiveSearchCustomRequest } from "../interfaces/archive";
import { umbraSearchService } from "../services/umbraCatalog";
import { isAxiosError } from "axios";
import { convertUmbraHrefsToOurHrefs, pickLinks, replaceBodyInNextPageLink } from "../utils/transformResponse";
import { SuccessResponseSchema } from "../schema/archiveSearchResponse";

/**
 * Express controller to perform an archive search using all the filters provided by the custom Request body
 * @param {ArchiveSearchCustomRequest} req Custom request body containing "searchBody" property that has all the formatted filters in it
 * @param res Response
 * @returns
 */
export const archiveSearch = async (req: ArchiveSearchCustomRequest, res: Response) => {
  try {
    if (!req.searchBody)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });

    const { results } = await umbraSearchService(req.searchBody);

    // Replacing body in the "next" link if it exists
    results.links = replaceBodyInNextPageLink(results.links, req.body);
    // Picking only the required links in the links array
    results.links = pickLinks(results.links, ["next"]);
    // Making sure umbra hrefs don't make it to client
    results.links = convertUmbraHrefsToOurHrefs(results.links, req.originalUrl);

    const parsedResults = SuccessResponseSchema.safeParse({ success: true, data: results });

    if (parsedResults.success) return res.status(200).json(parsedResults.data);
    else
      return res.status(200).json({
        success: true,
        message: "Results may not be following correct schema",
        data: results,
      });
  } catch (err) {
    if (isAxiosError(err)) {
      const statusCode = err.response?.status;
      if (statusCode === 422) {
        console.log("validation error when API call sent to Umbra search archive: ");
        console.log(util.inspect(err.response?.data, true, 20, true));
        return res.status(500).json({
          success: false,
          message: "Something went wrong. Internal server error",
        });
      } else if (statusCode === 429)
        return res.status(429).json({
          success: false,
          message: "Too many requests. Try again later",
        });
      else {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
        });
      }
    }

    console.log("Something went wrong while executing archive search");
    console.log(err);
    if (err instanceof TypeError) {
      console.log("Name of error: ", err.name);
      console.log("Message of error: ", err.message);
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
