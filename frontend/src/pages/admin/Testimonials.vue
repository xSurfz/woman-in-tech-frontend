<script setup>
import { ref, onMounted } from "vue";

import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../services/admin-testimonial.service.js";

const testimonials = ref([]);

const form = ref({
    fullName: "",
    company: "",
    role: "",
    content: "",
    sortOrder: 0,
});

const file = ref(null);
const preview = ref(null);

const editingTestimonialId = ref(null);

const formError = ref("");
const formSuccess = ref("");

const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const testimonialToDelete = ref(null);

async function submit() {
  const formData = new FormData();

  isSubmitting.value = true;

  try {
    Object.entries(form.value).forEach(
      ([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
        ) {
          formData.append(key, value);
        }
      }
    );

    if (file.value) {
      formData.append("image", file.value);
    }

    if (editingTestimonialId.value) {
      await updateTestimonial(
        editingTestimonialId.value,
        formData,
      );

      formSuccess.value =
        "Testimonial updated successfully.";
    } else {
      await createTestimonial(formData);

      formSuccess.value =
        "Testimonial created successfully.";
    }

    await load();

    form.value = {
      fullName: "",
      company: "",
      role: "",
      content: "",
      sortOrder: 0,
    };

    file.value = null;
    preview.value = null;
    editingTestimonialId.value = null;

    formError.value = "";
  } catch (error) {
    console.error(error.response?.data);

    formError.value =
      error.response?.data?.error?.message ??
      "Unexpected error";
  } finally {
    isSubmitting.value = false;
  }
}

function getFileUrl(path) {
  if (!path) return "";

  return `http://localhost:3000${path}`;
}

async function load() {
  testimonials.value =
    await getTestimonials();
}

function handleFileChange(event) {
  const selectedFile =
    event.target.files?.[0];

  if (!selectedFile) return;

  file.value = selectedFile;

  preview.value =
    URL.createObjectURL(selectedFile);
}

function startEdit(testimonial) {
  editingTestimonialId.value =
    testimonial.id;

  form.value = {
    fullName: testimonial.fullName,
    company: testimonial.company ?? "",
    role: testimonial.role,
    content: testimonial.content,
    sortOrder: testimonial.sortOrder,
  };

  preview.value = testimonial.imageUrl
    ? getFileUrl(testimonial.imageUrl)
    : null;

  formError.value = "";
  formSuccess.value = "";
}

function openDeleteModal(testimonial) {
  testimonialToDelete.value = testimonial;

  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!testimonialToDelete.value) return;

  try {
    await handleDelete(
      testimonialToDelete.value.id,
    );

    await load();

    formSuccess.value =
      "Testimonial deleted successfully.";

  } catch (error) {
    console.error(error.response?.data);
    formError.value =
      error.response?.data?.error?.message ??
      "Unexpected error";
  }

  showDeleteModal.value = false;

  testimonialToDelete.value = null;
}

async function handleDelete(id) {
  await deleteTestimonial(id);

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
      Testimonials
    </h1>
    <div class="bg-white rounded-xl p-6 shadow">

        <h2 class="text-xl font-semibold mb-4">
        {{
            editingTestimonialId
            ? "Edit Testimonial"
            : "Create Testimonial"
        }}
        </h2>

        <form 
            class="space-y-4"
            @submit.prevent="submit"
        >

        <input
            v-model="form.fullName"
            type="text"
            placeholder="Full Name"
            class="w-full border rounded-lg p-3"
        />

        <input
            v-model="form.company"
            type="text"
            placeholder="Company"
            class="w-full border rounded-lg p-3"
        />

        <input
            v-model="form.role"
            type="text"
            placeholder="Role"
            class="w-full border rounded-lg p-3"
        />

        <textarea
            v-model="form.content"
            placeholder="Content"
            rows="4"
            class="w-full border rounded-lg p-3"
        />

        <input
            v-model.number="form.sortOrder"
            type="number"
            placeholder="Sort Order"
            class="w-full border rounded-lg p-3"
        />

        <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
        />
        
        <div v-if="preview" class="mt-4">
            <img
                :src="preview"
                alt="Preview"
                class="h-32 rounded-lg object-cover"
            />
        </div>
        <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                {{
                    editingTestimonialId
                    ? "Update Testimonial"
                    : "Create Testimonial"
                }}
        </button>
    </form>
    </div>
    <div class="bg-white rounded-xl p-6 shadow">

        <h2 class="text-xl font-semibold mb-4">
        Testimonials
        </h2>

        <table class="w-full">

        <thead>
            <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Role</th>
            <th>Company</th>
            </tr>
        </thead>

        <tbody>

            <tr
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            >
            <td>
            <img
                v-if="testimonial.imageUrl"
                :src="getFileUrl(testimonial.imageUrl)"
                alt="Testimonial"
                class="w-12 h-12 rounded-full object-cover"
            />
            </td>
            <td>
                {{ testimonial.fullName }}
            </td>

            <td>
                {{ testimonial.role }}
            </td>

            <td>
                {{ testimonial.company }}
            </td>
            <td class="p-4">
                <div class="flex justify-end gap-2">
                <button
                    @click="startEdit(testimonial)"
                    class="px-3 py-2 rounded-lg bg-blue-600 text-white"
                >
                    Edit
                </button>

                <button
                    @click="openDeleteModal(testimonial)"
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
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
    <div class="bg-white p-6 rounded-xl">

        <h3 class="text-lg font-semibold mb-4">
        Delete testimonial?
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