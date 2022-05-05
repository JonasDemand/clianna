import { Box, CircularProgress } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { FunctionComponent, ReactNode } from 'react';

export type AuthenticationWrapperProps = {
  children: ReactNode;
};

const AuthenticationWrapper: FunctionComponent<AuthenticationWrapperProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  if (session) {
    return <>{children}</>;
  }
  if (status !== 'loading') signIn();
  return (
    <Box
      sx={{
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <CircularProgress size={100} />
    </Box>
  );
};

export default AuthenticationWrapper;
