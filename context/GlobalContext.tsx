import { GlobalContextType } from '@customTypes/global';
import { Backdrop, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

export const GlobalContext = createContext<GlobalContextType | null>(null);

type GlobalContextProps = {
  children: ReactNode;
};

const GlobalProvider: FC<GlobalContextProps> = ({ children }) => {
  const router = useRouter();
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    router.events.on(
      'routeChangeStart',
      (_, { shallow }) => !shallow && setShowBackdrop(true)
    );
    router.events.on(
      'routeChangeComplete',
      (_, { shallow }) => !shallow && setShowBackdrop(false)
    );
  }, [router.events]);

  const onDragOver = useCallback(() => setIsDragging(true), []);
  const onDragAbort = useCallback(() => setIsDragging(false), []);

  useEffect(() => console.log(isDragging), [isDragging]);

  return (
    <GlobalContext.Provider
      value={{
        showBackdrop: setShowBackdrop,
        isDragging,
      }}
    >
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <CircularProgress size={100} />
      </Backdrop>
      <Box
        onDragLeave={onDragAbort}
        onDrop={onDragAbort}
        onDragOver={onDragOver}
      >
        {children}
      </Box>
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
