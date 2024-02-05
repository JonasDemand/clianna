import { SecurityDataType } from '@customTypes/api';
import { environment } from '@utils/config';

import { ApiConfig, Client } from './generated/Api';

export const getApiClient = (
  config?: Partial<ApiConfig<SecurityDataType>> | null
) => {
  const client = new Client<SecurityDataType>({
    baseUrl: environment.NEXT_PUBLIC_CLIANNA_API_URL,
    baseApiParams: { cache: 'no-cache' },
    securityWorker: (securityData) => {
      if (securityData?.accessToken)
        return {
          headers: { Authorization: `Bearer ${securityData.accessToken}` },
        };
    },
    customFetch: async (...params) => {
      const res = await fetch(...params);
      if (res.status === 401) {
        /*TODO if (!refreshSession) {
          typeof window === 'undefined' ? redirect('/login') : await signOut();
          return res;
        }
        const newSession = await refreshSession!();

        client.setSecurityData({ accessToken: newSession?.user.accessToken });
        const resSecondAttempt = await fetch(params[0], {
          ...params[1],
          headers: {
            ...params[1]?.headers,
            Authorization: `Bearer ${newSession?.user.accessToken}`,
          },
        });
        if (resSecondAttempt.status === 401)
          typeof window === 'undefined' ? redirect('/login') : await signOut();
        return resSecondAttempt;*/
      }
      return res;
    },
    ...config,
  });
  return client;
};
