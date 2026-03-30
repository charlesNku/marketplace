import { create } from 'zustand';
import api from '../services/api.js';

const useCartStore = create((set) => ({
  cart: { products: [] },
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message,
        loading: false 
      });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/cart/add', { productId, quantity });
      set({ cart: data, loading: false });
    } catch (error) {
       set({ 
        error: error.response?.data?.message || error.message,
        loading: false 
      });
    }
  },

  removeFromCart: async (productId) => {
     set({ loading: true, error: null });
    try {
      const { data } = await api.delete('/cart/remove', { data: { productId } });
      set({ cart: data, loading: false });
    } catch (error) {
       set({ 
        error: error.response?.data?.message || error.message,
        loading: false 
      });
    }
  }
}));

export default useCartStore;
