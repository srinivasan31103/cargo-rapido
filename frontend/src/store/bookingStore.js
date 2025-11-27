import { create } from 'zustand';
import { bookingAPI } from '../utils/api';

const useBookingStore = create((set, get) => ({
  currentBooking: null,
  bookings: [],
  loading: false,
  error: null,

  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.create(bookingData);
      const booking = response.data.data;

      set({
        currentBooking: booking,
        bookings: [booking, ...get().bookings],
        loading: false
      });

      return booking;
    } catch (error) {
      const message = error.response?.data?.message || 'Booking creation failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  fetchBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.getById(bookingId);
      const booking = response.data.data;

      set({
        currentBooking: booking,
        loading: false
      });

      return booking;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch booking';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  fetchUserBookings: async (userId, params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.getUserBookings(userId, params);
      const bookings = response.data.data;

      set({
        bookings,
        loading: false
      });

      return bookings;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  estimatePrice: async (estimateData) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.estimate(estimateData);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Price estimation failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  updateBookingStatus: async (bookingId, statusData) => {
    try {
      const response = await bookingAPI.updateStatus(bookingId, statusData);
      const updatedBooking = response.data.data;

      set({
        currentBooking: updatedBooking,
        bookings: get().bookings.map(b =>
          b._id === bookingId ? updatedBooking : b
        )
      });

      return updatedBooking;
    } catch (error) {
      const message = error.response?.data?.message || 'Status update failed';
      throw new Error(message);
    }
  },

  cancelBooking: async (bookingId, reason) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingAPI.cancel(bookingId, { reason });
      const cancelledBooking = response.data.data;

      set({
        currentBooking: cancelledBooking,
        bookings: get().bookings.map(b =>
          b._id === bookingId ? cancelledBooking : b
        ),
        loading: false
      });

      return cancelledBooking;
    } catch (error) {
      const message = error.response?.data?.message || 'Cancellation failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  rateBooking: async (bookingId, rating) => {
    try {
      const response = await bookingAPI.rate(bookingId, rating);
      const ratedBooking = response.data.data;

      set({
        bookings: get().bookings.map(b =>
          b._id === bookingId ? ratedBooking : b
        )
      });

      return ratedBooking;
    } catch (error) {
      const message = error.response?.data?.message || 'Rating submission failed';
      throw new Error(message);
    }
  },

  clearCurrentBooking: () => set({ currentBooking: null }),
  clearError: () => set({ error: null })
}));

export default useBookingStore;
