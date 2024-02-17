'use server';

import { SecurityDataType } from '@customTypes/api';
import { ESessionCookieName } from '@customTypes/auth';
import { getApiClient } from '@utils/api/ApiClient';
import { ApiConfig } from '@utils/api/generated/Api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const useApiClientServer = async (
  config?: Partial<ApiConfig<SecurityDataType>> | null | undefined
) => {
  const client = getApiClient(
    config,
    (newCookies) =>
      newCookies.forEach(({ name, value, ...options }) =>
        cookies().set(name, value, options)
      ),
    () => {
      cookies().delete(ESessionCookieName.JwtToken);
      cookies().delete(ESessionCookieName.RefreshToken);
      cookies().delete(ESessionCookieName.ValidJwt);
      redirect('/login'); //TODO add redirect url (not important, because server logout shouldn't happen anyway)
    }
  );
  client.setSecurityData({
    [ESessionCookieName.JwtToken]: cookies().get(ESessionCookieName.JwtToken)
      ?.value,
    [ESessionCookieName.ValidJwt]: Boolean(
      cookies().get(ESessionCookieName.ValidJwt)?.value
    ),
    [ESessionCookieName.RefreshToken]: cookies().get(
      ESessionCookieName.RefreshToken
    )?.value,
  });

  return client;
};

export default useApiClientServer;
