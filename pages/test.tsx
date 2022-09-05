import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import { Button } from '@mui/material';
import { NextPage } from 'next';

const Test: NextPage = () => {
  return (
    <AuthenticationWrapper>
      <Button onClick={() => fetch('/api/gapi')}>gapi</Button>
    </AuthenticationWrapper>
  );
};

export default Test;
