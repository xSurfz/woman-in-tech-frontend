<script setup>
defineProps({
  open: Boolean,
  title: {
    type: String,
    default: "Confirm Action",
  },
  message: {
    type: String,
    default: "Are you sure?",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["confirm", "cancel"]);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-lg font-semibold">
          {{ title }}
        </h2>

        <p class="text-gray-600 mt-2">
          {{ message }}
        </p>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            @click="$emit('confirm')"
            :disabled="loading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {{ loading ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>