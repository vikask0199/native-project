export interface OemToken {
  provider: string;
  accessToken: string;
  expiresAt: number;
}

export interface UmbraGetTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}
