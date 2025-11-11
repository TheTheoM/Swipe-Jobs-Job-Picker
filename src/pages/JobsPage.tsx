import React, { useState, useEffect } from 'react';
import { Container, Box, Snackbar, Alert, Fade, Skeleton } from '@mui/material';
import Header from '../components/Job/Header';
import JobCard from '../components/Job/Job';
import NoJobsFoundCard from '../components/Job/NoJobsFound';
import ErrorFallback from '../components/ErrorFallback/ErrorFallback';
import { getMatchedJobs, getWorkerProfile, acceptJob, rejectJob } from '../api/swipeJobsAPI';
import useWorkerJobDistance from '../hooks/useWorkerJobDistance';
import type { Job, WorkerProfile } from '../types';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>('');

  const userAddress = profile?.address?.formattedAddress;
  const companyAddress = jobs?.[currentIndex]?.company.address.formattedAddress;
  const { distance: distanceFromSearch } = useWorkerJobDistance(userAddress, companyAddress);

  // Get profile and jobs.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, jobsData] = await Promise.all([getWorkerProfile(), getMatchedJobs()]);
        setProfile(profileData);
        setJobs(jobsData);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      }
    };
    fetchData();
  }, []);

  // Accept the job, showing error snackbar if failed.
  const handleAccept = async () => {
    if (!jobs || currentIndex >= jobs.length || snackbarOpen) return;
    const jobId = jobs[currentIndex].jobId;

    try {
      const response = await acceptJob(jobId);
      if (response.success) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSnackbarMessage(response.message);
        setSnackbarOpen(true);
      }
    } catch {
      setSnackbarMessage('Sorry, something went wrong accepting the job.');
      setSnackbarOpen(true);
    }
  };

  // Reject the job, showing error snackbar if failed.
  const handleReject = async () => {
    if (!jobs || currentIndex >= jobs.length || snackbarOpen) return;
    const jobId = jobs[currentIndex].jobId;

    try {
      const response = await rejectJob(jobId);
      if (response.success) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSnackbarMessage(response.message);
        setSnackbarOpen(true);
      }
    } catch {
      setSnackbarMessage('Sorry, something went wrong rejecting the job.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setCurrentIndex((prev) => prev + 1);
    setSnackbarOpen(false);
  };

  if (error) return <ErrorFallback />;

  if (!jobs || !profile) {
    // If the job or profile has not loaded yet, display loading skeleton.
    return (
      <Container maxWidth='sm'>
        <Header name={''} />
        <Box sx={{ width: '100%', p: 2, bgcolor: 'white' }}>
          <Skeleton variant='rectangular' width='100%' sx={{ height: { xs: 600, sm: 800 } }} />
        </Box>
      </Container>
    );
  }

  if (currentIndex >= jobs.length) {
    return <NoJobsFoundCard userName={`${profile.firstName} ${profile.lastName}`} />;
  }

  const currentJob = {
    ...jobs[currentIndex],
    distanceFromSearch,
  };

  return (
    <Container maxWidth='sm' sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }} id='modal-root'>
      <Box sx={{ width: '100%' }}>
        <Header name={`${profile.firstName} ${profile.lastName}`} />
        <Fade in={true} timeout={300} key={currentJob.jobId}>
          <div>
            <JobCard jobData={currentJob} onAccept={handleAccept} onReject={handleReject} />
          </div>
        </Fade>
        <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} data-testid='SnackbarErrorComponent'>
          <Alert onClose={handleSnackbarClose} severity='error' sx={{ width: '100%', minWidth: 300, maxWidth: 600, fontSize: '1rem', py: 2 }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default JobsPage;
