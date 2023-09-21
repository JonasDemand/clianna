'use client';

import { LOCALSTORAGE_JWT_KEY } from '@consts/api';
import { ApiContextType, SecurityDataType } from '@customTypes/api';
import { Client } from '@utils/api/generated/Api';
import getConfig from 'next/config';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';

console.log(getConfig());
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
  const router = useRouter();

  const client = useMemo(() => {
    const client = new Client<SecurityDataType>({
      baseUrl: publicRuntimeConfig.CLIANNA_API_URL,
      securityWorker: (securityData) => {
        if (securityData?.token)
          return {
            headers: { Authorization: `Bearer ${securityData.token}` },
          };
      },
      customFetch: async (...params) => {
        const res = await fetch(...params);
        if (res.status === 401) {
          localStorage.removeItem(LOCALSTORAGE_JWT_KEY);
          router.replace('/login');
        }
        return res;
      },
    });
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(LOCALSTORAGE_JWT_KEY);
      token ? client.setSecurityData({ token }) : router.replace('/login');
    }
    return client;
  }, [router]);

  const setToken = useCallback(
    (token?: string | null) => {
      client.setSecurityData({ token });
      token
        ? localStorage.setItem(LOCALSTORAGE_JWT_KEY, token)
        : localStorage.removeItem(LOCALSTORAGE_JWT_KEY);
    },
    [client]
  );

  return (
    <ApiContext.Provider value={{ Client: client, setToken }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
