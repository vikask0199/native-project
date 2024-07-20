/**
 * @file Contains model definition for the collection "oemAccessTokens", used to store OEMs' bearer token details (if they have bearer token auth)
 * @author Harsh Morayya <harsh.morayya@suhora.com>
 */

import mongoose from "mongoose";

export interface OemAccessTokenInterface extends Document {
  provider: string;
  accessToken?: string;
  expiresAt: number;
}

const schema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: false,
  },
  expiresAt: {
    type: Number,
    required: false,
  },
});

export default mongoose.model<OemAccessTokenInterface>(
  "OemAccessToken",
  schema,
  "oemAccessTokens"
);
