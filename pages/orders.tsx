import { LinearProgress } from '@mui/material';
import { NextPage } from 'next';

import AuthenticationWrapper from '../components/AuthenticationWrapper';
import LayoutWrapper from '../components/LayoutWrapper';

const Orders: NextPage = () => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <LinearProgress />
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export default Orders;
