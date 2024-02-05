import { SESSION_JWT_COOKIE_NAME } from '@consts/auth';
import { SecurityDataType } from '@customTypes/api';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { cookies } from 'next/headers';

const useApiClientServer = async (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined
) => {
  console.log(cookies().get(SESSION_JWT_COOKIE_NAME)?.value);
  const client = getApiClient(config);
  client.setSecurityData({
    accessToken: cookies().get(SESSION_JWT_COOKIE_NAME)?.value,
  });

  return client;
};

export default useApiClientServer;
