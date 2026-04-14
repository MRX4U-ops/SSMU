import { create } from 'zustand';

export const useAppStore = create((set) => ({
  token: null,
  user: null,
  subscription: { status: 'inactive', remainingDays: 0 },
  setSession: (token, user) => set({ token, user }),
  setSubscription: (subscription) => set({ subscription })
}));
