import { Client } from '@utils/api/generated/Api';

export type SecurityDataType = {
  token?: string | null;
};

export type ApiContextType = {
  Client: Client<SecurityDataType>;
  setToken: (token: string) => void;
};
