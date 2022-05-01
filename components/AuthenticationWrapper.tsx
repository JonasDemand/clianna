import { signIn, useSession } from 'next-auth/react';
import { FunctionComponent } from 'react';

export interface AuthenticationWrapperProps {
  children: React.ReactNode;
}

const AuthenticationWrapper: FunctionComponent<AuthenticationWrapperProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  if (session) {
    return <div>{children}</div>;
  }
  if (status === 'loading') {
    return <div>loading</div>;
  }
  signIn();
  return <div>loading</div>;
};

export default AuthenticationWrapper;
