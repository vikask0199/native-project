/**
 * @file Contains services related to the oemAccessTokens collection
 * @author Harsh Morayya <harsh.morayya@suhora.com>
 */

import { MongooseError } from "mongoose";
import oemAccessTokens from "../models/oemAccessTokens";
import { OemToken, UmbraGetTokenResponse } from "../interfaces/auth";
import umbraConfig from "../config/umbraConfig";
import sleep from "../utils/sleep";
import appConfig from "../config/appConfig";
import { umbraTokenGeneratorClient } from "../config/axiosConfig";
import isAxiosResponseOKHelper from "../utils/isAxiosResponseOKHelper";
import { authEndpointsLimiter } from "../config/bottleneckConfig";

/**
 * Get an authorization token that is already stored in database
 * @param oemName The name of the oem
 * @returns {Promise<OemToken | null | undefined>} the oemToken whose name field = oemName. If not found, sends null. If error, rethrows the error
 */
export const getAccessTokenService = async (oemName: string): Promise<OemToken | null | undefined> => {
  try {
    return await oemAccessTokens.findOne({ provider: oemName });
  } catch (err) {
    if (err instanceof MongooseError) {
      console.log("App crashed due to mongoDB connection failure? Original error: ", err);
      throw err;
    }
  }
};

/**
 * Add an access token to the DB
 * @param {OemToken} oemToken contains token details like expires_in, token, etc
 * @returns the new token as saved or false if operation was unsuccessful
 */
export const addAccessTokenService = async (oemToken: OemToken) => {
  // Precaution to not add duplicates
  if ((await getAccessTokenService(oemToken.provider)) !== null) return false;
  else {
    const newOemToken = new oemAccessTokens({
      provider: oemToken.provider,
      expiresAt: oemToken.expiresAt,
      accessToken: oemToken.accessToken,
    });

    try {
      await newOemToken.save();
    } catch (err) {
      console.log("Can't save token. Error: ", err);
      return false;
    }
  }
};

/**
 * Update a token. Uses the name field in the token to find
 * @param oemToken contains token details likes expires_in, token, etc
 * @returns
 */
export const updateAccessTokenService = async (oemToken: OemToken) => {
  try {
    return await oemAccessTokens.findOneAndReplace({ provider: oemToken.provider }, oemToken, {
      returnOriginal: false,
    });
  } catch (err) {
    if (err instanceof MongooseError) {
      console.log("App crashed due to mongoDB connection failure? Original error: ", err);
    }
  }
};

/**
 * Gets a new auth token from umbra
 * @returns {UmbraGetTokenResponse} the new token sent by umbra
 */
export const umbraGetTokenService = async () => {
  var details: { [key: string]: string } = {
    client_id: umbraConfig.clientId ? umbraConfig.clientId : "",
    client_secret: umbraConfig.clientSecret ? umbraConfig.clientSecret : "",
    grant_type: umbraConfig.grantType,
    audience: umbraConfig.audience,
  };

  const response = await authEndpointsLimiter.schedule(() =>
    umbraTokenGeneratorClient("/", {
      headers: {
        "Content-Type": "application/json",
      },
      data: details,
      method: "POST",
    })
  );

  if (!isAxiosResponseOKHelper(response)) {
    console.log(await response.data);
    throw new Error();
  }

  const tokenDetails: UmbraGetTokenResponse = await response.data;
  return tokenDetails;
};

/**
 * Responsible for storing valid Umbra tokens. Does these actions:
 *
 * i) If token isn't in DB, get a new token and store it
 *
 * ii) If token is expired, get a new token and update in DB
 *
 * iii) Execute at GRACE_PERIOD_FOR_EXPIRY (constant in function) milliseconds before token expires
 */
export async function umbraBearerTokenBaseProcess() {
  const GRACE_PERIOD_FOR_EXPIRY = 600000; // 10 min

  async function setUmbraBearerToken(): Promise<number> {
    const umbraToken = await getAccessTokenService("umbra");

    appConfig.dbConnectionSuccessful = true;

    // Token does not exist in DB. Add token
    if (umbraToken == null) {
      try {
        const tokenDetails = await umbraGetTokenService();

        umbraConfig.bearerToken = tokenDetails.access_token;

        console.log("umbra token refreshes in (ms): ", tokenDetails.expires_in * 1000);

        await addAccessTokenService({
          provider: "umbra",
          accessToken: tokenDetails.access_token,
          expiresAt: Date.now() + tokenDetails.expires_in * 1000,
        });

        return tokenDetails.expires_in;
      } catch (err) {
        console.log("Failed to get Umbra token", err);
        appConfig.dbConnectionSuccessful = false;
        return 720;
      }
    }
    // Token already exists in DB
    else {
      // existing token has already expired or has less than 10 min left to expire
      const timeToExpire = umbraToken.expiresAt - Date.now() - GRACE_PERIOD_FOR_EXPIRY;
      if (timeToExpire <= 0) {
        console.log("umbra: existing token expired or about to expire");
        try {
          const tokenDetails = await umbraGetTokenService();

          await updateAccessTokenService({
            provider: "umbra",
            accessToken: tokenDetails.access_token,
            expiresAt: Date.now() + tokenDetails.expires_in * 1000,
          });

          umbraConfig.bearerToken = tokenDetails.access_token;

          return tokenDetails.expires_in;
        } catch (err) {
          console.log("Failed to get Umbra token", err);
          appConfig.dbConnectionSuccessful = false;
          return 720;
        }
      }
      // existing token hasn't expired yet
      else {
        console.log("not expired. Time left: " + (umbraToken.expiresAt - Date.now()));
        umbraConfig.bearerToken = umbraToken.accessToken;
        return Math.floor((umbraToken.expiresAt - Date.now()) / 1000);
      }
    }
  }

  // Initial get token
  let expiresIn = await setUmbraBearerToken();
  console.log("umbra token expires in ", expiresIn);

  while (true) {
    await sleep(expiresIn * 1000 - GRACE_PERIOD_FOR_EXPIRY);
    // refresh token as soon as sleeping is completed
    expiresIn = await setUmbraBearerToken();
  }
}
