<script setup>
import { ref, onMounted } from "vue";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../services/admin-member.service.js";
import { getInterests } from "../../services/admin-interest.service.js";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
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

// Control reactivo para validar de forma nativa al perder el foco
const touched = ref({
  fullName: false,
  role: false,
  biography: false,
});

function isFormValid() {
  return (
    form.value.fullName.trim() &&
    form.value.role.trim() &&
    form.value.biography.trim()
  );
}

async function load() {
  try {
    members.value = await getMembers();
    interests.value = await getInterests();
  } catch (error) {
    console.error("Error al cargar la información:", error);
  }
}

async function submit() {
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true));

  if (!isFormValid()) {
    formError.value =
      "Por favor, completa los campos requeridos marcados con (*).";
    return;
  }

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
      "Ocurrió un error inesperado al procesar el miembro.";
  } finally {
    isSubmitting.value = false;
  }
}

async function create() {
  const formData = buildFormData();
  await createMember(formData);
  formSuccess.value = "Miembro creado y registrado correctamente.";
  await afterSubmit();
}

async function update() {
  const formData = buildFormData();
  await updateMember(editingMemberId.value, formData);
  formSuccess.value = "Información del miembro actualizada correctamente.";
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

  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  editingMemberId.value = null;
  file.value = null;
  preview.value = null;
}

function editMember(member) {
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  formError.value = "";
  formSuccess.value = "";

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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  resetForm();
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
    formSuccess.value =
      "Miembro removido de la organización de forma permanente.";
  } catch (error) {
    console.error(error.response?.data);
    formError.value =
      error.response?.data?.error?.message ??
      "Error inesperado al intentar eliminar al miembro.";
  } finally {
    showDeleteModal.value = false;
    memberToDelete.value = null;
  }
}

