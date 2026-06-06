<script setup>
import { ref, onMounted } from "vue";

import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../services/admin-member.service.js";

import { getInterests } from "../../services/admin-interest.service.js";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const members = ref([]);
const interests = ref([]);
const file = ref(null);
const preview = ref(null);

const editingMemberId = ref(null);
const isSubmitting = ref(false);

const formSuccess = ref("");
const formError = ref("");

const showDeleteModal = ref(false);
const memberToDelete = ref(null);

const form = ref({
  fullName: "",
  role: "",
  biography: "",
  email: "",
  githubUrl: "",
  linkedinUrl: "",
  category: "MEMBER",
  sortOrder: 0,
  interests: [],
});

async function submit() {
  isSubmitting.value = true;
  formError.value = "";
  formSuccess.value = "";

  try {
    if (editingMemberId.value) {
      await update();
    } else {
      await create();
    }
  } catch (error) {
    console.error(error.response?.data);
    formError.value =
      error.response?.data?.error?.message ??
      error.response?.data?.message ??
      "Unexpected error";
  } finally {
    isSubmitting.value = false;
  }
}

async function create() {
  const formData = buildFormData();

  await createMember(formData);

  formSuccess.value = "Member created successfully.";
  await afterSubmit();
}

async function update() {
  const formData = buildFormData();

  await updateMember(editingMemberId.value, formData);

  formSuccess.value = "Member updated successfully.";
  await afterSubmit();
}

function buildFormData() {
  const formData = new FormData();

  Object.entries(form.value).forEach(([key, value]) => {
    if (key === "interests") {
      if (Array.isArray(value)) {
        value.forEach((interestId) => {
          formData.append("interests", interestId);
        });
      }
      return;
    }

    if (value !== null && value !== undefined && String(value).trim() !== "") {
      formData.append(key, value);
    }
  });

  if (file.value) {
    formData.append("image", file.value);
  }

  return formData;
}

async function afterSubmit() {
  await load();
  resetForm();
}

function resetForm() {
  form.value = {
    fullName: "",
    role: "",
    biography: "",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    category: "MEMBER",
    sortOrder: 0,
    interests: [],
  };

  editingMemberId.value = null;
  file.value = null;
  preview.value = null;
}

function editMember(member) {
  editingMemberId.value = member.id;

  form.value = {
    fullName: member.fullName,
    role: member.role,
    biography: member.biography ?? "",
    email: member.email ?? "",
    githubUrl: member.githubUrl ?? "",
    linkedinUrl: member.linkedinUrl ?? "",
    category: member.category,
    sortOrder: member.sortOrder ?? 0,
    interests: member.interests.map((interest) => interest.id),
  };

  preview.value = member.imageUrl ? getFileUrl(member.imageUrl) : null;
}

function confirmDelete(member) {
  memberToDelete.value = member;
  showDeleteModal.value = true;
}

async function handleDelete() {
  if (!memberToDelete.value) return;

  try {
    await deleteMember(memberToDelete.value.id);
    await load();
  } catch (error) {
    console.error(error.response?.data);
    formError.value =
      error.response?.data?.error?.message ?? "Unexpected error";
  } finally {
    showDeleteModal.value = false;
    memberToDelete.value = null;
  }
}

function getFileUrl(path) {
  if (!path) return "";
  return `http://localhost:3000${path}`;
}

async function load() {
  members.value = await getMembers();
  interests.value = await getInterests();
}

function handleFileChange(event) {
  const selected = event.target.files?.[0];
  if (!selected) return;

  file.value = selected;
  preview.value = URL.createObjectURL(selected);
}

onMounted(load);
</script>

