import "zod-openapi/extend";
import { createDocument } from "zod-openapi";
import { writeFileSync } from "fs";
import catalogPaths from "./catalog";

const document = createDocument({
  openapi: "3.1.0",
  servers: [
    {
      url: "http://localhost:8081/api/v1",
    },
  ],
  info: {
    title: "Umbra Microservice",
    description: "Umbra's microservice. Use `serviceName: 'umbra'` in the gateway to access",
    version: "1.0-dev",
  },
  paths: { ...catalogPaths },
});

export default document;

export function saveOpenAPIDefsAsJson(filename: string = "./umbra-microservice.json") {
  var json = JSON.stringify(document);
  writeFileSync(filename, json, "utf-8");
}

// Makes a definitions JSON if file is loaded as prerequisite module
saveOpenAPIDefsAsJson();
