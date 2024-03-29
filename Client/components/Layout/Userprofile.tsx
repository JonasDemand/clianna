'use client';

import MuiTooltip from '@components/External/MuiTooltip';
import { Logout, ManageAccounts } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import useSession from 'hooks/useSession';
import { useRouter } from 'next/navigation';
import React, { FC, useCallback, useMemo, useState } from 'react';

const Userprofile: FC = () => {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { logout } = useSession();

  const actions = useMemo(
    () => [
      {
        label: 'Profil',
        icon: <ManageAccounts />,
        onClick: () => {
          router.replace('/manage/profile');
        },
      },
      {
        label: 'Logout',
        icon: <Logout />,
        onClick: logout,
      },
    ],
    [router, logout]
  );

  const onClickUserMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) =>
      setAnchorElUser(event.currentTarget),
    []
  );

  const onCloseUserMenu = useCallback(() => setAnchorElUser(null), []);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <MuiTooltip title="Account">
        <IconButton onClick={onClickUserMenu} sx={{ p: 0 }}>
          <Avatar />
        </IconButton>
      </MuiTooltip>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!anchorElUser}
        onClose={onCloseUserMenu}
      >
        {actions.map((action, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              onCloseUserMenu();
              action.onClick();
            }}
          >
            {action.icon}
            <Typography textAlign="center" sx={{ ml: 1 }}>
              {action.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Userprofile;
