import { create } from 'zustand';

export const useAppStore = create((set) => ({
  token: null,
  user: null,
  deviceId: null,
  subscription: { status: 'inactive', remainingDays: 0 },
  setSession: (token, user, deviceId) => set({ token, user, deviceId }),
  setSubscription: (subscription) => set({ subscription })
}));
