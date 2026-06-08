<template>
  <div class="bg-gray-50 min-h-screen">
    <section
      class="bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white py-20"
    >
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Testimonios</h1>

        <p class="text-lg text-purple-100 max-w-2xl mx-auto">
          Historias de experiencia dentro de la comunidad Women in Tech Colombia
        </p>
      </div>
    </section>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-700"
      ></div>
      <p class="mt-4 text-gray-600">Cargando testimonios...</p>
    </div>

    <section v-else class="py-20">
      <div class="max-w-6xl mx-auto px-4">
        <div
          v-if="testimonials.length === 0"
          class="text-center text-gray-500 py-12"
        >
          No hay testimonios disponibles en este momento.
        </div>

        <Swiper
          v-else
          :modules="modules"
          :slides-per-view="1"
          :space-between="30"
          :loop="testimonials.length > 1"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          :navigation="true"
          :breakpoints="{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }"
          class="pb-14 swiper-equal-height"
        >
          <SwiperSlide v-for="t in testimonials" :key="t.id" class="!h-auto">
            <div
              class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-4 mb-4 shrink-0">
                  <img
                    :src="
                      t.imageUrl
                        ? `${VITE_SERVER_URL}${t.imageUrl}`
                        : 'https://ui-avatars.com/api/?name=' +
                          encodeURIComponent(t.fullName) +
                          '&background=F3E8FF&color=6B21A8'
                    "
                    :alt="t.fullName"
                    class="w-14 h-14 rounded-full object-cover bg-purple-100 shrink-0"
                  />

                  <div class="overflow-hidden">
                    <h3 class="font-bold text-gray-900 leading-tight truncate">
                      {{ t.fullName }}
                    </h3>
                    <p class="text-purple-700 text-sm truncate">
                      {{ t.role }} {{ t.company ? `en ${t.company}` : "" }}
                    </p>
                  </div>
                </div>

                <div
                  class="testimonial-content max-h-48 overflow-y-auto pr-1 mb-4"
                >
                  <p class="text-gray-600 italic text-sm leading-relaxed">
                    "{{ t.content }}"
                  </p>
                </div>
              </div>

              <div
                class="pt-2 border-t border-gray-100 flex text-yellow-400 shrink-0"
              >
                <Star v-for="i in 5" :key="i" size="16" fill="currentColor" />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Star } from "lucide-vue-next";
import { getTestimonials } from "../services/testimonial.service";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const modules = [Autoplay, Pagination, Navigation];
const testimonials = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await getTestimonials();
    const data = response && response.data ? response.data : response || [];
    testimonials.value = data.filter((t) => t.isActive);
  } catch (error) {
    console.error("Error al cargar los testimonios:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Fuerza a las diapositivas de Swiper a estirarse uniformemente en la fila */
.swiper-equal-height :deep(.swiper-wrapper) {
  display: flex;
  align-items: stretch;
}

/* Estilos de barra de scroll elegantes y minimalistas para textos gigantes */
.testimonial-content::-webkit-scrollbar {
  width: 4px;
}

.testimonial-content::-webkit-scrollbar-track {
  background: transparent;
}

.testimonial-content::-webkit-scrollbar-thumb {
  background-color: #e9d5ff; /* purple-200 */
  border-radius: 20px;
}

.testimonial-content::-webkit-scrollbar-thumb:hover {
  background-color: #a855f7; /* purple-500 */
}
</style>
