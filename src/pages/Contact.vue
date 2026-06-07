<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero -->
    <section
      class="bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-600 text-white py-20"
    >
      <div class="max-w-7xl mx-auto px-4 text-center">
        <div
          class="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
        >
          <Mail size="16" />
          <span class="text-sm font-medium"> Estamos aquí para ayudarte </span>
        </div>

        <h1 class="text-4xl md:text-5xl font-bold mb-6">Contacto</h1>

        <p class="text-lg text-purple-100 max-w-3xl mx-auto leading-relaxed">
          ¿Tienes preguntas, sugerencias o quieres unirte a nuestra comunidad?
          Escríbenos y nuestro equipo te responderá lo antes posible.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        <!-- Form -->
        <div
          class="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10"
        >
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">
              Envíanos un mensaje
            </h2>

            <p class="text-gray-600">
              Completa el formulario y nos pondremos en contacto contigo.
            </p>
          </div>

          <!-- Success -->
          <transition name="fade">
            <div
              v-if="successMessage"
              class="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl"
            >
              {{ successMessage }}
            </div>
          </transition>

          <form @submit.prevent="onSubmit" class="space-y-6">
            <!-- Nombre -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Nombre completo *
              </label>

              <input
                v-model="form.name"
                type="text"
                placeholder="Lorem Ipsum"
                :class="inputClass(errors.name)"
              />

              <p v-if="errors.name" class="mt-2 text-sm text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Correo electrónico *
              </label>

              <input
                v-model="form.email"
                type="email"
                placeholder="lorem@ipsum.com"
                :class="inputClass(errors.email)"
              />

              <p v-if="errors.email" class="mt-2 text-sm text-red-500">
                {{ errors.email }}
              </p>
            </div>

            <!-- Grid -->
            <div class="grid md:grid-cols-2 gap-5">
              <!-- Phone -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Teléfono
                </label>

                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="+00 000 000 0000"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-600 outline-none transition"
                />
              </div>

              <!-- Subject -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Asunto *
                </label>

                <select
                  v-model="form.subject"
                  :class="inputClass(errors.subject)"
                >
                  <option value="">Selecciona un asunto</option>

                  <option value="comunidad">Lorem comunidad</option>

                  <option value="programas">Lorem programas</option>

                  <option value="eventos">Lorem eventos</option>

                  <option value="alianzas">Lorem alianzas</option>

                  <option value="feedback">Lorem feedback</option>

                  <option value="otros">Otros</option>
                </select>

                <p v-if="errors.subject" class="mt-2 text-sm text-red-500">
                  {{ errors.subject }}
                </p>
              </div>
            </div>

            <!-- Message -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-semibold text-gray-900">
                  Mensaje *
                </label>

                <span
                  :class="[
                    'text-xs font-medium',
                    form.message.length > 500
                      ? 'text-red-500'
                      : 'text-gray-400',
                  ]"
                >
                  {{ form.message.length }}/500
                </span>
              </div>

              <textarea
                v-model="form.message"
                rows="6"
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                :class="[inputClass(errors.message), 'resize-none']"
              ></textarea>

              <p v-if="errors.message" class="mt-2 text-sm text-red-500">
                {{ errors.message }}
              </p>
            </div>

            <!-- Privacy -->
            <div>
              <div class="flex items-start gap-3">
                <input
                  id="privacy"
                  v-model="form.privacy"
                  type="checkbox"
                  class="mt-1 h-4 w-4 accent-purple-700"
                />

                <label
                  for="privacy"
                  class="text-sm text-gray-600 leading-relaxed"
                >
                  Acepto la política de privacidad y autorizo el tratamiento de
                  mis datos personales.
                </label>
              </div>

              <p v-if="errors.privacy" class="mt-2 text-sm text-red-500">
                {{ errors.privacy }}
              </p>
            </div>

            <!-- Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <div
                v-if="isSubmitting"
                class="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"
              ></div>

              <span>
                {{ isSubmitting ? "Enviando mensaje..." : "Enviar mensaje" }}
              </span>
            </button>
          </form>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Contact Cards -->
          <div class="grid gap-5">
            <!-- Oficina -->
            <div
              class="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div class="flex gap-4">
                <div
                  class="bg-purple-100 text-purple-700 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                >
                  <MapPin size="22" />
                </div>

                <div>
                  <h3 class="font-bold text-gray-900 mb-1">
                    Oficina principal
                  </h3>

                  <p class="text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet,
                    <br />
                    consectetur adipiscing elit.
                  </p>
                </div>
              </div>
            </div>

            <!-- Correo -->
            <div
              class="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div class="flex gap-4">
                <div
                  class="bg-purple-100 text-purple-700 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                >
                  <Mail size="22" />
                </div>

                <div>
                  <h3 class="font-bold text-gray-900 mb-1">
                    Correo electrónico
                  </h3>

                  <p class="text-gray-600">lorem@ipsumdolor.com</p>
                </div>
              </div>
            </div>

            <!-- Teléfono -->
            <div
              class="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div class="flex gap-4">
                <div
                  class="bg-purple-100 text-purple-700 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                >
                  <Phone size="22" />
                </div>

                <div>
                  <h3 class="font-bold text-gray-900 mb-1">Teléfono</h3>

                  <p class="text-gray-600">+00 (000) 000 0000</p>
                </div>
              </div>
            </div>

            <!-- Horario -->
            <div
              class="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div class="flex gap-4">
                <div
                  class="bg-purple-100 text-purple-700 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                >
                  <Clock size="22" />
                </div>

                <div>
                  <h3 class="font-bold text-gray-900 mb-1">
                    Horario de atención
                  </h3>

                  <p class="text-gray-600">
                    Lorem a viernes
                    <br />
                    00:00 AM - 00:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Social -->
          <div
            class="bg-white rounded-3xl shadow-sm border border-gray-200 p-8"
          >
            <h3 class="text-xl font-bold text-gray-900 mb-6">
              Síguenos en redes
            </h3>

            <div class="grid grid-cols-2 gap-4">
              <a
                href="#"
                class="flex items-center justify-center gap-3 bg-purple-50 hover:bg-purple-700 hover:text-white text-purple-700 py-4 rounded-2xl transition font-medium"
              >
                <Facebook size="20" />
                Facebook
              </a>

              <a
                href="#"
                class="flex items-center justify-center gap-3 bg-purple-50 hover:bg-purple-700 hover:text-white text-purple-700 py-4 rounded-2xl transition font-medium"
              >
                <Twitter size="20" />
                Twitter
              </a>

              <a
                href="#"
                class="flex items-center justify-center gap-3 bg-purple-50 hover:bg-purple-700 hover:text-white text-purple-700 py-4 rounded-2xl transition font-medium"
              >
                <Linkedin size="20" />
                LinkedIn
              </a>

              <a
                href="#"
                class="flex items-center justify-center gap-3 bg-purple-50 hover:bg-purple-700 hover:text-white text-purple-700 py-4 rounded-2xl transition font-medium"
              >
                <Instagram size="20" />
                Instagram
              </a>
            </div>
          </div>

          <!-- Map -->
          <div
            class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="h-64 bg-gradient-to-br from-purple-100 via-fuchsia-100 to-purple-200 flex items-center justify-center"
            >
              <div class="text-center">
                <div
                  class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <MapPin size="36" class="text-purple-700" />
                </div>

                <p class="font-semibold text-gray-900">Lorem Ipsum</p>

                <p class="text-sm text-gray-600 mt-1">Dolor sit amet</p>
              </div>
            </div>

            <div class="p-6">
              <p class="text-gray-600 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque euismod, nisi vel consectetur interdum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import * as yup from "yup";

