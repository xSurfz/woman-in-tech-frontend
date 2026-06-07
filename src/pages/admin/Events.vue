<script setup>
import { ref, onMounted } from "vue";
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../../services/admin-event.service.js";
import ConfirmModal from "../../components/admin/ConfirmModal.vue";
import { getFileUrl } from "../../utils/files.js";

const events = ref([]);

const form = ref({
  title: "",
  description: "",
  location: "",
  eventMode: "ONSITE",
  startsAt: "",
  endsAt: "",
});

// Sistema dinámico para rastrear qué campos ha tocado/visitado el usuario
const touched = ref({
  title: false,
  description: false,
  location: false,
  startsAt: false,
  endsAt: false,
});

const file = ref(null);
const preview = ref(null);
const deleting = ref(false);
const showDeleteModal = ref(false);
const eventToDelete = ref(null);
const editingEventId = ref(null);
const isSubmitting = ref(false);
const formError = ref("");
const formSuccess = ref("");

async function load() {
  const data = await getEvents();
  events.value = [...(data.upcoming || []), ...(data.past || [])];
}

function handleFile(e) {
  const f = e.target.files[0];
  if (f) {
    file.value = f;
    preview.value = URL.createObjectURL(f);
  }
}

// Validación rápida antes de enviar al servidor
function isFormValid() {
  return (
    form.value.title.trim() &&
    form.value.description.trim() &&
    form.value.location.trim() &&
    form.value.startsAt &&
    form.value.endsAt
  );
}

async function submit() {
  // Forzar que todos los campos muestren error si se intenta enviar vacío
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true));

  if (!isFormValid()) {
    formError.value = "Por favor, completa todos los campos obligatorios.";
    return;
  }

  const formData = new FormData();
  isSubmitting.value = true;
  formError.value = "";
  formSuccess.value = "";

  try {
    Object.entries(form.value).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        formData.append(key, value);
      }
    });

    if (file.value) {
      formData.append("image", file.value);
    }

    if (editingEventId.value) {
      await updateEvent(editingEventId.value, formData);
    } else {
      await createEvent(formData);
    }

    await load();

    formSuccess.value = editingEventId.value
      ? "¡Evento actualizado exitosamente!"
      : "¡Evento creado y publicado con éxito!";

    // Resetear formulario
    form.value = {
      title: "",
      description: "",
      location: "",
      eventMode: "ONSITE",
      startsAt: "",
      endsAt: "",
    };

    // Resetear toques de validación
    Object.keys(touched.value).forEach((key) => (touched.value[key] = false));

    file.value = null;
    preview.value = null;
    editingEventId.value = null;
  } catch (error) {
    console.error(error);
    formError.value =
      error.response?.data?.error?.message ??
      "Ocurrió un error inesperado al procesar el evento.";
  } finally {
    isSubmitting.value = false;
  }
}

function openDeleteModal(event) {
  eventToDelete.value = event;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!eventToDelete.value) return;
  deleting.value = true;
  try {
    await handleDelete(eventToDelete.value.id);
    await load();
    showDeleteModal.value = false;
    eventToDelete.value = null;
  } catch (error) {
    console.error(error);
  } finally {
    deleting.value = false;
  }
}

async function handleDelete(id) {
  await deleteEvent(id);
}

function editEvent(event) {
  editingEventId.value = event.id;

  // Al editar limpiamos errores previos
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  formError.value = "";
  formSuccess.value = "";

  form.value = {
    title: event.title ?? "",
    description: event.description ?? "",
    location: event.location ?? "",
    eventMode: event.eventMode ?? "ONSITE",
    startsAt: event.startsAt ? event.startsAt.slice(0, 16) : "",
    endsAt: event.endsAt ? event.endsAt.slice(0, 16) : "",
  };

  preview.value = event.imageUrl ? getFileUrl(event.imageUrl) : null;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  editingEventId.value = null;
  form.value = {
    title: "",
    description: "",
    location: "",
    eventMode: "ONSITE",
    startsAt: "",
    endsAt: "",
  };
  Object.keys(touched.value).forEach((key) => (touched.value[key] = false));
  preview.value = null;
  file.value = null;
}

