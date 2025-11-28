import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Event, Attendee, Booking, CartItem, UserProfile, AuthState } from '@/types';
import { mockEvents } from '@/mocks/events';
import { mockAttendees } from '@/mocks/attendees';

const STORAGE_KEYS = {
  EVENTS: 'allurra_events',
  ATTENDEES: 'allurra_attendees',
  BOOKINGS: 'allurra_bookings',
  CART: 'allurra_cart',
  PROFILE: 'allurra_profile',
  AUTH: 'allurra_auth',
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [events, setEvents] = useState<Event[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Event Organizer',
    email: 'organizer@allurra.com',
    phone: '+234 809 292 6086',
    company: 'Allurra Events',
  });
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, attendeesData, bookingsData, cartData, profileData, authData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.EVENTS),
        AsyncStorage.getItem(STORAGE_KEYS.ATTENDEES),
        AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS),
        AsyncStorage.getItem(STORAGE_KEYS.CART),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.AUTH),
      ]);

      setEvents(eventsData ? JSON.parse(eventsData) : mockEvents);
      setAttendees(attendeesData ? JSON.parse(attendeesData) : mockAttendees);
      setBookings(bookingsData ? JSON.parse(bookingsData) : []);
      setCart(cartData ? JSON.parse(cartData) : []);
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
      if (authData) {
        setAuthState(JSON.parse(authData));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEvents = useCallback(async (data: Event[]) => {
    setEvents(data);
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data));
  }, []);

  const saveAttendees = useCallback(async (data: Attendee[]) => {
    setAttendees(data);
    await AsyncStorage.setItem(STORAGE_KEYS.ATTENDEES, JSON.stringify(data));
  }, []);

  const saveBookings = useCallback(async (data: Booking[]) => {
    setBookings(data);
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(data));
  }, []);

  const saveCart = useCallback(async (data: CartItem[]) => {
    setCart(data);
    await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(data));
  }, []);

  const saveProfile = useCallback(async (data: UserProfile) => {
    setProfile(data);
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data));
  }, []);

  const addEvent = useCallback(
    (event: Omit<Event, 'id' | 'createdAt' | 'revenue'>) => {
      const newEvent: Event = {
        ...event,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        revenue: 0,
        ticketTypes: event.ticketTypes.map((tt) => ({ ...tt, sold: 0 })),
      };
      saveEvents([...events, newEvent]);
    },
    [events, saveEvents]
  );

  const updateEvent = useCallback(
    (eventId: string, updates: Partial<Event>) => {
      const updated = events.map((e) => (e.id === eventId ? { ...e, ...updates } : e));
      saveEvents(updated);
    },
    [events, saveEvents]
  );

  const deleteEvent = useCallback(
    (eventId: string) => {
      saveEvents(events.filter((e) => e.id !== eventId));
    },
    [events, saveEvents]
  );

  const addAttendee = useCallback(
    (attendee: Omit<Attendee, 'id' | 'purchasedAt' | 'checkedIn'>) => {
      const newAttendee: Attendee = {
        ...attendee,
        id: Date.now().toString(),
        purchasedAt: new Date().toISOString(),
        checkedIn: false,
      };
      saveAttendees([...attendees, newAttendee]);
    },
    [attendees, saveAttendees]
  );

  const checkInAttendee = useCallback(
    (attendeeId: string) => {
      const updated = attendees.map((a) =>
        a.id === attendeeId ? { ...a, checkedIn: true, checkedInAt: new Date().toISOString() } : a
      );
      saveAttendees(updated);
    },
    [attendees, saveAttendees]
  );

  const addToCart = useCallback(
    (item: Omit<CartItem, 'id'>) => {
      const newItem: CartItem = {
        ...item,
        id: Date.now().toString(),
      };
      saveCart([...cart, newItem]);
    },
    [cart, saveCart]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      saveCart(cart.filter((c) => c.id !== itemId));
    },
    [cart, saveCart]
  );

  const checkoutCart = useCallback(
    (items: CartItem[]) => {
      const newBookings: Booking[] = items.map((item) => ({
        id: Date.now().toString() + Math.random(),
        providerId: item.providerId,
        provider: item.provider,
        eventDate: item.eventDate,
        location: item.location,
        bidAmount: item.bidAmount,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        paid: true,
      }));
      saveBookings([...bookings, ...newBookings]);
      saveCart(cart.filter((c) => !items.find((i) => i.id === c.id)));
    },
    [bookings, cart, saveBookings, saveCart]
  );

  const updateBookingStatus = useCallback(
    (bookingId: string, status: Booking['status']) => {
      const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status } : b));
      saveBookings(updated);
    },
    [bookings, saveBookings]
  );

  const getTotalRevenue = useCallback(() => {
    return events.reduce((sum, event) => sum + event.revenue, 0);
  }, [events]);

  const getEventAttendees = useCallback(
    (eventId: string) => {
      return attendees.filter((a) => a.eventId === eventId);
    },
    [attendees]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const user: UserProfile = {
        name: profile.name,
        email,
        phone: profile.phone,
        company: profile.company,
      };
      const newAuthState: AuthState = {
        isAuthenticated: true,
        user,
      };
      setAuthState(newAuthState);
      setProfile(user);
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(newAuthState));
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(user));
    },
    [profile]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, phone: string, company?: string) => {
      const user: UserProfile = {
        name,
        email,
        phone,
        company,
      };
      const newAuthState: AuthState = {
        isAuthenticated: true,
        user,
      };
      setAuthState(newAuthState);
      setProfile(user);
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(newAuthState));
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(user));
    },
    []
  );

  const logout = useCallback(async () => {
    const newAuthState: AuthState = {
      isAuthenticated: false,
      user: null,
    };
    setAuthState(newAuthState);
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(newAuthState));
  }, []);

  return {
    events,
    attendees,
    bookings,
    cart,
    profile,
    authState,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    addAttendee,
    checkInAttendee,
    addToCart,
    removeFromCart,
    checkoutCart,
    updateBookingStatus,
    saveProfile,
    getTotalRevenue,
    getEventAttendees,
    login,
    signup,
    logout,
  };
});
