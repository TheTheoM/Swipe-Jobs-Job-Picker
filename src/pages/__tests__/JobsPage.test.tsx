import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobsPage from '../../pages/JobsPage';
import * as api from '../../api/swipeJobsAPI';
import { act } from 'react';
import { type Job, type WorkerProfile, type JobActionResponse } from '../../types';

// --- Global Mock Data ---

const MOCK_JOBS: Job[] = [
  {
    jobId: '5775d8e18a488e6c5bb08333',
    jobTitle: {
      name: 'Construction General Helper',
      imageUrl: 'https://imgs.swipejobs.com/js/job-category/construction-1.jpg',
    },
    company: {
      name: 'Steve Smith Construction',
      address: {
        formattedAddress: '430 Smith St, Chicago, IL 60654, USA',
        zoneId: 'America/Chicago',
      },
      reportTo: {
        name: 'Judy Smith',
        phone: '2130010012',
      },
    },
    wagePerHourInCents: 950,
    milesToTravel: 3.4,
    shifts: [
      {
        startDate: '2019-09-04T21:00:00Z',
        endDate: '2019-09-05T05:00:00Z',
      },
    ],
    branch: 'Downtown',
    branchPhoneNumber: '2531233322',
  },
  {
    jobId: '5775d8e18a488e6c5bb08c13',
    jobTitle: {
      name: 'Driver',
      imageUrl: 'https://imgs.swipejobs.com/js/job-category/driver-service-3.jpg',
    },
    company: {
      name: 'C.D. Barnes and Associates',
      address: {
        formattedAddress: '123 Main Street, Chicago, IL 60654',
        zoneId: 'America/Chicago',
      },
      reportTo: {
        name: 'Steve Rogers',
      },
    },
    wagePerHourInCents: 1081.7,
    milesToTravel: 11.666,
    shifts: [
      {
        startDate: '2019-09-04T21:00:00Z',
        endDate: '2019-09-05T05:00:00Z',
      },
      {
        startDate: '2019-09-15T21:00:00Z',
        endDate: '2019-09-16T05:00:00Z',
      },
    ],
    branch: 'Chicago',
    branchPhoneNumber: '2531233311',
    requirements: ['Safety Vest', 'Hart Hat'],
  },
];

const MOCK_WORKER_PROFILE: WorkerProfile = {
  firstName: 'Jim',
  lastName: 'Rose',
  id: '1',
  email: 'jim@example.com',
};

const MOCK_FAILED_JOB_MATCH: JobActionResponse = {
  success: false,
  message: 'Failed to reject the job',
  errorCode: 'FAIL-101',
};

const MOCK_SUCCESS_JOB_MATCH: JobActionResponse = {
  success: true,
};

const ACCEPT_BUTTON_TEXT = "I'll Take it";
const REJECT_BUTTON_TEXT = 'No Thanks';

jest.mock('../../../src/config', () => ({
  API_BASE_URL: 'base-url',
  WORKER_ID: 'abcd-efg-hij',
}));

jest.mock('../../components/Job/Header', () => () => <div>Header</div>);
jest.mock('../../components/ErrorFallback/ErrorFallback', () => () => <div>ErrorFallback</div>);

