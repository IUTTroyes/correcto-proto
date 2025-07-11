<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { GrilleEvaluation } from "@/types/GrilleEvaluation";

const props = defineProps<{
  grille: GrilleEvaluation;
}>();

const emit = defineEmits(['submit']);

function handleSubmit() {
  emit('submit', props.grille);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="text-lg font-bold mb-4">Création de la grille</div>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div class="flex gap-4">
        <div class="flex flex-col gap-2 w-full">
          <label for="name" class="font-medium">Nom de la grille</label>
          <input
              type="text"
              id="name"
              v-model="grille.name"
              placeholder="Entrez le nom de la grille"
              required
              class="p-2 border border-gray-200 rounded text-base"
          />
        </div>
        <div class="flex flex-col gap-2 w-full">
          <label for="description" class="font-medium">Total de points</label>
          <input
              type="number"
              id="totalPoints"
              v-model.number="grille.total_points"
              placeholder="Entrez le total de points de la grille"
              required
              class="p-2 border border-gray-200 rounded text-base"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" class="font-medium">Description</label>
        <textarea
            id="description"
            v-model="grille.description"
            placeholder="Entrez une description de la grille"
            required
            class="p-2 border border-gray-200 rounded text-base h-24 resize-none"
        ></textarea>
      </div>

      <button
          type="submit"
          class="mt-2 py-3 bg-red-600 text-white rounded text-base font-medium hover:bg-red-700 transition-colors"
      >
        Créer la grille
      </button>
    </form>
  </div>
</template>

<style scoped>
</style>
