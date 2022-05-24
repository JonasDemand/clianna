import { Box, Tab,Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import { FunctionComponent, ReactNode } from 'react';

type LayoutWrapperProps = {
  children: ReactNode;
};

type Route = {
  label: string;
  route: string;
};

const routes: Route[] = [
  { label: 'Kunden', route: '/customers' },
  { label: 'Bestellungen', route: '/orders' },
];

const LayoutWrapper: FunctionComponent<LayoutWrapperProps> = ({ children }) => {
  const router = useRouter();
  const currentRoute = routes.find((x) => x.route === router.route) as Route;
  return (
    <Box sx={{ padding: 0.5 }}>
      <nav>
        <Box sx={{ borderBottom: 1, borderColor: 'grey' }}>
          <Tabs value={routes.indexOf(currentRoute)}>
            {routes.map((route, i) => (
              <Tab key={i} label={route.label} href={route.route} />
            ))}
          </Tabs>
        </Box>
      </nav>
      <main>
        <Box sx={{ p: 2, height: 'calc(100vh - 57px)' }}>{children}</Box>
      </main>
    </Box>
  );
};

export default LayoutWrapper;
