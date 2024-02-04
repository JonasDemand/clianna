import { SecurityDataType } from '@customTypes/api';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession, Session } from 'next-auth';

const useApiClientServer = async (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined,
  session?: Session
) => {
  const _session = session ?? (await getServerSession(authOptions));
  console.log(_session);

  const client = getApiClient(config, () => getServerSession(authOptions));
  client.setSecurityData({ accessToken: _session?.user.accessToken });

  return client;
};

export default useApiClientServer;
