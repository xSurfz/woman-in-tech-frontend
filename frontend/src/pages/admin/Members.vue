<script setup>
import { ref, onMounted } from "vue";

import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../services/admin-member.service.js";

import {
  getInterests,
} from "../../services/admin-interest.service.js";

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
  const formData = new FormData();

  isSubmitting.value = true;

  formError.value = "";
  formSuccess.value = "";

  try {
    Object.entries(form.value).forEach(
      ([key, value]) => {

        if (key === "interests") {
          value.forEach((interestId) => {
            formData.append(
              "interests",
              interestId,
            );
          });

          return;
        }

        if (
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
        ) {
          formData.append(
            key,
            value,
          );
        }
      },
    );

    if (file.value) {
      formData.append(
        "image",
        file.value,
      );
    }

    if (editingMemberId.value) {
      await updateMember(
        editingMemberId.value,
        formData,
      );
    } else {
      await createMember(
        formData,
      );
    }

    await load();

    formSuccess.value =
      editingMemberId.value
        ? "Member updated successfully."
        : "Member created successfully.";

    resetForm();

  } catch (error) {
    console.error(error.response?.data);

    formError.value =
      error.response?.data?.error?.message ??
      "Unexpected error";
  } finally {
    isSubmitting.value = false;
  }
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

    interests: member.interests.map(
      (interest) => interest.id
    ),
  };

  preview.value = member.imageUrl;
}

function confirmDelete(member) {
  memberToDelete.value =
    member;

  showDeleteModal.value =
    true;
}

async function handleDelete() {

if (!memberToDelete.value)
  return;

await deleteMember(
  memberToDelete.value.id,
);

await load();

showDeleteModal.value =
  false;
}

function getFileUrl(path) {
  if (!path) return "";

  return `http://localhost:3000${path}`;
}

async function load() {
  members.value =
    await getMembers();

  interests.value =
    await getInterests();
}

function handleFileChange(event) {
  const selected =
    event.target.files?.[0];

  if (!selected) return;

  file.value = selected;

  preview.value =
    URL.createObjectURL(selected);
}

onMounted(load);
</script>
<template>
    <div class="bg-white rounded-xl p-6 shadow">
        <h2 class="text-xl font-semibold mb-4">
        Member
        </h2>
        <form
        class="space-y-4"
        @submit.prevent="submit"
        >
            <input
                v-model="form.fullName"
                placeholder="Full name"
                class="w-full border p-3 rounded"
            />
            <input
                v-model="form.role"
                placeholder="Role"
                class="w-full border p-3 rounded"
            />
            <select
                v-model="form.category"
                class="w-full border p-3 rounded"
            >
            <option value="LEADER">
                Leadership
            </option>
            <option value="MEMBER">
                Active Member
            </option>
            </select>
            <div>
                <label class="font-medium">
                    Interests
                </label>
                <div
                    v-if="interests.length"
                    class="grid grid-cols-2 gap-2 mt-2"
                >
                    <label
                    v-for="interest in interests"
                    :key="interest.id"
                    class="flex items-center gap-2"
                    >
                    <input
                        type="checkbox"
                        :value="interest.id"
                        v-model="form.interests"
                    />

                    {{ interest.name }}
                    </label>
                </div>
                <p
                    v-else
                    class="mt-2 text-sm text-gray-500"
                >
                    No interests have been created yet.
                    Please create interests before adding members.
                </p>
                </div>
            <textarea
                v-model="form.biography"
                placeholder="Biography"
                rows="4"
                class="w-full border p-3 rounded"
            />
            <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
            />
            <img
                v-if="preview"
                :src="preview"
                class="w-full h-64 object-cover rounded-xl mb-4"
            />
            <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded"
                >
                {{
                    editingMemberId
                    ? "Update Member"
                    : "Create Member"
                }}
            </button>
        </form>
    </div>
    <div class="mt-10 bg-white rounded-2xl shadow-sm border">
        <div class="p-5 border-b">
            <h2 class="font-semibold text-lg">
            Members List
            </h2>
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
                    <tr
                        v-for="member in members"
                        :key="member.id"
                        class="border-t"
                    >
                        <td class="p-4">
                            <img
                                v-if="member.imageUrl"
                                :src="getFileUrl(member.imageUrl)"
                                class="w-16 h-16 rounded-lg object-cover"
                            />
                        </td>
                        <td class="p-4 font-medium">
                            {{ member.fullName }}
                        </td>

                        <td class="p-4">
                            {{ member.role }}
                        </td>

                        <td class="p-4">
                            {{
                                member.category === "LEADER"
                                ? "Leadership"
                                : "Member"
                            }}
                        </td>
                        <td class="p-4">
                            {{ member.interests
                                .map(i => i.name)
                                .join(", ")
                            }}
                        </td>
                        <td class="p-4">
                            <div class="flex justify-end gap-2">
                                <button
                                class="px-3 py-2 rounded-lg bg-blue-600 text-white"
                                @click="editMember(member)"
                                >
                                    Edit
                                </button>

                                <button
                                @click="confirmDelete(member)"
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
        <div
            class="bg-white p-6 rounded-xl w-full max-w-md"
        >
            <h3
            class="text-lg font-semibold mb-4"
            >
            Delete member
            </h3>

            <p>
            Are you sure you want to delete
            <strong>
                {{ memberToDelete?.fullName }}
            </strong>
            ?
            </p>

            <div
            class="flex justify-end gap-2 mt-6"
            >
            <button
                type="button"
                class="px-4 py-2 border rounded"
                @click="showDeleteModal = false"
            >
                Cancel
            </button>

            <button
                type="button"
                class="px-4 py-2 bg-red-600 text-white rounded"
                @click="handleDelete"
            >
                Delete
            </button>
            </div>
        </div>
    </div>
</template>