function getFileUrl(path) {
  if (!path) return "";
  return `http://localhost:3000${path}`;
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
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
    <header
      class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-5"
    >
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {{
            editingMemberId
              ? "Modificar Perfil de Miembro"
              : "Gestión de Miembros"
          }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Administra los perfiles del equipo de liderazgo, mentores y miembros
          activos de la comunidad.
        </p>
      </div>
    </header>

    <Transition name="fade">
      <div
        v-if="formSuccess"
        class="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm"
      >
        <svg
          class="w-5 h-5 text-emerald-600 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-sm font-medium">{{ formSuccess }}</span>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="formError"
        class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 shadow-sm"
      >
        <svg
          class="w-5 h-5 text-rose-600 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-sm font-medium">{{ formError }}</span>
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
      <div
        class="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
      >
        <h2
          class="font-bold text-lg text-gray-900 border-b pb-3 border-gray-100"
        >
          Información del Miembro
        </h2>

        <form @submit.prevent="submit" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Nombre Completo <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.fullName"
                @blur="touched.fullName = true"
                type="text"
                placeholder="Ej. Amanda Silva"
                class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
                :class="[
                  touched.fullName && !form.fullName.trim()
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
                ]"
              />
              <p
                v-if="touched.fullName && !form.fullName.trim()"
                class="text-xs text-rose-600 mt-1 font-medium"
              >
                El nombre completo es obligatorio.
              </p>
            </div>

            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Rol o Posición <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.role"
                @blur="touched.role = true"
                type="text"
                placeholder="Ej. DevOps Mentor"
                class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
                :class="[
                  touched.role && !form.role.trim()
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
                ]"
              />
              <p
                v-if="touched.role && !form.role.trim()"
                class="text-xs text-rose-600 mt-1 font-medium"
              >
                El rol o posición dentro del equipo es obligatorio.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Categoría Organizacional
              </label>
              <select
                v-model="form.category"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              >
                <option value="LEADER">Liderazgo / Directivo</option>
                <option value="MEMBER">Miembro Activo</option>
              </select>
            </div>

            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Orden de Visualización
              </label>
              <input
                v-model.number="form.sortOrder"
                type="number"
                min="0"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Correo Electrónico
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="nombre@ejemplo.com"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                URL de GitHub
              </label>
              <input
                v-model="form.githubUrl"
                type="url"
                placeholder="https://github.com/..."
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                URL de LinkedIn
              </label>
              <input
                v-model="form.linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/..."
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
            >
              Áreas de Interés Asociadas
            </label>
            <div
              v-if="interests.length"
              class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200/60"
            >
              <label
                v-for="interest in interests"
                :key="interest.id"
                class="flex items-center gap-2.5 text-xs text-gray-700 font-medium cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  :value="interest.id"
                  v-model="form.interests"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                {{ interest.name }}
              </label>
            </div>
            <p v-else class="text-xs text-gray-400 italic">
              No existen áreas de interés configuradas en el sistema.
              Regístralas antes de asociarlas a un miembro.
            </p>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Breve Biografía Perfil <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="form.biography"
              @blur="touched.biography = true"
              rows="4"
              placeholder="Escribe una pequeña reseña sobre la experiencia del miembro..."
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 resize-none"
              :class="[
                touched.biography && !form.biography.trim()
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.biography && !form.biography.trim()"
              class="text-xs text-rose-600 mt-1 font-medium"
            >
              La biografía es obligatoria para la visualización pública.
            </p>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Fotografía de Perfil
            </label>
            <div
              class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50/50 transition relative"
            >
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                class="flex items-center justify-center gap-2 text-xs text-gray-600"
              >
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p class="font-medium text-purple-600">
                  Cargar una nueva imagen de perfil
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-100">
            <button
              v-if="editingMemberId"
              @click="cancelEdit"
              type="button"
              class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white font-semibold py-2.5 rounded-xl hover:from-purple-800 hover:to-fuchsia-700 transition disabled:opacity-50 text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span
                v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{
                isSubmitting
                  ? "Procesando..."
                  : editingMemberId
                    ? "Actualizar Miembro"
                    : "Registrar Miembro"
              }}
            </button>
          </div>
        </form>
      </div>

      <div
        class="lg:sticky lg:top-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4"
      >
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">
          Previsualización de Tarjeta
        </h3>

        <div
          class="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm"
        >
          <div class="w-full h-56 bg-gray-100 relative overflow-hidden">
            <img
              v-if="preview"
              :src="preview"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1 bg-gray-50"
            >
              <svg
                class="w-8 h-8 stroke-1 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="text-[11px] font-medium tracking-wide uppercase"
                >Sin fotografía</span
              >
            </div>

            <span
              class="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm"
            >
              {{ form.category === "LEADER" ? "Liderazgo" : "Miembro" }}
            </span>
          </div>

          <div class="p-5 space-y-3">
            <div>
              <h4 class="text-lg font-bold text-gray-900 truncate">
                {{ form.fullName || "Nombre del Miembro" }}
              </h4>
              <p class="text-xs font-semibold text-purple-600 truncate mt-0.5">
                {{ form.role || "Cargo u Oficio" }}
              </p>
            </div>

            <p
              class="text-xs text-gray-500 leading-relaxed line-clamp-3 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 italic"
            >
              {{
                form.biography ||
                "Cuerpo biográfico. Esta sección se completará dinámicamente con los campos redactados en el formulario de la izquierda..."
              }}
            </p>

            <div class="flex gap-2 pt-2 border-t border-gray-100">
              <div
                class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-mono"
              >
                GH
              </div>
              <div
                class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-mono"
              >
                LN
              </div>
              <div
                class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-mono"
              >
                EM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-900">
          Listado General de Miembros
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          Visualiza, modifica prioridades y gestiona el personal indexado.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="bg-gray-50 text-gray-700 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-100"
          >
            <tr>
              <th class="px-6 py-4">Miembro</th>
              <th class="px-6 py-4">Rol / Posición</th>
              <th class="px-6 py-4">Categoría</th>
              <th class="px-6 py-4">Áreas Asociadas</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white text-gray-600">
            <tr
              v-for="member in members"
              :key="member.id"
              class="hover:bg-gray-50/50 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <img
                    v-if="member.imageUrl"
                    :src="getFileUrl(member.imageUrl)"
                    class="w-11 h-11 rounded-xl object-cover ring-2 ring-gray-100"
                  />
                  <div
                    v-else
                    class="w-11 h-11 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm"
                  >
                    {{ member.fullName.charAt(0) }}
                  </div>
                  <div class="font-bold text-gray-900">
                    {{ member.fullName }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                {{ member.role }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-xs">
                <span
                  class="px-2.5 py-1 rounded-full font-semibold"
                  :class="[
                    member.category === 'LEADER'
                      ? 'bg-purple-50 text-purple-700 border border-purple-100'
                      : 'bg-gray-50 text-gray-600 border border-gray-200',
                  ]"
                >
                  {{ member.category === "LEADER" ? "Liderazgo" : "Miembro" }}
                </span>
              </td>

              <td class="px-6 py-4 max-w-xs">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="interest in member.interests"
                    :key="interest.id"
                    class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium"
                  >
                    {{ interest.name }}
                  </span>
                  <span
                    v-if="!member.interests.length"
                    class="text-xs text-gray-400 italic"
                    >Ninguno</span
                  >
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="editMember(member)"
                    class="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button
                    @click="confirmDelete(member)"
                    class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition text-xs font-medium shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="members.length === 0">
              <td colspan="5" class="text-center py-12 text-gray-400">
                <div
                  class="flex flex-col items-center justify-center space-y-2"
                >
                  <svg
                    class="w-8 h-8 stroke-1 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p class="text-xs">
                    No hay miembros registrados dentro de la comunidad
                    actualmente.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
    >
      <div
        class="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-1.5">Remover Miembro</h3>
      <p class="text-sm text-gray-500 mb-6 leading-relaxed">
        ¿Estás seguro de que quieres eliminar la ficha de perfil de
        <strong>{{ memberToDelete?.fullName }}</strong
        >? Toda su información y enlaces asociados serán desvinculados del
        sistema de inmediato.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-xs font-medium"
        >
          Cancelar
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition text-xs font-semibold shadow-md shadow-rose-100"
        >
          Remover Registro
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
