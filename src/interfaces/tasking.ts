import { Geometry, Point } from "geojson";

export interface UmbraSpotlightConstraints {
  geometry: Point;
  polarization?: "VV" | "HH";
  rangeResolutionMinMeters?: number;
  multilookFactor?: number;
  grazingAngleMinDegrees?: number;
  grazingAngleMaxDegrees?: number;
  targetAzimuthAngleEndDegrees?: number;
  sceneSize?: "5X5_KM" | "4X4_KM" | "10X10_KM" | "NATURAL_FOOTPRINT";
}

export interface UmbraCreateTaskRequestBody {
  imagingMode?: "SPOTLIGHT";
  spotlightConstraints?: UmbraSpotlightConstraints;
  windowStartsAt: string;
  windowEndsAt: string;
  deliveryConfigId?: string;
  productTypes?: string[];
  taskName: string;
  userOrderId?: string;
  satelliteIds?: string[];
}

type UmbraTaskStatus =
  | "RECEIVED"
  | "REVIEW"
  | "ACCEPTED"
  | "ACTIVE"
  | "SCHEDULED"
  | "REJECTED"
  | "EXPIRED"
  | "TASKED"
  | "PROCESSING"
  | "PROCESSED"
  | "DELIVERED"
  | "CANCEL_REQUESTED"
  | "CANCELED"
  | "ERROR"
  | "ANOMALY"
  | "COMPLETED"
  | "SUBMITTED"
  | "TRANSMITTED"
  | "INCOMPLETE";

export interface UmbraCreateTaskResponseBody {
  id?: string;
  type?: "Feature";
  geometry: Geometry;
  properties: {
    imagingMode?: "SPOTLIGHT";
    spotlightConstraints?: UmbraSpotlightConstraints;
    windowStartsAt: string;
    windowEndsAt: string;
    deliveryConfigId?: string;
    productTypes?: string[];
    taskName: string;
    userOrderId?: string;
    satelliteIds?: string[];
    createdAt?: string;
    updatedAt?: string;
    organizationId: string;
    status?: UmbraTaskStatus;
    statusHistory?: { status: UmbraTaskStatus; timestamp?: string }[];
    userId: string;
    collectIds?: string[];
    userEmail?: string;
  };
}
