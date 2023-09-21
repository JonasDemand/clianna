import { BackdropContextType } from '@customTypes/backdrop';
import { Backdrop, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
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
  const router = useRouter();
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    /*TODO find a fix
    router.events.on(
      'routeChangeStart',
      (_, { shallow }) => !shallow && setShowBackdrop(true)
    );
    router.events.on(
      'routeChangeComplete',
      (_, { shallow }) => !shallow && setShowBackdrop(false)
    );*/
  }, [router.events]);

  return (
    <BackdropContext.Provider
      value={{
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
