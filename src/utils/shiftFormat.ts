// Used in Job -> JobDetails -> ShiftDates
// Converts the ISO strings "2019-09-04T21:00:00Z" into SEPTEMBER 5, WED 4:00 PM - 12:00 AM
export const formatShift = (shift: { startDate: string; endDate: string }, timeZone: string) => {
  const start = new Date(shift.startDate);
  const end = new Date(shift.endDate);

  const startMonth = start.toLocaleString('en-US', { month: 'long', timeZone }).toUpperCase();
  const startDay = start.toLocaleString('en-US', { day: 'numeric', timeZone });
  const startWeekday = start.toLocaleString('en-US', { weekday: 'short', timeZone }).toUpperCase();

  const startTime = start.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  });

  const endTime = end.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  });

  return `${startMonth} ${startDay}, ${startWeekday} ${startTime} - ${endTime}`;
};
