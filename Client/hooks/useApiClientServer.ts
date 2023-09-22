import { SecurityDataType } from '@customTypes/api';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const useApiClientServer = async (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined
) => {
  const session = await getServerSession(authOptions);

  const client = getApiClient(config);
  client.setSecurityData({ token: session?.user.token });

  return client;
};

export default useApiClientServer;
