import { Avatar, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography, Button } from '@mui/material';
import { useUserSlice } from '../../store/user';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthSlice } from '../../store/authslice/auth';
import { useMutation } from '@tanstack/react-query';
import signOutAPI from '../../services/signOut';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function Profile() {
  const user = useUserSlice((state) => state.user);
  const setUser = useUserSlice((state) => state.setUser);
  const signOut = useAuthSlice((state) => state.signOut);
  const navigate = useNavigate();
  const { mutateAsync, isError, error } = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: signOutAPI,
  });

  // Keep the menu functionality for the logout option
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // New function to navigate to profile page
  const goToProfile = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await mutateAsync();
      setUser(null);
      signOut();
      navigate('/signin');
    } catch (err) {
      console.error('Logout error:', err);
    }
    handleCloseMenu();
  };

  return (
    <div className='tw-flex tw-items-center'>
      {/* Main avatar that navigates to profile */}
      <Tooltip title='View profile'>
        <IconButton onClick={goToProfile} size='small' sx={{ mr: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
            }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* Settings menu button
      <Tooltip title='Account options'>
        <IconButton
          onClick={handleOpenMenu}
          size='small'
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <AccountCircleIcon fontSize='small' />
        </IconButton>
      </Tooltip> */}

      {/* Menu for logout */}
      {/* <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <EmailIcon fontSize='small' />
          <Typography marginLeft={1} variant='body2'>
            {user?.email}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu> */}
    </div>
  );
}
