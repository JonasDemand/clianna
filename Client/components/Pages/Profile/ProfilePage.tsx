import { Grid } from '@mui/material';
import React, { FC } from 'react';

import LoginConfiguration from './LoginConfiguration';

const ProfilePage: FC = () => {
  return (
    <Grid container justifyContent="center">
      <Grid item sx={{ maxWidth: '800px' }}>
        <LoginConfiguration />
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
