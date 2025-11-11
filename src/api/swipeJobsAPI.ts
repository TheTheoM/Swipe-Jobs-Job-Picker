import { API_BASE_URL, WORKER_ID } from '../config';
import type { Job, JobActionResponse, WorkerProfile } from '../types';

export const getWorkerProfile = async (): Promise<WorkerProfile> => {
  const res = await fetch(`${API_BASE_URL}/worker/${WORKER_ID}/profile`);
  if (!res.ok) {
    throw new Error(`Failed to fetch worker profile: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as WorkerProfile;
  return data;
};

export const getMatchedJobs = async (): Promise<Job[]> => {
  const res = await fetch(`${API_BASE_URL}/worker/${WORKER_ID}/matches`);
  if (!res.ok) {
    throw new Error(`Failed to fetch matched jobs: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as Job[];
  return data;
};

export const acceptJob = async (jobId: string): Promise<JobActionResponse> => {
  const res = await fetch(`${API_BASE_URL}/worker/${WORKER_ID}/job/${jobId}/accept`, {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error(`Failed to accept job ${jobId}: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as JobActionResponse;
  return data;
};

export const rejectJob = async (jobId: string): Promise<JobActionResponse> => {
  const res = await fetch(`${API_BASE_URL}/worker/${WORKER_ID}/job/${jobId}/reject`, {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error(`Failed to reject job ${jobId}: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as JobActionResponse;
  return data;
};
