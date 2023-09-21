import React, { FC, ReactNode } from 'react';

export type AuthenticationWrapperProps = {
  children: ReactNode;
};

const AuthenticationWrapper: FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  /*TODO
  const { setShowBackdrop } = useBackdropContext();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (!session && status !== 'loading') signIn();
  }, [session, status]);
  useEffect(() => setShowBackdrop(!session), [session, setShowBackdrop]);*/
  return <>{<>{children}</>}</>;
};

export default AuthenticationWrapper;
