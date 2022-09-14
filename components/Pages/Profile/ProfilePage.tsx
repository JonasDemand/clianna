import { BackdropContext } from '@context/BackdropContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { Grid } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { refreshSession } from '@utils/nextauth';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect } from 'react';

import DocumentConfiguration from './DocumentConfiguration';
import LoginConfiguration from './LoginConfiguration';

const ProfilePage: FC = () => {
  const router = useRouter();
  const { setShowBackdrop } = useContext(
    BackdropContext
  ) as BackdropContextType;

  useEffect(() => {
    if (Boolean(router.query.createRootfolder)) {
      setShowBackdrop(true);
      router.replace('/profile', undefined, { shallow: true });
      ApiClient.Document.CreateRootFolder().then(refreshSession);
      setShowBackdrop(false);
    }
  }, [router, router.query.createRootfolder, setShowBackdrop]);

  return (
    <Grid container justifyContent="center">
      <Grid item sx={{ maxWidth: '800px' }}>
        <LoginConfiguration />
        <DocumentConfiguration />
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
