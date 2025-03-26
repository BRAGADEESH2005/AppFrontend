import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import signIn from '../../../services/signIn';
import { useNavigate } from 'react-router';
import { useAuthSlice } from '../../../store/authslice/auth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from 'sonner';
import { usethemeUtils } from '../../../context/ThemeWrapper';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const signin = useAuthSlice((state) => state.signIn);
  const navigate = useNavigate();
  const { colorMode } = usethemeUtils();

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const { mutateAsync } = useMutation({
    mutationFn: signIn,
    mutationKey: ['signIn'],
  });
  const onClickHandler = async () => {
    try {
      const data = await mutateAsync({ email, password });
      if (data?.status === 'Success') {
        signin();
        navigate('/', { state: data.data.id });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: 'bottom-left',
        });
      }
    }
  };
  const signInAsGuest = async () => {
    try {
      const data = await mutateAsync({
        email: import.meta.env.VITE_GUEST_USER_EMAIL,
        password: import.meta.env.VITE_GUEST_USER_PASSWORD,
      });
      if (data?.status === 'Success') {
        signin();
        navigate('/', { state: data.data.id });
      } else {
        throw new Error('Guest Sign In Failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: 'bottom-left',
        });
      }
    }
  };
  const colorStyles = useMemo(() => ({ color: colorMode === 'dark' ? 'common.white' : 'common.black' }), [colorMode]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto', p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
      <Typography variant='h5' align='center' fontWeight='bold' sx={{ mb: 2 }}>
        Sign In
      </Typography>
      <FormControl variant='outlined' fullWidth>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id='email'
          type='email'
          label='E-mail'
          variant='outlined'
          size='medium'
          InputLabelProps={{ style: { color: colorStyles.color } }}
        />
      </FormControl>
      <FormControl variant='outlined' fullWidth>
        <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
        <OutlinedInput
          id='outlined-adornment-password'
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          size='medium'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
          label='Password'
        />
      </FormControl>
      <Stack spacing={1} alignItems='center' sx={{ mt: 2 }}>
        <Button color='warning' variant='contained' fullWidth onClick={onClickHandler}>
          Sign In
        </Button>
        <Typography variant='body2' color='textSecondary'>Or</Typography>
        <Button color='warning' variant='contained' fullWidth onClick={signInAsGuest}>
          Sign In as Guest
        </Button>
      </Stack>
    </Box>
  );
}