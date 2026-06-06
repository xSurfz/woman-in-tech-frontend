<template>
  <div class="bg-slate-50 min-h-screen antialiased text-base text-slate-800">
    <!-- Hero (Escala tipográfica optimizada) -->
    <section
      class="bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white py-24"
    >
      <div class="max-w-7xl mx-auto px-6 text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
          Programas e Iniciativas
        </h1>
        <p
          class="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed"
        >
          Impulsamos el crecimiento profesional de mujeres en tecnología
          mediante programas de formación, mentoría y networking.
        </p>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32">
      <div
        class="animate-spin rounded-full h-14 w-14 border-4 border-purple-200 border-t-purple-700"
      ></div>
      <p class="mt-6 text-lg font-medium text-slate-600">
        Cargando programas...
      </p>
    </div>

    <!-- Content -->
    <div v-else class="max-w-7xl mx-auto px-6 py-20 space-y-24">
      <!-- Programs Grid -->
      <section>
        <div
          v-if="programs.length === 0"
          class="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm"
        >
          <p class="text-lg text-slate-600">
            No hay programas activos publicados en este momento.
          </p>
        </div>

        <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          <article
            v-for="program in programs"
            :key="program.id"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <!-- Image Container con Control de Estados -->
            <div
              class="relative h-56 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0"
            >
              <!-- Skeleton Loader Animado -->
              <div
                v-if="
                  !imageStatus[program.id]?.loaded &&
                  !imageStatus[program.id]?.error
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
                  >Cargando portada</span
                >
              </div>

              <!-- Imagen Real / Fallback Corporativo -->
              <img
                :src="
                  imageStatus[program.id]?.error
                    ? DEFAULT_PLACEHOLDER
                    : `${SERVER_URL}${program.imageUrl}`
                "
                :alt="program.title"
                class="w-full h-full object-cover transition-all duration-500"
                :class="
                  imageStatus[program.id]?.loaded
                    ? 'opacity-100 scale-100 hover:scale-105'
                    : 'opacity-0 scale-95'
                "
                @load="handleImageLoad(program.id)"
                @error="handleImageError(program.id)"
              />

              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"
              ></div>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-1 space-y-4">
              <h3 class="text-2xl font-bold text-slate-900 leading-tight">
                {{ program.title }}
              </h3>

              <p class="text-base text-slate-600 leading-relaxed line-clamp-3">
                {{ program.description }}
              </p>

              <!-- Button -->
              <button
                @click="showProgramInfo(program)"
                class="mt-auto w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-base py-3.5 rounded-xl transition shadow-sm hover:shadow"
              >
                Ver detalles
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- Featured Projects (Estructura optimizada de tarjetas) -->
      <section class="border-t border-slate-200/60 pt-20">
        <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
            Proyectos Destacados
          </h2>
          <p class="text-lg text-slate-600 leading-relaxed">
            Algunas de las iniciativas que han generado impacto dentro de
            nuestra comunidad tecnológica.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Project 1 -->
          <div
            class="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition flex flex-col md:flex-row gap-6 items-start"
          >
            <div
              class="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-extrabold text-lg shrink-0 shadow-inner"
            >
              C&G
            </div>
            <div class="space-y-3">
              <h3 class="text-2xl font-bold text-slate-900">Code & Girls</h3>
              <p class="text-base text-slate-600 leading-relaxed">
                Programa de introducción a la programación dirigido a niñas de
                instituciones educativas públicas, desarrollado en alianza con
                entidades educativas nacionales.
              </p>
            </div>
          </div>

          <!-- Project 2 -->
          <div
            class="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition flex flex-col md:flex-row gap-6 items-start"
          >
            <div
              class="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-extrabold text-lg shrink-0 shadow-inner"
            >
              WF
            </div>
            <div class="space-y-3">
              <h3 class="text-2xl font-bold text-slate-900">Women Founders</h3>
              <p class="text-base text-slate-600 leading-relaxed">
                Programa de aceleración para emprendimientos tecnológicos
                liderados por mujeres, con acceso a mentoría, networking
                estratégico y acompañamiento empresarial.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal Detalles (Accesibilidad visual mejorada) -->
    <div
      v-if="selectedProgram"
      class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-purple-700 text-white p-6 md:p-8">
          <div class="flex justify-between items-center gap-4">
            <h3 class="text-2xl font-bold tracking-tight">
              {{ selectedProgram.title }}
            </h3>
            <button
              @click="closeModal"
              class="text-purple-100 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
              aria-label="Cerrar modal"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8 space-y-6">
          <p
            class="text-base text-slate-600 leading-relaxed whitespace-pre-line"
          >
            {{ selectedProgram.description }}
          </p>

          <div
            class="bg-slate-100 rounded-xl p-5 border border-slate-200/50 space-y-2"
          >
            <h4 class="font-bold text-slate-900 text-base">
              ¿Cómo participar?
            </h4>
            <p class="text-base text-slate-600 leading-relaxed">
              Si estás interesada en este programa, envía un correo electrónico
              a nuestro equipo manifestando tu interés. Te contactaremos para
              brindarte más información sobre requisitos, fechas y proceso de
              inscripción.
            </p>
          </div>

          <div
            class="bg-purple-50 rounded-xl p-5 border border-purple-100 space-y-1"
          >
            <h4 class="font-bold text-slate-900 text-base">Contacto</h4>
            <p class="text-sm text-slate-500">Para más información:</p>
            <p class="text-purple-700 font-bold text-base select-all">
              programas@womenintechcolombia.org
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-slate-100 p-6 bg-slate-50">
          <button
            @click="closeModal"
            class="w-full bg-slate-900 hover:bg-black text-white font-bold text-base py-4 rounded-xl transition shadow"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getPrograms } from "../services/program.service";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Placeholder SVG limpio y semántico en Base64 para prevenir caídas de red de imágenes
const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23cbd5e1' dominant-baseline='middle' text-anchor='middle'>Imagen no disponible</text></svg>";

const programs = ref([]);
const loading = ref(true);
const selectedProgram = ref(null);

// Estado reactivo controlado individualmente por ID de programa
const imageStatus = ref({});

const handleImageLoad = (id) => {
  if (!imageStatus.value[id]) imageStatus.value[id] = {};
  imageStatus.value[id].loaded = true;
};

const handleImageError = (id) => {
  if (!imageStatus.value[id]) imageStatus.value[id] = {};
  imageStatus.value[id].error = true;
  imageStatus.value[id].loaded = true;
};

const showProgramInfo = (program) => {
  selectedProgram.value = program;
};

const closeModal = () => {
  selectedProgram.value = null;
};

onMounted(async () => {
  try {
    const data = await getPrograms();
    if (data) {
      programs.value = data;

      // Mapear preventivo para evitar comportamientos erráticos en el DOM
      data.forEach((prog) => {
        imageStatus.value[prog.id] = { loaded: false, error: false };
      });
    }
  } catch (error) {
    console.error("Error al obtener los programas del servicio:", error);
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
