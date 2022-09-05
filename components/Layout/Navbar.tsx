import {
  Assignment,
  Extension,
  Menu as MenuIcon,
  People,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useMemo, useState } from 'react';

const pages = [
  { label: 'Kunden', route: '/customers', icon: <People /> },
  { label: 'Aufträge', route: '/orders', icon: <Assignment /> },
];

const Navbar: FC = () => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);

  const redirectRoot = () => router.push('/');

  const currentPage = useMemo(
    () => pages.find((x) => x.route === router.route),
    [router.route]
  );

  return (
    <>
      {/*mobile*/}
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={!!anchorElNav}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {pages.map((page) => (
            <MenuItem
              key={page.route}
              onClick={() => {
                handleCloseNavMenu();
                page !== currentPage && router.push(page.route);
              }}
            >
              {page.icon}
              <Typography textAlign="center" sx={{ ml: 1 }}>
                {page.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Extension
        onClick={redirectRoot}
        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, cursor: 'pointer' }}
      />
      <Typography
        variant="h5"
        noWrap
        onClick={redirectRoot}
        sx={{
          mr: 2,
          display: { xs: 'flex', md: 'none' },
          flexGrow: 1,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        CLIANNA
      </Typography>

      {/*desktop*/}
      <Extension
        onClick={redirectRoot}
        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, cursor: 'pointer' }}
      />
      <Typography
        variant="h6"
        noWrap
        onClick={redirectRoot}
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        CLIANNA
      </Typography>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {pages.map((page) => (
          <Box
            key={page.route}
            sx={{
              my: 2,
            }}
          >
            <Button
              onClick={() => page !== currentPage && router.push(page.route)}
              sx={{
                color: 'white',
                display: 'flex',
              }}
            >
              {page.icon}
              <Typography sx={{ ml: 1 }}>{page.label}</Typography>
            </Button>
            {page === currentPage && <Divider sx={{ border: 1 }} />}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Navbar;
