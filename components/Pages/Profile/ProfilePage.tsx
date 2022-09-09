import { Grid } from '@mui/material';
import { FC } from 'react';

import DocumentConfiguration from './DocumentConfiguration';
import LoginConfiguration from './LoginConfiguration';

const ProfilePage: FC = () => (
  <Grid container justifyContent="center">
    <Grid item sx={{ maxWidth: '800px' }}>
      <LoginConfiguration />
      <DocumentConfiguration />
    </Grid>
  </Grid>
);

export default ProfilePage;
