<script setup>
import { ref, onMounted } from "vue";
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../../services/admin-event.service.js";
import ConfirmModal from "../../components/admin/ConfirmModal.vue";
import { getFileUrl } from "../../utils/files.js";

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
const deleting = ref(false);
const showDeleteModal = ref(false);
const eventToDelete = ref(null);
const editingEventId = ref(null);
const isSubmitting = ref(false);
const formError = ref("");
const formSuccess = ref("");

async function load() {
  const data = await getEvents();;
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
  isSubmitting.value = true;
  formError.value = "";
  formSuccess.value = "";
  try {
    Object.entries(form.value).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        formData.append(key, value);
      }
    });

    if (file.value) {
      formData.append("image", file.value);
    }

    if (editingEventId.value) {
      await updateEvent(editingEventId.value, formData);
    } else {
      await createEvent(formData);
    }

    await load();

    formSuccess.value = editingEventId.value
      ? "Event updated successfully."
      : "Event created successfully.";  

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
    editingEventId.value = null;

  } catch (error) {
    console.error(error);

    formError.value =
      error.response?.data?.error?.message ??
      "Unexpected error";
  } finally {
    isSubmitting.value = false;
  }
}

function openDeleteModal(event) {
  eventToDelete.value = event;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!eventToDelete.value) return;

  try {
    await handleDelete(eventToDelete.value.id);

    await load();

    showDeleteModal.value = false;
    eventToDelete.value = null;
  } catch (error) {
    console.error(error);
  }
}

async function handleDelete(id) {
  await deleteEvent(id);
  await load();
}

function editEvent(event) {
  editingEventId.value = event.id;

  form.value = {
    title: event.title ?? "",
    description: event.description ?? "",
    location: event.location ?? "",
    eventMode: event.eventMode ?? "ONSITE",

    startsAt: event.startsAt
      ? event.startsAt.slice(0, 16)
      : "",

    endsAt: event.endsAt
      ? event.endsAt.slice(0, 16)
      : "",
  };

  preview.value = event.imageUrl
    ? getFileUrl(event.imageUrl)
    : null;
}

onMounted(load);
</script>

<ConfirmModal
  :open="showDeleteModal"
  :loading="deleting"
  title="Delete Event"
  :message="`Are you sure you want to delete '${eventToDelete?.title ?? ''}'? This action cannot be undone.`"
  @cancel="showDeleteModal = false"
  @confirm="confirmDelete"
/>

<template>
  <div
    v-if="formSuccess"
    class="mb-4 p-3 rounded-lg bg-green-50 text-green-700"
  >
    {{ formSuccess }}
  </div>

  <div
    v-if="formError"
    class="mb-4 p-3 rounded-lg bg-red-50 text-red-700"
  >
    {{ formError }}
  </div>
  <div class="max-w-10xl mx-auto p-6">
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
          :disabled="isSubmitting"
          class="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          {{ isSubmitting
          ? "Saving..."
          : editingEventId
          ? "Update Event"
          : "Publish Event" }}
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
      
      <div class="mt-10">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold">Existing Events</h2>
            <p class="text-sm text-gray-500">
              Manage published events
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="text-left px-4 py-3">Image</th>
                <th class="text-left px-4 py-3">Title</th>
                <th class="text-left px-4 py-3">Mode</th>
                <th class="text-left px-4 py-3">Location</th>
                <th class="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="event in events"
                :key="event.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="px-4 py-3">
                  <img
                    v-if="event.imageUrl"
                    :src="getFileUrl(event.imageUrl)"
                    class="w-16 h-16 rounded object-cover"
                  />

                  <div
                    v-else
                    class="w-16 h-16 rounded bg-gray-100"
                  />
                </td>

                <td class="px-4 py-3 font-medium">
                  {{ event.title }}
                </td>

                <td class="px-4 py-3">
                  {{ event.eventMode }}
                </td>

                <td class="px-4 py-3">
                  {{ event.location || "-" }}
                </td>

                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      @click="editEvent(event)"
                      class="px-3 py-1 rounded border"
                    >
                      Edit
                    </button>

                    <button
                      @click="openDeleteModal(event)"
                      class="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="events.length === 0">
                <td
                  colspan="5"
                  class="text-center py-8 text-gray-500"
                >
                  No events found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-2">
        Delete event
      </h3>

      <p class="text-gray-600 mb-6">
        Are you sure you want to delete
        <strong>{{ eventToDelete?.title }}</strong>?
        This action can be reversed only from the database.
      </p>

      <div class="flex justify-end gap-3">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete Event
        </button>
      </div>
    </div>
  </div>
</template>
