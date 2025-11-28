export type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    imageUrl: string;
    ticketTypes: TicketType[];
    createdAt: string;
    revenue: number;
  };
  
  export type TicketType = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sold: number;
  };
  
  export type Attendee = {
    id: string;
    eventId: string;
    ticketTypeId: string;
    name: string;
    email: string;
    phone: string;
    checkedIn: boolean;
    checkedInAt?: string;
    qrCode: string;
    purchasedAt: string;
  };
  
  export type ServiceCategory = 'mc' | 'comedian' | 'catering' | 'photography' | 'decoration';

  export type PortfolioItem = {
    id: string;
    url: string;
    type: 'image' | 'video';
    thumbnail?: string;
  };

  export type ServiceProvider = {
    id: string;
    name: string;
    category: ServiceCategory;
    description: string;
    imageUrl: string;
    basePrice: number;
    rating: number;
    reviews: number;
    location: string;
    portfolio?: PortfolioItem[];
  };
  
  export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'refunded';
  
  export type Booking = {
    id: string;
    providerId: string;
    provider: ServiceProvider;
    eventDate: string;
    location: string;
    bidAmount: number;
    status: BookingStatus;
    createdAt: string;
    paid: boolean;
  };
  
  export type CartItem = {
    id: string;
    providerId: string;
    provider: ServiceProvider;
    eventDate: string;
    location: string;
    bidAmount: number;
  };
  
  export type UserProfile = {
    name: string;
    email: string;
    phone: string;
    company?: string;
    imageUrl?: string;
  };
  
  export type AuthState = {
    isAuthenticated: boolean;
    user: UserProfile | null;
  };
  