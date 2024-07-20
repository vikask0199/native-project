import { Request } from "express";
import { Polygon, Point, Geometry } from "geojson";
import { z } from "zod";
import ArchiveSearchRequestSchema from "../schema/archiveSearchRequest";

export type SearchRequestBody = z.infer<typeof ArchiveSearchRequestSchema>;

export interface ArchiveSearchCustomRequest extends Request<{}, {}, SearchRequestBody, { oldestFirst?: string }> {
  searchBody?: UmbraSearchFilters;
}

export interface UmbraSearchFilters {
  "filter-lang": "cql2-json";
  fields?: {
    include?: string[];
    exclude?: string[];
  };
  filter: {
    op: string;
    args: any[];
  };
  sortby: {
    field: string;
    direction: "asc" | "desc";
  }[];
  datetime: string;
  intersects: Geometry;
  limit?: number;
  token?: string;
}

export interface UmbraLink {
  rel: string;
  type: string;
  href: string;
  body?: Record<string, any>;
  method?: string;
}

export interface UmbraArchiveSearchResults {
  type: string;
  context: {
    limit: number;
    returned: number;
  };
  features: UmbraArchiveItem[];
  links: UmbraLink[];
}

export interface UmbraArchiveItem {
  id: string;
  bbox: number[];
  type: string;
  links: {
    rel: string;
    type: string;
    href: string;
  }[];
  assets: {
    thumbnail: {
      href: string;
      type: string;
      roles: string[];
      title: string;
      description: string;
    };
  };
  geometry: Polygon | Point;
  collection: string;
  properties: {
    id: string;
    created: string; //datetime
    updated: string; //datetime
    platform: string;
    start_datetime: string; //datetime
    end_datetime: string; //datetime
    "umbra:task_id": string;
    "sar:product_type": string;
    "sar:looks_azimuth": number;
    "sar:polarizations": Array<"VV" | "VH" | "HH" | "HV">;
    "umbra:collect_ids": string[];
    "sar:frequency_band": "X" | "L" | "C";
    "sar:instrument_mode": "SPOTLIGHT";
    "sar:resolution_range": number;
    "view:incidence_angle": number;
    "sar:resolution_azimuth": number;
    "umbra:open-data-catalog": number;
    "umbra:squint_angle_degrees": number;
    "umbra:grazing_angle_degrees": number;
    "umbra:slant_range_kilometers": number;
    "umbra:target_azimuth_angle_degrees": number;
  };
}
