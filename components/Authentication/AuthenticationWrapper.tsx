import { BackdropContext } from '@context/BackdropContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { signIn, useSession } from 'next-auth/react';
import { FC, ReactNode, useContext, useEffect } from 'react';

export type AuthenticationWrapperProps = {
  children: ReactNode;
};

const AuthenticationWrapper: FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const { setShowBackdrop } = useContext(
    BackdropContext
  ) as BackdropContextType;
  useEffect(() => {
    if (!session && status !== 'loading') signIn();
  }, [session, status]);
  useEffect(() => setShowBackdrop(!session), [session]);
  return <>{session && <>{children}</>}</>;
};

export default AuthenticationWrapper;
