<script setup>
import { ref, onMounted } from "vue";

import {
  getInterests,
  createInterest,
  updateInterest,
  deleteInterest,
} from "../../services/admin-interest.service.js";

const interests = ref([]);

const form = ref({
  name: "",
  description: "",
});

const editingInterestId = ref(null);

const formError = ref("");
const formSuccess = ref("");

const isSubmitting = ref(false);

const showDeleteModal = ref(false);
const interestToDelete = ref(null);

async function load() {
  interests.value =
    await getInterests();
}

async function submit() {
  isSubmitting.value = true;

  try {
    if (editingInterestId.value) {
      await updateInterest(
        editingInterestId.value,
        form.value,
      );

      formSuccess.value =
        "Interest updated successfully.";
    } else {
      await createInterest(form.value);

      formSuccess.value =
        "Interest created successfully.";
    }

    await load();

    form.value = {
      name: "",
      description: "",
    };

    editingInterestId.value = null;

    formError.value = "";
  } catch (error) {
    console.error(error);

    formError.value =
      error.response?.data?.error?.message ??
      "Unexpected error";
  } finally {
    isSubmitting.value = false;
  }
}

function startEdit(interest) {
  editingInterestId.value =
    interest.id;

  form.value = {
    name: interest.name,
    description:
      interest.description ?? "",
  };

  formError.value = "";
  formSuccess.value = "";
}

function openDeleteModal(interest) {
  interestToDelete.value = interest;

  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!interestToDelete.value) return;

  try {
    await handleDelete(
      interestToDelete.value.id,
    );

    await load();

    formSuccess.value =
      "Interest deleted successfully.";
  } catch (error) {
    formError.value =
      error.response?.data?.error?.message ??
      "Unexpected error";
  }

  showDeleteModal.value = false;

  interestToDelete.value = null;
}

async function handleDelete(id) {
  await deleteInterest(id);

  await load();
}

onMounted(load);
</script>
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
    <div class="space-y-6">

        <h1 class="text-3xl font-bold">
        Interests
        </h1>

        <div class="bg-white rounded-xl p-6 shadow">

        <form
            class="space-y-4"
            @submit.prevent="submit"
        >

            <input
            v-model="form.name"
            type="text"
            placeholder="Name"
            class="w-full border rounded-lg p-3"
            />

            <textarea
            v-model="form.description"
            placeholder="Description"
            rows="4"
            class="w-full border rounded-lg p-3"
            />

            <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
            {{
                editingInterestId
                ? "Update Interest"
                : "Create Interest"
            }}
            </button>

        </form>

        </div>
        <div class="bg-white rounded-xl p-6 shadow">

            <h2 class="text-xl font-semibold mb-4">
            Interests
            </h2>

            <table class="w-full">

            <thead>
                <tr>
                <th class="text-left py-2">
                    Name
                </th>

                <th class="text-left py-2">
                    Description
                </th>

                <th class="text-left py-2">
                    Actions
                </th>
                </tr>
            </thead>

            <tbody>

                <tr
                v-for="interest in interests"
                :key="interest.id"
                >
                <td class="py-2">
                    {{ interest.name }}
                </td>

                <td class="py-2">
                    {{ interest.description }}
                </td>

                <td class="py-2 space-x-2">

                    <button
                    @click="startEdit(interest)"
                    class="px-3 py-2 rounded-lg bg-blue-600 text-white"
                    >
                    Edit
                    </button>

                    <button
                    @click="openDeleteModal(interest)"
                    class="px-3 py-2 rounded-lg bg-red-600 text-white"
                    >
                    Delete
                    </button>

                </td>
                </tr>

            </tbody>

            </table>

        </div>
    </div>
    <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
        <div class="bg-white p-6 rounded-xl">

            <h3 class="text-lg font-semibold mb-4">
            Delete interest?
            </h3>

            <div class="flex gap-2">

            <button
                @click="confirmDelete"
                class="px-4 py-2 bg-red-600 text-white rounded"
            >
                Delete
            </button>

            <button
                @click="showDeleteModal = false"
                class="px-4 py-2 border rounded"
            >
                Cancel
            </button>

            </div>

        </div>
    </div>
</template>

