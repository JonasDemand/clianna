import { Backdrop, CircularProgress } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { FC, ReactNode } from 'react';

export type AuthenticationWrapperProps = {
  children: ReactNode;
};

const AuthenticationWrapper: FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  if (!session && status !== 'loading') signIn();
  return (
    <>
      {session && <>{children}</>}
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!session}
      >
        <CircularProgress size={100} />
      </Backdrop>
    </>
  );
};

export default AuthenticationWrapper;
