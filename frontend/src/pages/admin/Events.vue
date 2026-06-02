<script setup>
import { ref, onMounted } from "vue";
import {
  getEvents,
  createEvent,
  deleteEvent,
} from "../../services/admin-event.service.js";

const events = ref([]);

const form = ref({
  title: "",
  description: "",
  location: "",
  eventMode: "ONSITE",
  startsAt: "",
  endsAt: "",
});

const file = ref(null);
const preview = ref(null);

async function load() {
  const data = await getEvents();
  events.value = [...data.upcoming, ...data.past];
}

function handleFile(e) {
  const f = e.target.files[0];
  if (f) {
    file.value = f;
    preview.value = URL.createObjectURL(f);
  }
}

async function submit() {
  const formData = new FormData();

  // Recorremos el formulario pero filtramos valores vacíos
  Object.entries(form.value).forEach(([key, value]) => {
    // Si el valor es un string, le quitamos espacios.
    // Si queda vacío (""), no lo metemos al FormData para que el backend sepa que es NULL.
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      formData.append(key, value);
    }
  });

  if (file.value) {
    formData.append("image", file.value);
  }

  await createEvent(formData);
  await load();

  // reset UX
  form.value = {
    title: "",
    description: "",
    location: "",
    eventMode: "ONSITE",
    startsAt: "",
    endsAt: "",
  };

  file.value = null;
  preview.value = null;
}

async function handleDelete(id) {
  await deleteEvent(id);
  await load();
}

onMounted(load);
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-1">Create Event</h1>
    <p class="text-gray-500 mb-6">Fill the details to publish a new event</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- FORM -->
      <div class="space-y-4 bg-white p-5 rounded-xl shadow-sm">
        <div>
          <label class="text-sm font-medium">Title</label>
          <input v-model="form.title" class="input" />
        </div>

        <div>
          <label class="text-sm font-medium">Description</label>
          <textarea v-model="form.description" class="input h-28" />
        </div>

        <div>
          <label class="text-sm font-medium">Location</label>
          <input v-model="form.location" class="input" />
        </div>

        <div>
          <label class="text-sm font-medium">Mode</label>
          <select v-model="form.eventMode" class="input">
            <option value="ONSITE">On-site</option>
            <option value="ONLINE">Online</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm">Starts</label>
            <input
              type="datetime-local"
              v-model="form.startsAt"
              class="input"
            />
          </div>

          <div>
            <label class="text-sm">Ends</label>
            <input type="datetime-local" v-model="form.endsAt" class="input" />
          </div>
        </div>

        <div>
          <label class="text-sm font-medium">Image</label>
          <input type="file" @change="handleFile" class="mt-1" />
        </div>

        <button
          @click="submit"
          class="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          Publish Event
        </button>
      </div>

      <!-- PREVIEW -->
      <div class="bg-gray-50 p-5 rounded-xl">
        <h3 class="font-semibold mb-3">Preview</h3>

        <img
          v-if="preview"
          :src="preview"
          class="rounded-lg mb-4 w-full h-48 object-cover"
        />

        <h2 class="text-xl font-bold">
          {{ form.title || "Event title" }}
        </h2>

        <p class="text-gray-600 mt-2">
          {{ form.description || "Event description preview..." }}
        </p>

        <div class="mt-4 text-sm text-gray-500 space-y-1">
          <p>{{ form.location || "Location" }}</p>
          <p>{{ form.eventMode }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
