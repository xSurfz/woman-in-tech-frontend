<script setup>
import { reactive } from "vue";

const emit = defineEmits(["submit"]);

const form = reactive({
  title: "",
  description: "",
  imageUrl: "",
  location: "",
  eventMode: "ONLINE",
  startsAt: "",
  endsAt: "",
  externalUrl: "",
  isFeatured: false,
});

function submit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.title" placeholder="Title" />

    <textarea v-model="form.description" placeholder="Description" />

    <input v-model="form.imageUrl" placeholder="Image URL" />

    <button>Save</button>
  </form>
</template>
