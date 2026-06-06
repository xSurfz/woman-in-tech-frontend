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

// Control reactivo para rastrear la interacción con los campos obligatorios
const touched = ref({
  name: false,
  description: false,
});

const editingInterestId = ref(null);
const isSubmitting = ref(false);

const formError = ref("");
const formSuccess = ref("");

const showDeleteModal = ref(false);
const interestToDelete = ref(null);

function isFormValid() {
  return form.value.name.trim() && form.value.description.trim();
}

async function load() {
  try {
    interests.value = await getInterests();
  } catch (error) {
    console.error("Error al cargar los intereses:", error);
  }
}

function startEdit(interest) {
  // Limpiar errores y estados de validación previos
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  formError.value = "";
  formSuccess.value = "";

  editingInterestId.value = interest.id;
  form.value = {
    name: interest.name,
    description: interest.description ?? "",
  };

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  editingInterestId.value = null;
  resetForm();
}

function resetForm() {
  form.value = {
    name: "",
    description: "",
  };
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
}

async function submit() {
  // Forzar visualización de alertas si intentan guardar sin interactuar
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true));

  if (!isFormValid()) {
    formError.value = "Por favor, completa todos los campos obligatorios (*).";
    return;
  }

  isSubmitting.value = true;
  formError.value = "";
  formSuccess.value = "";

  try {
    if (editingInterestId.value) {
      await updateInterest(editingInterestId.value, form.value);
      formSuccess.value = "Interés actualizado correctamente.";
    } else {
      await createInterest(form.value);
      formSuccess.value = "Interés creado y registrado correctamente.";
    }

    await load();
    resetForm();
    editingInterestId.value = null;
  } catch (error) {
    console.error(error);
    formError.value =
      error.response?.data?.error?.message ??
      "Ocurrió un error inesperado al procesar el interés.";
  } finally {
    isSubmitting.value = false;
  }
}

function openDeleteModal(interest) {
  interestToDelete.value = interest;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!interestToDelete.value) return;

  try {
    await handleDelete(interestToDelete.value.id);
    await load();
    formSuccess.value = "Interés eliminado correctamente.";
  } catch (error) {
    console.error(error);
    formError.value =
      error.response?.data?.error?.message ??
      "Error al intentar eliminar el interés.";
  } finally {
    showDeleteModal.value = false;
    interestToDelete.value = null;
  }
}

async function handleDelete(id) {
  await deleteInterest(id);
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
          {{ editingInterestId ? "Modificar Interés" : "Gestión de Intereses" }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Administra las categorías de interés técnico y profesional utilizadas
          en la plataforma.
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
          Información del Interés
        </h2>

        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Nombre de la Categoría <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.name"
              @blur="touched.name = true"
              type="text"
              placeholder="Ej. Desarrollo Frontend"
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
              :class="[
                touched.name && !form.name.trim()
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.name && !form.name.trim()"
              class="text-xs text-rose-600 mt-1 font-medium"
            >
              El nombre es obligatorio.
            </p>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Descripción General <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              @blur="touched.description = true"
              rows="4"
              placeholder="Detalla los alcances, tecnologías involucradas o propósitos de este interés..."
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 resize-none"
              :class="[
                touched.description && !form.description.trim()
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.description && !form.description.trim()"
              class="text-xs text-rose-600 mt-1 font-medium"
            >
              La descripción es obligatoria.
            </p>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-100">
            <button
              v-if="editingInterestId"
              @click="cancelEdit"
              type="button"
              class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white font-semibold py-2.5 rounded-xl hover:from-purple-800 hover:to-fuchsia-700 transition disabled:opacity-50 text-sm shadow-md shadow-purple-100 flex items-center justify-center gap-2"
            >
              <span
                v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{
                isSubmitting
                  ? "Procesando..."
                  : editingInterestId
                    ? "Actualizar Interés"
                    : "Guardar Interés"
              }}
            </button>
          </div>
        </form>
      </div>

      <div
        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4"
      >
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">
          Estructura de Datos
        </h3>
        <p class="text-xs text-gray-500 leading-relaxed">
          Los intereses registrados permiten agrupar los contenidos de la
          plataforma, facilitando la navegación interna y la segmentación de
          perfiles técnicos de los miembros.
        </p>
      </div>
    </div>

    <section
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-900">
          Repositorio de Intereses
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          Control global de los tópicos indexados en la base de datos.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="bg-gray-50 text-gray-700 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-100"
          >
            <tr>
              <th class="px-6 py-4 w-1/4">Nombre</th>
              <th class="px-6 py-4 w-2/4">Descripción</th>
              <th class="px-6 py-4 w-1/4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white text-gray-600">
            <tr
              v-for="interest in interests"
              :key="interest.id"
              class="hover:bg-gray-50/50 transition"
            >
              <td
                class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap"
              >
                {{ interest.name }}
              </td>

              <td
                class="px-6 py-4 text-gray-500 leading-relaxed max-w-md truncate"
              >
                {{ interest.description }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="startEdit(interest)"
                    class="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button
                    @click="openDeleteModal(interest)"
                    class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition text-xs font-medium shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="interests.length === 0">
              <td colspan="3" class="text-center py-12 text-gray-400">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p class="text-xs">
                    No se encontraron intereses registrados en el sistema.
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
      <h3 class="text-lg font-bold text-gray-900 mb-1.5">Eliminar Interés</h3>
      <p class="text-sm text-gray-500 mb-6 leading-relaxed">
        ¿Estás seguro de que deseas eliminar la categoría
        <strong>{{ interestToDelete?.name }}</strong
        >? Esta acción removerá el registro de la base de datos de forma
        permanente.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-xs font-medium"
        >
          Cancelar
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition text-xs font-semibold shadow-md shadow-rose-100"
        >
          Confirmar Eliminación
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
