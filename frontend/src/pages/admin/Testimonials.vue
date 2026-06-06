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

// Sistema reactivo para controlar qué campos requeridos han sido tocados
const touched = ref({
  fullName: false,
  role: false,
  content: false,
});

const file = ref(null);
const preview = ref(null);
const editingTestimonialId = ref(null);

const formError = ref("");
const formSuccess = ref("");
const isSubmitting = ref(false);

const showDeleteModal = ref(false);
const testimonialToDelete = ref(null);

// Validación en cliente para evitar envíos con campos requeridos vacíos
function isFormValid() {
  return (
    form.value.fullName.trim() &&
    form.value.role.trim() &&
    form.value.content.trim()
  );
}

async function load() {
  try {
    testimonials.value = await getTestimonials();
  } catch (error) {
    console.error("Error al cargar testimonios:", error);
  }
}

function getFileUrl(path) {
  if (!path) return "";
  return `http://localhost:3000${path}`;
}

function handleFileChange(event) {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  file.value = selectedFile;
  preview.value = URL.createObjectURL(selectedFile);
}

function startEdit(testimonial) {
  // Limpiar estados previos de validación y alertas
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  formError.value = "";
  formSuccess.value = "";

  editingTestimonialId.value = testimonial.id;
  form.value = {
    fullName: testimonial.fullName,
    company: testimonial.company ?? "",
    role: testimonial.role,
    content: testimonial.content,
    sortOrder: testimonial.sortOrder ?? 0,
  };

  preview.value = testimonial.imageUrl
    ? getFileUrl(testimonial.imageUrl)
    : null;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  editingTestimonialId.value = null;
  resetForm();
}

function resetForm() {
  form.value = {
    fullName: "",
    company: "",
    role: "",
    content: "",
    sortOrder: 0,
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
  // Activar los errores visuales de todos los campos obligatorios al intentar enviar
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true));

  if (!isFormValid()) {
    formError.value =
      "Por favor, completa los campos requeridos marcados con (*).";
    return;
  }

  isSubmitting.value = true;
  formError.value = "";
  formSuccess.value = "";

  const formData = buildFormData();

  try {
    if (editingTestimonialId.value) {
      await updateTestimonial(editingTestimonialId.value, formData);
      formSuccess.value = "Testimonio actualizado correctamente.";
    } else {
      await createTestimonial(formData);
      formSuccess.value = "Testimonio creado y publicado con éxito.";
    }

    await load();
    resetForm();
    editingTestimonialId.value = null;
  } catch (error) {
    console.error(error.response?.data);
    formError.value =
      error.response?.data?.error?.message ??
      "Error inesperado al procesar la solicitud.";
  } finally {
    isSubmitting.value = false;
  }
}

