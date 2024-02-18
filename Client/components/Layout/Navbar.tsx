'use client';

import {
  Assignment,
  Description,
  Email,
  Extension,
  Menu as MenuIcon,
  People,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { FC, MouseEvent, useCallback, useState } from 'react';

const pages = [
  { label: 'Kunden', route: '/manage/customers', icon: <People /> },
  { label: 'Aufträge', route: '/manage/orders', icon: <Assignment /> },
  { label: 'Dokumente', route: '/manage/documents', icon: <Description /> },
  { label: 'Nachrichten', route: '/manage/messages', icon: <Email /> },
];

const Navbar: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const onClickOpenNavMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget),
    []
  );
  const onClickRoot = useCallback(() => router.replace('/'), [router]);

  const onCloseNavMenu = useCallback(() => setAnchorElNav(null), []);

  return (
    <>
      {/*mobile*/}
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton size="large" onClick={onClickOpenNavMenu} color="inherit">
          <MenuIcon />
        </IconButton>
        <Menu
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
          onClose={onCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {pages.map((page) => (
            <MenuItem
              key={page.route}
              onClick={() => {
                onCloseNavMenu();
                page.route !== pathname && router.replace(page.route);
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
        onClick={onClickRoot}
        sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, cursor: 'pointer' }}
      />
      <Typography
        variant="h5"
        noWrap
        onClick={onClickRoot}
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
        onClick={onClickRoot}
        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, cursor: 'pointer' }}
      />
      <Typography
        variant="h6"
        noWrap
        onClick={onClickRoot}
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
      <Tabs
        value={pathname}
        sx={{
          flexGrow: 1,
          display: { xs: 'none', md: 'flex' },
          '.MuiTabs-indicator': { backgroundColor: 'whitesmoke' },
        }}
        onChange={(_, value) => router.replace(value)}
      >
        {pages.map((page) => (
          <Tab
            value={page.route}
            key={page.route}
            label={
              <Box sx={{ display: 'flex', color: 'whitesmoke' }}>
                {page.icon}
                <Typography sx={{ ml: 1 }}>{page.label}</Typography>
              </Box>
            }
          />
        ))}
      </Tabs>
    </>
  );
};

export default Navbar;
