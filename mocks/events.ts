import { Event } from '@/types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Annual technology conference featuring the latest innovations',
    date: '2025-03-15',
    time: '09:00 AM',
    location: 'Lagos Convention Centre, Lagos',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    ticketTypes: [
      { id: 't1', name: 'Regular', price: 15000, quantity: 100, sold: 45 },
      { id: 't2', name: 'VIP', price: 35000, quantity: 50, sold: 28 },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    revenue: 1655000,
  },
  {
    id: '2',
    title: 'Wedding Reception',
    description: 'Celebrating the union of two hearts',
    date: '2025-04-20',
    time: '04:00 PM',
    location: 'Eko Hotel & Suites, Victoria Island',
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    ticketTypes: [
      { id: 't3', name: 'General Admission', price: 0, quantity: 200, sold: 156 },
    ],
    createdAt: '2025-01-10T14:30:00Z',
    revenue: 0,
  },
];
