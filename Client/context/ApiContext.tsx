'use client';

import { ApiContextType, SecurityDataType } from '@customTypes/api';
import { Client } from '@utils/api/generated/Api';
import { useSession } from 'next-auth/react';
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

const { publicRuntimeConfig } = {
  publicRuntimeConfig: { CLIANNA_API_URL: 'https://localhost:4000' },
}; //TODO getConfig();

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('Context is null');
  }
  return context;
};

const ApiContext = createContext<ApiContextType | null>(null);

type ApiContextProps = {
  children: ReactNode;
};
const ApiProvider: FC<ApiContextProps> = ({ children }) => {
  const { data: session } = useSession();

  const client = useMemo(() => {
    const client = new Client<SecurityDataType>({
      baseUrl: publicRuntimeConfig.CLIANNA_API_URL,
      securityWorker: (securityData) => {
        if (securityData?.token)
          return {
            headers: { Authorization: `Bearer ${securityData.token}` },
          };
      },
    });
    return client;
  }, []);

  useEffect(() => {
    client.setSecurityData({ token: session?.user.token });
  }, [client, session?.user.token]);

  return (
    <ApiContext.Provider value={{ Client: client }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
