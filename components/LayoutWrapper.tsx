import { Box, Tabs, Tab } from '@mui/material';
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
  const currentRoute = routes.filter((x) => x.route === router.route)[0];
  return (
    <>
      <nav>
        <Box sx={{ borderBottom: 1, borderColor: 'grey', mb: 2 }}>
          <Tabs value={routes.indexOf(currentRoute)}>
            {routes.map((route, i) => (
              <Tab key={i} label={route.label} href={route.route} />
            ))}
          </Tabs>
        </Box>
      </nav>
      <main>{children}</main>
    </>
  );
};

export default LayoutWrapper;
