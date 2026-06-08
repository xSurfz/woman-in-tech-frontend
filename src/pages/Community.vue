<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero -->
    <section
      class="bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white py-20"
    >
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Nuestra Comunidad</h1>
        <p class="text-lg text-purple-100 max-w-2xl mx-auto">
          Conoce a los profesionales, líderes y miembros que hacen posible Women
          in Tech Colombia.
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 py-16">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-24"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-700"
        ></div>
        <p class="mt-4 text-gray-600">Cargando comunidad...</p>
      </div>

      <div v-else>
        <!-- Leadership -->
        <section class="mb-24" v-if="community.leaders.length > 0">
          <div class="text-center mb-14">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Equipo Líder
            </h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Líderes que impulsan iniciativas, programas y espacios de
              crecimiento dentro de la comunidad.
            </p>
          </div>

          <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            <article
              v-for="leader in community.leaders"
              :key="leader.id"
              class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <!-- Image con Placeholder Personalizado -->
              <div
                class="relative overflow-hidden bg-gray-100 h-80 flex items-center justify-center"
              >
                <img
                  v-if="leader.imageUrl"
                  :src="`${VITE_SERVER_URL}${leader.imageUrl}`"
                  :alt="leader.fullName"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <!-- Placeholder de iniciales -->
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br"
                  :class="getRandomGradient()"
                >
                  <span class="text-7xl font-bold text-white/90">
                    {{ getInitials(leader.fullName) }}
                  </span>
                </div>

                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                ></div>
              </div>

              <!-- Content -->
              <div class="p-6 text-center">
                <h3 class="text-xl font-bold text-gray-900 mb-1">
                  {{ leader.fullName }}
                </h3>
                <p class="text-purple-700 font-semibold mb-3">
                  {{ leader.role }}
                </p>
                <div
                  v-if="leader.interests && leader.interests.length > 0"
                  class="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium"
                >
                  {{ leader.interests[0].name }}
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- Members -->
        <section class="mb-24" v-if="community.members.length > 0">
          <div class="text-center mb-14">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Miembros Activos
            </h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Una red diversa de personas en distintas áreas de tecnología,
              innovación y liderazgo.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <article
              v-for="member in community.members"
              :key="member.id"
              class="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <!-- Avatar con Placeholder Personalizado -->
              <div class="mb-5 relative">
                <img
                  v-if="member.imageUrl"
                  :src="`${VITE_SERVER_URL}${member.imageUrl}`"
                  :alt="member.fullName"
                  class="w-28 h-28 rounded-full object-cover mx-auto border-4 border-purple-100 bg-gray-100"
                />
                <!-- Placeholder de iniciales -->
                <div
                  v-else
                  class="w-28 h-28 rounded-full flex items-center justify-center mx-auto border-4 border-purple-100 bg-gradient-to-br"
                  :class="getRandomGradient()"
                >
                  <span class="text-4xl font-bold text-white/90">
                    {{ getInitials(member.fullName) }}
                  </span>
                </div>
              </div>

              <h3 class="text-lg font-bold text-gray-900 mb-1">
                {{ member.fullName }}
              </h3>
              <p class="text-purple-700 font-medium text-sm mb-3">
                {{ member.role }}
              </p>
              <div
                v-if="member.interests && member.interests.length > 0"
                class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {{ member.interests[0].name }}
              </div>
            </article>
          </div>
        </section>

        <!-- Interest Areas (API IMPLEMENTADA) -->
        <section class="mb-24" v-if="interests.length > 0">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Áreas de Interés
            </h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Nuestra comunidad participa en distintas disciplinas del
              ecosistema tecnológico y digital.
            </p>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="interest in interests"
              :key="interest.id || interest.name"
              class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ interest.name }}
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                {{
                  interest.description ||
                  "Explora y aprende proyectos e iniciativas sobre esta disciplina."
                }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCommunity } from "../services/community.service";
import { getInterest } from "../services/interest.service"; // IMPLEMENTADO: Importación del servicio

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const community = ref({
  leaders: [],
  members: [],
});
const interests = ref([]); // IMPLEMENTADO: Estado reactivo para los intereses

const loading = ref(true);

const getInitials = (fullName) => {
  if (!fullName) return "WIT";
  const names = fullName.trim().split(" ");
  if (names.length < 2) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

/**
 * Lista de degradados de la marca para los placeholders.
 */
const gradients = [
  "from-purple-600 to-fuchsia-500",
  "from-fuchsia-500 to-pink-500",
  "from-violet-600 to-purple-600",
  "from-pink-500 to-rose-400",
];

const getRandomGradient = () => {
  const index = Math.floor(Math.random() * gradients.length);
  return gradients[index];
};

onMounted(async () => {
  try {
    // Usamos Promise.all Settled para que si una API falla de forma aislada, la otra igual renderice los datos.
    const [communityRes, interestRes] = await Promise.allSettled([
      getCommunity(),
      getInterest(),
    ]);

    // 1. Procesar Comunidad
    if (communityRes.status === "fulfilled") {
      const response = communityRes.value;
      let allUsers = [];

      if (response && Array.isArray(response.data)) {
        allUsers = response.data;
      } else if (Array.isArray(response)) {
        allUsers = response;
      }

      community.value.leaders = allUsers.filter(
        (user) => user.category && user.category.toUpperCase() === "LEADER",
      );

      community.value.members = allUsers.filter(
        (user) => user.category && user.category.toUpperCase() === "MEMBER",
      );
    } else {
      console.error("Error cargando comunidad:", communityRes.reason);
    }

    // 2. Procesar Intereses (IMPLEMENTADO)
    if (interestRes.status === "fulfilled") {
      const response = interestRes.value;
      if (response && Array.isArray(response.data)) {
        interests.value = response.data;
      } else if (Array.isArray(response)) {
        interests.value = response;
      }
    } else {
      console.error("Error cargando intereses:", interestRes.reason);
    }
  } catch (error) {
    console.error("Error general en el ciclo onMounted:", error);
  } finally {
    loading.value = false;
  }
});
</script>
