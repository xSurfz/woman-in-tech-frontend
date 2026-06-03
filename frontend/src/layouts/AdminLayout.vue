<template>
  <div class="min-h-screen flex bg-gray-100">
    <aside class="w-64 bg-gray-900 text-white p-4">
      <h1 class="text-xl font-bold mb-6">Admin Panel</h1>

      <nav class="space-y-2">
        <router-link 
          to="/admin"
          class="block p-2 rounded"
          active-class="bg-gray-800"
        > 
          Dashboard 
        </router-link>

        <RouterLink
          to="/admin/events"
          class="block p-2 rounded"
          active-class="bg-gray-800"
        >
          Events
        </RouterLink>
        
        <router-link 
          to="/admin/programs"
          class="block p-2 rounded"
          active-class="bg-gray-800"
        > 
          Programs 
        </router-link>

        <router-link 
          to="/admin/resources"
          class="block p-2 rounded"
          active-class="bg-gray-800"
        > 
          Resources 
        </router-link>

        <router-link 
          to="/admin/testimonials"
          class="block p-2 rounded"
          active-class="bg-gray-800"
        > 
          Testimonials 
        </router-link>

        <router-link 
          to="/admin/interests"
          class="block p-2 rounded"
          active-class="bg-gray-800"
        > 
          Interests 
        </router-link>

        <router-link 
          to="/admin/members"
          class="block p-2 rounded"
          active-class="bg-gray-800"
        > 
          Members 
        </router-link>
      </nav>
    </aside>
    <!-- MAIN -->
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>
