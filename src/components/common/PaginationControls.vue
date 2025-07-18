<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['prev-page', 'next-page']);

const prevPage = () => {
  emit('prev-page');
};

const nextPage = () => {
  emit('next-page');
};
</script>

<template>
  <div class="flex justify-center items-center gap-2 mt-2">
    <button
      class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
      :class="{ 'hover:cursor-pointer hover:bg-gray-300': currentPage !== 1 }"
      :disabled="currentPage === 1"
      @click="prevPage"
    >
      Précédent
    </button>
    <span>Page {{ currentPage }} / {{ totalPages }}</span>
    <button
      class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
      :class="{ 'hover:cursor-pointer hover:bg-gray-300': currentPage !== totalPages }"
      :disabled="currentPage === totalPages"
      @click="nextPage"
    >
      Suivant
    </button>
  </div>
</template>
