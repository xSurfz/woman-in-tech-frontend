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

// Sistema reactivo para rastrear qué campos obligatorios han sido visitados
const touched = ref({
  title: false,
  description: false,
  actionText: false,
  actionUrl: false,
});

const file = ref(null);
const preview = ref(null);

const editingProgramId = ref(null);
const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const programToDelete = ref(null);
const formError = ref("");
const formSuccess = ref("");

// Validación rápida en el cliente
function isFormValid() {
  return (
    form.value.title.trim() &&
    form.value.description.trim() &&
    form.value.actionText.trim() &&
    form.value.actionUrl.trim()
  );
}

async function submit() {
  // Forzar visualización de errores si intentan enviar a ciegas
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true));

  if (!isFormValid()) {
    formError.value = "Por favor, completa todos los campos obligatorios (*).";
    return;
  }

  isSubmitting.value = true;
  formError.value = "";
  formSuccess.value = "";

  try {
    if (editingProgramId.value) {
      await update();
    } else {
      await create();
    }
  } catch (error) {
    console.error(error);
    formError.value =
      error.response?.data?.error?.message ??
      "Ocurrió un error inesperado al procesar el programa.";
  } finally {
    isSubmitting.value = false;
  }
}

async function create() {
  const formData = buildFormData();
  await createProgram(formData);
  formSuccess.value = "¡Programa creado y publicado exitosamente!";
  await afterSubmit();
}

async function update() {
  const formData = buildFormData();
  await updateProgram(editingProgramId.value, formData);
  formSuccess.value = "¡Programa actualizado correctamente!";
  await afterSubmit();
}

function buildFormData() {
  const formData = new FormData();

  Object.entries(form.value).forEach(([key, value]) => {
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

  form.value = {
    title: "",
    description: "",
    actionText: "",
    actionUrl: "",
    sortOrder: 0,
    isFeatured: false,
  };

  // Limpiar estados de validación
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));

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
    formSuccess.value = "Programa eliminado correctamente.";
  } catch (error) {
    console.error(error.response?.data);
    formError.value =
      error.response?.data?.error?.message ?? "Error al intentar eliminar.";
  } finally {
    showDeleteModal.value = false;
    programToDelete.value = null;
  }
}

async function handleDelete(id) {
  await deleteProgram(id);
}

