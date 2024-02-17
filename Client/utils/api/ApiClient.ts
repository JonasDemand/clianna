import { SecurityDataType } from '@customTypes/api';
import { ESessionCookieName } from '@customTypes/auth';
import { Cookie, generateCookiesFromTokens } from '@utils/auth';

import { ApiConfig, Client } from './generated/Api';

export const getApiClient = (
  config?: Partial<ApiConfig<SecurityDataType>> | null,
  updateCookies?: (cookies: Cookie[]) => void,
  logout?: () => void
) => {
  const client = new Client<SecurityDataType>({
    baseUrl: process.env.NEXT_PUBLIC_CLIANNA_API_URL ?? 'http://localhost:4001',
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
      if (res.status === 401) {
        const securityData = client.getSecurityData();
        if (!securityData) {
          logout && logout();
          return res;
        }
        const { data, error } = await client.user.refreshUpdate(
          { refreshToken: securityData[ESessionCookieName.RefreshToken] },
          { dontCheckJwt: true }
        );
        if (error || !data) {
          logout && logout();
          return res;
        }

        const cookies = generateCookiesFromTokens(data);
        if (!cookies) {
          logout && logout();
          return res;
        }
        updateCookies && updateCookies(cookies);
        return await fetch(url, {
          ...request,
          headers: {
            ...request?.headers,
            Authorization: `Bearer ${cookies[0].value}`,
          },
        });
      }
      return res;
    },
    ...config,
  });
  return client;
};
