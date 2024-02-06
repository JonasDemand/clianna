import { SecurityDataType } from '@customTypes/api';
import { ESessionCookieName } from '@customTypes/auth';
import { Cookie, generateCookiesFromTokens } from '@utils/auth';
import { environment } from '@utils/config';

import { ApiConfig, Client } from './generated/Api';

export const getApiClient = (
  config?: Partial<ApiConfig<SecurityDataType>> | null,
  updateCookies?: (cookies: Cookie[]) => void,
  logout?: () => void
) => {
  const client = new Client<SecurityDataType>({
    baseUrl: environment.NEXT_PUBLIC_CLIANNA_API_URL,
    baseApiParams: { cache: 'no-cache' },
    securityWorker: async (securityData, dontCheckJwt) => {
      if (!securityData) return;
      if (!dontCheckJwt && !securityData[ESessionCookieName.ValidJwt]) {
        const { data, error } = await client.user.refreshUpdate(
          { refreshToken: securityData[ESessionCookieName.RefreshToken] },
          { dontCheckJwt: true }
        );
        if (error || !data) {
          logout && logout();
          return;
        }
        const cookies = generateCookiesFromTokens(data);
        if (!cookies) {
          logout && logout();
          return;
        }
        updateCookies && updateCookies(cookies);
        return {
          headers: {
            Authorization: `Bearer ${cookies[0].value}`,
          },
        };
      }
      if (securityData[ESessionCookieName.JwtToken])
        return {
          headers: {
            Authorization: `Bearer ${
              securityData[ESessionCookieName.JwtToken]
            }`,
          },
        };
    },
    customFetch: async (url, request) => {
      const res = await fetch(url, request);
      if (res.status === 401) logout && logout();
      return res;
    },
    ...config,
  });
  return client;
};
