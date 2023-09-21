import { ApiContextType, SecurityDataType } from '@customTypes/api';
import { Client } from '@utils/api/generated/Api';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';

const LOCALSTORAGE_KEY = 'JWT_TOKEN';

const { publicRuntimeConfig } = getConfig();

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
        if (res.status === 401) router.replace('/auth/signin');
        return res;
      },
    });
    if (typeof window !== 'undefined')
      client.setSecurityData({ token: localStorage.getItem(LOCALSTORAGE_KEY) });
    return client;
  }, [router]);

  const setToken = useCallback(
    (token?: string) => {
      client.setSecurityData({ token });
      token
        ? localStorage.setItem(LOCALSTORAGE_KEY, token)
        : localStorage.removeItem(LOCALSTORAGE_KEY);
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