onMounted(load);
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
    <!-- HEADER -->
    <header
      class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-5"
    >
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {{ editingEventId ? "Editar Evento" : "Crear Nuevo Evento" }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Completa detalladamente los campos informativos para actualizar o
          publicar un evento en la plataforma.
        </p>
      </div>
    </header>

    <!-- NOTIFICACIONES TOAST -->
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
      <!-- FORMULARIO PRINCIPAL -->
      <div
        class="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
      >
        <!-- TÍTULO -->
        <div class="relative">
          <label
            class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex justify-between"
          >
            Título del Evento <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.title"
            @blur="touched.title = true"
            type="text"
            placeholder="Ej. Hackathon Women in Tech 2026"
            class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
            :class="[
              touched.title && !form.title.trim()
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
            ]"
          />
          <p
            v-if="touched.title && !form.title.trim()"
            class="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1"
          >
            Este campo es obligatorio
          </p>
        </div>

        <!-- DESCRIPCIÓN -->
        <div>
          <label
            class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex justify-between"
          >
            Descripción general <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            @blur="touched.description = true"
            placeholder="Describe de qué tratará el evento, agenda, conferencistas, etc..."
            class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2 h-32 resize-none"
            :class="[
              touched.description && !form.description.trim()
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
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

        <!-- CONFIGURACIÓN DE MODALIDAD Y LUGAR -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Modalidad <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.eventMode"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="ONSITE">Presencial</option>
              <option value="ONLINE">Virtual (Online)</option>
              <option value="HYBRID">Híbrido</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Ubicación / Enlace <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.location"
              @blur="touched.location = true"
              type="text"
              placeholder="Dirección física o url de Zoom/Meet"
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
              :class="[
                touched.location && !form.location.trim()
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.location && !form.location.trim()"
              class="text-xs text-rose-600 mt-1 font-medium"
            >
              Este campo es obligatorio
            </p>
          </div>
        </div>

        <!-- FECHAS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Fecha y Hora de Inicio <span class="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              v-model="form.startsAt"
              @blur="touched.startsAt = true"
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
              :class="[
                touched.startsAt && !form.startsAt
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.startsAt && !form.startsAt"
              class="text-xs text-rose-600 mt-1 font-medium"
            >
              Este campo es obligatorio
            </p>
          </div>

          <div>
            <label
              class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Fecha y Hora de Cierre <span class="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              v-model="form.endsAt"
              @blur="touched.endsAt = true"
              class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none focus:ring-2"
              :class="[
                touched.endsAt && !form.endsAt
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100',
              ]"
            />
            <p
              v-if="touched.endsAt && !form.endsAt"
              class="text-xs text-rose-600 mt-1 font-medium"
            >
              Este campo es obligatorio
            </p>
          </div>
        </div>

        <!-- CARGA DE IMÁGENES -->
        <div class="pt-2">
          <label
            class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
          >
            Banner / Portada del Evento
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
                Haz clic para cargar imagen
              </p>
              <p class="text-xs text-gray-400">PNG, JPG, WEBP hasta 5MB</p>
            </div>
          </div>
        </div>

        <!-- ACCIONES -->
        <div
          class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100"
        >
          <button
            v-if="editingEventId"
            @click="cancelEdit"
            type="button"
            class="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
          >
            Cancelar Edición
          </button>

          <button
            @click="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white py-2.5 px-6 rounded-xl font-semibold shadow-md shadow-purple-200 hover:from-purple-800 hover:to-fuchsia-700 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            <span
              v-if="isSubmitting"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            {{
              isSubmitting
                ? "Procesando..."
                : editingEventId
                  ? "Guardar Cambios"
                  : "Publicar Evento"
            }}
          </button>
        </div>
      </div>

      <!-- VISTA PREVIA (STICKY) -->
      <div
        class="lg:sticky lg:top-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <h3
          class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4"
        >
          Vista Previa en Tiempo Real
        </h3>

        <div
          class="bg-gray-50 rounded-xl overflow-hidden border border-gray-200/60"
        >
          <div
            class="relative h-44 bg-gray-200 flex items-center justify-center text-gray-400"
          >
            <img
              v-if="preview"
              :src="preview"
              class="w-full h-full object-cover transition-all duration-300"
            />
            <div v-else class="flex flex-col items-center space-y-1">
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
              <span class="text-xs">Sin banner cargado</span>
            </div>
            <span
              class="absolute top-3 right-3 bg-purple-700 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm"
            >
              {{ form.eventMode }}
            </span>
          </div>

          <div class="p-5 space-y-3">
            <h2 class="text-lg font-bold text-gray-900 line-clamp-2">
              {{ form.title || "Título ilustrativo del evento" }}
            </h2>

            <p class="text-gray-600 text-xs leading-relaxed line-clamp-3">
              {{
                form.description ||
                "Aquí aparecerá un fragmento estructurado del texto descriptivo que redactes a la izquierda..."
              }}
            </p>

            <div
              class="pt-3 border-t border-gray-200/60 flex items-center gap-2 text-xs text-gray-500"
            >
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="truncate font-medium">{{
                form.location || "Lugar o plataforma por definir"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLA DE EVENTOS EXISTENTES -->
    <section
      class="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-900">Eventos Existentes</h2>
        <p class="text-xs text-gray-500 mt-0.5">
          Listado global e histórico para control y modificaciones operativas.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead
            class="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wider text-[11px]"
          >
            <tr>
              <th class="px-6 py-4 text-left">Miniatura</th>
              <th class="px-6 py-4 text-left">Título del Evento</th>
              <th class="px-6 py-4 text-left">Modalidad</th>
              <th class="px-6 py-4 text-left">Ubicación</th>
              <th class="px-6 py-4 class text-center">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 text-gray-600 bg-white">
            <tr
              v-for="event in events"
              :key="event.id"
              class="hover:bg-gray-50/70 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  v-if="event.imageUrl"
                  :src="getFileUrl(event.imageUrl)"
                  class="w-14 h-14 rounded-xl object-cover ring-1 ring-gray-200"
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
                {{ event.title }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
                >
                  {{ event.eventMode }}
                </span>
              </td>

              <td class="px-6 py-4 max-w-xs truncate text-gray-500">
                {{ event.location || "-" }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex justify-center gap-2">
                  <button
                    @click="editEvent(event)"
                    class="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button
                    @click="openDeleteModal(event)"
                    class="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition text-xs font-medium shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="events.length === 0">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p class="text-xs">
                    No se encontraron eventos cargados en el sistema.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <!-- MODAL DE CONFIRMACIÓN EMBEBIDO -->
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
      <h3 class="text-lg font-bold text-gray-900 mb-1.5">Eliminar Evento</h3>
      <p class="text-sm text-gray-500 mb-6 leading-relaxed">
        ¿Estás completamente seguro de que deseas eliminar permanentemente
        <strong>{{ eventToDelete?.title }}</strong
        >? Esta acción alterará los registros públicos.
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
          :disabled="deleting"
          class="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition text-xs font-semibold shadow-md shadow-rose-100 flex items-center gap-2"
        >
          <span
            v-if="deleting"
            class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          Eliminar de por vida
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
