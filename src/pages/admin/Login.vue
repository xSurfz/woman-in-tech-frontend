<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { login } from "../../services/auth.service";
const router = useRouter();

const email = ref("");
const password = ref("");

async function submit() {
  await login(email.value, password.value);

  router.push("/admin");
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="submit" class="bg-white p-6 rounded shadow w-80">
      <h1 class="text-xl font-bold mb-4">Admin Login</h1>

      <input
        v-model="email"
        placeholder="Email"
        class="w-full border p-2 mb-3 rounded"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border p-2 mb-4 rounded"
      />

      <button class="w-full bg-black text-white p-2 rounded">Login</button>
    </form>
  </div>
</template>
