import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import { LinearProgress } from '@mui/material';
import { NextPage } from 'next';

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
