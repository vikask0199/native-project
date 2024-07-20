import { Geometry } from "geojson";
import gjv from "geojson-validation";
import umbraConfig from "../config/umbraConfig";

export function areAllMandatoryFieldsPresent(
  record: Record<string, any>,
  mandatoryPropertiesList: string[]
): string[] | true {
  const missingFields: string[] = [];

  const checkFields = (obj: Record<string, any>, keys: string[]) => {
    for (const key of keys) {
      const nestedKeys = key.split(".");
      let currentObj = obj;
      for (const nestedKey of nestedKeys) {
        if (!currentObj.hasOwnProperty(nestedKey)) {
          missingFields.push(key);
          break;
        }
        currentObj = currentObj[nestedKey];
      }
    }
  };

  checkFields(record, mandatoryPropertiesList);

  return missingFields.length > 0 ? missingFields : true;
}

/**
 * Checks if the given date string is in the format of "YYYY-MM-DDThh:mm:ssZ"
 * @param date date string to check against
 * @returns {boolean}
 */
export function isDateInCorrectFormat(date: string): boolean {
  if (typeof date !== "string") return false;

  const regex =
    /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+|)(?:Z|(?:\+|\-)(?:\d{2}):?(?:\d{2}))/;
  return regex.test(date);
}

export function isGeometryValid(geometry: Geometry) {
  // Otherwise returns the stack trace
  return gjv.isGeometryObject(geometry, true);
}

/**
 * Checks if every element in the bands array is present in the validBands array from umbraConfig.
 *
 * @param {string[]} bands - The array of band strings to check.
 * @returns {boolean} - Returns true if every element in the bands array is present in the validBands array from umbraConfig; otherwise, returns false.
 */
export function areBandsValid(bands: string[]): boolean {
  if (!Array.isArray(bands)) return false;

  return (
    bands.every((band) => umbraConfig.validBands.includes(band)) &&
    bands.length > 0
  );
}

export function arePolarizationsValid(polarizations: string[]): boolean {
  if (!Array.isArray(polarizations)) return false;

  return (
    polarizations.every((polarization) =>
      umbraConfig.validPolarizations.includes(polarization)
    ) && polarizations.length > 0
  );
}

/**
 * Checks user given range against a given valid range
 * Returns false if gte is more than lte
 *
 * @param userDefinedRange the user defined range
 * @param validRange the valid range
 * @returns
 */
export function isRangeValid(
  userDefinedRange: { gte?: number; lte?: number },
  validRange: { min: number; max: number }
) {
  // User did not supply an object
  if (typeof userDefinedRange !== "object") return false;

  // object is empty
  if (
    !(userDefinedRange.gte !== undefined || userDefinedRange.lte !== undefined)
  )
    return true;

  // gte exists and does not come under valid range
  if (
    typeof userDefinedRange.gte === "number" &&
    (userDefinedRange.gte > validRange.max ||
      userDefinedRange.gte < validRange.min)
  )
    return false;

  // lte exists and does not come under valid range
  if (
    typeof userDefinedRange.lte == "number" &&
    (userDefinedRange.lte > validRange.max ||
      userDefinedRange.lte < validRange.min)
  )
    return false;

  // both gte and lte exist and gte is more than lte
  if (
    typeof userDefinedRange.gte == "number" &&
    typeof userDefinedRange.lte == "number" &&
    userDefinedRange.gte > userDefinedRange.lte
  )
    return false;

  return true;
}
