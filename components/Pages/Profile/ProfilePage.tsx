import { GlobalContext } from '@context/GlobalContext';
import { GlobalContextType } from '@customTypes/global';
import { Grid } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { refreshSession } from '@utils/nextauth';
import { useRouter } from 'next/router';
import React, { FC, useContext, useEffect } from 'react';

import DocumentConfiguration from './DocumentConfiguration';
import LoginConfiguration from './LoginConfiguration';

const ProfilePage: FC = () => {
  const router = useRouter();
  const { showBackdrop } = useContext(GlobalContext) as GlobalContextType;

  useEffect(() => {
    const createFolder = async () => {
      if (!Boolean(router.query.createRootfolder)) return;
      showBackdrop(true);
      router.replace('/profile', undefined, { shallow: true });
      await ApiClient.Document.CreateRootFolder();
      await refreshSession();
      showBackdrop(false);
    };

    createFolder();
  }, [router, router.query.createRootfolder, showBackdrop]);

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
