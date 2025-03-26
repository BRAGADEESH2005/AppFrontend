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
  Card,
} from '@mui/material';
import { useMemo, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMutation } from '@tanstack/react-query';
import signUp from '../../../services/signUp';
import LanguageDropDown from '../Problem/LanguageDropDown';
import { toast } from 'sonner';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { useAuthSlice } from '../../../store/authslice/auth';
import { useNavigate } from 'react-router';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowconfirmPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickConfirmPassword = () => setShowconfirmPassword((show) => !show);
  const [favoriteProgrammingLanguage, setFavoriteProgrammingLanguage] = useState(93);
  const navigate = useNavigate();
  const { colorMode } = usethemeUtils();
  const signin = useAuthSlice((state) => state.signIn);

  const { mutateAsync } = useMutation({
    mutationFn: signUp,
    mutationKey: ['user-create'],
  });

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  async function handleSubmit() {
    if (password !== confirmPassword) {
      toast.warning('Password Did Not Match', { position: 'bottom-left', duration: 2000, dismissible: true });
      return;
    }
    try {
      const response = await mutateAsync({ username, email, password, favoriteProgrammingLanguage, roles: ['user'] });
      if (response?.status === 'Success') {
        toast.success('User Created Successfully', { position: 'bottom-left', duration: 2000, dismissible: true });
        signin();
        navigate('/', { state: response.data.id });
      } else {
        toast.error('User Creation Failed', { position: 'bottom-left', duration: 2000, dismissible: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: 'bottom-left' });
      }
    }
  }

  function handleChange(id: any) {
    setFavoriteProgrammingLanguage(id);
  }

  const colorStyles = useMemo(() => ({ color: colorMode === 'dark' ? 'common.white' : 'common.black' }), [colorMode]);

  return (
    <Card sx={{ p: 4, maxWidth: 400, mx: 'auto', boxShadow: 3, borderRadius: 2 }}>
      <Typography variant='h5' align='center' gutterBottom>
        Sign Up
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label='Username'
          variant='outlined'
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
        />
        <TextField
          label='E-mail'
          type='email'
          variant='outlined'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <FormControl variant='outlined' fullWidth>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
          />
        </FormControl>
        <FormControl variant='outlined' fullWidth>
          <InputLabel>Confirm Password</InputLabel>
          <OutlinedInput
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={handleClickConfirmPassword} onMouseDown={handleMouseDownPassword}>
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
            label='Confirm Password'
          />
        </FormControl>
        <LanguageDropDown
          label='Favorite Language'
          handleChange={handleChange}
          language={favoriteProgrammingLanguage}
          languagestoskip={[]}
        />
        <Button color='warning' variant='contained' onClick={handleSubmit} fullWidth>
          Sign Up
        </Button>
      </Box>
    </Card>
  );
}
