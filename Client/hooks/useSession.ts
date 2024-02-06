'use client';

import { ESessionCookieName, SessionCookies } from '@customTypes/auth';
import { Cookie } from '@utils/auth';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

const useSession = () => {
  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies<
    ESessionCookieName,
    SessionCookies
  >([
    ESessionCookieName.JwtToken,
    ESessionCookieName.ValidJwt,
    ESessionCookieName.RefreshToken,
  ]);

  const logout = useCallback(() => {
    removeCookie(ESessionCookieName.RefreshToken);
    removeCookie(ESessionCookieName.ValidJwt);
    removeCookie(ESessionCookieName.JwtToken);
    router.push(`/login?redirectUrl=${encodeURI(window.location.href)}`);
  }, [removeCookie, router]);

  const updateSession = useCallback(
    (newCookies: Cookie[]) => {
      newCookies.forEach(({ name, value, ...options }) =>
        setCookie(name, value, { ...options })
      );
    },
    [setCookie]
  );

  return {
    sessionCookies: cookies,
    logout,
    updateSession,
  };
};

export default useSession;
