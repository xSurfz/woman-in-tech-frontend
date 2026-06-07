<template>
  <div
    class="space-y-10 text-base leading-relaxed text-slate-800 antialiased selection:bg-purple-100"
  >
    <div class="border-b border-slate-200 pb-6">
      <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">
        Panel de Administración
      </h1>
      <p class="text-lg text-slate-600 mt-3 max-w-4xl leading-normal">
        Selecciona un módulo en la barra lateral o utiliza los accesos rápidos
        detallados a continuación para comenzar a gestionar el contenido de la
        plataforma.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 transition hover:shadow-md"
      >
        <div class="space-y-4">
          <div
            class="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"
          >
            <svg
              class="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">
            Cronograma y Formación
          </h2>
          <p class="text-base text-slate-600 leading-relaxed">
            Administra las fechas de los próximos eventos, ponentes asignados y
            gestiona la oferta de programas educativos vigentes.
          </p>
        </div>
        <div class="pt-2 flex gap-4">
          <RouterLink
            to="/admin/events"
            class="text-base font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl transition"
          >
            Ir a Eventos
          </RouterLink>
          <RouterLink
            to="/admin/programs"
            class="text-base font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl transition"
          >
            Ver Programas
          </RouterLink>
        </div>
      </div>

      <div
        class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 transition hover:shadow-md"
      >
        <div class="space-y-4">
          <div
            class="w-14 h-14 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center shrink-0"
          >
            <svg
              class="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">
            Recursos y Testimonios
          </h2>
          <p class="text-base text-slate-600 leading-relaxed">
            Sube documentación, guías descargables o enlaces de interés, y
            modera las opiniones o testimonios que se muestran en el sitio
            público.
          </p>
        </div>
        <div class="pt-2 flex gap-4">
          <RouterLink
            to="/admin/resources"
            class="text-base font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl transition"
          >
            Recursos
          </RouterLink>
          <RouterLink
            to="/admin/testimonials"
            class="text-base font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl transition"
          >
            Testimonios
          </RouterLink>
        </div>
      </div>

      <div
        class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 transition hover:shadow-md"
      >
        <div class="space-y-4">
          <div
            class="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"
          >
            <svg
              class="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">
            Comunidad y Segmentación
          </h2>
          <p class="text-base text-slate-600 leading-relaxed">
            Consulta la base de datos de los miembros registrados y parametriza
            las etiquetas o áreas de interés de la plataforma.
          </p>
        </div>
        <div class="pt-2 flex gap-4">
          <RouterLink
            to="/admin/interests"
            class="text-base font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl transition"
          >
            Intereses
          </RouterLink>
          <RouterLink
            to="/admin/members"
            class="text-base font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl transition"
          >
            Miembros
          </RouterLink>
        </div>
      </div>
    </div>

    <div
      class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-900 uppercase tracking-wider">
          Recordatorios de Operación
        </h2>
        <p class="text-base text-slate-600 mt-1">
          Pautas generales para mantener la consistencia en el sitio:
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div
          class="p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4"
        >
          <span class="text-slate-400 font-mono font-black text-lg mt-0.5"
            >01.</span
          >
          <p class="text-base text-slate-700 leading-relaxed">
            Al crear nuevos programas, recuerda asignarles al menos una etiqueta
            de Área de Interés para su correcta indexación dentro de la interfaz
            pública.
          </p>
        </div>
        <div
          class="p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4"
        >
          <span class="text-slate-400 font-mono font-black text-lg mt-0.5"
            >02.</span
          >
          <p class="text-base text-slate-700 leading-relaxed">
            Los archivos subidos a la sección de Recursos deben estar
            optimizados y preferiblemente en formato PDF o enlaces web externos
            directos para asegurar compatibilidad.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
