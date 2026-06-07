<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logout } from "../services/auth.service";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();
const isLoggingOut = ref(false);

async function handleLogout() {
  if (isLoggingOut.value) return;

  isLoggingOut.value = true;
  try {
    await logout();
    auth.clear(); // Limpia el estado global del usuario al salir
    router.push("/admin/login");
  } catch (error) {
    console.error("Error durante el cierre de sesión:", error);
  } finally {
    isLoggingOut.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 text-gray-900 font-sans antialiased">
    <aside
      class="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col border-r border-slate-800 shrink-0"
    >
      <div
        class="flex items-center gap-3 pb-5 mb-6 border-b border-slate-800 min-h-[65px]"
      >
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-black text-base uppercase shrink-0"
        >
          {{
            auth.user?.data?.email
              ? auth.user.data.email.charAt(0)
              : auth.user?.email
                ? auth.user.email.charAt(0)
                : "A"
          }}
        </div>
        <div class="overflow-hidden">
          <h1
            v-if="auth.user"
            class="text-sm font-bold text-white tracking-wide truncate"
            :title="auth.user.data?.email || auth.user.email"
          >
            {{ auth.user.data?.email || auth.user.email }}
          </h1>
          <h1
            v-else-id="auth.loading"
            class="text-sm font-bold text-slate-500 tracking-wide dynamic-pulse bg-slate-800 h-4 w-32 rounded"
          ></h1>

          <p
            class="text-xs text-slate-500 font-medium tracking-wider uppercase mt-0.5"
          >
            Administrador
          </p>
        </div>
      </div>

      <nav class="space-y-1.5 flex-1">
        <RouterLink
          to="/admin"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 hover:text-white hover:bg-slate-800/60"
          active-class="bg-slate-800 text-white shadow-inner font-semibold"
          exact-active-class="bg-slate-800 text-white"
        >
          <svg
            class="w-5 h-5 opacity-70 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
            />
          </svg>
          Dashboard
        </RouterLink>

        <RouterLink
          to="/admin/events"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 hover:text-white hover:bg-slate-800/60"
          active-class="bg-slate-800 text-white shadow-inner font-semibold"
        >
          <svg
            class="w-5 h-5 opacity-70 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"
            />
          </svg>
          Eventos
        </RouterLink>

        <RouterLink
          to="/admin/programs"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 hover:text-white hover:bg-slate-800/60"
          active-class="bg-slate-800 text-white shadow-inner font-semibold"
        >
          <svg
            class="w-5 h-5 opacity-70 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Programas
        </RouterLink>

        <RouterLink
          to="/admin/resources"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 hover:text-white hover:bg-slate-800/60"
          active-class="bg-slate-800 text-white shadow-inner font-semibold"
        >
          <svg
            class="w-5 h-5 opacity-70 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Recursos
        </RouterLink>

        <RouterLink
          to="/admin/testimonials"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 hover:text-white hover:bg-slate-800/60"
          active-class="bg-slate-800 text-white shadow-inner font-semibold"
        >
          <svg
            class="w-5 h-5 opacity-70 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Testimonios
        </RouterLink>

        <RouterLink
          to="/admin/interests"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 hover:text-white hover:bg-slate-800/60"
          active-class="bg-slate-800 text-white shadow-inner font-semibold"
        >
          <svg
            class="w-5 h-5 opacity-70 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
          Áreas de Interés
        </RouterLink>

        <RouterLink
          to="/admin/members"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 hover:text-white hover:bg-slate-800/60"
          active-class="bg-slate-800 text-white shadow-inner font-semibold"
        >
          <svg
            class="w-5 h-5 opacity-70 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Miembros
        </RouterLink>
      </nav>

      <div class="pt-5 border-t border-slate-800 mt-auto">
        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide bg-rose-950/40 hover:bg-rose-900 border border-rose-900/30 text-rose-300 hover:text-white transition duration-200 outline-none disabled:opacity-50"
        >
          <svg
            v-if="!isLoggingOut"
            class="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span
            v-else
            class="w-5 h-5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin shrink-0"
          ></span>
          {{ isLoggingOut ? "Cerrando Sesión..." : "Cerrar Sesión" }}
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.dynamic-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
