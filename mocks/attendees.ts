import { Attendee } from '@/types';

export const mockAttendees: Attendee[] = [
  {
    id: 'a1',
    eventId: '1',
    ticketTypeId: 't1',
    name: 'Chidi Okafor',
    email: 'chidi@example.com',
    phone: '+234 801 234 5678',
    checkedIn: true,
    checkedInAt: '2025-03-15T09:15:00Z',
    qrCode: 'EVT1-A1-CHK',
    purchasedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'a2',
    eventId: '1',
    ticketTypeId: 't2',
    name: 'Amina Ibrahim',
    email: 'amina@example.com',
    phone: '+234 802 345 6789',
    checkedIn: false,
    qrCode: 'EVT1-A2-VIP',
    purchasedAt: '2025-02-05T14:30:00Z',
  },
  {
    id: 'a3',
    eventId: '1',
    ticketTypeId: 't1',
    name: 'Tunde Williams',
    email: 'tunde@example.com',
    phone: '+234 803 456 7890',
    checkedIn: false,
    qrCode: 'EVT1-A3-CHK',
    purchasedAt: '2025-02-10T16:45:00Z',
  },
];
