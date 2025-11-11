import { LOCATION_IQ_ACCESS_TOKEN } from '../config';

// Used in hooks -> useWorkerJobDistance
// Calculates the distance between two points
export default async function calculateWorkerToJobDistance(workerAddress: string | undefined, jobAddress: string | undefined): Promise<string | null> {
  try {
    if (!workerAddress || !jobAddress) {
      return null;
    }

    const stripZip = (address: string) => address.replace(/,?\s*\w{2}\s*\d{5}(?:-\d{4})?,?/g, '').trim();
    const workerQuery = encodeURIComponent(stripZip(workerAddress));
    const jobQuery = encodeURIComponent(stripZip(jobAddress));
    const apiKey = LOCATION_IQ_ACCESS_TOKEN;

    const [workerRes, jobRes] = await Promise.all([
      fetch(`https://us1.locationiq.com/v1/search?key=${apiKey}&q=${workerQuery}&format=json`),
      fetch(`https://us1.locationiq.com/v1/search?key=${apiKey}&q=${jobQuery}&format=json`),
    ]);

    const [workerData, jobData] = await Promise.all([workerRes.json(), jobRes.json()]);

    if (!workerData?.[0] || !jobData?.[0]) return null;

    const lat1 = parseFloat(workerData[0].lat);
    const lon1 = parseFloat(workerData[0].lon);
    const lat2 = parseFloat(jobData[0].lat);
    const lon2 = parseFloat(jobData[0].lon);

    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    return distanceKm.toFixed(2);
  } catch (e) {
    console.error('Distance calculation failed:', e);
    return null;
  }
}
