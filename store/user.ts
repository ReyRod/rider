import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  setUser: (userInfo) => set({ user: userInfo }),
  updateUser: (updates) =>
    set((state) => ({ user: { ...state.user, ...updates } })),
  clearUser: () =>
    set({
      user: null,
    }),
}));

export default useUserStore;
