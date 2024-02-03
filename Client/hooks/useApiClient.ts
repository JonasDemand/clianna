import { SecurityDataType } from '@customTypes/api';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';

const useApiClient = (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined
) => {
  const { data: session } = useSession();

  const client = useMemo(() => getApiClient(config), [config]);

  useEffect(() => {
    client.setSecurityData({ accessToken: session?.user.accessToken });
  }, [client, session?.user.accessToken]);

  return client;
};

export default useApiClient;