import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-vue-next";

const schema = yup.object({
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(3, "Mínimo 3 caracteres"),

  email: yup
    .string()
    .required("El correo es obligatorio")
    .email("Correo electrónico inválido"),

  phone: yup.string(),

  subject: yup.string().required("Selecciona un asunto"),

  message: yup
    .string()
    .required("El mensaje es obligatorio")
    .max(500, "Máximo 500 caracteres"),

  privacy: yup
    .boolean()
    .oneOf([true], "Debes aceptar la política de privacidad"),
});

const form = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  privacy: false,
});

const errors = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
  privacy: "",
});

const isSubmitting = ref(false);
const successMessage = ref("");

const inputClass = (hasError) => {
  return [
    "w-full px-4 py-3 rounded-xl border outline-none transition duration-300",
    "focus:ring-4 focus:ring-purple-100",
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-purple-600",
  ];
};

const validateField = async (field, value) => {
  try {
    await schema.validateAt(field, {
      [field]: value,
    });

    errors[field] = "";
    return true;
  } catch (err) {
    errors[field] = err.message;
    return false;
  }
};

const validateForm = async () => {
  const fields = ["name", "email", "subject", "message", "privacy"];

  let isValid = true;

  for (const field of fields) {
    const valid = await validateField(field, form[field]);

    if (!valid) {
      isValid = false;
    }
  }

  return isValid;
};

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.phone = "";
  form.subject = "";
  form.message = "";
  form.privacy = false;

  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
};

const onSubmit = async () => {
  successMessage.value = "";

  const isValid = await validateForm();

  if (!isValid) {
    const firstError = document.querySelector(".text-red-500");

    if (firstError) {
      firstError.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return;
  }

  isSubmitting.value = true;

  try {
    // Simulación de envío API
    await new Promise((resolve) => setTimeout(resolve, 1800));

    console.log("Formulario enviado:", {
      ...form,
    });

    successMessage.value =
      "¡Mensaje enviado exitosamente! Nuestro equipo te responderá pronto.";

    resetForm();
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;

    setTimeout(() => {
      successMessage.value = "";
    }, 5000);
  }
};

/* realtime validation */
watch(
  () => form.name,
  (val) => validateField("name", val),
);

watch(
  () => form.email,
  (val) => validateField("email", val),
);

watch(
  () => form.subject,
  (val) => validateField("subject", val),
);

watch(
  () => form.message,
  (val) => validateField("message", val),
);

watch(
  () => form.privacy,
  (val) => validateField("privacy", val),
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
