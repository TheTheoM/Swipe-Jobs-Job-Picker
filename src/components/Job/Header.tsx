import React from 'react';
import { Box, Typography } from '@mui/material';
import SwipeJobsLogoUrl from '../../assets/swipe_jobs_logo.svg';

interface HeaderProps {
  name?: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        color: 'white',
        width: '100%',
        p: 1,
      }}
    >
      <img src={SwipeJobsLogoUrl} alt='SwipeJobs Logo' style={{ height: 40, marginRight: 8 }} />
      {name && <Typography variant='h6'>{name}</Typography>}
    </Box>
  );
};

export default Header;
