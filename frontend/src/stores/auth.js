import { defineStore } from "pinia";

import { getMe } from "../services/auth.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
  }),

  actions: {
    async fetchUser() {
      try {
        this.loading = true;

        this.user = await getMe();
      } catch {
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.user = null;
    },
  },
});
