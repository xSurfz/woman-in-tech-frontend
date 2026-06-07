<template>
  <footer
    class="relative mt-24 overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
  >
    <!-- Glow decorativo -->
    <div
      class="absolute top-0 left-0 w-72 h-72 bg-purple-700/20 blur-3xl rounded-full"
    ></div>

    <div
      class="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-600/10 blur-3xl rounded-full"
    ></div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <!-- Top -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10"
      >
        <!-- Brand -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg"
            >
              <Sparkles size="22" />
            </div>

            <div>
              <h3 class="text-2xl font-bold tracking-tight">Women in Tech</h3>

              <p class="text-sm text-gray-400">
                Comunidad • Tecnología • Innovación
              </p>
            </div>
          </div>

          <p
            class="text-gray-400 leading-relaxed max-w-xl text-sm md:text-base"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere erat a ante venenatis dapibus posuere velit aliquet.
            Curabitur blandit tempus porttitor.
          </p>

          <!-- Newsletter -->
          <div class="mt-8">
            <h4 class="font-semibold text-white mb-3">
              Suscríbete al newsletter
            </h4>

            <div class="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                class="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                class="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 px-5 py-3 rounded-xl font-semibold transition"
              >
                Suscribirme
              </button>
            </div>
          </div>
        </div>

        <!-- Navegación -->
        <div>
          <h4 class="font-semibold text-lg mb-5">Navegación</h4>

          <ul class="space-y-3">
            <li>
              <router-link
                to="/"
                class="text-gray-400 hover:text-white transition"
              >
                Inicio
              </router-link>
            </li>

            <li>
              <router-link
                to="/events"
                class="text-gray-400 hover:text-white transition"
              >
                Eventos
              </router-link>
            </li>

            <li>
              <router-link
                to="/programs"
                class="text-gray-400 hover:text-white transition"
              >
                Programas
              </router-link>
            </li>

            <li>
              <router-link
                to="/resources"
                class="text-gray-400 hover:text-white transition"
              >
                Recursos
              </router-link>
            </li>

            <li>
              <router-link
                to="/community"
                class="text-gray-400 hover:text-white transition"
              >
                Comunidad
              </router-link>
            </li>

            <li>
              <router-link
                to="/contact"
                class="text-gray-400 hover:text-white transition"
              >
                Contacto
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h4 class="font-semibold text-lg mb-5">Contacto</h4>

          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <MapPin size="18" class="text-purple-400 mt-1 shrink-0" />

              <p class="text-gray-400 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet,
                <br />
                consectetur adipiscing elit
              </p>
            </div>

            <div class="flex items-center gap-3">
              <Mail size="18" class="text-purple-400 shrink-0" />

              <p class="text-gray-400 text-sm">contacto@loremipsum.com</p>
            </div>

            <div class="flex items-center gap-3">
              <Phone size="18" class="text-purple-400 shrink-0" />

              <p class="text-gray-400 text-sm">+00 000 000 0000</p>
            </div>
          </div>

          <!-- Redes -->
          <div class="mt-8">
            <h5 class="font-medium mb-4">Síguenos</h5>

            <div class="flex gap-3">
              <a
                href="#"
                class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300"
              >
                <Facebook size="18" />
              </a>

              <a
                href="#"
                class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300"
              >
                <Twitter size="18" />
              </a>

              <a
                href="#"
                class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300"
              >
                <Linkedin size="18" />
              </a>

              <a
                href="#"
                class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300"
              >
                <Instagram size="18" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div
        class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
      ></div>
    </div>
  </footer>
</template>

<script setup>
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-vue-next";
</script>
