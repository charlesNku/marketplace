import { create } from 'zustand';
import api from '../services/api.js';

const useAuthStore = create((set) => ({
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  error: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
    }
  },

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, loading: false });
    } catch (error) {
       set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ userInfo: null });
  }
}));

export default useAuthStore;
