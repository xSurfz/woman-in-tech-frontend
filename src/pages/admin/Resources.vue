<template>
  <div
    class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen antialiased text-base text-slate-800"
  >
    <header
      class="mb-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6"
    >
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          {{ editingResourceId ? "Editar Recurso" : "Gestión de Recursos" }}
        </h1>
        <p class="text-sm text-slate-500">
          Administra de forma segura los cursos, becas, herramientas y
          materiales disponibles para la comunidad.
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
        <span class="text-sm font-semibold">{{ formSuccess }}</span>
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
        <span class="text-sm font-semibold">{{ formError }}</span>
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-14">
      <div
        class="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60"
      >
        <h2
          class="font-bold text-lg text-slate-900 border-b pb-3 border-slate-100 flex items-center gap-2"
        >
          <span>Información General</span>
          <span
            v-if="editingResourceId"
            class="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            >Modo Edición</span
          >
        </h2>

        <div class="space-y-5">
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Título del Recurso <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.title"
              @blur="touched.title = true"
              type="text"
              placeholder="Ej. Introducción al Desarrollo Frontend"
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 text-slate-900 font-medium"
              :class="[
                touched.title && !form.title.trim()
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                  : 'border-slate-200 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.title && !form.title.trim()"
              class="text-xs text-rose-600 mt-1.5 font-semibold"
            >
              El título es requerido para la publicación de la card.
            </p>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Descripción Corta <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              @blur="touched.description = true"
              rows="4"
              placeholder="Resume los alcances, requisitos u orientaciones clave de este recurso..."
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 resize-none text-slate-700 leading-relaxed"
              :class="[
                touched.description && !form.description.trim()
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                  : 'border-slate-200 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.description && !form.description.trim()"
              class="text-xs text-rose-600 mt-1.5 font-semibold"
            >
              Por favor proporciona un extracto descriptivo.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Enlace de Acceso (URL) <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.url"
                @blur="touched.url = true"
                type="url"
                placeholder="https://plataforma.com/recurso"
                class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 text-slate-900"
                :class="[
                  touched.url && !form.url.trim()
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                    : 'border-slate-200 focus:border-purple-500 focus:ring-purple-100',
                ]"
              />
              <p
                v-if="touched.url && !form.url.trim()"
                class="text-xs text-rose-600 mt-1.5 font-semibold"
              >
                Debe contener una dirección URL válida.
              </p>
            </div>

            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Categoría / Tipo
              </label>
              <select
                v-model="form.type"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition bg-white text-slate-900 font-medium cursor-pointer"
              >
                <option value="COURSE">Curso</option>
                <option value="SCHOLARSHIP">Beca</option>
                <option value="MATERIAL">Material / Herramienta</option>
                <option value="COMMUNITY">Comunidad</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            <div class="sm:col-span-1">
              <label
                class="relative flex items-center justify-center gap-3 cursor-pointer bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition select-none font-bold text-xs uppercase text-slate-700"
              >
                <input
                  type="checkbox"
                  v-model="form.isFeatured"
                  class="rounded text-purple-600 focus:ring-purple-500 h-4 w-4 border-slate-300"
                />
                <span>Destacar Recurso</span>
              </label>
            </div>

            <div class="sm:col-span-2">
              <div
                class="relative group border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:bg-slate-50 transition"
              >
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFile"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  class="flex items-center justify-center gap-3 text-xs text-slate-600"
                >
                  <svg
                    class="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition"
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
                  <p
                    class="font-bold text-purple-600 group-hover:text-purple-700 transition"
                  >
                    {{
                      file
                        ? "Cambiar imagen cargada"
                        : "Asignar miniatura o portada"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-5 border-t border-slate-100">
            <button
              v-if="editingResourceId"
              @click="cancelEdit"
              type="button"
              class="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition text-sm font-bold"
            >
              Cancelar
            </button>
            <button
              @click="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white font-bold py-3 rounded-xl hover:from-purple-800 hover:to-fuchsia-700 transition disabled:opacity-50 text-sm shadow-md shadow-purple-100 flex items-center justify-center gap-2"
            >
              <span
                v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{
                isSubmitting
                  ? "Guardando cambios..."
                  : editingResourceId
                    ? "Actualizar Registro"
                    : "Guardar Nuevo Recurso"
              }}
            </button>
          </div>
        </div>
      </div>

      <div
        class="lg:sticky lg:top-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-4"
      >
        <h3
          class="text-xs font-extrabold uppercase tracking-widest text-slate-400"
        >
          Visualización en tiempo real
        </h3>

        <div
          class="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm relative group"
        >
          <span
            v-if="form.isFeatured"
            class="absolute top-3 left-3 bg-fuchsia-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm z-10 uppercase tracking-wider"
          >
            ✨ Destacado
          </span>

          <div
            class="h-44 bg-slate-100 flex items-center justify-center text-slate-400 relative overflow-hidden"
          >
            <img
              v-if="preview"
              :src="preview"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
            <div
              v-else
              class="text-center flex flex-col items-center space-y-1.5 opacity-60"
            >
              <svg
                class="w-8 h-8 stroke-1.5"
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
              <span class="text-xs font-semibold tracking-wide uppercase"
                >Sin banner asignado</span
              >
            </div>
          </div>

          <div class="p-5 space-y-3">
            <div>
              <span
                class="inline-block px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-extrabold uppercase tracking-wider"
              >
                {{ form.type }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 line-clamp-1">
              {{ form.title || "Nombre descriptivo del recurso" }}
            </h3>

            <p class="text-slate-500 text-xs leading-relaxed line-clamp-3">
              {{
                form.description ||
                "Completa la información en el panel izquierdo para observar el comportamiento responsivo del texto dentro de las grillas principales."
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <section
      class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
    >
      <div class="p-6 border-b border-slate-100">
        <h2 class="text-xl font-bold text-slate-900">
          Repositorio Institucional
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Auditoría de cargas operativas, control de accesos externos y
          categorización del material publicado.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100"
          >
            <tr>
              <th class="px-6 py-4.5">Banner</th>
              <th class="px-6 py-4.5">Título del Recurso</th>
              <th class="px-6 py-4.5">Categoría</th>
              <th class="px-6 py-4.5">Destacado</th>
              <th class="px-6 py-4.5 text-right">Acciones de Control</th>
            </tr>
          </thead>

          <tbody
            class="divide-y divide-slate-100 bg-white text-slate-600 font-medium"
          >
            <tr
              v-for="resource in resources"
              :key="resource.id"
              class="hover:bg-slate-50/70 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  v-if="resource.imageUrl"
                  :src="getFileUrl(resource.imageUrl)"
                  class="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-100 shadow-sm"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"
                >
                  <svg
                    class="w-4 h-4 stroke-1.5"
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

              <td class="px-6 py-4 text-slate-900 max-w-xs truncate font-bold">
                <a
                  :href="resource.url"
                  target="_blank"
                  class="hover:text-purple-700 transition underline decoration-slate-200 hover:decoration-purple-300 underline-offset-4"
                >
                  {{ resource.title }}
                </a>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider"
                >
                  {{ resource.type }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="resource.isFeatured"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 shadow-sm"
                >
                  ✨ Sí
                </span>
                <span v-else class="text-slate-400 text-xs font-normal"
                  >No</span
                >
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end gap-2.5">
                  <button
                    @click="startEdit(resource)"
                    class="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-xs font-bold shadow-sm"
                  >
                    Editar
                  </button>
                  <button
                    @click="openDeleteModal(resource)"
                    class="px-3.5 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition text-xs font-bold shadow-sm hover:shadow"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="resources.length === 0">
              <td colspan="5" class="text-center py-16 text-slate-400">
                <div
                  class="flex flex-col items-center justify-center space-y-3"
                >
                  <svg
                    class="w-10 h-10 stroke-1 text-slate-300"
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
                  <p class="text-sm font-medium">
                    No se encontraron recursos registrados en la plataforma.
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
    class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
    >
      <div
        class="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4 shadow-inner"
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
      <h3 class="text-lg font-bold text-slate-900 mb-1.5">Eliminar Recurso</h3>
      <p class="text-sm text-slate-500 mb-6 leading-relaxed">
        ¿Estás seguro de que quieres eliminar permanentemente a
        <strong>{{ resourceToDelete?.title }}</strong
        >? Esta acción destruirá los registros del servidor de base de datos y
        no se puede deshacer.
      </p>
      <div class="flex justify-end gap-3">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition text-xs font-bold"
        >
          Cancelar
        </button>
        <button
          @click="confirmDelete"
          class="px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition text-xs font-bold shadow-md shadow-rose-100"
        >
          Confirmar Eliminación
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../../services/admin-resource.service.js";

// Extracción limpia de la URL de configuración ambiental de Vite
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const resources = ref([]);

const form = ref({
  title: "",
  description: "",
  url: "",
  type: "COURSE",
  isFeatured: false,
});

const touched = ref({
  title: false,
  description: false,
  url: false,
});

const file = ref(null);
const preview = ref(null);
const editingResourceId = ref(null);
const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const resourceToDelete = ref(null);
const formError = ref("");
const formSuccess = ref("");

function isFormValid() {
  return (
    form.value.title.trim() &&
    form.value.description.trim() &&
    form.value.url.trim()
  );
}

async function load() {
  try {
    resources.value = await getResources();
  } catch (error) {
    console.error("Error al cargar recursos:", error);
  }
}

// Resuelve la ruta dinámica evitando hardcoding en el cliente
function getFileUrl(path) {
  if (!path) return "";
  return `${VITE_SERVER_URL}${path}`;
}

function handleFile(event) {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  file.value = selectedFile;
  preview.value = URL.createObjectURL(selectedFile);
}

function startEdit(resource) {
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  formError.value = "";
  formSuccess.value = "";

  editingResourceId.value = resource.id;
  form.value = {
    title: resource.title,
    description: resource.description,
    url: resource.url,
    type: resource.type,
    isFeatured: resource.isFeatured,
  };

  preview.value = resource.imageUrl ? getFileUrl(resource.imageUrl) : null;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  editingResourceId.value = null;
  resetForm();
}

// Limpieza recursiva del estado reactivo del formulario
function resetForm() {
  form.value = {
    title: "",
    description: "",
    url: "",
    type: "COURSE",
    isFeatured: false,
  };
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  file.value = null;
  preview.value = null;
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

async function submit() {
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true));

  if (!isFormValid()) {
    formError.value = "Por favor, completa todos los campos obligatorios (*).";
    return;
  }

  isSubmitting.value = true;
  formError.value = "";
  formSuccess.value = "";

  const formData = buildFormData();

  try {
    if (editingResourceId.value) {
      await updateResource(editingResourceId.value, formData);
      formSuccess.value = "¡Recurso actualizado con éxito!";
    } else {
      await createResource(formData);
      formSuccess.value = "¡Recurso creado y registrado con éxito!";
    }

    await load();
    resetForm();
    editingResourceId.value = null;
  } catch (error) {
    console.error(error.response?.data);
    formError.value =
      error.response?.data?.error?.message ??
      "Ocurrió un error inesperado al procesar el recurso.";
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
    await handleDelete(resourceToDelete.value.id);
    await load();
    formSuccess.value = "Recurso eliminado correctamente.";
  } catch (error) {
    console.error(error);
    formError.value =
      error.response?.data?.error?.message ??
      "Error al intentar eliminar el recurso.";
  } finally {
    showDeleteModal.value = false;
    resourceToDelete.value = null;
  }
}

async function handleDelete(id) {
  await deleteResource(id);
}

onMounted(load);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
