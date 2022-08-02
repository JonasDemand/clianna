import { BackdropContextType } from '@customTypes/backdrop';
import { Backdrop, CircularProgress } from '@mui/material';
import { createContext, FC, ReactNode, useState } from 'react';

export const BackdropContext = createContext<BackdropContextType | null>(null);

type BackdropContextProps = {
  children: ReactNode;
};

const BackdropProvider: FC<BackdropContextProps> = ({ children }) => {
  const [showBackdrop, setShowBackdrop] = useState(false);

  return (
    <BackdropContext.Provider
      value={{
        showBackdrop,
        setShowBackdrop,
      }}
    >
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <CircularProgress size={100} />
      </Backdrop>
      {children}
    </BackdropContext.Provider>
  );
};

export default BackdropProvider;