function openDeleteModal(testimonial) {
  testimonialToDelete.value = testimonial;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!testimonialToDelete.value) return;

  try {
    await deleteTestimonial(testimonialToDelete.value.id);
    await load();
    formSuccess.value = "Testimonio eliminado permanentemente.";
  } catch (error) {
    console.error(error.response?.data);
    formError.value =
      error.response?.data?.error?.message ??
      "No se pudo eliminar el testimonio.";
  } finally {
    showDeleteModal.value = false;
    testimonialToDelete.value = null;
  }
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
            editingTestimonialId
              ? "Modificar Testimonio"
              : "Testimonios y Feedback"
          }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Gestiona las opiniones de los usuarios, estudiantes y aliados
          estratégicos de la organización.
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
          Información del Testimonial
        </h2>

        <form @submit.prevent="submit" class="space-y-5">
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
              placeholder="Ej. Sofia Ross"
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Cargo / Rol <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.role"
                @blur="touched.role = true"
                type="text"
                placeholder="Ej. Senior UI Designer"
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
                El cargo o rol es obligatorio.
              </p>
            </div>

            <div>
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Empresa o Institución
              </label>
              <input
                v-model="form.company"
                type="text"
                placeholder="Ej. Stripe Inc. (Opcional)"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Testimonio o Feedback <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="form.content"
              @blur="touched.content = true"
              rows="4"
              placeholder="Escribe aquí la reseña o comentario redactado por el usuario..."
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 resize-none"
              :class="[
                touched.content && !form.content.trim()
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.content && !form.content.trim()"
              class="text-xs text-rose-600 mt-1 font-medium"
            >
              El contenido del testimonio no puede estar vacío.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
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

            <div class="sm:col-span-2">
              <label
                class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Fotografía del Autor
              </label>
              <div
                class="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center hover:bg-gray-50/50 transition relative"
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
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p class="font-medium text-purple-600">
                    Subir retrato del autor
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-100">
            <button
              v-if="editingTestimonialId"
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
                  : editingTestimonialId
                    ? "Actualizar Testimonio"
                    : "Publicar Testimonio"
              }}
            </button>
          </div>
        </form>
      </div>

      <div
        class="lg:sticky lg:top-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <h3
          class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4"
        >
          Vista Previa de la Opinión
        </h3>

        <div
          class="bg-gradient-to-tr from-gray-50 to-purple-50/20 rounded-2xl p-6 border border-gray-200/60 shadow-sm space-y-4"
        >
          <svg
            class="w-8 h-8 text-purple-200"
            fill="currentColor"
            viewBox="0 0 32 32"
          >
            <path
              d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h2V8h-2zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h2V8h-2z"
            />
          </svg>

          <p class="text-gray-600 text-xs italic leading-relaxed line-clamp-4">
            {{
              form.content ||
              "«Aquí aparecerá el cuerpo del testimonio que el usuario ha redactado acerca de la organización, servicios o productos»"
            }}
          </p>

          <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
            <div
              class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 ring-2 ring-white shadow-sm"
            >
              <img
                v-if="preview"
                :src="preview"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold text-xs"
              >
                {{
                  form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"
                }}
              </div>
            </div>

            <div class="min-w-0">
              <h4 class="text-xs font-bold text-gray-900 truncate">
                {{ form.fullName || "Nombre del Autor" }}
              </h4>
              <p class="text-[10px] text-gray-500 truncate">
                {{ form.role || "Cargo u Oficio" }}
                <span v-if="form.company" class="text-purple-600 font-medium">
                  @ {{ form.company }}</span
                >
              </p>
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
          Repositorio de Testimonios
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          Control, orden de visualización en landing pages y eliminación de
          feedback.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="bg-gray-50 text-gray-700 font-semibold uppercase text-[11px] tracking-wider border-b border-gray-100"
          >
            <tr>
              <th class="px-6 py-4">Autor</th>
              <th class="px-6 py-4">Cargo / Rol</th>
              <th class="px-6 py-4">Empresa</th>
              <th class="px-6 py-4 text-center">Prioridad (Orden)</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white text-gray-600">
            <tr
              v-for="testimonial in testimonials"
              :key="testimonial.id"
              class="hover:bg-gray-50/50 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <img
                    v-if="testimonial.imageUrl"
                    :src="getFileUrl(testimonial.imageUrl)"
                    class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm"
                  >
                    {{ testimonial.fullName.charAt(0) }}
                  </div>
                  <div class="font-semibold text-gray-900">
                    {{ testimonial.fullName }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-600">
                {{ testimonial.role }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="testimonial.company"
                  class="px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700"
                >
                  {{ testimonial.company }}
                </span>
                <span v-else class="text-gray-400 italic text-xs"
                  >No especificada</span
                >
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-center font-mono text-xs font-semibold text-gray-500"
              >
                {{ testimonial.sortOrder }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="startEdit(testimonial)"
                    class="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button
                    @click="openDeleteModal(testimonial)"
                    class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition text-xs font-medium shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="testimonials.length === 0">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p class="text-xs">
                    No hay testimonios ni reseñas registradas en la base de
                    datos.
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
      <h3 class="text-lg font-bold text-gray-900 mb-1.5">
        Eliminar Testimonio
      </h3>
      <p class="text-sm text-gray-500 mb-6 leading-relaxed">
        ¿Estás seguro de que quieres remover la opinión de
        <strong>{{ testimonialToDelete?.fullName }}</strong
        >? Esta acción borrará el contenido del sistema de forma permanente.
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
          Remover permanentemente
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
