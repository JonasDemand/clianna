import { GlobalContext } from '@context/GlobalContext';
import { GlobalContextType } from '@customTypes/global';
import { signIn, useSession } from 'next-auth/react';
import React, { FC, ReactNode, useContext, useEffect } from 'react';

export type AuthenticationWrapperProps = {
  children: ReactNode;
};

const AuthenticationWrapper: FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const { showBackdrop } = useContext(GlobalContext) as GlobalContextType;
  const { data: session, status } = useSession();
  useEffect(() => {
    if (!session && status !== 'loading') signIn();
  }, [session, status]);
  useEffect(() => showBackdrop(!session), [session, showBackdrop]);
  return <>{session && <>{children}</>}</>;
};

export default AuthenticationWrapper;
