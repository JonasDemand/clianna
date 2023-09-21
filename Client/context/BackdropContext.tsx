'use client';

import MuiGlobalBackdrop from '@components/External/MuiGlobalBackdrop';
import { BackdropContextType } from '@customTypes/backdrop';
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from 'react';

export const useBackdropContext = () => {
  const context = useContext(BackdropContext);
  if (!context) {
    throw new Error('Context is null');
  }
  return context;
};

const BackdropContext = createContext<BackdropContextType | null>(null);

type BackdropContextProps = {
  children: ReactNode;
};

const BackdropProvider: FC<BackdropContextProps> = ({ children }) => {
  const [showBackdrop, setShowBackdrop] = useState(false);

  return (
    <BackdropContext.Provider
      value={{
        setShowBackdrop,
      }}
    >
      <MuiGlobalBackdrop open={showBackdrop} />
      {children}
    </BackdropContext.Provider>
  );
};

export default BackdropProvider;
