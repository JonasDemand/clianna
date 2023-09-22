import { SecurityDataType } from '@customTypes/api';
import { environment } from '@utils/config';

import { ApiConfig, Client } from './generated/Api';

export const getApiClient = (
  config?: Partial<ApiConfig<SecurityDataType>> | null
) =>
  new Client<SecurityDataType>({
    baseUrl: environment.NEXT_PUBLIC_CLIANNA_API_URL,
    baseApiParams: { cache: 'no-cache' },
    securityWorker: (securityData) => {
      if (securityData?.token)
        return {
          headers: { Authorization: `Bearer ${securityData.token}` },
        };
    },
    ...config,
  });
