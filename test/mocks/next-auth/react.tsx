import { Session } from 'next-auth';
import { SessionContextValue } from 'next-auth/react';
import { ReactNode } from 'react';

var currentSession: SessionContextValue = {
  data: null,
  status: 'unauthenticated',
  update: () => new Promise((res) => res(null)),
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
      update: () => new Promise((res) => res(null)),
    };
  return children;
};

export const useSession = (): SessionContextValue => currentSession;
