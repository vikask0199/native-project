/**
 * @file Contains services related to Umbra's tasking API
 * @author Harsh Morayya <harsh.morayya@suhora.com>
 */

import { FeatureCollection } from "geojson";
import umbraAuth from "../utils/authHeader";
import {
  UmbraCreateTaskRequestBody,
  UmbraCreateTaskResponseBody,
} from "../interfaces/tasking";
import { umbraTaskingClient } from "../config/axiosConfig";
import {
  createTaskEndpointLimiter,
  genericReadEndpointsLimiter,
} from "../config/bottleneckConfig";
import { AxiosResponse } from "axios";

/**
 * Get a task from Umbra's API using the taskId
 * @param {string} taskId The taskId of the requested task
 * @returns the requested task
 */
export const umbraGetTaskService = async (taskId: string) => {
  const taskResponse = await genericReadEndpointsLimiter.schedule(() =>
    umbraTaskingClient(`/tasks/${taskId}`, {
      headers: {
        ...umbraAuth,
      },
    })
  );
  const task = await taskResponse.data;

  return { response: taskResponse, results: task };
};

/**
 * Creates a tasking request
 * @param {UmbraCreateTaskRequestBody} requestBody Object containing all the details and conditions for the tasking
 * @returns {Promise<{response: AxiosResponse, results: UmbraCreateTaskResponseBody}>} Contains the original response and the results from umbra
 */
export const umbraCreateTaskService = async (
  requestBody: UmbraCreateTaskRequestBody
): Promise<{
  response: AxiosResponse;
  results: UmbraCreateTaskResponseBody;
}> => {
  const response = await createTaskEndpointLimiter.schedule(() =>
    umbraTaskingClient("/tasks", {
      headers: {
        ...umbraAuth,
        accept: "application/json",
        "content-type": "application/json",
      },
      data: requestBody,
    })
  );

  const taskResponseResults: UmbraCreateTaskResponseBody = await response.data;

  return { response: response, results: taskResponseResults };
};

// idk where we will be using it
/**
 * Used to retrieve which regions are restricted for us to task on
 * @returns {Promise<{results: FeatureCollection, response: AxiosResponse}>} The feature collection which contains geometries that we can't perform tasking on as per our contract. As well as the original response
 */
export const umbraGetRestrictedAreasService = async (): Promise<{
  results: FeatureCollection;
  response: AxiosResponse;
}> => {
  const response = await genericReadEndpointsLimiter.schedule(() =>
    umbraTaskingClient("/restricted-access-areas", {
      headers: { ...umbraAuth },
    })
  );

  const restrictedAreasFeatureCollection: FeatureCollection =
    await response.data;

  return { response: response, results: restrictedAreasFeatureCollection };
};
