import { formatShift } from '../shiftFormat';

describe('formatShift', () => {
  it('formats a shift correctly in Chicago timezone', () => {
    const shift = {
      startDate: '2019-09-04T21:00:00Z',
      endDate: '2019-09-05T05:00:00Z',
    };
    const formatted = formatShift(shift, 'America/Chicago');

    expect(formatted).toBe('SEPTEMBER 4, WED 4:00 PM - 12:00 AM');
  });

  it('formats a shift correctly in Sydney timezone', () => {
    const shift = {
      startDate: '2019-09-04T21:00:00Z',
      endDate: '2019-09-05T05:00:00Z',
    };
    const formatted = formatShift(shift, 'Australia/Sydney');

    expect(formatted).toBe('SEPTEMBER 5, THU 7:00 AM - 3:00 PM');
  });
});
