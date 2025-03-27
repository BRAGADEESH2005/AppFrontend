import { Link as ReactLink } from 'react-router-dom';
import darklogo from '../../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { Button, Link, Divider } from '@mui/material';
import { useAuthSlice } from '../../../store/authslice/auth';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import Profile from '../../UI/Profile';

export default function HomeNavbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);

  return (
    <nav className={`tw-sticky tw-top-0 tw-z-50 tw-py-3 tw-px-6 tw-shadow-md ${colorMode === 'dark' ? 'tw-bg-gray-900' : 'tw-bg-white'}`}>
      <div className='tw-container tw-mx-auto tw-flex tw-justify-between tw-items-center'>
        {/* Logo Section */}
        <div className='tw-flex tw-items-center tw-gap-2'>
          <ReactLink to="/">
            <img
              alt='logo'
              src={colorMode === 'light' ? darklogo : lightlogo}
              width={100}
              height={80}
              className='tw-object-contain'
            />
          </ReactLink>
        </div>
        
        {/* Navigation Items */}
        <div className='tw-flex tw-items-center tw-gap-6'>
          {!isLogedIn ? (
            <div className='tw-flex tw-items-center tw-gap-4'>
              <Link
                component={ReactLink}
                to='/signin'
                className={`tw-py-2 tw-px-4 tw-text-sm tw-font-medium tw-transition-all tw-duration-200 ${
                  colorMode === 'dark' 
                    ? 'tw-text-gray-300 hover:tw-text-white' 
                    : 'tw-text-gray-700 hover:tw-text-gray-900'
                }`}
                underline='none'
              >
                Sign in
              </Link>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: '20px', alignSelf: 'center' }} />
              
              <Link
                component={ReactLink}
                to='/signup'
                className={`tw-py-2 tw-px-5 tw-rounded-md tw-font-medium tw-transition-all tw-duration-200 ${
                  colorMode === 'dark'
                    ? 'tw-bg-blue-600 tw-text-white hover:tw-bg-blue-700'
                    : 'tw-bg-blue-500 tw-text-white hover:tw-bg-blue-600'
                }`}
                underline='none'
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className='tw-flex tw-items-center tw-gap-6'>
              <Link
                component={ReactLink}
                to='/leaderboard'
                className={`tw-py-2 tw-px-4 tw-font-medium tw-transition-colors tw-duration-200 ${
                  colorMode === 'dark'
                    ? 'tw-text-gray-300 hover:tw-text-white'
                    : 'tw-text-gray-700 hover:tw-text-gray-900'
                }`}
                underline='none'
              >
                Leaderboard
              </Link>
              <Profile />
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <Button
            variant='text'
            onClick={toggleColorMode}
            size='medium'
            className='tw-ml-2'
            sx={{
              minWidth: '40px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0
            }}
          >
            {colorMode === 'dark' 
              ? <LightModeOutlinedIcon sx={{ color: 'white' }} /> 
              : <DarkModeIcon />
            }
          </Button>
        </div>
      </div>
    </nav>
  );
}