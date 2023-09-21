import { useBackdropContext } from '@context/BackdropContext';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';

import LoginConfiguration from './LoginConfiguration';

const ProfilePage: FC = () => {
  const router = useRouter();
  const { setShowBackdrop } = useBackdropContext();

  useEffect(() => {
    const createFolder = async () => {
      if (!Boolean(router.query.createRootfolder)) return;
      setShowBackdrop(true);
      router.replace('/profile', undefined, { shallow: true });
      setShowBackdrop(false);
    };

    createFolder();
  }, [router, router.query.createRootfolder, setShowBackdrop]);

  return (
    <Grid container justifyContent="center">
      <Grid item sx={{ maxWidth: '800px' }}>
        <LoginConfiguration />
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
