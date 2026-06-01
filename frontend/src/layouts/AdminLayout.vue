<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- SIDEBAR -->
    <aside class="w-64 bg-gray-900 text-white p-4">
      <h1 class="text-xl font-bold mb-6">Admin Panel</h1>

      <nav class="space-y-2">
        <RouterLink to="/admin" class="block hover:bg-gray-800 p-2 rounded">
          Dashboard
        </RouterLink>

        <RouterLink
          to="/admin/events"
          class="block hover:bg-gray-800 p-2 rounded"
        >
          Events
        </RouterLink>
      </nav>
    </aside>

    <!-- MAIN -->
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>
