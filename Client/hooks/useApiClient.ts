'use client';

import { SecurityDataType } from '@customTypes/api';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { useEffect, useMemo } from 'react';

import useSession from './useSession';

const useApiClient = (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined
) => {
  const { sessionCookies, logout, updateSession } = useSession();

  const client = useMemo(
    () => getApiClient(config, updateSession, logout),
    [config, logout, updateSession]
  );

  useEffect(() => {
    client.setSecurityData(sessionCookies);
  }, [client, sessionCookies]);

  return client;
};

export default useApiClient;
