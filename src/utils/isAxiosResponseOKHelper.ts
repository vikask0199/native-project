/**
 * @file Contains helper function that checks if axios response is a 2xx or not since axios doesn't include such a property
 * @author {Harsh Morayya} <harsh.morayya@suhora.com>
 */

import { AxiosResponse } from "axios";

export default function (axiosResponse: AxiosResponse) {
  return axiosResponse.status >= 200 && axiosResponse.status < 300;
}