function startEdit(program) {
  // Limpiar errores previos al editar
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  formError.value = "";
  formSuccess.value = "";

  editingProgramId.value = program.id;

  form.value = {
    title: program.title,
    description: program.description,
    actionText: program.actionText || "",
    actionUrl: program.actionUrl || "",
    sortOrder: program.sortOrder || 0,
    isFeatured: program.isFeatured,
  };

  preview.value = program.imageUrl ? getFileUrl(program.imageUrl) : null;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  editingProgramId.value = null;
  form.value = {
    title: "",
    description: "",
    actionText: "",
    actionUrl: "",
    sortOrder: 0,
    isFeatured: false,
  };
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  preview.value = null;
  file.value = null;
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
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
    <header
      class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-5"
    >
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {{ editingProgramId ? "Editar Programa" : "Gestión de Programas" }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Estructura los contenidos, prioridades y enlaces de acción para los
          programas institucionales.
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div
        class="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
      >
        <h2
          class="font-bold text-lg text-gray-900 border-b pb-3 border-gray-100"
        >
          Información del Programa
        </h2>

        <div class="space-y-5">
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Título <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.title"
              @blur="touched.title = true"
              type="text"
              placeholder="Ej. Mentorship Program 2026"
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
              :class="[
                touched.title && !form.title.trim()
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.title && !form.title.trim()"
              class="text-xs text-rose-600 mt-1 font-medium"
            >
              Este campo es obligatorio
            </p>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Descripción <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              @blur="touched.description = true"
              rows="4"
              placeholder="Detalla los objetivos del programa, a quién va dirigido, etc..."
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
              Este campo es obligatorio
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Texto del Botón (CTA) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.actionText"
                @blur="touched.actionText = true"
                type="text"
                placeholder="Ej. Postularme ahora"
                class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
                :class="[
                  touched.actionText && !form.actionText.trim()
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
                ]"
              />
              <p
                v-if="touched.actionText && !form.actionText.trim()"
                class="text-xs text-rose-600 mt-1 font-medium"
              >
                Este campo es obligatorio
              </p>
            </div>

            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Enlace del Botón (URL) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.actionUrl"
                @blur="touched.actionUrl = true"
                type="url"
                placeholder="https://forms.gle/..."
                class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
                :class="[
                  touched.actionUrl && !form.actionUrl.trim()
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
                ]"
              />
              <p
                v-if="touched.actionUrl && !form.actionUrl.trim()"
                class="text-xs text-rose-600 mt-1 font-medium"
              >
                Este campo es obligatorio
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Orden de Visualización
              </label>
              <input
                v-model="form.sortOrder"
                type="number"
                min="0"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>

            <div class="flex items-center h-full pt-5">
              <label
                class="relative flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100/70 w-full transition select-none"
              >
                <input
                  type="checkbox"
                  v-model="form.isFeatured"
                  class="rounded text-purple-600 focus:ring-purple-500 h-4 w-4 border-gray-300"
                />
                <span class="text-sm font-medium text-gray-700"
                  >Destacar programa</span
                >
              </label>
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Imagen del Programa
            </label>
            <div
              class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50/50 transition relative"
            >
              <input
                type="file"
                accept="image/*"
                @change="handleFile"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                class="flex flex-col items-center justify-center space-y-1 text-sm text-gray-600"
              >
                <svg
                  class="w-8 h-8 text-gray-400 mb-1"
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
                  Sube una portada descriptiva
                </p>
                <p class="text-xs text-gray-400">Archivos JPG, WEBP o PNG</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-100">
            <button
              v-if="editingProgramId"
              @click="cancelEdit"
              type="button"
              class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              @click="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white font-semibold py-2.5 rounded-xl hover:from-purple-800 hover:to-fuchsia-700 transition disabled:opacity-50 text-sm shadow-md shadow-purple-100 flex items-center justify-center gap-2"
            >
              <span
                v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{
                isSubmitting
                  ? "Guardando..."
                  : editingProgramId
                    ? "Actualizar Cambios"
                    : "Publicar Programa"
              }}
            </button>
          </div>
        </div>
      </div>

      <div
        class="lg:sticky lg:top-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <h3
          class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4"
        >
          Vista Previa en Tiempo Real
        </h3>

        <div
          class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm relative"
        >
          <span
            v-if="form.isFeatured"
            class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10 flex items-center gap-1"
          >
            ⭐ Destacado
          </span>

          <div
            class="h-48 bg-gray-200 flex items-center justify-center text-gray-400 relative"
          >
            <img
              v-if="preview"
              :src="preview"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="text-center flex flex-col items-center space-y-1"
            >
              <svg
                class="w-10 h-10 stroke-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span class="text-xs">Sin imagen de portada</span>
            </div>
          </div>

          <div class="p-5 space-y-3">
            <h3 class="text-xl font-bold text-gray-900 line-clamp-1">
              {{ form.title || "Título del Programa" }}
            </h3>

            <p class="text-gray-600 text-xs leading-relaxed line-clamp-4">
              {{
                form.description ||
                "Aquí se desplegará el bloque principal de contenido e información introductoria que redactes en el formulario..."
              }}
            </p>

            <div class="pt-2">
              <button
                type="button"
                class="w-full py-2 bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-purple-800 transition"
              >
                {{ form.actionText || "Texto de acción" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section
      class="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-900">Programas Registrados</h2>
        <p class="text-xs text-gray-500 mt-0.5">
          Control global e histórico de programas vigentes en el ecosistema.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 text-sm">
          <thead
            class="bg-gray-50 text-gray-700 font-semibold uppercase text-[11px] tracking-wider"
          >
            <tr>
              <th class="text-left px-6 py-4">Imagen</th>
              <th class="text-left px-6 py-4">Título</th>
              <th class="text-left px-6 py-4">Destacado</th>
              <th class="text-left px-6 py-4">Orden</th>
              <th class="text-center px-6 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white text-gray-600">
            <tr
              v-for="program in programs"
              :key="program.id"
              class="hover:bg-gray-50/60 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  v-if="program.imageUrl"
                  :src="getFileUrl(program.imageUrl)"
                  class="w-14 h-14 rounded-xl object-cover ring-1 ring-gray-100"
                />
                <div
                  v-else
                  class="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400"
                >
                  <svg
                    class="w-5 h-5 stroke-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </td>

              <td
                class="px-6 py-4 font-semibold text-gray-900 max-w-xs truncate"
              >
                {{ program.title }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="program.isFeatured"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                >
                  Sí
                </span>
                <span v-else class="text-gray-400 text-xs">No</span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                {{ program.sortOrder }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                  <button
                    @click="startEdit(program)"
                    class="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button
                    @click="openDeleteModal(program)"
                    class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition text-xs font-medium shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="programs.length === 0">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p class="text-xs">
                    No hay programas cargados actualmente en la base de datos.
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
      <h3 class="text-lg font-bold text-gray-900 mb-1.5">Eliminar Programa</h3>
      <p class="text-sm text-gray-500 mb-6 leading-relaxed">
        ¿Estás completamente seguro de que deseas remover
        <strong>{{ programToDelete?.title }}</strong
        >? Los usuarios perderán el acceso a este contenido en el landing.
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
          Remover Programa
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
