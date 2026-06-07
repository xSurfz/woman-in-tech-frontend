<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-purple-700 to-fuchsia-500 text-white">
      <div class="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          
          <!-- Texto izquierdo -->
          <div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Empoderando mujeres en tecnología
            </h1>

            <p class="text-lg md:text-xl mb-8 text-purple-100">
              Somos una comunidad dinámica e inclusiva dedicada a fomentar el
              empoderamiento, la diversidad y la innovación en el sector
              tecnológico en Colombia.
            </p>

            <div class="flex flex-wrap gap-4">
              <button
                class="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Únete ahora
              </button>

              <button
                class="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition"
              >
                Conoce más
              </button>
            </div>
          </div>

          <!-- Imagen derecha -->
          <div class="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Mujeres en tecnología trabajando en equipo"
              class="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Resumen de la comunidad -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Una comunidad que crece contigo
          </h2>

          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Conectamos a mujeres apasionadas por la tecnología en todo Colombia
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">

          <!-- Tarjeta 1 -->
          <router-link
            to="/events"
            class="group p-6 bg-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div class="text-purple-700 mb-4">
              <Calendar size="40" />
            </div>

            <h3
              class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition"
            >
              Eventos
            </h3>

            <p class="text-gray-600">
              Hackathons, talleres y networking para impulsar tu carrera
            </p>
          </router-link>

          <!-- Tarjeta 2 -->
          <router-link
            to="/programs"
            class="group p-6 bg-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div class="text-purple-700 mb-4">
              <GraduationCap size="40" />
            </div>

            <h3
              class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition"
            >
              Programas
            </h3>

            <p class="text-gray-600">
              Mentorías, talleres y bootcamps para todos los niveles
            </p>
          </router-link>

          <!-- Tarjeta 3 -->
          <router-link
            to="/resources"
            class="group p-6 bg-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div class="text-purple-700 mb-4">
              <BookOpen size="40" />
            </div>

            <h3
              class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition"
            >
              Recursos
            </h3>

            <p class="text-gray-600">
              Cursos, becas y materiales educativos gratuitos
            </p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Estadísticas -->
    <section class="bg-gray-100 py-16">
      <div class="max-w-7xl mx-auto px-4">
        
        <div class="grid md:grid-cols-3 gap-8 text-center">

          <div>
            <div class="text-4xl font-bold text-purple-700 mb-2">
              500+
            </div>

            <div class="text-gray-900 font-semibold">
              Miembros activas
            </div>

            <div class="text-gray-600 text-sm">
              en toda Colombia
            </div>
          </div>

          <div>
            <div class="text-4xl font-bold text-purple-700 mb-2">
              50+
            </div>

            <div class="text-gray-900 font-semibold">
              Eventos realizados
            </div>

            <div class="text-gray-600 text-sm">
              desde 2020
            </div>
          </div>

          <div>
            <div class="text-4xl font-bold text-purple-700 mb-2">
              20+
            </div>

            <div class="text-gray-900 font-semibold">
              Aliados estratégicos
            </div>

            <div class="text-gray-600 text-sm">
              empresas y universidades
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  Calendar,
  GraduationCap,
  BookOpen,
} from 'lucide-vue-next'
</script>