import { Session } from 'next-auth';
import { SessionContextValue } from 'next-auth/react';
import { ReactNode } from 'react';

var currentSession: SessionContextValue = {
  data: null,
  status: 'unauthenticated',
};

export const SessionProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session;
}) => {
  if (session)
    currentSession = {
      data: session,
      status: 'authenticated',
    };
  return children;
};

export const useSession = (): SessionContextValue => currentSession;
