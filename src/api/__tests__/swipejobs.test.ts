import { getWorkerProfile, getMatchedJobs, acceptJob, rejectJob } from '../swipeJobsAPI';
import { API_BASE_URL, WORKER_ID } from '../../../src/config';

jest.mock('../../../src/config', () => ({
  API_BASE_URL: 'base-url',
  WORKER_ID: 'abcd-efg-hij',
}));

(globalThis.fetch as jest.Mock) = jest.fn();

describe('SwipeJobs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls correct endpoint for worker profile', async () => {
    const mockProfile = { firstName: 'Jim' };
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockProfile });

    const result = await getWorkerProfile();

    expect(result).toEqual(mockProfile);
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/worker/${WORKER_ID}/profile`);
  });

  it('calls correct endpoint for matched jobs', async () => {
    const mockJobs = [{ jobId: '1' }];
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockJobs });

    const result = await getMatchedJobs();

    expect(result).toEqual(mockJobs);
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/worker/${WORKER_ID}/matches`);
  });

  it('calls correct endpoint for acceptJob and handles failure response', async () => {
    const mockFail = { success: false, message: 'Not available', errorCode: 'FAIL-101' };
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockFail });

    const result = await acceptJob('job-1');

    expect(result).toEqual(mockFail);
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/worker/${WORKER_ID}/job/job-1/accept`, { method: 'GET' });
  });

  it('calls correct endpoint for rejectJob and handles failure response', async () => {
    const mockFail = { success: false, message: 'Cannot reject', errorCode: 'FAIL-102' };
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockFail });

    const result = await rejectJob('job-1');

    expect(result).toEqual(mockFail);
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/worker/${WORKER_ID}/job/job-1/reject`, { method: 'GET' });
  });
});
