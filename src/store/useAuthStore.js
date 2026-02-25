import { create } from "zustand";
import authService from "../services/authService";

const useAuthStore = create((set) => ({
  // State
  user: null,
  loading: true,
  error: null,

  // Actions
  setUser: (user) => set({ user, error: null }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  // Initialize auth state listener
  initializeAuth: () => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  // Sign out and clear user state
  signOut: async () => {
    try {
      await authService.signOut();
      set({ user: null, error: null });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useAuthStore;
