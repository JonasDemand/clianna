import { Logout, ManageAccounts } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { FC, useMemo, useState } from 'react';

const Userprofile: FC = () => {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const actions = useMemo(
    () => [
      {
        label: 'Profil',
        icon: <ManageAccounts />,
        onClick: () => {
          router.push('/profile');
        },
      },
      {
        label: 'Logout',
        icon: <Logout />,
        onClick: () => {
          signOut();
        },
      },
    ],
    [router]
  );

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Account">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar />
        </IconButton>
      </Tooltip>
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
        onClose={handleCloseUserMenu}
      >
        {actions.map((action, i) => (
          <MenuItem
            disabled={
              action.label === 'Profil' /*TODO: Implement profile page*/
            }
            key={i}
            onClick={() => {
              handleCloseUserMenu();
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
