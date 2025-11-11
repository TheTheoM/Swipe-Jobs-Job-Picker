import { useState, useEffect } from 'react';
import calculateWorkerToJobDistance from '../utils/calculateWorkerToJobDistance';

export default function useWorkerJobDistance(workerAddress?: string, jobAddress?: string) {
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    if (!workerAddress || !jobAddress) {
      setDistance(null);
      return;
    }

    let cancelled = false;

    const fetchDistance = async () => {
      try {
        const distance = await calculateWorkerToJobDistance(workerAddress, jobAddress);
        if (!cancelled) setDistance(distance);
      } catch (err) {
        console.error('Distance calculation failed:', err);
        if (!cancelled) setDistance(null);
      }
    };

    fetchDistance();

    return () => {
      cancelled = true;
    };
  }, [workerAddress, jobAddress]);

  return { distance };
}