describe('JobsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(api, 'getWorkerProfile').mockResolvedValue(MOCK_WORKER_PROFILE);
  });

  it('shows NoJobsFound when jobs is empty', async () => {
    jest.spyOn(api, 'getMatchedJobs').mockResolvedValue([] as Job[]);

    await act(async () => render(<JobsPage />));

    expect(screen.getByText('Sorry, no jobs found right now!', { exact: true })).toBeInTheDocument();
  });

  it('shows JobCard when jobs exist', async () => {
    jest.spyOn(api, 'getMatchedJobs').mockResolvedValue(MOCK_JOBS);

    await act(async () => render(<JobsPage />));

    expect(screen.getByTestId('Job-Component')).toBeInTheDocument();

    // It should show the first job by default
    expect(screen.getByText('Construction General Helper')).toBeInTheDocument();
  });

  it('advances to next job on accept/reject success', async () => {
    jest.spyOn(api, 'getMatchedJobs').mockResolvedValue(MOCK_JOBS);

    const acceptSpy = jest.spyOn(api, 'acceptJob').mockResolvedValue(MOCK_SUCCESS_JOB_MATCH);
    const rejectSpy = jest.spyOn(api, 'rejectJob').mockResolvedValue(MOCK_SUCCESS_JOB_MATCH);

    await act(async () => render(<JobsPage />));

    expect(screen.getByText('Construction General Helper')).toBeInTheDocument();

    fireEvent.click(screen.getByText(ACCEPT_BUTTON_TEXT, { exact: true }));
    await waitFor(() => expect(acceptSpy).toHaveBeenCalledWith(MOCK_JOBS[0].jobId));

    await waitFor(() => {
      expect(screen.getByText('Driver')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(REJECT_BUTTON_TEXT, { exact: true }));
    await waitFor(() => expect(rejectSpy).toHaveBeenCalledWith(MOCK_JOBS[1].jobId));

    await waitFor(() => {
      expect(screen.getByText('Sorry, no jobs found right now!', { exact: true })).toBeInTheDocument();
    });
  });

  it('shows error snackbar on accept failure', async () => {
    jest.spyOn(api, 'getMatchedJobs').mockResolvedValue(MOCK_JOBS);
    jest.spyOn(api, 'acceptJob').mockResolvedValue(MOCK_FAILED_JOB_MATCH);

    await act(async () => render(<JobsPage />));

    fireEvent.click(screen.getByText(ACCEPT_BUTTON_TEXT, { exact: true }));

    await waitFor(() => {
      expect(screen.getByTestId('SnackbarErrorComponent')).toBeInTheDocument();
    });
  });

  it('shows error snackbar on reject failure', async () => {
    jest.spyOn(api, 'getMatchedJobs').mockResolvedValue(MOCK_JOBS);
    jest.spyOn(api, 'rejectJob').mockResolvedValue(MOCK_FAILED_JOB_MATCH);

    await act(async () => render(<JobsPage />));

    fireEvent.click(screen.getByText(REJECT_BUTTON_TEXT, { exact: true }));

    await waitFor(() => {
      expect(screen.getByTestId('SnackbarErrorComponent')).toBeInTheDocument();
    });
  });

  it('show next job on accept failure, by snackbar closing', async () => {
    jest.useFakeTimers();

    jest.spyOn(api, 'getMatchedJobs').mockResolvedValue(MOCK_JOBS);
    jest.spyOn(api, 'acceptJob').mockResolvedValue(MOCK_FAILED_JOB_MATCH);

    await act(async () => render(<JobsPage />));
    expect(screen.getByText('Construction General Helper')).toBeInTheDocument();

    fireEvent.click(screen.getByText(ACCEPT_BUTTON_TEXT, { exact: true }));

    await waitFor(() => {
      expect(screen.getByTestId('SnackbarErrorComponent')).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('SnackbarErrorComponent')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(ACCEPT_BUTTON_TEXT, { exact: true }));

    await waitFor(() => {
      expect(screen.getByText('Driver')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('show next job on reject failure, by snackbar closing', async () => {
    jest.useFakeTimers();

    jest.spyOn(api, 'getMatchedJobs').mockResolvedValue(MOCK_JOBS);
    jest.spyOn(api, 'acceptJob').mockResolvedValue(MOCK_FAILED_JOB_MATCH);

    await act(async () => render(<JobsPage />));
    expect(screen.getByText('Construction General Helper')).toBeInTheDocument();

    fireEvent.click(screen.getByText(REJECT_BUTTON_TEXT, { exact: true }));

    await waitFor(() => {
      expect(screen.getByTestId('SnackbarErrorComponent')).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('SnackbarErrorComponent')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(REJECT_BUTTON_TEXT, { exact: true }));

    await waitFor(() => {
      expect(screen.getByText('Driver')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('renders all job details correctly', async () => {
    const mockJob = MOCK_JOBS[1];
    jest.spyOn(api, 'getMatchedJobs').mockResolvedValue([mockJob]);

    await act(async () => render(<JobsPage />));

    // Check image
    const jobImage = screen.getByTestId('Job_Image');
    expect(jobImage).toHaveAttribute('src', mockJob.jobTitle.imageUrl);
    expect(jobImage).toHaveAttribute('alt', 'Job site banner');

    // Check Company name, job title and address
    expect(screen.getByText(mockJob.jobTitle.name, { exact: true })).toBeInTheDocument();
    expect(screen.getByText(mockJob.company.name, { exact: true })).toBeInTheDocument();
    expect(screen.getByText(mockJob.company.address.formattedAddress, { exact: true })).toBeInTheDocument();

    // Check for the hourly
    const formattedWage = `${(mockJob.wagePerHourInCents / 100).toFixed(2)}`;
    expect(screen.getByText(formattedWage, { exact: true })).toBeInTheDocument();

    // Check for the distance in miles.
    const formattedDistance = `${mockJob.milesToTravel?.toFixed(1)} miles`;
    expect(screen.getByText(formattedDistance, { exact: true })).toBeInTheDocument();

    // Check all requirements are present.
    mockJob.requirements?.forEach((req) => {
      expect(screen.getByText(req, { exact: false })).toBeInTheDocument();
    });

    // Check report-to name
    expect(screen.getByText(mockJob.company.reportTo.name, { exact: true })).toBeInTheDocument();
  });
});