<template>
  <div
    v-if="formSuccess"
    class="mb-4 p-3 rounded-lg bg-green-50 text-green-700 max-w-7xl mx-auto mt-6"
  >
    {{ formSuccess }}
  </div>

  <div
    v-if="formError"
    class="mb-4 p-3 rounded-lg bg-red-50 text-red-700 max-w-7xl mx-auto mt-6"
  >
    {{ formError }}
  </div>

  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-2">Members</h1>
    <p class="text-gray-500 mb-6">
      Manage community leaders and active members
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl p-6 shadow border space-y-4">
        <h2 class="text-xl font-semibold mb-4">Member Information</h2>

        <div>
          <label class="block text-sm font-medium mb-1">Full Name</label>
          <input
            v-model="form.fullName"
            placeholder="Full name"
            class="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Role</label>
          <input
            v-model="form.role"
            placeholder="Role"
            class="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select v-model="form.category" class="w-full border p-3 rounded">
            <option value="LEADER">Leadership</option>
            <option value="MEMBER">Active Member</option>
          </select>
        </div>

        <div>
          <label class="font-medium text-sm block mb-1">Interests</label>
          <div v-if="interests.length" class="grid grid-cols-2 gap-2 mt-2">
            <label
              v-for="interest in interests"
              :key="interest.id"
              class="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                :value="interest.id"
                v-model="form.interests"
              />
              {{ interest.name }}
            </label>
          </div>
          <p v-else class="mt-2 text-sm text-gray-500">
            No interests have been created yet. Please create interests before
            adding members.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Biography</label>
          <textarea
            v-model="form.biography"
            placeholder="Biography"
            rows="4"
            class="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Image</label>
          <input type="file" accept="image/*" @change="handleFileChange" />
        </div>

        <button
          type="button"
          @click="submit"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white rounded-lg py-3 disabled:opacity-50 font-medium"
        >
          {{ editingMemberId ? "Update Member" : "Create Member" }}
        </button>
      </div>

      <div class="bg-white rounded-xl p-6 shadow border">
        <h2 class="font-semibold text-lg mb-4">Preview</h2>
        <img
          v-if="preview"
          :src="preview"
          class="w-full h-64 object-cover rounded-xl mb-4"
        />
        <div
          v-else
          class="w-full h-64 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400"
        >
          No image selected
        </div>
        <h3 class="text-xl font-bold">{{ form.fullName || "Member name" }}</h3>
        <p class="text-blue-600 font-medium mt-1">
          {{ form.role || "Role / Position" }}
        </p>
        <p class="text-gray-600 mt-3 text-sm leading-relaxed">
          {{ form.biography || "Biography..." }}
        </p>
      </div>
    </div>

    <div class="mt-10 bg-white rounded-2xl shadow-sm border">
      <div class="p-5 border-b">
        <h2 class="font-semibold text-lg">Members List</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left p-4">Image</th>
              <th class="text-left p-4">Name</th>
              <th class="text-left p-4">Role</th>
              <th class="text-left p-4">Category</th>
              <th class="text-left p-4">Interests</th>
              <th class="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id" class="border-t">
              <td class="p-4">
                <img
                  v-if="member.imageUrl"
                  :src="getFileUrl(member.imageUrl)"
                  class="w-16 h-16 rounded-lg object-cover"
                />
              </td>
              <td class="p-4 font-medium">{{ member.fullName }}</td>
              <td class="p-4">{{ member.role }}</td>
              <td class="p-4">
                {{ member.category === "LEADER" ? "Leadership" : "Member" }}
              </td>
              <td class="p-4">
                {{ member.interests.map((i) => i.name).join(", ") }}
              </td>
              <td class="p-4">
                <div class="flex justify-end gap-2">
                  <button
                    class="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
                    @click="editMember(member)"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(member)"
                    class="px-3 py-2 rounded-lg bg-red-600 text-white text-sm"
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

  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-xl w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">Delete member</h3>
      <p class="text-gray-600">
        Are you sure you want to delete
        <strong>{{ memberToDelete?.fullName }}</strong
        >?
      </p>
      <div class="flex justify-end gap-2 mt-6">
        <button
          type="button"
          class="px-4 py-2 border rounded-lg"
          @click="showDeleteModal = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-red-600 text-white rounded-lg"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
