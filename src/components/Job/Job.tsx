import React from 'react';
import { useTheme, Box, CardMedia, Typography, Button } from '@mui/material';

import { ShiftDates } from './JobDetails/ShiftDates';
import { Location } from './JobDetails/Location';
import { Requirements } from './JobDetails/Requirements';
import { ReportTo } from './JobDetails/ReportsTo';
import type { JobWithDistance } from '../../types';
import formatPhoneNumber from '../../utils/formatPhoneNumber';

interface JobProps {
  jobData: JobWithDistance;
  onAccept?: () => void;
  onReject?: () => void;
}

const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/800x200/4F4F4F/FFFFFF?text=Construction+Site+Banner';

const JobCard: React.FC<JobProps> = ({ jobData, onAccept, onReject }) => {
  const theme = useTheme();
  const reportToPhone = formatPhoneNumber(jobData.company.reportTo?.phone, jobData.company.address?.zoneId);
  const reportToText = `${jobData.company.reportTo.name} ${reportToPhone}`;
  const bannerImageUrl = jobData.jobTitle.imageUrl || PLACEHOLDER_IMAGE_URL;

  const milesToTravel = `${jobData.milesToTravel?.toFixed(1)} miles`;
  const hourlyRate = `${(jobData.wagePerHourInCents / 100).toFixed(2)}`;

  return (
    <Box sx={{ width: '100%', position: 'relative', bgcolor: '#EEEEEE', p: { xs: 0, sm: 2 }, boxShadow: 5 }} data-testid='Job-Component'>
      <Box sx={{ width: '100%', bgcolor: 'white' }}>
        <CardMedia component='img' height='192' image={bannerImageUrl} alt='Job site banner' data-testid='Job_Image' loading='lazy' />

        <Box sx={{ p: 1.5, mb: 0 }}>
          <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold' }}>
            {jobData.jobTitle.name}
          </Typography>
          <Typography variant='subtitle1' color='text.primary' sx={{ fontWeight: 'bold' }}>
            {jobData.company.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: theme.palette.primary.main, mb: 1 }}>
          <Box>
            <Typography variant='body1' component='h6' color='text.primary' sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              Distance
            </Typography>
            <Typography variant='h3' component='div' color='white' sx={{ fontWeight: 'bold', mt: 0.5, lineHeight: 1}}>
              {milesToTravel}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant='body1' component='h6' color='text.primary' sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              Hourly Rate
            </Typography>
            <Typography variant='h3' component='div' color='white' sx={{ fontWeight: 'bold', mt: 0.5, lineHeight: 1 }}>
              <Box component='span' sx={{ fontSize: '0.6em', verticalAlign: 'top' }}>
                $
              </Box>
              {hourlyRate}
            </Typography>
          </Box>
        </Box>

        <ShiftDates shifts={jobData.shifts} timeZone={jobData.company.address.zoneId} />
        <Location address={jobData.company.address.formattedAddress} distanceFromSearch={jobData.distanceFromSearch} />
        <Requirements requirements={jobData.requirements} />
        <ReportTo reportToText={reportToText} />

        <Box sx={{ p: 2, display: 'flex', gap: 2, pt: 3 }}>
          <Button
            variant='outlined'
            fullWidth
            size='large'
            onClick={onReject}
            aria-label='Reject Job'
            sx={{
              borderColor: '#ccc',
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { borderColor: 'black', bgcolor: '#f9f9f9' },
            }}
          >
            No Thanks
          </Button>
          <Button
            variant='contained'
            fullWidth
            size='large'
            onClick={onAccept}
            aria-label='Accept Job'
            sx={{
              bgcolor: 'black',
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: 1,
              '&:hover': { bgcolor: '#333' },
            }}
          >
            I'll Take it
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default JobCard;
