'use client';

import { Session } from 'next-auth';
import React, { createContext, FC, ReactNode, useContext } from 'react';

export const useCustomSessionContext = () => {
  const context = useContext(CustomSessionContext);
  if (!context) {
    throw new Error('Context is null');
  }
  return context;
};

const CustomSessionContext = createContext<{ session: Session } | null>(null);

type CustomSessionContextProps = {
  children: ReactNode;
  session: Session;
};

const CustomSessionProvider: FC<CustomSessionContextProps> = ({
  children,
  session,
}) => {
  return (
    <CustomSessionContext.Provider
      value={{
        session,
      }}
    >
      {children}
    </CustomSessionContext.Provider>
  );
};

export default CustomSessionProvider;
