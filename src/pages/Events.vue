<template>
  <div class="bg-gray-50 min-h-screen antialiased text-base text-slate-800">
    <section
      class="bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white py-24"
    >
      <div class="max-w-7xl mx-auto px-6 text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
          Eventos
        </h1>
        <p
          class="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed"
        >
          Conoce nuestros próximos encuentros, talleres y actividades de la
          comunidad Women in Tech Colombia.
        </p>
      </div>
    </section>

    <div v-if="loading" class="flex flex-col items-center justify-center py-32">
      <div
        class="animate-spin rounded-full h-14 w-14 border-4 border-purple-200 border-t-purple-700"
      ></div>
      <p class="mt-6 text-lg font-medium text-slate-600">Cargando eventos...</p>
    </div>

    <div v-else class="max-w-7xl mx-auto px-6 py-20 space-y-24">
      <section>
        <div class="flex items-center gap-4 mb-10">
          <div class="bg-purple-100 p-3 rounded-xl text-purple-700 shrink-0">
            <Calendar size="28" />
          </div>
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
            Próximos eventos
          </h2>
        </div>

        <div
          v-if="events.upcoming.length === 0"
          class="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm"
        >
          <p class="text-lg text-slate-600">
            No hay eventos próximos por el momento.
          </p>
        </div>

        <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          <article
            v-for="event in paginatedUpcomingEvents"
            :key="event.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div
              class="relative w-full h-56 bg-slate-100 flex items-center justify-center overflow-hidden"
            >
              <div
                v-if="
                  !imageStatus[event.id]?.loaded &&
                  !imageStatus[event.id]?.error
                "
                class="absolute inset-0 dynamic-pulse bg-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2"
              >
                <svg
                  class="w-10 h-10 opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span
                  class="text-xs font-semibold tracking-wider uppercase opacity-50"
                  >Cargando miniatura</span
                >
              </div>

              <img
                :src="
                  imageStatus[event.id]?.error
                    ? DEFAULT_PLACEHOLDER
                    : `${VITE_SERVER_URL}${event.imageUrl}`
                "
                :alt="event.title"
                class="w-full h-56 object-cover transition-opacity duration-500"
                :class="
                  imageStatus[event.id]?.loaded ? 'opacity-100' : 'opacity-0'
                "
                @load="handleImageLoad(event.id)"
                @error="handleImageError(event.id)"
              />

              <div
                class="absolute top-4 left-4 bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide uppercase"
              >
                Próximo evento
              </div>
            </div>

            <div class="p-6 flex flex-col flex-1 space-y-4">
              <div
                class="flex items-center gap-2 text-sm font-bold text-purple-700"
              >
                <Calendar size="18" />
                <span>{{ formatDate(event.startsAt) }}</span>
              </div>

              <h3 class="text-xl font-bold text-slate-900 leading-tight">
                {{ event.title }}
              </h3>

              <p class="text-base text-slate-600 leading-relaxed line-clamp-3">
                {{ event.description }}
              </p>

              <div
                class="flex items-center gap-2 text-sm font-semibold text-slate-500 pt-2"
              >
                <MapPin size="18" class="text-slate-400 shrink-0" />
                <span class="truncate">{{ event.location }}</span>
              </div>

              <button
                @click="showEventInfo(event)"
                class="mt-auto w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-base py-3.5 rounded-xl transition shadow-sm hover:shadow"
              >
                Ver detalles
              </button>
            </div>
          </article>
        </div>

        <div
          v-if="totalPages > 1"
          class="flex justify-center items-center gap-3 mt-16"
        >
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
          >
            Anterior
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-11 h-11 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm',
              currentPage === page
                ? 'bg-purple-700 text-white'
                : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
          >
            Siguiente
          </button>
        </div>
      </section>

      <section>
        <div class="flex items-center gap-4 mb-10">
          <div class="bg-slate-200 p-3 rounded-xl text-slate-700 shrink-0">
            <History size="28" />
          </div>
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
            Eventos pasados
          </h2>
        </div>

        <div
          v-if="events.past.length === 0"
          class="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm"
        >
          <p class="text-lg text-slate-600">Aún no hay eventos archivados.</p>
        </div>

        <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          <article
            v-for="event in events.past"
            :key="event.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition duration-300 flex flex-col"
          >
            <div
              class="relative w-full h-56 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0"
            >
              <div
                v-if="
                  !imageStatus[event.id]?.loaded &&
                  !imageStatus[event.id]?.error
                "
                class="absolute inset-0 dynamic-pulse bg-slate-200 flex items-center justify-center text-slate-400"
              >
                <svg
                  class="w-10 h-10 opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <img
                :src="
                  imageStatus[event.id]?.error
                    ? DEFAULT_PLACEHOLDER
                    : `${VITE_SERVER_URL}${event.imageUrl}`
                "
                :alt="event.title"
                class="w-full h-56 object-cover grayscale opacity-90 hover:grayscale-0 transition duration-500"
                :class="
                  imageStatus[event.id]?.loaded ? 'opacity-100' : 'opacity-0'
                "
                @load="handleImageLoad(event.id)"
                @error="handleImageError(event.id)"
              />
            </div>

            <div class="p-6 flex flex-col flex-1 space-y-3">
              <div
                class="flex items-center gap-2 text-sm font-semibold text-slate-500"
              >
                <Calendar size="18" />
                <span>{{ formatDate(event.startsAt) }}</span>
              </div>

              <h3 class="text-xl font-bold text-slate-900 leading-tight">
                {{ event.title }}
              </h3>

              <p class="text-base text-slate-600 leading-relaxed line-clamp-3">
                {{ event.description }}
              </p>

              <div
                class="flex items-center gap-2 text-sm font-semibold text-slate-500 pt-2 mt-auto"
              >
                <MapPin size="18" class="text-slate-400 shrink-0" />
                <span class="truncate">{{ event.location }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div
      v-if="selectedEvent"
      class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100"
        @click.stop
      >
        <div class="bg-purple-700 text-white p-6 md:p-8">
          <h3 class="text-2xl font-bold tracking-tight">
            {{ selectedEvent.title || selectedEvent.name }}
          </h3>
        </div>

        <div class="p-6 md:p-8 space-y-6">
          <div class="flex items-start gap-4">
            <Calendar class="text-purple-700 mt-1 shrink-0" size="22" />
            <div>
              <p class="font-bold text-slate-900 text-base">
                Fecha del encuentro
              </p>
              <p class="text-base text-slate-600 mt-0.5">
                {{ formatDate(selectedEvent.startsAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <MapPin class="text-purple-700 mt-1 shrink-0" size="22" />
            <div>
              <p class="font-bold text-slate-900 text-base">
                Ubicación física / Enlace
              </p>
              <p class="text-base text-slate-600 mt-0.5">
                {{ selectedEvent.location }}
              </p>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-5">
            <p class="font-bold text-slate-900 text-base mb-2">
              Acerca de este evento
            </p>
            <p
              class="text-base text-slate-600 leading-relaxed whitespace-pre-line"
            >
              {{ selectedEvent.description }}
            </p>
          </div>
        </div>

        <div class="border-t border-slate-100 p-6 bg-slate-50">
          <button
            @click="closeModal"
            class="w-full bg-slate-900 hover:bg-black text-white font-bold text-base py-4 rounded-xl transition shadow"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Calendar, History, MapPin } from "lucide-vue-next";
import { getEvents } from "../services/event.service";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

// URL de un placeholder corporativo limpio en SVG/Base64 en caso de error 404 del backend
const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23cbd5e1' dominant-baseline='middle' text-anchor='middle'>Imagen no disponible</text></svg>";

const events = ref({
  upcoming: [],
  past: [],
});

const loading = ref(true);
const selectedEvent = ref(null);

// Registro reactivo del estado de carga de cada miniatura por ID
const imageStatus = ref({});

const currentPage = ref(1);
const eventsPerPage = 6;

const totalPages = computed(() => {
  return Math.ceil(events.value.upcoming.length / eventsPerPage);
});

const paginatedUpcomingEvents = computed(() => {
  const start = (currentPage.value - 1) * eventsPerPage;
  const end = start + eventsPerPage;
  return events.value.upcoming.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Controladores del flujo de carga de imágenes nativas
const handleImageLoad = (id) => {
  if (!imageStatus.value[id]) imageStatus.value[id] = {};
  imageStatus.value[id].loaded = true;
};

const handleImageError = (id) => {
  if (!imageStatus.value[id]) imageStatus.value[id] = {};
  imageStatus.value[id].error = true;
  imageStatus.value[id].loaded = true;
};

const showEventInfo = (event) => {
  selectedEvent.value = event;
};

const closeModal = () => {
  selectedEvent.value = null;
};

onMounted(async () => {
  try {
    const data = await getEvents();
    if (data) {
      events.value = data;

      // Inicializar el diccionario de imágenes para evitar saltos reactivos
      const allEvents = [...(data.upcoming || []), ...(data.past || [])];
      allEvents.forEach((evt) => {
        imageStatus.value[evt.id] = { loaded: false, error: false };
      });
    }
  } catch (err) {
    console.error("Error al renderizar los eventos de la comunidad:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.dynamic-pulse {
  animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
