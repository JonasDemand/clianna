import { useCustomSessionContext } from '@context/CustomSessionContext';
import { SecurityDataType } from '@customTypes/api';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { reloadSession } from '@utils/auth';
import { useEffect, useMemo } from 'react';

const useApiClient = (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined
) => {
  const { session } = useCustomSessionContext();

  const client = useMemo(
    () => getApiClient(config, () => reloadSession(false)),
    [config]
  );

  useEffect(() => {
    client.setSecurityData({ accessToken: session?.user.accessToken });
  }, [client, session?.user.accessToken]);

  return client;
};

export default useApiClient;
