import { Box, useTheme } from '@mui/material';

export default function Footer() {
  const theme = useTheme();
  const bgColor = theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)';

  return (
    <footer
      className='tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-py-2 tw-z-10 tw-border-t'
      style={{
        backgroundColor: bgColor,
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      }}
    >
      <div className='tw-container-lg tw-flex tw-justify-evenly tw-mx-auto'>
        <Box sx={{ paddingBlock: '5px', color: textColor }}>Copyright &copy; 2025 Leetcode</Box>
        <Box sx={{ paddingBlock: '5px', color: textColor }}>Made with Love ❤</Box>
      </div>
    </footer>
  );
}
