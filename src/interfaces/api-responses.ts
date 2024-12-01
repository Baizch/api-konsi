export interface ExternalApiResponse {
  success: boolean;
  data: {
    token: string;
    type: string;
    expiresIn: string;
  };
}

export interface GetTokenResponse {
  token: string | null;
  expiresAt: Date | null;
}
