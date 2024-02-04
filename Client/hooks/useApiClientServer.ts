import { SecurityDataType } from '@customTypes/api';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { auth } from 'config/auth';
import { Session } from 'next-auth';

const useApiClientServer = async (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined,
  session?: Session
) => {
  const _session = session ?? (await auth());

  const client = getApiClient(config, () => auth());
  client.setSecurityData({ accessToken: _session?.user.accessToken });

  return client;
};

export default useApiClientServer;
