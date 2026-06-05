<script setup>
import { ref, onMounted } from "vue";

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../../services/admin-program.service.js";

const programs = ref([]);

const form = ref({
  title: "",
  description: "",
  actionText: "",
  actionUrl: "",
  sortOrder: 0,
  isFeatured: false,
});

const file = ref(null);
const preview = ref(null);

const editingProgramId = ref(null);
const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const programToDelete = ref(null);
const formError = ref("");
const formSuccess = ref("");

async function submit() {
  if (editingProgramId.value) {
    await update();
  } else {
    await create();
  }
}

async function create() {
  const formData = buildFormData();

  await createProgram(formData);

  formSuccess.value =
    "Program created successfully.";

  await afterSubmit();
}

async function update() {
  const formData = buildFormData();

  await updateProgram(
    editingProgramId.value,
    formData,
  );

  formSuccess.value =
    "Program updated successfully.";

  await afterSubmit();
}

function buildFormData() {
  const formData = new FormData();

  Object.entries(form.value).forEach(
    ([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        formData.append(key, value);
      }
    },
  );

  if (file.value) {
    formData.append(
      "image",
      file.value,
    );
  }

  return formData;
}

async function afterSubmit() {
  await load();

  form.value = {
    title: "",
    description: "",
    actionText: "",
    actionUrl: "",
    sortOrder: 0,
    isFeatured: false,
  };

  file.value = null;
  preview.value = null;
  editingProgramId.value = null;
}

function getFileUrl(path) {
  if (!path) return "";

  return `http://localhost:3000${path}`;
}

async function load() {
  programs.value = await getPrograms();
}

function openDeleteModal(program) {
  programToDelete.value = program;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!programToDelete.value) return;

  try {
    await handleDelete(programToDelete.value.id);

    await load();
  } catch (error) {
    console.error(error.response?.data);

    formError.value =
      error.response?.data?.error?.message ??
      "Unexpected error";
  } finally {
    showDeleteModal.value = false;
    programToDelete.value = null;
  }
}

async function handleDelete(id) {
  await deleteProgram(id);

  await load();
}

function startEdit(program) {
  editingProgramId.value = program.id;

  form.value = {
    title: program.title,
    description: program.description,
    actionText: program.actionText || "",
    actionUrl: program.actionUrl || "",
    sortOrder: program.sortOrder || 0,
    isFeatured: program.isFeatured,
  };

  preview.value = program.imageUrl
    ? getFileUrl(program.imageUrl)
    : null;
}

function handleFile(event) {
  const selectedFile = event.target.files?.[0];

  if (!selectedFile) return;

  file.value = selectedFile;

  preview.value = URL.createObjectURL(selectedFile);
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
    <div class="max-w-7xl mx-auto p-6">
        <h1 class="text-2xl font-bold mb-2">
            Programs
        </h1>

        <p class="text-gray-500 mb-6">
            Manage organization programs
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- FORM -->
            <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h2 class="font-semibold text-lg mb-4">
                Program Information
            </h2>

            <div class="space-y-4">
                <div>
                <label class="block text-sm font-medium mb-1">
                    Title
                </label>

                <input
                    v-model="form.title"
                    class="input"
                    placeholder="Program title"
                />
                </div>

                <div>
                <label class="block text-sm font-medium mb-1">
                    Description
                </label>

                <textarea
                    v-model="form.description"
                    rows="5"
                    class="input"
                    placeholder="Program description"
                />
                </div>

                <div>
                <label class="block text-sm font-medium mb-1">
                    Action Text
                </label>

                <input
                    v-model="form.actionText"
                    class="input"
                    placeholder="Join now"
                />
                </div>

                <div>
                <label class="block text-sm font-medium mb-1">
                    Action URL
                </label>

                <input
                    v-model="form.actionUrl"
                    class="input"
                    placeholder="https://..."
                />
                </div>

                <div>
                <label class="block text-sm font-medium mb-1">
                    Sort Order
                </label>

                <input
                    v-model="form.sortOrder"
                    type="number"
                    class="input"
                />
                </div>

                <div>
                <label class="block text-sm font-medium mb-1">
                    Image
                </label>

                <input
                    type="file"
                    @change="handleFile"
                />
                </div>

                <div class="flex items-center gap-2">
                <input
                    type="checkbox"
                    v-model="form.isFeatured"
                />

                <span class="text-sm">
                    Featured Program
                </span>
                </div>

                <button
                    @click="submit"
                    :disabled="isSubmitting"
                    class="w-full bg-black text-white rounded-lg py-3 disabled:opacity-50"
                >
                    {{ editingProgramId ? "Update Program" : "Save Program" }}
                </button>
            </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border p-6">
                <h2 class="font-semibold text-lg mb-4">
                    Preview
                </h2>

                <img
                    v-if="preview"
                    :src="preview"
                    class="w-full h-64 object-cover rounded-xl mb-4"
                />

                <h3 class="text-xl font-bold">
                    {{ form.title || "Program title" }}
                </h3>

                <p class="text-gray-600 mt-3">
                    {{ form.description || "Program description..." }}
                </p>

                <button
                    v-if="form.actionText"
                    class="mt-5 px-4 py-2 rounded-lg bg-black text-white"
                >
                    {{ form.actionText }}
                </button>
            </div>
            
            <div class="mt-10 bg-white rounded-2xl shadow-sm border">
                <div class="p-5 border-b">
                    <h2 class="font-semibold text-lg">
                    Programs List
                    </h2>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                            <th class="text-left p-4">Image</th>
                            <th class="text-left p-4">Title</th>
                            <th class="text-left p-4">Featured</th>
                            <th class="text-left p-4">Order</th>
                            <th class="text-right p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="program in programs"
                                :key="program.id"
                                class="border-t"
                            >
                            <td class="p-4">
                                <img
                                    v-if="program.imageUrl"
                                    :src="getFileUrl(program.imageUrl)"
                                    class="w-16 h-16 rounded-lg object-cover"
                                />
                            </td>

                            <td class="p-4 font-medium">
                                {{ program.title }}
                            </td>

                            <td class="p-4">
                                {{ program.isFeatured ? "⭐ Yes" : "No" }}
                            </td>

                            <td class="p-4">
                                {{ program.sortOrder }}
                            </td>

                        <td class="p-4">
                            <div class="flex justify-end gap-2">
                            <button
                                @click="startEdit(program)"
                                class="px-3 py-2 rounded-lg bg-blue-600 text-white"
                            >
                                Edit
                            </button>

                            <button
                                @click="openDeleteModal(program)"
                                class="px-3 py-2 rounded-lg bg-red-600 text-white"
                            >
                                Delete
                            </button>
                            </div>
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
        <div
            class="bg-white rounded-2xl p-6 w-full max-w-md"
        >
            <h3 class="text-lg font-semibold mb-2">
            Delete Program
            </h3>

            <p class="text-gray-600 mb-6">
            Are you sure you want to delete
            <strong>
                {{ programToDelete?.title }}
            </strong>?
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
                class="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
                Delete
            </button>
            </div>
        </div>
    </div>
</template>