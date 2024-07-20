import { config } from "dotenv";
import path from "path";

config();

export default {
  _bearerToken:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5HQmZiZkVWeFh3S0tZX0NHbWRnZiJ9.eyJodHRwczovL3VtYnJhLnNwYWNlL3JhdGVfbGltaXQiOjUwLCJodHRwczovL3VtYnJhLnNwYWNlL3JhdGVfbGltaXRfcmVtYWluaW5nIjoyLCJjbGllbnQiOnsiY2xpZW50X2lkIjoibGJRTkJUbFdHNFdsNWpnZ1ZqdGU1U1VybUtTNmdzMFkiLCJjbGllbnRfbmFtZSI6Ik0yTVM6IFN1aG9yYSIsIm9yZ19kaXNwbGF5X25hbWUiOiJTdWhvcmEiLCJvcmdfaWQiOiJvcmdfQWF5TWxJc0N6TUtnZUpGYyIsIm9yZ19uYW1lIjoic3Vob3JhIn0sImlzcyI6Imh0dHBzOi8vYXV0aC5jYW5vcHkudW1icmEuc3BhY2UvIiwic3ViIjoibGJRTkJUbFdHNFdsNWpnZ1ZqdGU1U1VybUtTNmdzMFlAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBpLmNhbm9weS51bWJyYS5zcGFjZSIsImlhdCI6MTcxNDYyNTEzNCwiZXhwIjoxNzE0NzExNTM0LCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJsYlFOQlRsV0c0V2w1amdnVmp0ZTVTVXJtS1M2Z3MwWSIsInBlcm1pc3Npb25zIjpbXX0.e_lqVl_XUrgIXcUQJYWlc1nfO6RGqbRq6g8jVGUsIdaZOV-5vIqOnQVK4pstABTPtKdhKNQ5vC-KtKF3fSCFZCFJMP5RuQ0l7QcR5T3W5HAj_Rh1AKaX-ZZUm_Zbqt8NYrD9NHaJo_S0OPAEj2ZXYsKDaMVPPLbRQUCTL3MY8Uqw-UeOfhF22zvvEBJ106_CQtRCsSOOKHVzOLFcUO_bbXFsZkaNuUDaqJQTKJpZovr8BPOdVKYl3HbHoHAbj25HR0JELmdJVKFqfiCmSNq612HIsMtodMjobgzfITzkKm44p4F_rfzhqLxTcd_VT2FiqeYb9gM6T9tJFF8sXCRiwg", // Initialized when app starts
  get bearerToken() {
    return this._bearerToken;
  },
  set bearerToken(value) {
    this._bearerToken = value;
  },

  clientId: process.env.UMBRA_CLIENT_ID,
  clientSecret: process.env.UMBRA_CLIENT_SECRET,
  grantType: "client_credentials",
  audience: "https://api.canopy.umbra.space",
  tokenGenerationUrl: "https://auth.canopy.umbra.space/oauth/token",

  thumbnailsDir: path.join("static/thumbnails"),
  // storageLocation: path.join("static/planet"),

  taskingBaseUrl: "https://api.canopy.umbra.space/tasking",
  catalogBaseUrl: "https://api.canopy.umbra.space/archive",

  validBands: ["X"],
  validPolarizations: ["VV", "HH"],
  validRangeResolutionRange: {
    min: 0,
    max: 2,
  },
  validLooksAzimuthRange: {
    min: 1,
    max: 9,
  },
  validIncidenceAngleRange: {
    min: 0,
    max: 90,
  },
  maxArchiveItemsAllowedPerPage: 30,
};
