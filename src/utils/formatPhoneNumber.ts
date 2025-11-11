export default function formatPhoneNumber(phone?: string, zoneId?: string) {
  // "2130010012" => (213) 001 0012
  if (!phone) return '';

  if (zoneId === 'America/Chicago' && phone.length === 10) {
    // For Chicago 10-digit numbers, format as (XXX) XXX XXXX
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)} ${phone.slice(6)}`;
  }

  // For all other cases, split into groups of up to 4 characters
  // Example: "123456789" => "1234 5678 9"
  return phone.match(/.{1,4}/g)?.join(' ') || phone;
}
