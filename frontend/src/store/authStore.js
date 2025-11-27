import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../utils/api';
import { initializeSocket, disconnectSocket } from '../utils/socket';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { data } = response.data;

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            loading: false
          });

          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));

          // Initialize socket connection
          initializeSocket(data.token);

          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      loginDriver: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.loginDriver(credentials);
          const { data } = response.data;

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            loading: false
          });

          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));

          initializeSocket(data.token);

          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { data } = response.data;

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            loading: false
          });

          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));

          initializeSocket(data.token);

          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      registerDriver: async (driverData) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.registerDriver(driverData);
          const { data } = response.data;

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            loading: false
          });

          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));

          initializeSocket(data.token);

          return data;
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      logout: () => {
        disconnectSocket();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
        localStorage.setItem('user', JSON.stringify({ ...get().user, ...userData }));
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export { useAuthStore };
export default useAuthStore;
