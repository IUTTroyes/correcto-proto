<script setup lang="ts">
import { ref } from 'vue';
import { useGrilleEvaluationStore } from '@/stores/grilleEvaluation';
import {DocumentTextIcon} from "@heroicons/vue/24/outline";

const grilleStore = useGrilleEvaluationStore();

const grilles = ref(grilleStore.grilles);
</script>

<template>
  <div class="flex md:flex-row flex-col gap-4 w-full">
    <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 w-full">
      <div class="flex justify-between items-center">
        <div class="font-bold text-xl">Grilles d'évaluation</div>
      </div>

      <div v-if="grilles.length === 0" class="flex flex-col gap-2 mt-4 justify-center items-center mb-12">
        <DocumentTextIcon class="w-14 h-14 mx-auto text-gray-400" />
        <div class="flex flex-col items-center">
          <p class="text-sm m-0 p-0">Aucune grille d'évaluation trouvée.</p>
          <p class="text-gray-500 m-0 p-0">Créez votre première grille d'évaluation.</p>
        </div>
        <button>
          <router-link to="/evaluation/new" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Créer une grille d'évaluation
          </router-link>
        </button>
      </div>

      <div v-else v-for="grille in grilles" class="p-1 w-full border-b border-gray-200 last:border-b-0 pb-4">
        <div class="flex md:flex-row flex-col justify-between md:items-center">
          {{grille.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
