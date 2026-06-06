<template>
  <nav class="bg-purple-700 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="text-xl font-bold">
          Women in Tech
        </router-link>

        <!-- Desktop menu -->
        <div class="hidden md:flex space-x-6">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="hover:text-purple-200 transition"
          >
            {{ link.name }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <button @click="isOpen = !isOpen" class="md:hidden">
          <Menu v-if="!isOpen" size="24" />
          <X v-else size="24" />
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="isOpen" class="md:hidden pb-4">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="block py-2 hover:bg-purple-600 px-2 rounded"
          @click="isOpen = false"
        >
          {{ link.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isOpen = ref(false)

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Sobre Nosotros', path: '/about' },
  { name: 'Eventos', path: '/events' },
  { name: 'Programas', path: '/programs' },
  { name: 'Comunidad', path: '/community' },
  { name: 'Recursos', path: '/resources' },
  { name: 'Testimonios', path: '/testimonials' },
  { name: 'Contacto', path: '/contact' }
]
</script>