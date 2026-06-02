<template>
  <aside>
    <router-link to="/admin"> Dashboard </router-link>

    <RouterLink
      to="/admin/events"
      class="block p-2 rounded"
      active-class="bg-gray-800"
    >
      Events
    </RouterLink>
    <router-link to="/admin/programs"> Programs </router-link>

    <router-link to="/admin/resources"> Resources </router-link>

    <router-link to="/admin/testimonials"> Testimonials </router-link>

    <router-link to="/admin/interests"> Interests </router-link>
  </aside>
</template>
