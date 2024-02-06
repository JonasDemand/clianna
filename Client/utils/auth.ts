import { ESessionCookieName } from '@customTypes/auth';

import { TokenResponse } from './api/generated/Api';

export type Cookie = {
  name: ESessionCookieName;
  value: string;
  expires: Date;
  path: string;
};

export const generateCookiesFromTokens = (
  tokens: TokenResponse
): Cookie[] | null => {
  if (
    !tokens.accessToken ||
    !tokens.accessTokenExpireDate ||
    !tokens.refreshToken ||
    !tokens.refreshTokenExpireDate
  )
    return null;

  const refreshTokenExpireDate = new Date(tokens.refreshTokenExpireDate); //Somehow JS Date needs to be re-created
  return [
    {
      name: ESessionCookieName.JwtToken,
      value: tokens.accessToken,
      expires: refreshTokenExpireDate, // jwt needs to be held for longer to "authenticate" to refresh api
      path: '/',
    },
    {
      name: ESessionCookieName.ValidJwt,
      value: 'true',
      expires: new Date(tokens.accessTokenExpireDate),
      path: '/',
    },
    {
      name: ESessionCookieName.RefreshToken,
      value: tokens.refreshToken,
      expires: refreshTokenExpireDate, // jwt needs to be held for longer to "authenticate" to refresh api
      path: '/',
    },
  ];
};
