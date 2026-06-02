<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../../services/admin-resource.service.js";

const form = ref({
  title: "",
  description: "",
  url: "",
  type: "COURSE",
  isFeatured: false,
});

const file = ref(null);
const preview = ref(null);
const editingResourceId = ref(null);
const isSubmitting = ref(false);
const resources = ref([]);
const showDeleteModal = ref(false);
const resourceToDelete = ref(null);
const formError = ref("");
const formSuccess = ref("");

async function load() {
  resources.value = await getResources();
}

function getFileUrl(path) {
  if (!path) return "";

  return `http://localhost:3000${path}`;
}

onMounted(load);

function handleFile(event) {
  const selectedFile = event.target.files?.[0];

  if (!selectedFile) return;

  file.value = selectedFile;

  preview.value =
    URL.createObjectURL(selectedFile);
}

function startEdit(resource) {
  editingResourceId.value = resource.id;

  form.value = {
    title: resource.title,
    description: resource.description,
    url: resource.url,
    type: resource.type,
    isFeatured: resource.isFeatured,
  };

  preview.value = resource.imageUrl
    ? getFileUrl(resource.imageUrl)
    : null;
}

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

    if (editingResourceId.value) {
        await updateResource(
            editingResourceId.value,
            formData,
        );
    } else {
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        await createResource(formData);
    }

    await load();

    formSuccess.value = editingResourceId.value
      ? "Resource updated successfully."
      : "Resource created successfully."; 
      
    form.value = {
    title: "",
    description: "",
    url: "",
    type: "COURSE",
    isFeatured: false,
    };
    
    editingResourceId.value = null;
    file.value = null;
    preview.value = null;
    } catch (error) {
        console.error(error.response?.data);
        
        formError.value =
            error.response?.data?.error?.message ??
            "Unexpected error";
    } finally {
    isSubmitting.value = false;
  }
}

function openDeleteModal(resource) {
  resourceToDelete.value = resource;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!resourceToDelete.value) return;

  try {
    await handleDelete(
      resourceToDelete.value.id,
    );

    await load();
  } catch (error) {
    console.error(error);

    formError.value =
      error.response?.data?.error?.message ??
      "Unexpected error";
  } finally {
    showDeleteModal.value = false;
    resourceToDelete.value = null;
  }
}

async function handleDelete(id) {
  await deleteResource(id);

  await load();
}

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
        Resources
        </h1>

        <p class="text-gray-500 mb-6">
        Manage organization resources
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- FORM -->
        <div
            class="bg-white rounded-2xl shadow-sm border p-6"
        >
            <h2 class="font-semibold text-lg mb-4">
            Resource Information
            </h2>

            <div class="space-y-4">

            <div>
                <label class="block text-sm font-medium mb-1">
                Title
                </label>

                <input
                v-model="form.title"
                class="input"
                placeholder="Resource title"
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
                placeholder="Resource description"
                />
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">
                URL
                </label>

                <input
                v-model="form.url"
                class="input"
                placeholder="https://..."
                />
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">
                Type
                </label>

                <select
                v-model="form.type"
                class="input"
                >
                <option value="COURSE">
                    Course
                </option>

                <option value="SCHOLARSHIP">
                    Scholarship
                </option>

                <option value="MATERIAL">
                    Material
                </option>

                <option value="COMMUNITY">
                    Community
                </option>

                <option value="OTHER">
                    Other
                </option>
                </select>
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
                Featured Resource
                </span>
            </div>

            <button
                @click="submit"
                :disabled="isSubmitting"
                class="w-full bg-black text-white rounded-lg py-3"
            >
                {{ editingResourceId ? "Update Resource" : "Save Resource" }}
            </button>

            </div>
        </div>

        <div
            class="bg-white rounded-2xl shadow-sm border p-6"
        >
            <h2 class="font-semibold text-lg mb-4">
            Preview
            </h2>

            <img
            v-if="preview"
            :src="preview"
            class="w-full h-64 object-cover rounded-xl mb-4"
            />

            <h3 class="text-xl font-bold">
            {{ form.title || "Resource title" }}
            </h3>

            <p class="text-gray-600 mt-3">
            {{
                form.description ||
                "Resource description..."
            }}
            </p>

            <span
            class="inline-block mt-4 px-3 py-1 rounded-full bg-gray-100 text-sm"
            >
            {{ form.type }}
            </span>

        </div>

        <div class="mt-10 bg-white rounded-2xl shadow-sm border">
            <div class="p-5 border-b">
                <h2 class="font-semibold text-lg">
                Resources List
                </h2>
            </div>
        
            <div class="overflow-x-auto">
                <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                    <th class="text-left p-4">Image</th>
                    <th class="text-left p-4">Title</th>
                    <th class="text-left p-4">Type</th>
                    <th class="text-left p-4">Featured</th>
                    <th class="text-right p-4">Actions</th>
                    </tr>
                </thead>
        
                <tbody>
                    <tr
                    v-for="resource in resources"
                    :key="resource.id"
                    class="border-t"
                    >
                    <td class="p-4">
                        <img
                        v-if="resource.imageUrl"
                        :src="getFileUrl(resource.imageUrl)"
                        class="w-16 h-16 rounded-lg object-cover"
                        />
                    </td>
        
                    <td class="p-4 font-medium">
                        {{ resource.title }}
                    </td>
        
                    <td class="p-4">
                        <span
                        class="px-2 py-1 rounded-full bg-gray-100 text-sm"
                        >
                        {{ resource.type }}
                        </span>
                    </td>
        
                    <td class="p-4">
                        {{ resource.isFeatured ? "⭐ Yes" : "No" }}
                    </td>
        
                    <td class="p-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button
                                @click="startEdit(resource)"
                                class="px-3 py-2 rounded-lg bg-blue-600 text-white"
                            >
                                Edit
                            </button>
                            <button
                                @click="openDeleteModal(resource)"
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
            Delete Resource
            </h3>

            <p class="text-gray-600 mb-6">
            Are you sure you want to delete
            <strong>
                {{ resourceToDelete?.title }}
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