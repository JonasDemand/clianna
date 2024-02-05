import { SESSION_JWT_COOKIE_NAME } from '@consts/auth';
import { SecurityDataType } from '@customTypes/api';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';

const useApiClient = (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined
) => {
  const client = useMemo(() => getApiClient(config), [config]);

  const [cookies] = useCookies([SESSION_JWT_COOKIE_NAME]);

  useEffect(() => {
    client.setSecurityData({ accessToken: cookies.sessionJwt });
  }, [client, cookies.sessionJwt]);

  return client;
};

export default useApiClient;
