import formatPhoneNumber from '../formatPhoneNumber';

describe('formatPhoneNumber', () => {
  it('formats 10-digit Chicago numbers correctly', () => {
    expect(formatPhoneNumber('2130010012', 'America/Chicago')).toBe('(213) 001 0012');
  });

  it('formats non-Chicago numbers with default 4-character grouping', () => {
    expect(formatPhoneNumber('2130010012', 'America/New_York')).toBe('2130 0100 12');
  });
});
