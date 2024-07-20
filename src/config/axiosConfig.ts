import axios from "axios";
import applyCaseMiddleware, {
  ApplyCaseMiddlewareOptions,
} from "axios-case-converter";
import umbraConfig from "./umbraConfig";

const axiosCaseConverterOptions: ApplyCaseMiddlewareOptions = {
  ignoreParams: true,
  caseFunctions: {
    camel: (input: string) => input,
    snake: (input: string) => input,
  },
};

export const umbraCatalogClient = applyCaseMiddleware(
  axios.create({
    baseURL: umbraConfig.catalogBaseUrl,
  }),
  axiosCaseConverterOptions
);

export const umbraTaskingClient = applyCaseMiddleware(
  axios.create({
    baseURL: umbraConfig.taskingBaseUrl,
  }),
  axiosCaseConverterOptions
);

export const umbraTokenGeneratorClient = applyCaseMiddleware(
  axios.create({
    baseURL: umbraConfig.tokenGenerationUrl,
  }),
  axiosCaseConverterOptions
);
