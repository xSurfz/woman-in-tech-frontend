<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero -->
    <section
      class="bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white py-20"
    >
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Eventos</h1>

        <p class="text-lg text-purple-100 max-w-2xl mx-auto">
          Conoce nuestros próximos encuentros, talleres y actividades de la
          comunidad Women in Tech Colombia.
        </p>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-700"
      ></div>

      <p class="mt-4 text-gray-600">Cargando eventos...</p>
    </div>

    <!-- Content -->
    <div v-else class="max-w-7xl mx-auto px-4 py-16">
      <!-- Upcoming Events -->
      <section class="mb-20">
        <div class="flex items-center gap-3 mb-8">
          <div class="bg-purple-100 p-2 rounded-lg">
            <Calendar size="24" class="text-purple-700" />
          </div>

          <h2 class="text-3xl font-bold text-gray-900">Próximos eventos</h2>
        </div>

        <div
          v-if="events.upcoming.length === 0"
          class="bg-white border border-gray-200 rounded-2xl p-10 text-center"
        >
          <p class="text-gray-600">No hay eventos próximos por el momento.</p>
        </div>

        <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          <article
            v-for="event in paginatedUpcomingEvents"
            :key="event.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <!-- Image -->
            <div class="relative">
              <img
                :src="`${SERVER_URL}${event.imageUrl}`"
                :alt="event.title"
                class="w-full h-56 object-cover"
              />

              <div
                class="absolute top-4 left-4 bg-purple-700 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                Próximo evento
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-1">
              <div class="flex items-center gap-2 text-sm text-purple-700 mb-3">
                <Calendar size="16" />
                <span>{{ formatDate(event.startsAt) }}</span>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-3">
                {{ event.title }}
              </h3>

              <p class="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {{ event.description }}
              </p>

              <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <MapPin size="16" />
                <span>{{ event.location }}</span>
              </div>

              <!-- Botón alineado -->
              <button
                @click="showEventInfo(event)"
                class="mt-auto w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 rounded-xl transition"
              >
                Ver detalles
              </button>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex justify-center items-center gap-2 mt-12"
        >
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Anterior
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 rounded-lg font-medium transition',
              currentPage === page
                ? 'bg-purple-700 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Siguiente
          </button>
        </div>
      </section>

      <!-- Past Events -->
      <section>
        <div class="flex items-center gap-3 mb-8">
          <div class="bg-gray-200 p-2 rounded-lg">
            <History size="24" class="text-gray-700" />
          </div>

          <h2 class="text-3xl font-bold text-gray-900">Eventos pasados</h2>
        </div>

        <div
          v-if="events.past.length === 0"
          class="bg-white border border-gray-200 rounded-2xl p-10 text-center"
        >
          <p class="text-gray-600">Aún no hay eventos archivados.</p>
        </div>

        <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          <article
            v-for="event in events.past"
            :key="event.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition"
          >
            <img
              :src="`${SERVER_URL}${event.imageUrl}`"
              :alt="event.title"
              class="w-full h-56 object-cover grayscale hover:grayscale-0 transition duration-300"
            />

            <div class="p-6">
              <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar size="16" />
                <span>{{ formatDate(event.starsAt) }}</span>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-3">
                {{ event.title }}
              </h3>

              <p class="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {{ event.description }}
              </p>

              <div class="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size="16" />
                <span>{{ event.location }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedEvent"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
        @click.stop
      >
        <div class="bg-purple-700 text-white p-6">
          <h3 class="text-2xl font-bold">
            {{ selectedEvent.name }}
          </h3>
        </div>

        <div class="p-6 space-y-5">
          <div class="flex items-start gap-3">
            <Calendar class="text-purple-700 mt-1" size="18" />
            <div>
              <p class="font-semibold text-gray-900">Fecha</p>
              <p class="text-gray-600">
                {{ formatDate(selectedEvent.startsAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <MapPin class="text-purple-700 mt-1" size="18" />
            <div>
              <p class="font-semibold text-gray-900">Ubicación</p>
              <p class="text-gray-600">
                {{ selectedEvent.location }}
              </p>
            </div>
          </div>

          <div>
            <p class="font-semibold text-gray-900 mb-2">Descripción</p>

            <p class="text-gray-600 leading-relaxed">
              {{ selectedEvent.description }}
            </p>
          </div>
        </div>

        <div class="border-t border-gray-200 p-6">
          <button
            @click="closeModal"
            class="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl transition"
          >
            Cerrar
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
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const events = ref({
  upcoming: [],
  past: [],
});

const loading = ref(true);
const selectedEvent = ref(null);

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
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const showEventInfo = (event) => {
  selectedEvent.value = event;
};

const closeModal = () => {
  selectedEvent.value = null;
};

onMounted(async () => {
  events.value = await getEvents();
  loading.value = false;
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
