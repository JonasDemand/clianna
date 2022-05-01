import { Button } from '@mui/material';
import { NextPage } from 'next';
import AuthenticationWrapper from '../components/AuthenticationWrapper';

const Home: NextPage = () => {
  return (
    <AuthenticationWrapper>
      <Button variant="outlined">Hello World</Button>
    </AuthenticationWrapper>
  );
};

export default Home;
