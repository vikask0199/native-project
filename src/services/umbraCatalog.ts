/**
 * @file Contains services that pertain to Umbra's STAC API
 * @author Harsh Morayya <harsh.morayya@suhora.com>
 */

import { AxiosResponse } from "axios";
import { umbraCatalogClient } from "../config/axiosConfig";
import {
  UmbraArchiveSearchResults,
  UmbraSearchFilters,
} from "../interfaces/archive";
import umbraAuth from "../utils/authHeader";
import { archiveEndpointsLimiter } from "../config/bottleneckConfig";

/**
 * Searches the Umbra catalog. Uses the CQL2-JSON language for filtering
 * @param fieldsAndFilters
 * @returns {Promise<{response: Response;results: UmbraArchiveSearchResults;}>}
 */
export const umbraSearchService = async (
  requestBody: UmbraSearchFilters
): Promise<{ response: AxiosResponse; results: UmbraArchiveSearchResults }> => {
  const searchBodyWithFilterLang = {
    ...requestBody,
  };

  try {
    const searchResponse = await archiveEndpointsLimiter.schedule(() =>
      umbraCatalogClient("/search", {
        headers: {
          ...umbraAuth,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "POST",
        data: searchBodyWithFilterLang,
      })
    );
    const searchResults: UmbraArchiveSearchResults = await searchResponse.data;

    return { response: searchResponse, results: searchResults };
  } catch (err) {
    throw err;
  }
};
